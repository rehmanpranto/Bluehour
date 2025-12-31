const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create a test user with a simple password
    const result = await client.query(`
      INSERT INTO users (email, password_hash, full_name)
      VALUES ($1, crypt($2, gen_salt('bf')), $3)
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = crypt($2, gen_salt('bf'))
      RETURNING id, email, full_name;
    `, ['test@bluehour.app', 'test123', 'Test User']);

    console.log('\n✅ Test user created successfully!');
    console.log('\nLogin credentials:');
    console.log('  Email: test@bluehour.app');
    console.log('  Password: test123');
    console.log('\nUser ID:', result.rows[0].id);

    await client.end();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestUser();
