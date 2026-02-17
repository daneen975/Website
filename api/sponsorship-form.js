import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sponsorship_form (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const { name, email, phoneNumber, comment } = req.body;

    if (!name || !email || !phoneNumber || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await sql`
      INSERT INTO sponsorship_form (name, email, phone_number, comment)
      VALUES (${name}, ${email}, ${phoneNumber}, ${comment})
      RETURNING id
    `;

    res.status(201).json({
      success: true,
      message: 'Sponsorship form submitted successfully!',
      id: result[0].id
    });

  } catch (error) {
    console.error('Error submitting sponsorship form:', error);
    res.status(500).json({ success: false, message: 'Error submitting form. Please try again later.' });
  }
}
