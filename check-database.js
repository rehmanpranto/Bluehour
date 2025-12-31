const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to production database\n');

    // Check if users table exists
    const usersTableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    console.log('Users table exists:', usersTableCheck.rows[0].exists);

    // Check if user_id column exists in mood_entries
    const userIdColumnCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'mood_entries' AND column_name = 'user_id'
      );
    `);
    console.log('user_id column in mood_entries:', userIdColumnCheck.rows[0].exists);

    // Check if test user exists
    const testUserCheck = await client.query(`
      SELECT id, email, full_name FROM users WHERE email = 'test@bluehour.app';
    `);
    console.log('Test user exists:', testUserCheck.rows.length > 0);
    if (testUserCheck.rows.length > 0) {
      console.log('Test user details:', testUserCheck.rows[0]);
    }

    // Count mood entries
    const entriesCount = await client.query(`SELECT COUNT(*) FROM mood_entries;`);
    console.log('\nTotal mood entries:', entriesCount.rows[0].count);

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
