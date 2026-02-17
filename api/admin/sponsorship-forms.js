import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT * FROM sponsorship_form 
      ORDER BY created_at DESC
    `;

    res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching sponsorship forms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
