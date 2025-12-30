-- Create pgcrypto extension for UUID and password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create mood_entries table (modified to include user_id)
CREATE TABLE IF NOT EXISTS mood_entries (
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_entry_date ON mood_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood ON mood_entries(user_id, mood);
CREATE INDEX IF NOT EXISTS idx_mood_entries_anxiety ON mood_entries(user_id, anxiety);
CREATE INDEX IF NOT EXISTS idx_mood_entries_felt_safe ON mood_entries(user_id, felt_safe);

-- Create index on users email for login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
