# 🔧 Vercel Troubleshooting Guide - Mood Logging Issue

## Current Issue
You're seeing: **"Something went wrong saving your reflection. Please try again."** on Vercel production.

## Most Likely Causes (in order)

### 1. ❌ NOT LOGGED IN (Most Common!)
**Solution:** 
- Go to: https://bluehour-delta.vercel.app/auth/login
- Login with:
  - Email: `test@bluehour.app`
  - Password: `test123`
- Then try saving your mood again

### 2. ❌ DATABASE_URL Not Set in Vercel
**Check:**
1. Go to: https://vercel.com/rehmanpranto/bluehour/settings/environment-variables
2. Verify `DATABASE_URL` is set
3. Value should be: `postgresql://neondb_owner:npg_doLQ6tv8WpCk@ep-patient-sun-a1nhdsgp-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

**If missing:**
- Click "Add New"
- Name: `DATABASE_URL`
- Value: (paste the connection string above)
- Select: Production, Preview, Development
- Save and redeploy

### 3. ❌ Old Deployment Cached
**Solution:**
- Wait 2-3 minutes for the new deployment (just pushed)
- Check deployment status: https://vercel.com/rehmanpranto/bluehour
- Look for commit: "fix: Add detailed error logging..."

### 4. ❌ Browser Cache Issues
**Solution:**
- Clear browser cache (Ctrl + Shift + Delete)
- Or use Incognito/Private mode
- Try again

## 🧪 Debugging Steps

### Step 1: Check If Logged In
Visit: https://bluehour-delta.vercel.app/api/health

Should show:
```json
{
  "nodeEnv": "production",
  "hasDatabaseUrl": true,
  "databaseUrlPrefix": "postgresql://neondb...",
  "timestamp": "..."
}
```

If `hasDatabaseUrl` is `false`, DATABASE_URL is missing!

### Step 2: Check Your Session
After logging in, try to save a mood entry again.

### Step 3: View Vercel Logs
1. Go to: https://vercel.com/rehmanpranto/bluehour
2. Click on latest deployment
3. Go to "Functions" tab
4. Look for errors in `/api/entries` logs

## 🎯 Quick Fix Checklist

- [ ] Waited for new deployment to finish (2-3 min)
- [ ] Verified DATABASE_URL is set in Vercel
- [ ] Logged in at /auth/login with test credentials
- [ ] Cleared browser cache
- [ ] Tried in incognito mode

## 📝 After New Deployment

Once the latest deployment is live (shows "fix: Add detailed error logging..." commit):

1. **Login first:** https://bluehour-delta.vercel.app/auth/login
2. **Go to check-in:** https://bluehour-delta.vercel.app/checkin
3. **Fill out the form**
4. **Click "Save reflection"**

If it still fails, check Vercel logs for the detailed error message.

## 🔍 Expected Behavior

**Success:**
- Form clears after saving
- Green success message appears
- Entry visible in /history

**Error (400):**
- Check if logged in
- Check console logs in Vercel
- Validate data format

## 💡 Common Solutions

**"Please login to save a check-in" (401)**
→ You're not logged in. Go to /auth/login

**"Something went wrong" (400)**  
→ Validation error. Check:
  - Date format (should be YYYY-MM-DD)
  - Mood, Anxiety, Energy (should be 1-10)
  - Notes (max 2000 characters)

**"Too many requests" (429)**
→ Wait 30 seconds and try again

## 🎉 Once Fixed

Your mood logging should work perfectly on Vercel! All features available:
- Daily mood tracking
- View history
- Automatic dark mode (6 PM - 6 AM)
- Mobile responsive
- Secure and private

---

**Status Check:** Visit https://bluehour-delta.vercel.app/api/health to verify configuration
