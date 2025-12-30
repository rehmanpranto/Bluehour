-- Create pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  person_name text NOT NULL DEFAULT 'Rideeta',
  entry_date date NOT NULL,
  entry_time_label text,
  mood smallint NOT NULL CHECK (mood BETWEEN 1 AND 10),
  anxiety smallint NOT NULL CHECK (anxiety BETWEEN 1 AND 10),
  energy smallint NOT NULL CHECK (energy BETWEEN 1 AND 10),
  notes text,
  triggers text[],
  helped text[],
  felt_safe boolean NOT NULL DEFAULT false
);

-- Create useful indexes
CREATE INDEX IF NOT EXISTS idx_mood_entries_entry_date ON mood_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_felt_safe ON mood_entries(felt_safe);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood ON mood_entries(mood);
CREATE INDEX IF NOT EXISTS idx_mood_entries_anxiety ON mood_entries(anxiety);
