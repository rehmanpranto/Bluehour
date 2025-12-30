import { query } from './db';

const migration001 = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  person_name TEXT DEFAULT 'Blue Hour',
  entry_date DATE NOT NULL,
  entry_time_label TEXT,
  mood SMALLINT CHECK (mood >= 1 AND mood <= 10),
  anxiety SMALLINT CHECK (anxiety >= 1 AND anxiety <= 10),
  energy SMALLINT CHECK (energy >= 1 AND energy <= 10),
  notes TEXT CHECK (CHAR_LENGTH(notes) <= 2000),
  triggers TEXT[],
  helped TEXT[],
  felt_safe BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_mood_entries_entry_date ON mood_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood ON mood_entries(mood);
CREATE INDEX IF NOT EXISTS idx_mood_entries_anxiety ON mood_entries(anxiety);
CREATE INDEX IF NOT EXISTS idx_mood_entries_felt_safe ON mood_entries(felt_safe);
`;

const migration002 = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mood_entries_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  person_name TEXT DEFAULT 'Blue Hour',
  entry_date DATE NOT NULL,
  entry_time_label TEXT,
  mood SMALLINT CHECK (mood >= 1 AND mood <= 10),
  anxiety SMALLINT CHECK (anxiety >= 1 AND anxiety <= 10),
  energy SMALLINT CHECK (energy >= 1 AND energy <= 10),
  notes TEXT CHECK (CHAR_LENGTH(notes) <= 2000),
  triggers TEXT[],
  helped TEXT[],
  felt_safe BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_entry_date ON mood_entries_v2(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries_v2(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood ON mood_entries_v2(user_id, mood);
CREATE INDEX IF NOT EXISTS idx_mood_entries_anxiety ON mood_entries_v2(user_id, anxiety);
CREATE INDEX IF NOT EXISTS idx_mood_entries_felt_safe ON mood_entries_v2(user_id, felt_safe);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;

export async function runMigrations() {
  try {
    console.log('Running migrations...');
    
    // Split migrations by semicolon and execute each statement
    const statements001 = migration001.split(';').filter(stmt => stmt.trim());
    for (const statement of statements001) {
      if (statement.trim()) {
        await query(statement.trim());
      }
    }
    console.log('Migration 001 completed');
    
    const statements002 = migration002.split(';').filter(stmt => stmt.trim());
    for (const statement of statements002) {
      if (statement.trim()) {
        await query(statement.trim());
      }
    }
    console.log('Migration 002 completed');
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}
