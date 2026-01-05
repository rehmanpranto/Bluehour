# Bluehour - Mood Logging Web App

A production-ready, trauma-informed mood logging application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL (Neon).

## Features

### 1. **Authentication**
- Secure login and signup system
- Password hashing with bcryptjs
- Cookie-based session management
- User-scoped data (all entries tied to authenticated users)

### 2. **Landing Page**
- Gentle, welcoming interface for new users
- Clear value propositions: Private, Gentle, See patterns
- Quick access to login/signup
- Preview of History and 7-Day Report features

### 3. **Check-in Form**
- Simple, gentle interface for logging moods (requires authentication)
- Date picker (defaults to today)
- Optional time of day label (morning, evening, etc.)
- Three 1-10 scales: Mood, Anxiety, Energy (with sliders and dropdowns)
- Optional notes field (up to 2000 characters)
- Comma-separated triggers and "what helped" tags
- Safety toggle: "I feel safe right now"
- Gentle confirmation message on successful save

### 4. **History Page**
- View all your entries sorted by date (newest first)
- Filter by:
  - Low mood (≤3)
  - High anxiety (≥8)
  - Not marked safe
- Each entry shows date, time label, scales, safety status, notes, and tags
- Delete entries with confirmation
- Beautiful, readable card layout

### 5. **7-Day Report**
- Aggregated view of the past 7 days
- Daily breakdown with averages for mood, anxiety, and energy
- Safety percentage for each day
- Summary statistics: overall averages and safe days percentage
- Helpful insights into patterns over the week

### 6. **Data Management**
- **Export**: Download all your entries as JSON file
- **Import**: Restore entries from a JSON backup (merge by ID to avoid duplicates)
- Simple one-click backup and restore

### 7. **Privacy & Security**
- User authentication required for all mood entries
- Server-side only database access (DATABASE_URL never exposed to browser)
- Parameterized queries (no SQL injection vulnerabilities)
- Input validation with Zod schemas
- Basic rate limiting (30 requests/minute per IP)
- Password hashing with bcryptjs
- httpOnly cookies for session management

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
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts      # POST login
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts      # POST logout
│   │   │   │   └── signup/
│   │   │   │       └── route.ts      # POST signup
│   │   │   ├── entries/
│   │   │   │   ├── route.ts          # POST (create), GET (list with filters) - requires auth
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # DELETE entry - requires auth
│   │   │   ├── export/
│   │   │   │   └── route.ts          # GET (export all as JSON) - requires auth
│   │   │   ├── import/
│   │   │   │   └── route.ts          # POST (import and merge JSON) - requires auth
│   │   │   └── migrations/
│   │   │       └── route.ts          # POST (run database migrations)
│   │   ├── auth/
│   │   │   └── login/
│   │   │       └── page.tsx          # Login/signup page
│   │   ├── checkin/
│   │   │   └── page.tsx              # Check-in form page
│   │   ├── history/
│   │   │   └── page.tsx              # History page
│   │   ├── report/
│   │   │   └── page.tsx              # 7-Day report page
│   │   ├── layout.tsx                # Root layout with navigation
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global Tailwind styles
│   ├── components/
│   │   ├── CheckInForm.tsx           # Check-in form component
│   │   ├── ExportImport.tsx          # Export/import controls
│   │   ├── HistoryList.tsx           # History list with filters
│   │   ├── LoginForm.tsx             # Login/signup form with test account
│   │   └── UserMenu.tsx              # User menu with logout
│   └── lib/
│       ├── auth.ts                   # Authentication helpers
│       ├── db.ts                     # Database connection & query helpers
│       ├── migrations.ts             # Migration runner
│       ├── rate-limit.ts             # Simple rate limiter
│       ├── schemas.ts                # Zod validation schemas
│       └── session.ts                # Session management
├── migrations/
│   ├── 001_create_mood_entries.sql   # Initial database schema
│   └── 002_add_user_authentication.sql # User authentication tables
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

You can run migrations via the API endpoint or manually with psql.

**Option 1: Via API (Recommended)**
```bash
# Start the dev server
npm run dev

# In another terminal, run migrations
curl -X POST http://localhost:3000/api/migrations
```

**Option 2: Manual psql**
```bash
# Run both migrations in order
psql -d your_database_name -f migrations/001_create_mood_entries.sql
psql -d your_database_name -f migrations/002_add_user_authentication.sql

# Or if using Neon web interface:
# 1. Copy the SQL from each migration file
# 2. Paste it into the Neon SQL editor
# 3. Run the queries in order
```

