import type { Db } from 'mongodb';

export const name = '20260218_create_users_collection';

export const up = async (db: Db): Promise<void> => {
  await db.collection('users').createIndex(
    { email: 1 },
    { unique: true, name: 'email_unique' }
  );
};

export const down = async (db: Db): Promise<void> => {
  await db.collection('users').dropIndex('email_unique').catch(() => {
    // Index may not exist
  });
};
