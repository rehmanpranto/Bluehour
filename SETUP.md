# Rideeta Setup Guide

## Quick Start (5-10 minutes)

### 1. Create a Neon PostgreSQL Database

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up (free tier available)
3. Create a new project
4. Copy the connection string that looks like:
   ```
   postgresql://user:password@host/dbname?sslmode=require
   ```

### 2. Set Up Environment

Create `.env.local` in the project root:

```bash
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

**Replace** with your actual Neon connection string.

### 3. Run Database Migration

Using psql (PostgreSQL CLI):

```bash
# If using Neon's SQL editor:
# 1. Open Neon dashboard
# 2. Click "SQL Editor"
# 3. Copy and paste the entire contents of: migrations/001_create_mood_entries.sql
# 4. Click "Run"

# Or use psql command line:
psql -d your_database_name -f migrations/001_create_mood_entries.sql
```

Verify the table was created:

```bash
psql -d your_database_name -c "\dt"
```

You should see `mood_entries` listed.

### 4. Install & Run

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Test It Out

1. **Create an entry**:
   - Fill in the form
   - Adjust the sliders or select numbers
   - Click "Save Reflection"
   - You should see a success message

2. **View History**:
   - Click "History" in the top navigation
   - See your entry listed

3. **Export**:
   - Click "Export Entries" on the home page
   - A JSON file downloads

4. **Import**:
   - Click "Import Entries"
   - Select the JSON file you just exported
   - Entries are merged without duplicates

---

## Detailed Setup

### Prerequisites

**Required**:
- Node.js 18+ ([download](https://nodejs.org))
- npm (comes with Node.js)
- PostgreSQL database (use free [Neon](https://neon.tech) for easiest setup)

**Optional but Recommended**:
- psql command-line tool (for running migrations)
- VS Code with extensions:
  - ESLint
  - Prettier
  - Thunder Client (or Postman) for API testing

### Step-by-Step Installation

#### Step 1: Database Setup (Neon)

**Option A: Neon (Recommended)**

1. Visit [neon.tech](https://neon.tech)
2. Click "Sign Up"
3. Create account (GitHub/Google login available)
4. Create a new project
5. Go to "Connection String" section
6. Select "Nodejs" from the dropdown
7. Copy the full connection string

**Option B: Local PostgreSQL**

1. Install PostgreSQL: [postgresql.org](https://www.postgresql.org/download)
2. Create a database:
   ```bash
   createdb rideeta
   ```
3. Get connection string:
   ```
   postgresql://localhost/rideeta
   ```

#### Step 2: Environment Configuration

Create `.env.local` in the project root:

```bash
# For Neon
DATABASE_URL=postgresql://user:password@region.neon.tech/dbname?sslmode=require

# For local PostgreSQL
DATABASE_URL=postgresql://localhost/rideeta
```

**Important**: 
- Never share or commit `.env.local`
- It's already in `.gitignore`
- Keep it secure

#### Step 3: Run Migration

**Using Neon Web Editor** (easiest):

1. Open your Neon project dashboard
2. Click "SQL Editor" 
3. Copy all SQL from `migrations/001_create_mood_entries.sql`
4. Paste into the editor
5. Click "Run"

**Using psql Command Line**:

```bash
# Connect and run migration
psql postgresql://user:password@host/dbname < migrations/001_create_mood_entries.sql

# Verify table exists
psql postgresql://user:password@host/dbname -c "\dt"
```

You should see:
```
          List of relations
 Schema |      Name      | Type  | Owner
--------+----------------+-------+-------
 public | mood_entries   | table | user
```

#### Step 4: Install Dependencies

```bash
# Navigate to project directory
cd blue_hour

# Install npm packages
npm install
```

This installs:
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety
- `tailwindcss` - CSS framework
- `zod` - Validation
- `@neondatabase/serverless` - Database client

#### Step 5: Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.1.1 (Turbopack)
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing the Application

### 1. Create Your First Entry

1. On the home page, you'll see the check-in form
2. Fill in:
   - Date (defaults to today)
   - Mood: 7
   - Anxiety: 4
   - Energy: 6
   - Optional: Add notes like "This is my first reflection"
3. Click "Save Reflection"
4. You should see: "Your reflection has been saved with care..."

### 2. View History

1. Click "History" in the top navigation
2. You should see your entry listed with all the details
3. The entry shows date, time label, mood/anxiety/energy values, safety status, and notes

### 3. Test Filters

On the history page:
- Click "Low Mood (≤3)" - no entries shown (your mood was 7)
- Click "All" to return to full list
- Click "High Anxiety (≥8)" - no entries shown
- Create another entry with anxiety ≥ 8 to test this filter

### 4. Test Export

1. Go to home page
2. Click "Export Entries" 
3. A file named `rideeta-entries-2025-12-30.json` downloads
4. Open it in a text editor - you should see JSON with your entries

### 5. Test Import

1. Create another entry with different values
2. Export again
3. Delete one entry by going to History and clicking Delete
4. Confirm deletion
5. Go back to home page
6. Click "Import Entries" and select your exported JSON
7. The entries are restored - no duplicates created

### 6. Test API Directly (Optional)

Use curl, Thunder Client, or Postman:

**Create entry**:
```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{
    "entry_date": "2025-12-30",
    "mood": 8,
    "anxiety": 3,
    "energy": 7
  }'
