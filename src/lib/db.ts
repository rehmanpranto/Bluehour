import { Pool } from '@neondatabase/serverless';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    pool = new Pool({ connectionString: databaseUrl });
  }
  return pool;
}

export async function query(
  text: string,
  params?: (string | number | boolean | null | string[] | undefined)[]
) {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