Verify the tables were created:

```bash
psql -d your_database_name -c "\dt"
```

You should see `mood_entries` and `users` tables listed.

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

1. **Create an account**:
   - Go to [http://localhost:3000](http://localhost:3000)
   - Click "Login / Create account"
   - Sign up with your email and password

2. **Log in**:
   - After login, you'll be automatically redirected to the check-in page
   - Fill in the mood check-in form
   - Click "Save Reflection"
   - You should see a confirmation message

3. **View history**:
   - Click "History" in the navigation
   - See your entries in the list

4. **View 7-day report**:
   - Click "7-Day Report" in the navigation
   - See aggregated statistics for the past week

5. **Filter entries**:
   - On the History page, use the filter buttons (Low Mood, High Anxiety, Not Safe)

6. **Export data**:
   - Click "Export Entries" to download JSON

7. **Delete an entry**:
   - Click "Delete" on any entry
   - Confirm when prompted

8. **Log out**:
   - Click your email in the top right
   - Select "Log out"

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

### Authentication

#### POST /api/auth/signup
Create a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "fullName": "John Doe"
}
```

**Response** (201):
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

#### POST /api/auth/login
Authenticate a user and create a session.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response** (200):
```json
{
  "userId": "uuid-here",
  "email": "user@example.com"
}
```

#### POST /api/auth/logout
End the current user session.

**Response** (200):
```json
{
  "success": true
}
```

### Mood Entries (All require authentication)

#### POST /api/entries
Create a new mood entry for the authenticated user.

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
  "user_id": "user-uuid",
  "created_at": "2025-12-30T10:00:00Z",
  "entry_date": "2025-12-30",
  "mood": 7,
  ...
}
```

#### GET /api/entries?filter=low_mood
Get entries for the authenticated user, optionally filtered.

**Query Parameters**:
- `filter=low_mood` → mood ≤ 3
- `filter=high_anxiety` → anxiety ≥ 8
- `filter=not_safe` → felt_safe = false
- None → all entries

**Response** (200): Array of user's entries

#### DELETE /api/entries/[id]
Delete an entry by ID (only if owned by authenticated user).

**Response** (200):
```json
{ "success": true }
```

### Data Management (Requires authentication)

#### GET /api/export
Export all entries for the authenticated user as JSON.

**Response** (200): JSON file download

#### POST /api/import
Import and merge entries from JSON for the authenticated user.

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

### Migrations

#### POST /api/migrations
Run all pending database migrations. Idempotent - safe to run multiple times.

**Response** (200):
```json
{
  "message": "Migrations completed successfully"
}
```

## Security Notes

### ✅ Implemented

- ✅ User authentication with password hashing (bcryptjs)
- ✅ Cookie-based session management (httpOnly cookies)
- ✅ User-scoped data (all entries tied to authenticated users)
- ✅ Server-side only database access
- ✅ Parameterized queries (no SQL injection)
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ No secrets in client code
- ✅ Auto-creation of test account in development only

### 🔒 Future Improvements

- [ ] Add OAuth authentication (Google, GitHub)
- [ ] Implement password reset via email
- [ ] Add two-factor authentication (2FA)
- [ ] Implement row-level security (RLS) in PostgreSQL
- [ ] Add request signing/verification
- [ ] Use Redis for distributed rate limiting
- [ ] Add data encryption at rest
- [ ] Implement audit logging
- [ ] Add CSRF protection
- [ ] Implement refresh tokens

## Troubleshooting

### "DATABASE_URL is not set"
- Check `.env.local` exists in project root
- Verify the connection string is correct
- Restart dev server after updating `.env.local`

### "Table does not exist" or "relation 'users' does not exist"
- Run the migrations: `curl -X POST http://localhost:3000/api/migrations`
- Or manually: `psql -f migrations/001_create_mood_entries.sql` and `psql -f migrations/002_add_user_authentication.sql`
- Check database name is correct

### Can't log in or sign up
- Ensure migrations have been run (see above)
- Check that the test account button works (in development mode)
- Verify database is running and accessible
- Check browser console for error messages

### Entries not saving
- Make sure you're logged in (check for userId cookie in browser dev tools)
- Check browser console for error messages
- Verify database is running and accessible
- Check Vercel logs if deployed

### Rate limit errors
- This is per-IP: 30 requests/minute
- Wait a minute and try again
- For MVP; upgrade in production

### Test account not working
- Ensure you're in development mode (NODE_ENV !== 'production')
- The test account is auto-created on first login attempt
- Check migrations have been run

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
