import * as Repository from '../../../repositories/example/mongo/user.repository.ts';
import bcrypt from 'bcryptjs';
import { BCRYPT_SALT_ROUNDS } from '../../../configs/constants.ts';
import { cacheGet, cacheSet, cacheDelete } from '../../../utils/cache.ts';
import { ValidationError, NotFoundError } from '../../../middlewares/index.ts';

const CACHE_KEY = 'users:mongo';

export const createUser = async (data: any) => {
    const existing = await Repository.findByEmail(data.email);
    if (existing) throw new ValidationError('Email already exists');

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

export const getUserById = async (id: string) => {
    const user = await Repository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
};

export const updateUser = async (id: string, data: any) => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    }
    const user = await Repository.update(id, data);
    if (!user) throw new NotFoundError('User not found');

    await cacheDelete(CACHE_KEY);
    return user;
};

export const deleteUser = async (id: string) => {
    const user = await Repository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    await Repository.remove(id);
    await cacheDelete(CACHE_KEY);
};
