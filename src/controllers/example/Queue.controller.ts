import type { Context } from 'hono';
import { successResponse } from '../../utils/response.ts';
import { dispatchScrape } from '../../jobs/Scrape.job.ts';

export const startScraping = async (c: Context) => {
    const { url } = await c.req.json();

    if (!url) {
        return c.json({ error: 'URL is required' }, 400);
    }

    // 🚀 Dispatch the job
    await dispatchScrape({ url });

    return successResponse(c, 'Scraping job has been queued!', { url });
};
