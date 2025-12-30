# 🌸 Rideeta - Project Overview

## What is Rideeta?

**Rideeta** is a production-ready, trauma-informed mood logging web application designed as a gentle space for personal reflection. Built with Next.js, React, TypeScript, Tailwind CSS, and PostgreSQL, it prioritizes privacy, simplicity, and emotional care.

---

## 🎯 Core Problem It Solves

Many people struggle to reflect on their emotions and well-being due to:
- Anxiety about judgment or "clinical" interfaces
- Complexity of existing mood tracking apps
- Privacy concerns about personal data
- Lack of simple, accessible tools

**Rideeta solves this** by providing:
- A simple, 60-second check-in
- Gentle, non-clinical language
- Complete data privacy and control
- Beautiful, calming interface

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│     Browser (Client)                │
│  ┌─────────────────────────────────┐│
│  │  React Components               ││
│  │  • CheckInForm                  ││
│  │  • HistoryList                  ││
│  │  • ExportImport                 ││
│  └─────────────────────────────────┘│
│                                     │
│  Client-side: Form UI, Navigation   │
└──────────────┬──────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────┐
│    Next.js Server (App Router)      │
│  ┌─────────────────────────────────┐│
│  │  API Routes                     ││
│  │  • POST   /api/entries          ││
│  │  • GET    /api/entries          ││
│  │  • DELETE /api/entries/[id]     ││
│  │  • GET    /api/export           ││
│  │  • POST   /api/import           ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  Validation & Security          ││
│  │  • Zod schemas                  ││
│  │  • Parameterized queries        ││
│  │  • Rate limiting                ││
│  └─────────────────────────────────┘│
└──────────────┬──────────────────────┘
               │ SQL
               ▼
┌─────────────────────────────────────┐
│   PostgreSQL Database (Neon)        │
│  ┌─────────────────────────────────┐│
│  │  mood_entries Table             ││
│  │  • id, created_at               ││
│  │  • entry_date, entry_time_label ││
│  │  • mood, anxiety, energy (1-10) ││
│  │  • notes, triggers, helped      ││
│  │  • felt_safe (boolean)          ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │  Indexes (Performance)          ││
│  │  • entry_date DESC              ││
│  │  • created_at DESC              ││
│  │  • mood, anxiety, felt_safe     ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 📊 User Journey

### Happy Path: Creating an Entry

```
1. User visits Home Page (/)
   ↓
2. Sees Check-in Form with:
   - Today's date (pre-filled)
   - Optional time label
   - Three scales (mood, anxiety, energy)
   - Optional notes, triggers, "helped"
   - Safety toggle
   ↓
3. Fills form (takes ~1-2 minutes)
   ↓
4. Clicks "Save Reflection"
   ↓
5. Form sends POST /api/entries with validation
   ↓
6. Server:
   - Validates with Zod schema
   - Checks rate limit
   - Saves to database
   - Returns entry
   ↓
7. User sees success message:
   "Your reflection has been saved with care. Take a moment for yourself."
   ↓
8. Form resets for next entry
```

### Happy Path: Viewing History

```
1. User clicks "History" in navigation
   ↓
2. Page loads GET /api/entries (all entries)
   ↓
3. Entries displayed in cards, newest first
   Each card shows:
   - Date and time
   - Mood/anxiety/energy visual indicators
   - Safety status
   - Notes
   - Tags for triggers and "helped"
   ↓
4. User can:
   - View filters (low mood, high anxiety, not safe)
   - Delete entries (with confirmation)
   - Go back to check-in
```

### Happy Path: Backup & Restore

```
1. User clicks "Export Entries"
   ↓
2. GET /api/export returns all data as JSON
   ↓
3. Browser downloads "rideeta-entries-2025-12-30.json"
   ↓
4. Later, user clicks "Import Entries"
   ↓
5. Selects JSON file
   ↓
6. POST /api/import receives file
   ↓
7. Server:
   - Parses JSON
   - Validates entries
   - Merges by ID (no duplicates)
   ↓
8. Success: "Imported 5 entries"
```

---

## 🔐 Security Model

### Defense in Depth

