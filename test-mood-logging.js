const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testMoodLogging() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get test user
    const userResult = await client.query(
      'SELECT id, email FROM users WHERE email = $1',
      ['test@bluehour.app']
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Test user not found. Creating one...');
      await client.query(`
        INSERT INTO users (email, password_hash, full_name)
        VALUES ($1, crypt($2, gen_salt('bf')), $3)
      `, ['test@bluehour.app', 'test123', 'Test User']);
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user exists:', userResult.rows[0].email);
    }

    // Get the user ID
    const userCheck = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['test@bluehour.app']
    );
    const userId = userCheck.rows[0].id;

    // Try to insert a test mood entry
    console.log('\n📝 Testing mood entry creation...');
    const testEntry = await client.query(`
      INSERT INTO mood_entries 
        (user_id, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe, person_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, entry_date, mood, anxiety, energy
    `, [
      userId,
      '2026-01-04', // today's date
      'evening',
      7, // mood
      4, // anxiety
      6, // energy
      'Test entry to verify mood logging works',
      ['work', 'stress'],
      ['exercise', 'meditation'],
      true,
      'Blue Hour'
    ]);

    console.log('✅ Test mood entry created successfully!');
    console.log('Entry details:', testEntry.rows[0]);

    // Count all entries for this user
    const countResult = await client.query(
      'SELECT COUNT(*) FROM mood_entries WHERE user_id = $1',
      [userId]
    );
    console.log('\n📊 Total mood entries for test user:', countResult.rows[0].count);

    // Show recent entries
    const recentEntries = await client.query(`
      SELECT entry_date, mood, anxiety, energy, notes, created_at
      FROM mood_entries 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 5
    `, [userId]);

    console.log('\n📖 Recent mood entries:');
    recentEntries.rows.forEach((entry, index) => {
      console.log(`  ${index + 1}. Date: ${entry.entry_date}, Mood: ${entry.mood}/10, Anxiety: ${entry.anxiety}/10, Energy: ${entry.energy}/10`);
      if (entry.notes) console.log(`     Notes: ${entry.notes.substring(0, 50)}...`);
    });

    console.log('\n✅ Everything is working correctly!');
    console.log('\n🎯 To log your moods:');
    console.log('   1. Go to: http://localhost:3000/auth/login');
    console.log('   2. Login with:');
    console.log('      Email: test@bluehour.app');
    console.log('      Password: test123');
    console.log('   3. You\'ll be redirected to /checkin');
    console.log('   4. Fill out the form and click "Save reflection"');

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testMoodLogging();
