import { getSqliteDb } from '../database/sqlite.connection.ts';

export interface ApiClient {
    id: number;
    name: string;
    client_id: string;
    client_secret: string;
    rate_limit: number;
    allowed_ips: string | null;
    status: 'active' | 'suspended';
    created_at: string;
    updated_at: string;
}

export const findByClientId = (clientId: string): ApiClient | null => {
    const db = getSqliteDb();
    const client = db.query('SELECT * FROM api_clients WHERE client_id = ? LIMIT 1').get(clientId);
    return (client as ApiClient) || null;
};

export const findByName = (name: string): ApiClient | null => {
    const db = getSqliteDb();
    const client = db.query('SELECT * FROM api_clients WHERE name = ? LIMIT 1').get(name);
    return (client as ApiClient) || null;
};

export const logUsage = (data: {
    client_id: string;
    ip_address: string;
    endpoint: string;
    method: string;
    status_code: number;
    request_body?: string | null;
    response_body?: string | null;
}): void => {
    const db = getSqliteDb();
    db.run(
        `INSERT INTO api_usage_logs (client_id, ip_address, endpoint, method, status_code, request_body, response_body) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            data.client_id,
            data.ip_address,
            data.endpoint,
            data.method,
            data.status_code,
            data.request_body || null,
            data.response_body || null
        ]
    );
};

export const getUsageCount = (clientId: string, windowMs: number): number => {
    const db = getSqliteDb();
    const since = new Date(Date.now() - windowMs).toISOString().replace('T', ' ').substring(0, 19);

    const result = db.query(
        'SELECT COUNT(*) as count FROM api_usage_logs WHERE client_id = ? AND timestamp >= ?'
    ).get(clientId, since) as { count: number };

    return result?.count || 0;
};

export const updateAllowedIps = (clientId: string, allowedIps: string | null): void => {
    const db = getSqliteDb();
    db.run(
        'UPDATE api_clients SET allowed_ips = ?, updated_at = CURRENT_TIMESTAMP WHERE client_id = ?',
        [allowedIps, clientId]
    );
};
