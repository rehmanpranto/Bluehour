# Rideeta - Mood Logging Web App

A production-ready, trauma-informed mood logging application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL (Neon).

## Features

### 1. **Check-in Form** (Home Page)
- Simple, gentle interface for logging moods
- Date picker (defaults to today)
- Optional time of day label (morning, evening, etc.)
- Three 1-10 scales: Mood, Anxiety, Energy (with sliders and dropdowns)
- Optional notes field (up to 2000 characters)
- Comma-separated triggers and "what helped" tags
- Safety toggle: "I feel safe right now"
- Gentle confirmation message on successful save

### 2. **History Page**
- View all entries sorted by date (newest first)
- Filter by:
  - Low mood (≤3)
  - High anxiety (≥8)
  - Not marked safe
- Each entry shows date, time label, scales, safety status, notes, and tags
- Delete entries with confirmation
- Beautiful, readable card layout

### 3. **Data Management**
- **Export**: Download all entries as JSON file
- **Import**: Restore entries from a JSON backup (merge by ID to avoid duplicates)
- Simple one-click backup and restore

### 4. **Privacy & Security**
- Server-side only database access (DATABASE_URL never exposed to browser)
- Parameterized queries (no SQL injection vulnerabilities)
- Input validation with Zod schemas
- Basic rate limiting (30 requests/minute per IP)
- Structured for future auth implementation

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **Validation**: Zod
- **Database Client**: @neondatabase/serverless

## Project Structure

```
blue_hour/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── entries/
│   │   │   │   ├── route.ts          # POST (create), GET (list with filters)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # DELETE entry
│   │   │   ├── export/
│   │   │   │   └── route.ts          # GET (export all as JSON)
│   │   │   └── import/
│   │   │       └── route.ts          # POST (import and merge JSON)
│   │   ├── history/
│   │   │   └── page.tsx              # History page
│   │   ├── layout.tsx                # Root layout with navigation
│   │   ├── page.tsx                  # Home check-in page
│   │   └── globals.css               # Global Tailwind styles
│   ├── components/
│   │   ├── CheckInForm.tsx           # Check-in form component
│   │   ├── HistoryList.tsx           # History list with filters
│   │   └── ExportImport.tsx          # Export/import controls
│   └── lib/
│       ├── db.ts                     # Database connection & query helpers
│       ├── schemas.ts                # Zod validation schemas
│       └── rate-limit.ts             # Simple rate limiter
├── migrations/
│   └── 001_create_mood_entries.sql   # Database schema
├── .env.local                         # (Create locally) Database connection
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (use Neon for easy hosting)
- Git

### 2. Clone or Create Project

The project is already scaffolded. If starting fresh:

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the project root:

```bash
DATABASE_URL=postgresql://user:password@host/dbname
```

**Important**: 
- Never commit `.env.local` to version control
- `DATABASE_URL` is only accessible server-side
- For Neon, get your connection string from the Neon dashboard

### 4. Run Database Migration

```bash
# Using psql directly
psql -d your_database_name -f migrations/001_create_mood_entries.sql

# Or if using Neon web interface:
# 1. Copy the SQL from migrations/001_create_mood_entries.sql
# 2. Paste it into the Neon SQL editor
# 3. Run the query
```

Verify the table was created:

```bash
psql -d your_database_name -c "\dt"
```

You should see `mood_entries` table listed.

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see:
- **Home page** with check-in form
- **Navigation** to History page
- **Export/Import** section

### 7. Test the App

1. **Create an entry**:
   - Fill in the form on the home page
   - Click "Save Reflection"
   - You should see a confirmation message

2. **View history**:
   - Click "History" in the navigation
   - See your entry in the list

3. **Filter entries**:
   - Use the filter buttons (Low Mood, High Anxiety, Not Safe)

4. **Export data**:
   - Click "Export Entries" to download JSON

5. **Delete an entry**:
   - Click "Delete" on any entry
   - Confirm when prompted

## Deployment (Vercel)

### Pre-deployment Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Database schema is created
- [ ] All tests pass (`npm run test` if tests exist)
- [ ] No sensitive data in git history

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial Rideeta app"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Set Environment Variables**:
   - In Vercel project settings → Environment Variables
   - Add `DATABASE_URL` with your Neon connection string
   - Do NOT include `.env.local` secrets

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Visit your Vercel URL

### Production Best Practices

- **Database**: Use Neon's auto-backup feature
- **Monitoring**: Set up Vercel Analytics to track performance
- **Secrets**: Rotate DATABASE_URL periodically
- **Rate Limiting**: Consider upgrading to a more robust solution (e.g., Redis)
- **Backups**: Regularly export entries via the app UI

## API Endpoints

### POST /api/entries
Create a new mood entry.

**Request**:
```json
{
  "entry_date": "2025-12-30",
  "entry_time_label": "morning",
  "mood": 7,
  "anxiety": 4,
  "energy": 6,
  "notes": "Had a good day.",
  "triggers": "work stress, lack of sleep",
  "helped": "exercise, meditation",
  "felt_safe": true
}
```

**Response** (201):
```json
{
  "id": "uuid-here",
  "created_at": "2025-12-30T10:00:00Z",
  "entry_date": "2025-12-30",
  "mood": 7,
  ...
}
```

### GET /api/entries?filter=low_mood
Get entries, optionally filtered.

**Query Parameters**:
- `filter=low_mood` → mood ≤ 3
- `filter=high_anxiety` → anxiety ≥ 8
- `filter=not_safe` → felt_safe = false
- None → all entries

**Response** (200): Array of entries

### DELETE /api/entries/[id]
Delete an entry by ID.

**Response** (200):
```json
{ "success": true }
```

### GET /api/export
Export all entries as JSON.

**Response** (200): JSON file download

### POST /api/import
Import and merge entries from JSON.

**Request**:
```json
[
  {
    "id": "uuid-here",
    "entry_date": "2025-12-30",
    "mood": 7,
    ...
  }
]
```

**Response** (200):
```json
{
  "success": true,
  "imported": 5,
  "skipped": 0,
  "message": "Imported 5 entries."
}
```

## Security Notes

### ✅ Implemented

- ✅ Server-side only database access
- ✅ Parameterized queries (no SQL injection)
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ No secrets in client code
- ✅ Structured for future auth

### 🔒 Future Improvements

- [ ] Add user authentication (OAuth, email, or SSO)
- [ ] Implement row-level security (RLS) in PostgreSQL
- [ ] Add request signing/verification
- [ ] Use Redis for distributed rate limiting
- [ ] Add data encryption at rest
- [ ] Implement audit logging

## Troubleshooting

### "DATABASE_URL is not set"
- Check `.env.local` exists in project root
- Verify the connection string is correct
- Restart dev server after updating `.env.local`

### "Table does not exist"
- Run the migration: `psql -f migrations/001_create_mood_entries.sql`
- Check database name is correct

### Entries not saving
- Check browser console for error messages
- Verify database is running and accessible
- Check Vercel logs if deployed

### Rate limit errors
- This is per-IP: 30 requests/minute
- Wait a minute and try again
- For MVP; upgrade in production

## Development

### Running Tests (Future)

```bash
npm run test
```

### Linting

```bash
npm run lint
```

### Build for Production

```bash
npm run build
npm start
```

## Code of Conduct

Rideeta is built with trauma-informed principles. All language and interactions should be:
- Gentle and non-judgmental
- Empowering, not clinical
- Focused on reflection, not diagnosis
- Respectful of individual healing journeys

## License

MIT

## Support

For questions or issues, please open a GitHub issue or contact the maintainer.

---

**Made with 💙 for thoughtful reflection.**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
