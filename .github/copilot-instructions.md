<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Rideeta - Mood Logging App

## Project Overview

Rideeta is a trauma-informed mood logging web application built for personal reflection and emotional awareness. The app emphasizes privacy, simplicity, and gentle language.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes (server-only)
- **Database**: PostgreSQL (Neon)
- **Validation**: Zod
- **Database Client**: @neondatabase/serverless

## Architecture Guidelines

### Database & Security

- **Server-Side Only**: All database queries execute on the server. `DATABASE_URL` is never exposed to the browser.
- **Parameterized Queries**: Always use parameterized queries to prevent SQL injection. Example:
  ```typescript
  await query('SELECT * FROM mood_entries WHERE id = $1', [id])
  ```
- **No String Concatenation**: Never concatenate user input into SQL strings.
- **Environment Variables**: Keep `.env.local` out of version control. Use `.env.local.example` as a template.

### API Routes

All API routes follow these patterns:
- Input validation with Zod schemas (in `src/lib/schemas.ts`)
- Rate limiting (simple in-memory for MVP)
- Parameterized queries
- Consistent JSON error responses

### Components

- **Check-in Form** (`CheckInForm.tsx`): Gentle form with scales, notes, and toggles. 'Use client' directive.
- **History List** (`HistoryList.tsx`): Displays entries with filters. 'Use client' directive.
- **Export/Import** (`ExportImport.tsx`): Backup and restore functionality. 'Use client' directive.

## Coding Standards

### Language & Tone

- Use gentle, non-clinical language
- Avoid terms like "diagnosis," "disorder," or "mental illness"
- Prefer: "reflection," "check-in," "well-being," "safe," "cared for"
- All error messages should be friendly and supportive

### TypeScript

- Use strict mode
- Define clear types for all data structures
- Avoid `any` type

### Styling

- Use Tailwind CSS utilities
- Follow a consistent color palette (blues, greens, ambers for warnings)
- Mobile-first responsive design
- Soft spacing and readable typography

### File Organization

```
src/
├── app/               # Next.js pages and API routes
├── components/        # Reusable React components
└── lib/              # Utilities (db, validation, rate limiting)
```

## Development Workflow

1. **Feature Planning**: Sketch UI changes on paper or Figma first
2. **Validation**: Add Zod schema first, then API route
3. **Components**: Build 'use client' components with state management
4. **Testing**: Manually test in browser; check console for errors
5. **Security**: Always validate input, use parameterized queries

## Key Files

- `src/lib/db.ts`: Database connection and query helper
- `src/lib/schemas.ts`: Zod validation schemas for all API inputs
- `src/lib/rate-limit.ts`: Simple rate limiting
- `migrations/001_create_mood_entries.sql`: Database schema
- `src/app/api/entries/route.ts`: Main CRUD operations
- `src/components/CheckInForm.tsx`: Primary UI form

## Common Tasks

### Adding a New API Endpoint

1. Create route file: `src/app/api/[feature]/route.ts`
2. Add Zod schema to `src/lib/schemas.ts`
3. Use `checkRateLimit()` and `getClientIp()` from rate-limit.ts
4. Always use parameterized queries with `query()` from db.ts
5. Return consistent JSON responses

### Adding a New Component

1. Create file in `src/components/[Component].tsx`
2. Add 'use client' at the top if using state/hooks
3. Define TypeScript interfaces for props
4. Use Tailwind for styling
5. Test on mobile viewport

### Updating Database Schema

1. Create new migration file: `migrations/002_feature_name.sql`
2. Test locally: `psql -f migrations/002_feature_name.sql`
3. Update `src/lib/schemas.ts` to match new schema
4. Update related API routes and components

## Deployment

- **Vercel**: Recommended for Next.js
- **Environment Variables**: Set `DATABASE_URL` in Vercel dashboard, never in code
- **Database Backups**: Use Neon's built-in backup features
- **Monitoring**: Check Vercel analytics and logs regularly

## Privacy & Security Checklist

- [ ] Database credentials in `.env.local`, not in code
- [ ] All queries parameterized
- [ ] Input validated with Zod
- [ ] Rate limiting enabled
- [ ] No console.log of sensitive data
- [ ] CORS headers (if needed) explicitly set
- [ ] `.env.local` in `.gitignore`

## Future Features (Roadmap)

- User authentication (OAuth or email)
- Data encryption at rest
- Advanced analytics and trends
- Mobile app (React Native)
- Collaborative features (shared insights with trusted contacts)
- Integration with therapy/wellness apps

## Support & Troubleshooting

- **Database Issues**: Check `.env.local`, verify Neon connection
- **Build Errors**: Clear `.next/` folder, reinstall dependencies
- **API Errors**: Check browser console, Vercel logs, database status
- **Performance**: Use Next.js Analytics, check query performance

---

For questions about specific implementations, refer to the README.md for comprehensive setup and API documentation.
