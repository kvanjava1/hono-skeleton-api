import type { Context } from 'hono';
import * as MySQLService from '../../services/example/mysql/user.service.ts';
import * as MongoService from '../../services/example/mongo/user.service.ts';
import * as PGService from '../../services/example/pg/user.service.ts';
import * as SQLiteService from '../../services/example/sqlite/user.service.ts';
import { successResponse } from '../../utils/response.ts';
import { MESSAGES, HTTP_STATUS } from '../../configs/constants.ts';

/**
 * MYSQL HANDLERS
 */
export const createMysqlUser = async (c: Context) => {
    const body = await c.req.json();
    const user = await MySQLService.createUser(body);
    return successResponse(c, MESSAGES.USER_CREATED, user, HTTP_STATUS.CREATED);
};

export const getMysqlUsers = async (c: Context) => {
    const users = await MySQLService.getUsers();
    const message = Array.isArray(users) ? MESSAGES.USERS_FETCHED : MESSAGES.USERS_FETCHED + ' (from cache)';
    return successResponse(c, message, users);
};

export const getMysqlUserById = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    const user = await MySQLService.getUserById(id);
    return successResponse(c, MESSAGES.USER_FETCHED, user);
};

export const updateMysqlUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const user = await MySQLService.updateUser(id, body);
    return successResponse(c, MESSAGES.USER_UPDATED, user);
};

export const deleteMysqlUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    await MySQLService.deleteUser(id);
    return successResponse(c, MESSAGES.USER_DELETED);
};

/**
 * MONGO HANDLERS
 */
export const createMongoUser = async (c: Context) => {
    const body = await c.req.json();
    const user = await MongoService.createUser(body);
    return successResponse(c, MESSAGES.USER_CREATED, user, HTTP_STATUS.CREATED);
};

export const getMongoUsers = async (c: Context) => {
    const users = await MongoService.getUsers();
    return successResponse(c, MESSAGES.USERS_FETCHED, users);
};

export const getMongoUserById = async (c: Context) => {
    const id = c.req.param('id');
    const user = await MongoService.getUserById(id);
    return successResponse(c, MESSAGES.USER_FETCHED, user);
};

export const updateMongoUser = async (c: Context) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const user = await MongoService.updateUser(id, body);
    return successResponse(c, MESSAGES.USER_UPDATED, user);
};

export const deleteMongoUser = async (c: Context) => {
    const id = c.req.param('id');
    await MongoService.deleteUser(id);
    return successResponse(c, MESSAGES.USER_DELETED);
};

/**
 * POSTGRESQL HANDLERS
 */
export const createPgUser = async (c: Context) => {
    const body = await c.req.json();
    const user = await PGService.createUser(body);
    return successResponse(c, MESSAGES.USER_CREATED, user, HTTP_STATUS.CREATED);
};

export const getPgUsers = async (c: Context) => {
    const users = await PGService.getUsers();
    return successResponse(c, MESSAGES.USERS_FETCHED, users);
};

export const getPgUserById = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    const user = await PGService.getUserById(id);
    return successResponse(c, MESSAGES.USER_FETCHED, user);
};

export const updatePgUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const user = await PGService.updateUser(id, body);
    return successResponse(c, MESSAGES.USER_UPDATED, user);
};

export const deletePgUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    await PGService.deleteUser(id);
    return successResponse(c, MESSAGES.USER_DELETED);
};

/**
 * SQLITE HANDLERS
 */
export const createSqliteUser = async (c: Context) => {
    const body = await c.req.json();
    const user = await SQLiteService.createUser(body);
    return successResponse(c, MESSAGES.USER_CREATED, user, HTTP_STATUS.CREATED);
};

export const getSqliteUsers = async (c: Context) => {
    const users = await SQLiteService.getUsers();
    return successResponse(c, MESSAGES.USERS_FETCHED, users);
};

export const getSqliteUserById = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    const user = await SQLiteService.getUserById(id);
    return successResponse(c, MESSAGES.USER_FETCHED, user);
};

export const updateSqliteUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    const body = await c.req.json();
    const user = await SQLiteService.updateUser(id, body);
    return successResponse(c, MESSAGES.USER_UPDATED, user);
};

export const deleteSqliteUser = async (c: Context) => {
    const id = parseInt(c.req.param('id'), 10);
    await SQLiteService.deleteUser(id);
    return successResponse(c, MESSAGES.USER_DELETED);
};
