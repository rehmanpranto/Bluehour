-- Migration to add user authentication to existing mood_entries table
-- This is a safe migration that won't lose existing data

-- Create pgcrypto extension for UUID and password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create a default user for existing entries
INSERT INTO users (id, email, password_hash, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'default@bluehour.app',
  crypt('change-this-password', gen_salt('bf')),
  'Default User'
)
ON CONFLICT (email) DO NOTHING;

-- Add user_id column to mood_entries if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mood_entries' AND column_name = 'user_id'
  ) THEN
    -- Add the column as nullable first
    ALTER TABLE mood_entries ADD COLUMN user_id UUID;
    
    -- Set all existing entries to the default user
    UPDATE mood_entries 
    SET user_id = '00000000-0000-0000-0000-000000000001'::uuid 
    WHERE user_id IS NULL;
    
    -- Now make it NOT NULL and add the foreign key
    ALTER TABLE mood_entries ALTER COLUMN user_id SET NOT NULL;
    ALTER TABLE mood_entries ADD CONSTRAINT fk_mood_entries_user 
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better query performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_entry_date ON mood_entries(user_id, entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood ON mood_entries(user_id, mood);
CREATE INDEX IF NOT EXISTS idx_mood_entries_anxiety ON mood_entries(user_id, anxiety);
CREATE INDEX IF NOT EXISTS idx_mood_entries_felt_safe ON mood_entries(user_id, felt_safe);

-- Create index on users email for login
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
