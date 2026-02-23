import { getSqliteDb } from '../src/database/sqlite.connection.ts';
import bcrypt from 'bcryptjs';

export const seedTestClient = async () => {
    const db = getSqliteDb();
    const clientId = 'test_client_id';
    const rawSecret = 'test_client_secret';
    const hashedSecret = await bcrypt.hash(rawSecret, 10);

    try {
        db.run(
            'INSERT OR REPLACE INTO api_clients (name, client_id, client_secret, allowed_ips, status) VALUES (?, ?, ?, ?, ?)',
            ['Test Website', clientId, hashedSecret, null, 'active']
        );
        console.log('✅ Test client created successfully!');
        console.log('Client ID:', clientId);
        console.log('Client Secret:', rawSecret);
    } catch (error) {
        console.error('❌ Failed to create test client:', error);
    }
};

if (import.meta.main) {
    await seedTestClient();
}
