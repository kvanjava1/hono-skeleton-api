import type { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import * as UserController from '../../controllers/example/user.controller.ts';
import { createUserSchema, updateUserSchema } from '../../schemas/example/user.schema.ts';
import { ValidationError } from '../../middlewares/index.ts';

const validateBody = (schema: any) =>
    zValidator('json', schema, (result) => {
        if (!result.success) {
            const message = result.error.issues?.[0]?.message || 'Invalid input';
            throw new ValidationError(message);
        }
    });

export const registerUserRoutes = (app: Hono) => {
    // --- MySQL Routes ---
    app.post('/api/users/mysql', validateBody(createUserSchema), UserController.createMysqlUser);
    app.get('/api/users/mysql', UserController.getMysqlUsers);
    app.get('/api/users/mysql/:id', UserController.getMysqlUserById);
    app.put('/api/users/mysql/:id', validateBody(updateUserSchema), UserController.updateMysqlUser);
    app.delete('/api/users/mysql/:id', UserController.deleteMysqlUser);

    // --- Mongo Routes ---
    app.post('/api/users/mongo', validateBody(createUserSchema), UserController.createMongoUser);
    app.get('/api/users/mongo', UserController.getMongoUsers);
    app.get('/api/users/mongo/:id', UserController.getMongoUserById);
    app.put('/api/users/mongo/:id', validateBody(updateUserSchema), UserController.updateMongoUser);
    app.delete('/api/users/mongo/:id', UserController.deleteMongoUser);

    // --- PostgreSQL Routes ---
    app.post('/api/users/pg', validateBody(createUserSchema), UserController.createPgUser);
    app.get('/api/users/pg', UserController.getPgUsers);
    app.get('/api/users/pg/:id', UserController.getPgUserById);
    app.put('/api/users/pg/:id', validateBody(updateUserSchema), UserController.updatePgUser);
    app.delete('/api/users/pg/:id', UserController.deletePgUser);

    // --- SQLite Routes ---
    app.post('/api/users/sqlite', validateBody(createUserSchema), UserController.createSqliteUser);
    app.get('/api/users/sqlite', UserController.getSqliteUsers);
    app.get('/api/users/sqlite/:id', UserController.getSqliteUserById);
    app.put('/api/users/sqlite/:id', validateBody(updateUserSchema), UserController.updateSqliteUser);
    app.delete('/api/users/sqlite/:id', UserController.deleteSqliteUser);
};
