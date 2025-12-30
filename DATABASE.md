# Rideeta Database Schema Reference

## Table: mood_entries

### Purpose
Stores all mood check-in entries created by the user.

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier for each entry |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | Timestamp when entry was created (server-side) |
| `person_name` | text | NOT NULL, DEFAULT 'Rideeta' | Name of the person (for future multi-user support) |
| `entry_date` | date | NOT NULL | Date the entry refers to (when the mood was logged) |
| `entry_time_label` | text | NULLABLE | Optional time of day label (e.g., "morning", "evening") |
| `mood` | smallint | NOT NULL, CHECK (1-10) | Mood scale from 1 (struggling) to 10 (great) |
| `anxiety` | smallint | NOT NULL, CHECK (1-10) | Anxiety scale from 1 (calm) to 10 (very anxious) |
| `energy` | smallint | NOT NULL, CHECK (1-10) | Energy level from 1 (exhausted) to 10 (energized) |
| `notes` | text | NULLABLE | Optional longer reflection/notes (max 2000 chars enforced in app) |
| `triggers` | text[] | NULLABLE | Array of trigger tags (e.g., `["work stress", "lack of sleep"]`) |
| `helped` | text[] | NULLABLE | Array of what helped tags (e.g., `["exercise", "meditation"]`) |
| `felt_safe` | boolean | NOT NULL, DEFAULT false | Whether user felt safe at the time of logging |

### Example Entry

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2025-12-30T14:30:00Z",
  "person_name": "Rideeta",
  "entry_date": "2025-12-30",
  "entry_time_label": "morning",
  "mood": 7,
  "anxiety": 4,
  "energy": 6,
  "notes": "Had a good day overall. Weather was nice.",
  "triggers": ["none"],
  "helped": ["morning walk", "talking to friend"],
  "felt_safe": true
}
```

## Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| `idx_mood_entries_entry_date` | entry_date DESC | Fast lookup of entries by date (for history view) |
| `idx_mood_entries_created_at` | created_at DESC | Fast lookup of recent entries (for feed/timeline) |
| `idx_mood_entries_felt_safe` | felt_safe | Fast filtering of entries where user didn't feel safe |
| `idx_mood_entries_mood` | mood | Fast filtering of low mood entries (mood ≤ 3) |
| `idx_mood_entries_anxiety` | anxiety | Fast filtering of high anxiety entries (anxiety ≥ 8) |

## SQL Queries

### Create Entry
```sql
INSERT INTO mood_entries 
  (entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe, person_name)
VALUES 
  ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Rideeta')
RETURNING id, created_at, entry_date, mood, anxiety, energy, notes, triggers, helped, felt_safe;
```

### Get All Entries (Newest First)
```sql
SELECT id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe
FROM mood_entries
ORDER BY entry_date DESC, created_at DESC;
```

### Get Low Mood Entries (Mood ≤ 3)
```sql
SELECT id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe
FROM mood_entries
WHERE mood <= $1  -- $1 = 3
ORDER BY entry_date DESC;
```

### Get High Anxiety Entries (Anxiety ≥ 8)
```sql
SELECT id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe
FROM mood_entries
WHERE anxiety >= $1  -- $1 = 8
ORDER BY entry_date DESC;
```

### Get Unsafe Entries (Felt Safe = False)
```sql
SELECT id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe
FROM mood_entries
WHERE felt_safe = $1  -- $1 = false
ORDER BY entry_date DESC;
```

### Get Entry by ID
```sql
SELECT id, created_at, entry_date, entry_time_label, mood, anxiety, energy, notes, triggers, helped, felt_safe
FROM mood_entries
WHERE id = $1;
```

### Delete Entry by ID
```sql
DELETE FROM mood_entries
WHERE id = $1;
```

### Update Entry
```sql
UPDATE mood_entries
SET entry_date = $2, mood = $3, anxiety = $4, energy = $5, notes = $6
WHERE id = $1
RETURNING *;
```

### Count Entries by Mood
```sql
SELECT mood, COUNT(*) as count
FROM mood_entries
GROUP BY mood
ORDER BY mood;
```

### Get Average Mood, Anxiety, Energy for Date Range
```sql
SELECT 
  ROUND(AVG(mood)::numeric, 2) as avg_mood,
  ROUND(AVG(anxiety)::numeric, 2) as avg_anxiety,
  ROUND(AVG(energy)::numeric, 2) as avg_energy
FROM mood_entries
WHERE entry_date BETWEEN $1 AND $2;  -- $1 = start_date, $2 = end_date
```

### Delete All Entries (Caution!)
```sql
DELETE FROM mood_entries;
```

## Data Types

- **uuid**: Universally Unique Identifier (128-bit)
- **timestamptz**: Timestamp with timezone (ISO 8601)
- **text**: Variable-length character string (unlimited)
- **date**: ISO 8601 date (YYYY-MM-DD)
- **smallint**: 16-bit integer (-32768 to 32767)
- **boolean**: TRUE or FALSE
- **text[]**: Array of text values

## Constraints

- **PRIMARY KEY**: Each entry has a unique ID
- **NOT NULL**: Required fields cannot be empty
- **CHECK**: Mood/Anxiety/Energy must be between 1 and 10
- **DEFAULT**: Fields like `id` and `created_at` have defaults

## Migration File

See `migrations/001_create_mood_entries.sql` for the full schema definition.

To create the table:

```bash
psql <your_connection_string> < migrations/001_create_mood_entries.sql
```

To drop the table (careful!):

```sql
DROP TABLE IF EXISTS mood_entries;
```

## Performance Notes

- Entries are indexed by date for fast history queries
- Filtering by mood/anxiety/safety is fast due to indexes
- Arrays (triggers, helped) are stored as PostgreSQL arrays (efficient)
- Recommended max entries per user: 100,000+ (performance not an issue)

## Future Schema Changes

When adding features:
1. Create a new migration file: `migrations/002_feature_name.sql`
2. Test locally first
3. Deploy migration before deploying app code
4. Update validation schemas in `src/lib/schemas.ts`
5. Update API routes to handle new fields

Example migration:
```sql
-- migrations/002_add_locations.sql
ALTER TABLE mood_entries ADD COLUMN location text;
CREATE INDEX idx_mood_entries_location ON mood_entries(location);
```

---

For more details, see the main README.md and SETUP.md files.
