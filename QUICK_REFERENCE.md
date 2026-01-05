# Blue Hour - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

### 1. Set Up Database
```bash
# Create .env.local in project root with your database URL
DATABASE_URL=your_database_connection_string
```

### 2. Run Migration
```bash
# Run all migration files in order
psql $DATABASE_URL < migrations/001_create_mood_entries.sql
psql $DATABASE_URL < migrations/002_add_user_authentication.sql
psql $DATABASE_URL < migrations/003_add_user_id_to_mood_entries.sql
```

### 3. Start Dev Server
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | Database URL (create, don't commit) |
| `src/app/page.tsx` | Landing page |
| `src/app/history/page.tsx` | History view |
| `src/app/api/entries/route.ts` | CRUD operations |
| `src/app/api/auth/login/route.ts` | Authentication |
| `src/lib/db.ts` | Database connection |
| `src/lib/schemas.ts` | Validation rules |
| `migrations/` | Database migrations |
| `README.md` | Full documentation |

---

## 🛠️ Common Commands

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm start             # Start production server
npm run lint          # Run ESLint
npx tsc --noEmit     # Check TypeScript
```

---

## 🔑 Key API Endpoints

### Create Entry
```bash
POST /api/entries
{
  "entry_date": "2025-12-30",
  "mood": 7,
  "anxiety": 4,
  "energy": 6,
  "notes": "Optional notes",
  "triggers": "trigger1, trigger2",
  "helped": "thing1, thing2",
  "felt_safe": true
}
```

### Get Entries
```bash
GET /api/entries                    # All entries
GET /api/entries?filter=low_mood    # Mood ≤ 3
GET /api/entries?filter=high_anxiety # Anxiety ≥ 8
GET /api/entries?filter=not_safe    # Not safe
```

### Delete Entry
```bash
DELETE /api/entries/[uuid-id]
```

### Export/Import
```bash
GET /api/export                     # Download JSON
POST /api/import                    # Upload JSON
```

---

## 🎨 UI Component Overview

| Component | Location | Purpose |
|-----------|----------|---------|
| CheckInForm | `src/components/CheckInForm.tsx` | Main form |
| HistoryList | `src/components/HistoryList.tsx` | Entry list |
| ExportImport | `src/components/ExportImport.tsx` | Backup controls |

---

## 🔒 Security Checklist

- [ ] `.env.local` created with DATABASE_URL
- [ ] `.env.local` is in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] Parameterized queries used (see `src/lib/db.ts`)
- [ ] Zod validation on all inputs (see `src/lib/schemas.ts`)
- [ ] Rate limiting enabled (`src/lib/rate-limit.ts`)

---

## 🚨 Troubleshooting Quick Tips

| Issue | Solution |
|-------|----------|
| "DATABASE_URL not set" | Create `.env.local` with connection string, restart server |
| "Table does not exist" | Run migration: `psql $DATABASE_URL < migrations/001_...sql` |
| "Port 3000 in use" | `npm run dev -- -p 3001` (use different port) |
| "Build fails" | Clear `.next/` folder: `rm -rf .next/` |
| "Entries not saving" | Check browser console (F12), verify database connection |

### Debugging 400 Bad Request Errors

A **400 Bad Request** means the server rejected your request as invalid. Follow these steps:

#### 1. Inspect the Request
```bash
# Open Chrome DevTools (F12) → Network tab
# Reproduce the error and click the failed request
# Check: URL, Method, Headers, Cookies, Payload
```

#### 2. Common Causes & Fixes

**Missing or Invalid Payload**
- Ensure all required fields are present: `entry_date`, `mood`, `anxiety`, `energy`, `felt_safe`
- Verify JSON is valid (no trailing commas, correct types)
- Check that mood/anxiety/energy are integers 1-10

**Authentication Issues**
- Verify you're logged in (check for `userId` cookie in DevTools → Application → Cookies)
- Try logging out and back in
- Clear site data if cookies look corrupted

**Invalid Data Types**
```javascript
// ❌ WRONG - strings instead of numbers
{ mood: "7", anxiety: "3" }

// ✅ CORRECT - numbers
{ mood: 7, anxiety: 3 }
```

**Missing Content-Type Header**
- API expects `Content-Type: application/json`
- Browser should set this automatically, but verify in Network tab

#### 3. Check Server Logs

**Local Development:**
- Check your terminal where `npm run dev` is running
- Look for validation errors logged by the API

**Production (Vercel):**
- Go to Vercel Dashboard → Your Project → Functions
- Click on the failed function to see logs
- Enhanced error logging shows validation details in development mode

#### 4. Test with cURL/PowerShell

**PowerShell Example:**
```powershell
$headers = @{ 
  "Content-Type" = "application/json"
  "Cookie" = "userId=YOUR_USER_ID_HERE"
}
$body = @{
  entry_date = "2026-01-05"
  mood = 7
  anxiety = 3
  energy = 5
  notes = "test entry"
  triggers = ""
  helped = ""
  felt_safe = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3000/api/entries' `
  -Method Post -Headers $headers -Body $body
```

**cURL Example:**
```bash
curl -X POST 'http://localhost:3000/api/entries' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: userId=YOUR_USER_ID_HERE' \
  -d '{
    "entry_date":"2026-01-05",
    "mood":7,
    "anxiety":3,
    "energy":5,
    "notes":"test",
    "triggers":"",
    "helped":"",
    "felt_safe":true
  }'
```

#### 5. Verify Database Schema
```bash
# Connect to your database
psql $DATABASE_URL

# Check tables exist
\dt

# Verify columns
\d mood_entries
\d users

# Check if you have entries
SELECT COUNT(*) FROM mood_entries;
SELECT COUNT(*) FROM users;
```

#### 6. Common Field Requirements

| Field | Type | Required | Valid Range |
|-------|------|----------|-------------|
| entry_date | string | Yes | YYYY-MM-DD format |
| mood | integer | Yes | 1-10 |
| anxiety | integer | Yes | 1-10 |
| energy | integer | Yes | 1-10 |
| felt_safe | boolean | Yes | true/false |
| notes | string | No | Max 2000 chars |
| triggers | string | No | Comma-separated |
| helped | string | No | Comma-separated |
| entry_time_label | string | No | Max 50 chars |

---

## 📋 Validation Rules

**Scales** (Mood, Anxiety, Energy): 1-10 integers  
**Date**: ISO format (YYYY-MM-DD)  
**Notes**: Max 2000 characters  
**Tags**: Max 20 items, comma-separated  
**Time Label**: Max 50 characters  

---

## 🗄️ Database Indexes

Query performance optimized with indexes on:
- `entry_date` (history sorting)
- `created_at` (recent entries)
- `felt_safe` (safety filter)
- `mood` (low mood filter)
- `anxiety` (high anxiety filter)

---

## 📊 Entry Structure

```json
{
  "id": "uuid",
  "created_at": "2025-12-30T12:00:00Z",
  "person_name": "Rideeta",
  "entry_date": "2025-12-30",
  "entry_time_label": "morning",
  "mood": 7,
  "anxiety": 4,
  "energy": 6,
  "notes": "Optional reflection",
  "triggers": ["trigger1", "trigger2"],
  "helped": ["thing1", "thing2"],
  "felt_safe": true
}
```

---

## 🔄 Deployment to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to vercel.com and import GitHub repo

# 3. Set environment variable:
# Key: DATABASE_URL
# Value: (your Neon connection string)

# 4. Deploy
# Done! Your app is live
```

---

## 📞 Need Help?

1. **Setup Issues**: See `SETUP.md`
2. **Database Questions**: See `DATABASE.md`
3. **Full Docs**: See `README.md`
4. **Team Guidelines**: See `.github/copilot-instructions.md`
5. **Code Details**: Check inline comments in source files

---

## ✨ Key Features

- ✅ Gentle check-in form
- ✅ Mood/anxiety/energy scales
- ✅ Safety toggle
- ✅ History view with filters
- ✅ Export entries as JSON
- ✅ Import entries with merge
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ Mobile responsive
- ✅ Server-side database only

---

## 🎯 Next Steps

1. **Local Testing**: Run `npm run dev`, fill out a form
2. **Database Check**: View entry in Neon dashboard
3. **History View**: Click History in nav to see entries
4. **Export Data**: Try exporting and re-importing
5. **Deploy**: Push to GitHub and connect Vercel

---

## 💙 Remember

> This tool supports reflection; it's not a substitute for professional help.

Rideeta is designed to be gentle, supportive, and non-clinical. Every feature exists to help with self-awareness and personal reflection.

---

**Version**: 1.0.0  
**Last Updated**: December 30, 2025  
**Status**: ✅ Production Ready
