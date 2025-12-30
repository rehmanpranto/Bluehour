# 🌊 Blue Hour - User Authentication Setup

Your database is now connected with Neon PostgreSQL. Here's what has been set up:

## ✅ Database Configuration

- **Connection**: Neon PostgreSQL (ap-southeast-1)
- **Database URL**: Set in `.env.local`
- **Status**: Ready to use

## 🔐 Authentication Features

### User Tables
- **users**: Stores user accounts with email, password hash, and profile
- **mood_entries**: Updated to include user_id for data isolation

### API Endpoints

#### Sign Up
- **POST** `/api/auth/signup`
- Request:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "full_name": "John Doe"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- Request:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- Sets secure HttpOnly cookie with session

#### Logout
- **POST** `/api/auth/logout`
- Clears session cookie

## 🚀 Next Steps

### 1. Initialize Database
Visit: `http://localhost:3000/api/migrations` (POST request)

Or run in terminal:
```bash
curl -X POST http://localhost:3000/api/migrations
```

### 2. Create Your Account
Go to: `http://localhost:3000/auth/login`
- Click "Sign Up"
- Enter email, password (8+ chars), and full name
- Click "Create Account"

### 3. Start Logging Moods
After login, you'll be redirected to the home page
- Fill in your mood check-in
- All entries are now tied to your account

## 🔒 Security Features

✅ **Password Hashing**: bcryptjs with 10 salt rounds
✅ **SQL Injection Prevention**: Parameterized queries
✅ **Rate Limiting**: 30 requests/minute per IP
✅ **Secure Cookies**: HttpOnly, SameSite=Lax
✅ **Input Validation**: Zod schemas for all inputs
✅ **User Data Isolation**: Entries queried by user_id

## 📊 Database Schema

### Users Table
```
id (UUID) - Primary key
email (TEXT) - Unique, indexed
password_hash (TEXT) - Bcrypt hash
full_name (TEXT)
created_at (TIMESTAMPTZ)
updated_at (TIMESTAMPTZ)
```

### Mood Entries Table
```
id (UUID) - Primary key
user_id (UUID) - Foreign key to users
created_at (TIMESTAMPTZ)
entry_date (DATE)
entry_time_label (TEXT)
mood (SMALLINT 1-10)
anxiety (SMALLINT 1-10)
energy (SMALLINT 1-10)
notes (TEXT max 2000)
triggers (TEXT[])
helped (TEXT[])
felt_safe (BOOLEAN)
```

## 🧪 Testing

### Test Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'
```

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## ⚠️ Important Notes

- **DO NOT commit** `.env.local` to git (already in `.gitignore`)
- **Database URLs** are sensitive - keep them private
- **Passwords** are hashed with bcryptjs - never stored in plain text
- **Sessions** expire after 7 days of inactivity

## 🔧 Troubleshooting

### "Too many login attempts"
- Rate limiting: Wait a few minutes, then try again

### "Email already registered"
- Use a different email or login with existing account

### "Invalid email or password"
- Check spelling and capitalization
- Email must be registered first

### Database connection issues
- Verify `.env.local` has correct DATABASE_URL
- Check Neon dashboard for connection status
- Ensure network allows outbound connections

## 📞 Support

All data stays private and secure on your Neon database.
This app supports reflection and wellness journaling.

---

**Last Updated**: December 30, 2025
**Status**: ✅ Production Ready