```
1. INPUT LAYER
   ├─ Browser validation (form required fields)
   └─ Zod schema validation on server
      ├─ Type checking (string, number, etc.)
      ├─ Range validation (mood 1-10)
      ├─ Length limits (notes max 2000)
      └─ Array limits (max 20 items)

2. RATE LIMIT LAYER
   ├─ IP-based tracking
   ├─ 30 requests/minute per IP
   └─ HTTP 429 response for exceeded

3. DATABASE LAYER
   ├─ Parameterized queries (prevent SQL injection)
   ├─ No string concatenation
   └─ Server-side only (never expose DATABASE_URL)

4. SECRETS LAYER
   ├─ DATABASE_URL in .env.local (never in code)
   ├─ Environment variables server-side only
   ├─ .env.local in .gitignore
   └─ No hardcoded credentials
```

---

## 📁 File Organization Philosophy

### By Domain (Not by Type)

```
app/                    - Routes & pages
├── api/entries/        - Mood entry CRUD
├── api/export/         - Data export
├── api/import/         - Data import
├── history/            - History view
└── page.tsx            - Home view

components/             - Reusable UI
├── CheckInForm.tsx     - Form logic
├── HistoryList.tsx     - List & filters
└── ExportImport.tsx    - Backup controls

lib/                    - Utilities
├── db.ts              - Database access
├── schemas.ts         - Validation rules
└── rate-limit.ts      - Rate limiting
```

**Benefit**: Related code is co-located. To add a feature, find the domain folder.

---

## 🎨 Design System

### Color Meanings

```
Blue (#3B82F6)
├─ Primary actions
├─ Form focus
└─ Interactive elements

Green (#10B981)
├─ Success states
├─ Positive emotions
└─ Safety toggle

Amber (#FBBF24)
├─ Warnings
├─ Important info
└─ Support note

Red (#EF4444)
├─ Low mood entries
├─ High anxiety
└─ Delete actions

Gray (#6B7280)
├─ Secondary text
├─ Disabled states
└─ Separators
```

### Typography Hierarchy

```
H1 (4xl, Bold)   - Page titles
H2 (2xl, Bold)   - Section headers
H3 (lg, Bold)    - Component titles
Body (base)      - Main content
Small (sm)       - Secondary info
XS (xs)          - Captions, helper text
```

---

## 🗄️ Database Design

### Table: mood_entries

```sql
CREATE TABLE mood_entries (
  id uuid PRIMARY KEY,
  
  -- Timing
  created_at timestamptz,      -- Server timestamp
  entry_date date,             -- User's date
  entry_time_label text,       -- "morning", "evening", etc.
  
  -- Scales (1-10)
  mood smallint CHECK (1-10),
  anxiety smallint CHECK (1-10),
  energy smallint CHECK (1-10),
  
  -- Content
  notes text,                  -- Optional reflection
  triggers text[],             -- Array: ["work stress", ...]
  helped text[],               -- Array: ["exercise", ...]
  
  -- Status
  felt_safe boolean DEFAULT false,
  person_name text DEFAULT 'Rideeta'
);
```

### Query Patterns

```
Most Common Queries:
├─ Get all entries (for history)
│  └─ SELECT * ORDER BY entry_date DESC
│
├─ Filter by mood (mood ≤ 3)
│  └─ WHERE mood <= 3
│
├─ Filter by anxiety (anxiety ≥ 8)
│  └─ WHERE anxiety >= 8
│
├─ Filter by safety (felt_safe = false)
│  └─ WHERE felt_safe = false
│
└─ Delete entry by ID
   └─ DELETE WHERE id = $1
```

### Indexes (Performance)

```
Index              Column              Purpose
─────────────────  ─────────────────  ──────────────
idx_entry_date     entry_date DESC     History sorting
idx_created_at     created_at DESC     Recent first
idx_felt_safe      felt_safe           Safety filter
idx_mood           mood                Low mood filter
idx_anxiety        anxiety             High anxiety filter
```

---

## 🔄 Data Flow Diagrams

### Creating an Entry

