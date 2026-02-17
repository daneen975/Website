import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS interest_form (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        program VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const { firstName, lastName, email, program } = req.body;

    if (!firstName || !lastName || !email || !program) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await sql`
      INSERT INTO interest_form (first_name, last_name, email, program)
      VALUES (${firstName}, ${lastName}, ${email}, ${program})
      RETURNING id
    `;

    res.status(201).json({
      success: true,
      message: 'Interest form submitted successfully!',
      id: result[0].id
    });

  } catch (error) {
    console.error('Error submitting interest form:', error);

    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    res.status(500).json({ success: false, message: 'Error submitting form. Please try again later.' });
  }
}
