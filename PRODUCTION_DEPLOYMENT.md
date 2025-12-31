# Blue Hour - Production Deployment Checklist

## ✅ Database Migration Status
- [x] Migration 003 completed successfully on Neon database
- [x] `users` table created
- [x] `user_id` column added to `mood_entries`
- [x] Test user created (test@bluehour.app)

## 🔧 Vercel Environment Variables

Make sure these are set in your Vercel project settings:

1. Go to: https://vercel.com/rehmanpranto/bluehour/settings/environment-variables

2. Add the following environment variable:
   - **Name:** `DATABASE_URL`
   - **Value:** `postgresql://neondb_owner:npg_doLQ6tv8WpCk@ep-patient-sun-a1nhdsgp-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - **Environments:** Production, Preview, Development

3. After adding the environment variable, **redeploy** your app:
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger a deployment

## 🧪 Testing Your Production App

Once redeployed, test with these steps:

1. **Visit:** https://bluehour-delta.vercel.app/auth/login

2. **Login with test credentials:**
   - Email: `test@bluehour.app`
   - Password: `test123`

3. **After login, try to save a check-in**

## 🐛 Troubleshooting

If you still get errors:

### Error: "Please login to save a check-in" (401)
- You're not logged in. Go to /auth/login first.

### Error: "Something went wrong" (400)
- Check that DATABASE_URL is set in Vercel
- Redeploy after setting the environment variable

### Error: "column user_id does not exist"
- The migration hasn't been run on production
- Run the migration script against production database

## 📋 Quick Migration Command

If you need to run the migration again (safe to run multiple times):

```powershell
cd h:\blue_hour
$env:DATABASE_URL = (Get-Content .env.local | Select-String 'DATABASE_URL' | ForEach-Object { $_ -replace 'DATABASE_URL=', '' })
node -e "const { Client } = require('pg'); const fs = require('fs'); const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); client.connect().then(() => { const sql = fs.readFileSync('migrations/003_add_user_id_to_mood_entries.sql', 'utf8'); return client.query(sql); }).then(() => { console.log('Migration completed!'); return client.end(); }).catch(err => { console.error('Error:', err); process.exit(1); });"
```

## 🎉 Success Indicators

Your app is working when:
- ✅ You can login at /auth/login
- ✅ You're redirected to /checkin after login
- ✅ You can save a reflection without errors
- ✅ The reflection appears in /history

## 📝 Notes

- Local database and production database are the same (both using Neon)
- Migration has been applied successfully
- Test user exists in the database
- Dark/light mode switches automatically at 6 PM
