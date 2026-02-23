import { getSqliteDb } from '../database/sqlite.connection.ts';

export interface TiktokRequest {
    request_id: string;
    client_id: string;
    usernames: string; // JSON string
    total_username: number;
    total_process: number;
    total_error: number;
    total_success: number;
    result: string | null; // JSON string
    process_status: 'pending' | 'processing' | 'done' | 'cancelled';
    callback_url: string | null;
    callback_response: string | null;
    callback_retry_count: number;
    created_at: string;
    updated_at: string;
}

export const create = (data: Partial<TiktokRequest>): void => {
    const db = getSqliteDb();
    db.run(
        `INSERT INTO request_tiktok_profiles (
            request_id, client_id, usernames, total_username, 
            process_status, callback_url
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.request_id ?? '',
            data.client_id ?? '',
            data.usernames ?? '[]',
            data.total_username ?? 0,
            data.process_status || 'pending',
            data.callback_url ?? null
        ]
    );
};

export const findById = (requestId: string): TiktokRequest | null => {
    const db = getSqliteDb();
    const result = db.query('SELECT * FROM request_tiktok_profiles WHERE request_id = ?').get(requestId);
    return (result as TiktokRequest) || null;
};

export const findActiveByClientId = (clientId: string): TiktokRequest | null => {
    const db = getSqliteDb();
    const result = db.query(
        "SELECT * FROM request_tiktok_profiles WHERE client_id = ? AND process_status IN ('pending', 'processing') LIMIT 1"
    ).get(clientId);
    return (result as TiktokRequest) || null;
};

export const getStatus = (requestId: string): string | null => {
    const db = getSqliteDb();
    const result = db.query('SELECT process_status FROM request_tiktok_profiles WHERE request_id = ?').get(requestId);
    return result ? (result as any).process_status : null;
};

export const cancel = (requestId: string): void => {
    const db = getSqliteDb();
    db.run(
        `UPDATE request_tiktok_profiles 
         SET process_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE request_id = ?`,
        [requestId]
    );
};

export const updateProgress = (requestId: string, data: {
    total_process: number;
    total_error: number;
    total_success: number;
    result: string;
    process_status: 'pending' | 'processing' | 'done' | 'cancelled';
}): void => {
    const db = getSqliteDb();
    db.run(
        `UPDATE request_tiktok_profiles 
         SET total_process = ?, total_error = ?, total_success = ?, result = ?, process_status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE request_id = ?`,
        [data.total_process, data.total_error, data.total_success, data.result, data.process_status, requestId]
    );
};

export const updateCallback = (requestId: string, data: {
    callback_response: string;
    callback_retry_count: number;
}): void => {
    const db = getSqliteDb();
    db.run(
        `UPDATE request_tiktok_profiles 
         SET callback_response = ?, callback_retry_count = ?, updated_at = CURRENT_TIMESTAMP
         WHERE request_id = ?`,
        [data.callback_response, data.callback_retry_count, requestId]
    );
};
