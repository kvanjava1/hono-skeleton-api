import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import * as ClientRepository from '../repositories/apiClient.repository.ts';
import { configJwt } from '../configs/index.ts';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.ts';

export const validateClientByCredentials = async (
    clientId: string,
    clientSecret: string,
    currentIp: string
): Promise<ClientRepository.ApiClient> => {
    const client = ClientRepository.findByClientId(clientId);

    if (!client) {
        throw new UnauthorizedError('Invalid credentials');
    }

    if (client.status !== 'active') {
        throw new ForbiddenError('Account is suspended');
    }

    // 1. Validate Secret
    const isValidSecret = await bcrypt.compare(clientSecret, client.client_secret);
    if (!isValidSecret) {
        throw new UnauthorizedError('Invalid credentials');
    }

    // 2. Validate IP Whitelist
    if (client.allowed_ips && client.allowed_ips.trim() !== '') {
        const allowedIps = client.allowed_ips.split(',').map(ip => ip.trim());
        if (!allowedIps.includes(currentIp)) {
            throw new ForbiddenError(`IP ${currentIp} is not authorized for this client`);
        }
    }

    return client;
};

export const generateAccessToken = async (client: ClientRepository.ApiClient): Promise<string> => {
    const payload = {
        sub: client.client_id,
        name: client.name,
        exp: Math.floor(Date.now() / 1000) + (parseDuration(configJwt.expiresIn)),
        iat: Math.floor(Date.now() / 1000),
    };

    return await sign(payload, configJwt.secret, 'HS256');
};

// Helper to parse duration strings like "1h", "24h"
export const parseDuration = (duration: string): number => {
    const unit = duration.slice(-1);
    const value = parseInt(duration.slice(0, -1));

    switch (unit) {
        case 'h': return value * 3600;
        case 'd': return value * 86400;
        case 'm': return value * 60;
        case 's': return value;
        default: return 3600; // Default 1h
    }
};