```
┌──────────────────────────────────────────────────────────┐
│ Browser (Client)                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ User fills CheckInForm:                            │  │
│ │ - date: 2025-12-30                                 │  │
│ │ - mood: 7, anxiety: 4, energy: 6                   │  │
│ │ - notes: "Good day"                                │  │
│ │ - triggers: "work,sleep"                           │  │
│ │ - felt_safe: true                                  │  │
│ └────────────────────────────────────────────────────┘  │
│                    ↓                                     │
│ Click "Save Reflection"                                │
│                    ↓                                     │
│ Form sends POST /api/entries with JSON body             │
└──────────────────────────────────────────────────────────┘
                    │ HTTP POST
                    ▼
┌──────────────────────────────────────────────────────────┐
│ Server (Next.js API Route)                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 1. Get client IP                                   │  │
│ │ 2. Check rate limit (30 req/min per IP)           │  │
│ │ 3. Parse JSON from request                         │  │
│ │ 4. Validate with Zod schema:                       │  │
│ │    - mood: 1-10? ✓                                 │  │
│ │    - anxiety: 1-10? ✓                              │  │
│ │    - energy: 1-10? ✓                               │  │
│ │    - date format? ✓                                │  │
│ │    - notes length? ✓                               │  │
│ │ 5. Parse comma-separated fields:                   │  │
│ │    - "work,sleep" → ["work", "sleep"]              │  │
│ │ 6. Prepare parameterized query                     │  │
│ └────────────────────────────────────────────────────┘  │
│                    ↓                                     │
│ ┌────────────────────────────────────────────────────┐  │
│ │ INSERT INTO mood_entries (                         │  │
│ │   entry_date, mood, anxiety, energy, ..., triggers│  │
│ │ ) VALUES (                                         │  │
│ │   $1, $2, $3, $4, ..., $7                          │  │
│ │ ) RETURNING *                                      │  │
│ │                                                    │  │
│ │ Parameters: [                                      │  │
│ │   '2025-12-30', 7, 4, 6, ..., ['work','sleep']    │  │
│ │ ]                                                  │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                    │ SQL Query
                    ▼
┌──────────────────────────────────────────────────────────┐
│ PostgreSQL Database (Neon)                              │
│ ┌────────────────────────────────────────────────────┐  │
│ │ INSERT new row:                                    │  │
│ │ - id: <auto-generated uuid>                        │  │
│ │ - created_at: <current timestamp>                  │  │
│ │ - entry_date: 2025-12-30                           │  │
│ │ - mood: 7                                          │  │
│ │ - ... (all other fields)                           │  │
│ │                                                    │  │
│ │ ✓ CHECK constraints pass                           │  │
│ │ ✓ Indexes updated                                  │  │
│ │ ✓ Row inserted successfully                        │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                    │ Response
                    ▼
┌──────────────────────────────────────────────────────────┐
│ Server Response (201 Created)                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ {                                                  │  │
│ │   "id": "550e8400-e29b-41d4-...",                  │  │
│ │   "created_at": "2025-12-30T14:30:00Z",            │  │
│ │   "entry_date": "2025-12-30",                      │  │
│ │   "mood": 7,                                       │  │
│ │   ... (all returned fields)                        │  │
│ │ }                                                  │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                    │ JSON
                    ▼
┌──────────────────────────────────────────────────────────┐
│ Browser (Client)                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 1. Receive response (201)                          │  │
│ │ 2. Display success message:                        │  │
│ │    "Your reflection has been saved with care.     │  │
│ │     Take a moment for yourself."                   │  │
│ │ 3. Reset form to initial state                     │  │
│ │ 4. Auto-clear success message after 4 seconds      │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing Strategy

### Manual Testing (MVP)
- [x] Create entry → verify in database
- [x] View history → verify order and display
- [x] Filter entries → verify logic
- [x] Export/import → verify no data loss
- [x] Delete entry → verify removal
- [x] Mobile responsive → verify layout
- [x] Form validation → verify errors

### Automated Testing (Ready)
- Unit tests for utilities (db, validation)
- Integration tests for API routes
- E2E tests for user flows

---

## 📈 Scalability

### Current Capacity
- **Entries**: Unlimited (PostgreSQL scales easily)
- **Requests**: 30/min per IP (upgradeable)
- **Database**: Single Neon instance (scales to 100K+ entries)

### Upgrade Path
1. **Rate Limiting**: Redis-based for distributed
2. **Database**: Read replicas for high traffic
3. **Caching**: Redis for frequently accessed data
4. **CDN**: Vercel/CloudFlare for static assets

---

## 🚀 Deployment Pipeline

### Local Development
```
npm run dev  →  http://localhost:3000
```

### Production Build
```
npm run build  →  .next/ directory
npm start      →  Production server
```

### Vercel Deployment
```
Git push to GitHub
    ↓
