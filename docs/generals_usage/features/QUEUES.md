# Background Queues (BullMQ)

This project uses **BullMQ** for background job processing. It follows a separate-process architecture similar to Laravel's queue workers.

## 🚀 Getting Started

### 1. Requirements
- **Redis 6.2+** (required by BullMQ)
- `DB_REDIS_ENABLED=true` in `.env`

### 2. Configure Environment
Update your `.env.dev` (or production env) with queue settings:

```env
QUEUE_CONCURRENCY=5
QUEUE_REMOVE_ON_COMPLETE=true
QUEUE_REMOVE_ON_FAIL=100
```

---

## 🛠 Usage Flow

### 1. Create a New Job
Use the CLI to generate a job handler:

```bash
bun run make job SendEmail
```
This creates `src/jobs/sendemail.job.ts`.

### 2. Implement Logic
Generate a job handler and implement the processor logic.

**Example: `src/jobs/Test.job.ts`**
```typescript
import { createQueue } from '../queues/base.queue.ts';
import type { Job } from 'bullmq';
import { logger } from '../utils/logger.ts';

// 1. Create the specific queue instance
export const testQueue = createQueue('test-queue');

/**
 * 2. Define the processor logic
 */
export const testProcessor = async (job: Job) => {
  const { data } = job;
  logger.info(`[BULLMQ] Processing Test job ${job.id}`);
  logger.info(`[BULLMQ] Data received: ${JSON.stringify(data, null, 2)}`);

  // Simulate some async work
  await new Promise(resolve => setTimeout(resolve, 1000));

  return { success: true };
};

/**
 * 3. Export a type-safe dispatcher helper
 */
export const dispatchTest = async (data: any) => {
  return await testQueue.add('test-task', data);
};
```

### 3. Register with the Worker
All processors must be registered in the worker entry point.

// Source: src/workers/index.ts (Refactored for Binary Mode)
import { createWorker } from '../queues/base.queue.ts';
import { logger } from '../utils/logger.ts';
import { testProcessor } from '../jobs/Test.job.ts';
import { scrapeProcessor } from '../jobs/Scrape.job.ts';

const startWorkers = () => {
    logger.info('Background Workers starting...');
    createWorker('test-queue', testProcessor);
    createWorker('scrape-queue', scrapeProcessor);
    logger.info('Workers are ready.');
};

// Export for the main entry point (src/index.ts)
export { startWorkers };
```

### 4. Dispatch a Job
Import the dispatcher helper in your controllers to queue tasks.

```typescript
import { dispatchTest } from '../jobs/Test.job.ts';

export const handleRequest = async (c: Context) => {
  // Add job to Redis
  await dispatchTest({ 
    userId: 123, 
    action: 'sync_profile' 
  });

  return c.json({ 
    status: 'success', 
    message: 'Job queued successfully' 
  });
};
```

---

## 🏃 Running the Worker

### Development
Start the worker in a separate terminal using the dedicated script:
```bash
bun run worker
```

### Production (Binary Mode)
Since the app is compiled into a single binary, you can run the worker mode using the `--worker` flag:

```bash
# Run as Worker
./server --worker

# Run with custom env file
BUN_ENV_FILE=.env.prod ./server --worker
```

### Deployment Strategy
In production, you should run at least two separate processes:
1.  **API Server**: `./server`
2.  **Worker**: `./server --worker`

You can use a process manager like **PM2** or **Systemd** to manage these:
```bash
pm2 start "./server" --name "api-server"
pm2 start "./server -- --worker" --name "queue-worker"
```

---

## 🏗 Architecture Details

### The Base Class (`src/queues/base.queue.ts`)
This factory handles the Redis connection and default BullMQ settings.

```typescript
import { Queue, Worker, type Job, type Processor } from 'bullmq';
import { configRedis, configQueue } from '../configs/index.ts';
import { logger } from '../utils/logger.ts';

const connection = {
    host: configRedis.host,
    port: configRedis.port,
};

export const createQueue = (name: string) => {
    return new Queue(name, {
        connection,
        defaultJobOptions: {
            removeOnComplete: configQueue.removeOnComplete,
            removeOnFail: configQueue.removeOnFail,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
        },
    });
};

export const createWorker = (name: string, processor: Processor) => {
    const worker = new Worker(name, processor, {
        connection,
        concurrency: configQueue.concurrency,
    });

    worker.on('completed', (job) => logger.info(`Job ${job.id} completed`));
    worker.on('failed', (job, err) => logger.error(`Job ${job?.id} failed: ${err.message}`));

    return worker;
};
```
