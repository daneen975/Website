import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1`;
    res.status(200).json({ status: 'OK', message: 'Lunaris Hacks API is running' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
  }
}