Vercel webhook triggered
    ↓
npm install && npm run build
    ↓
Vercel deploys
    ↓
Live at yourdomain.vercel.app
```

---

## 💡 Key Decisions Explained

### Why Next.js?
- Built-in API routes (no separate backend)
- TypeScript support out of the box
- Server-side rendering for SEO
- Excellent developer experience
- Easy deployment to Vercel

### Why PostgreSQL?
- Reliable, mature, open-source
- ACID compliance for data integrity
- Good indexing for performance
- Neon provides serverless option
- Easy backup and restore

### Why Zod?
- Lightweight, runtime validation
- Type inference (TypeScript integration)
- Friendly error messages
- Composable schemas
- No decorators needed

### Why Tailwind CSS?
- Utility-first (fast development)
- Responsive by design
- Great dark mode support
- Small bundle size
- Excellent documentation

---

## 📱 Mobile-First Design

### Breakpoints
```
xs  (default)  - Mobile (320px+)
sm  (640px)    - Small tablet
md  (768px)    - Tablet
lg  (1024px)   - Desktop
xl  (1280px)   - Large desktop
```

### Example: Card Layout
```
Mobile (1 column):
┌─────────────────┐
│                 │
│  Entry Card     │
│                 │
└─────────────────┘
┌─────────────────┐
│                 │
│  Entry Card     │
│                 │
└─────────────────┘

Desktop (2 columns):
┌─────────────────┐  ┌─────────────────┐
│                 │  │                 │
│  Entry Card     │  │  Entry Card     │
│                 │  │                 │
└─────────────────┘  └─────────────────┘
```

---

## 🎯 Success Metrics

### User Experience
- Form completion in <2 minutes
- History loads instantly
- Mobile fully responsive
- No validation errors on valid input
- Clear error messages on invalid input

### Performance
- Page load: <1 second
- API response: <200ms
- Database query: <100ms
- Build time: <10 seconds

### Reliability
- Uptime: 99.9%+
- Data backups: Automatic
- Error rate: <0.1%
- No data loss

---

## 🤝 Team Collaboration

### For Backend Developers
- Understand database schema (DATABASE.md)
- Use parameterized queries (see db.ts)
- Add validation schemas (schemas.ts)
- Implement API routes

### For Frontend Developers
- Use CheckInForm component as template
- Follow Tailwind patterns
- Add 'use client' directive for interactive components
- Test on mobile

### For DevOps
- Deploy to Vercel
- Set DATABASE_URL environment variable
- Monitor Vercel Analytics
- Review Neon backups monthly

---

## 💾 Data Model Relationships

```
User (implied single user for now)
    └── mood_entries (one-to-many)
        ├── entry_date: date
        ├── mood: 1-10
        ├── anxiety: 1-10
        ├── energy: 1-10
        ├── triggers: ["tag1", "tag2", ...]
        ├── helped: ["tag1", "tag2", ...]
        └── felt_safe: boolean
```

---

## 🔮 Future Vision

### Year 1
- User authentication
- Advanced analytics
- Mobile app
- Data encryption

### Year 2
- Therapy integration
- Peer sharing (optional)
- AI insights
- Multi-language

### Year 3
- Community features
- Wearable integration
- Predictive insights
- Public research

---

## 📚 Learning Resources

### For Understanding the Codebase
1. Start with README.md (overview)
2. Read SETUP.md (local setup)
3. Review DATABASE.md (schema)
4. Check IMPLEMENTATION.md (features)
5. Read component source code

### For Contributing
1. Read .github/copilot-instructions.md
2. Review existing components
3. Follow existing patterns
4. Write inline comments
5. Update documentation

---

## 🎉 Conclusion

Rideeta is a **thoughtfully crafted** mood logging application that prioritizes:

- 🌸 **Gentleness** - Every word, every interaction
- 🔒 **Privacy** - Your data is truly yours
- 📱 **Simplicity** - 60 seconds to log a mood
- 🚀 **Quality** - Production-ready code
- 📚 **Documentation** - Everything is explained

**The foundation is solid. The future is bright. 💙**

---

**Created with care for thoughtful reflection.**