```

**Get all entries**:
```bash
curl http://localhost:3000/api/entries
```

**Get low mood entries**:
```bash
curl "http://localhost:3000/api/entries?filter=low_mood"
```

**Delete entry** (replace `<id>` with actual UUID):
```bash
curl -X DELETE http://localhost:3000/api/entries/<id>
```

---

## Project Structure

```
blue_hour/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (server-only)
│   │   │   ├── entries/
│   │   │   │   ├── route.ts  # POST (create), GET (list)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # DELETE
│   │   │   ├── export/
│   │   │   │   └── route.ts  # Download JSON
│   │   │   └── import/
│   │   │       └── route.ts  # Upload JSON
│   │   ├── history/
│   │   │   └── page.tsx      # History view
│   │   ├── layout.tsx        # Root layout (nav + footer)
│   │   ├── page.tsx          # Home (check-in form)
│   │   └── globals.css       # Tailwind styles
│   ├── components/           # Reusable components
│   │   ├── CheckInForm.tsx
│   │   ├── HistoryList.tsx
│   │   └── ExportImport.tsx
│   └── lib/                  # Utilities
│       ├── db.ts             # Database helpers
│       ├── schemas.ts        # Zod validation
│       └── rate-limit.ts     # Rate limiting
├── migrations/
│   └── 001_create_mood_entries.sql
├── public/                   # Static files
├── .env.local               # (Create this) Database URL
├── .env.local.example       # Template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Troubleshooting

### "DATABASE_URL is not set"

**Error**:
```
Error: DATABASE_URL environment variable is not set
```

**Solution**:
1. Create `.env.local` in project root
2. Add: `DATABASE_URL=postgresql://...`
3. Restart dev server (`npm run dev`)
4. Check `.env.local` is NOT in `.gitignore` - it shouldn't be committed!

### "Cannot connect to database"

**Error**:
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
- Verify PostgreSQL is running
- Check connection string is correct
- For Neon: Ensure you copied the full connection string including `?sslmode=require`
- Test connection: `psql <your_connection_string>`

### "Relation 'mood_entries' does not exist"

**Error**:
```
error: relation "mood_entries" does not exist
```

**Solution**:
1. Run the migration:
   ```bash
   psql <your_connection_string> < migrations/001_create_mood_entries.sql
   ```
2. Verify: `psql <your_connection_string> -c "\dt"`
3. You should see `mood_entries` table

### Port 3000 already in use

**Error**:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Kill process on port 3000 (Linux/Mac)
lsof -i :3000
kill -9 <PID>

# Option 2: Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build errors

**If `npm run build` fails**:

```bash
# Clear cache
rm -rf .next/
rm -rf node_modules/
rm package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```

### Entries not saving

**Error**: Form submits but nothing appears in history

**Debugging**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Fill form and submit
4. Look for POST request to `/api/entries`
5. Check response status:
   - 201 = Success
   - 400 = Validation error (check response details)
   - 500 = Server error (check console.log in terminal)
6. Check browser console for error messages

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial Rideeta setup"
git push origin main
```

### Step 2: Connect Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Set Environment Variables

1. In Vercel project settings → "Environment Variables"
2. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string
3. Select environments: Production, Preview, Development
4. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed app URL

### Production Checklist

- [ ] `.env.local` is in `.gitignore` (don't commit secrets!)
- [ ] Database backups enabled (Neon has auto-backup)
- [ ] DATABASE_URL set in Vercel (not hardcoded)
- [ ] All environment variables configured
- [ ] No console.log of sensitive data
- [ ] Build succeeds without warnings

---

## Next Steps

1. **Customize colors**: Edit `tailwind.config.ts` and CSS classes
2. **Add authentication**: Implement user login (future feature)
3. **Set up backups**: Use Neon's backup features
4. **Monitor usage**: Check Vercel Analytics
5. **Share with Rideeta**: Create sharing feature for trusted contacts

---

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Zod Validation](https://zod.dev)
- [Neon Database](https://neon.tech/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Read error messages carefully - they usually indicate the problem
3. Check `npm run dev` terminal output for API errors
4. Check browser console (F12) for client-side errors
5. Check Vercel logs if deployed

---

**You've got this! 💙 Take your time, and remember that this app is here to support your reflection.**
