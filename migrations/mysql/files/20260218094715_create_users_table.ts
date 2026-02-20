import type { MySqlMigration } from '../runner.ts';
import type { Pool } from 'mysql2/promise';

export const name = '20260218094715_create_users_table';

export const up = async (pool: Pool): Promise<void> => {
  await pool.execute(`
    // Add your UP migration SQL here
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};

export const down = async (pool: Pool): Promise<void> => {
  await pool.execute(`
    // Add your DOWN migration SQL here
    DROP TABLE IF EXISTS users
  `);
};
