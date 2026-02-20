import * as Repository from '../../../repositories/example/pg/user.repository.ts';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../../../configs/constants.ts';
import { cacheGet, cacheSet, cacheDelete } from '../../../utils/cache.ts';

const CACHE_KEY = 'users:pg';

export const createUser = async (data: any) => {
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    const user = await Repository.save({ ...data, password: hashedPassword });
    await cacheDelete(CACHE_KEY);
    return user;
};

export const getUsers = async () => {
    const cached = await cacheGet(CACHE_KEY);
    if (cached) return cached;

    const users = await Repository.findAll();
    await cacheSet(CACHE_KEY, users);
    return users;
};

export const getUserById = async (id: number) => {
    return await Repository.findById(id);
};

export const updateUser = async (id: number, data: any) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    }
    const user = await Repository.update(id, data);
    await cacheDelete(CACHE_KEY);
    return user;
};

export const deleteUser = async (id: number) => {
    await Repository.remove(id);
    await cacheDelete(CACHE_KEY);
};
