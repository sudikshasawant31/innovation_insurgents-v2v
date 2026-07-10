# HerGuardian AI - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Set Environment Variables (1 min)

Add these to your `.env.local` file:

```bash
# Database
DATABASE_URL=postgresql://...@neon.tech/...

# Authentication
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>

# AI
OPENAI_API_KEY=<your-api-key>

# Optional
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
```

Generate `BETTER_AUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Step 2: Install Dependencies (1 min)

```bash
pnpm install
```

### Step 3: Start Dev Server (1 min)

```bash
pnpm dev
```

Visit: `http://localhost:3000`

### Step 4: Create Account (1 min)

1. Go to signup page
2. Enter email and password
3. You're authenticated!

### Step 5: Test Features (1 min)

- Click "Start Assessment" to create health assessment
- Go to "Mental Wellness" to log mood
- Check "Dashboard" for real-time data
- Visit "Emergency" to add contacts

---

## 🔑 Key Features

### Real-Time Dashboard
- Health score tracking
- Mood trends (auto-updates every 2 min)
- Quick action buttons
- Upcoming appointments

### Health Assessment
- 7-condition detection
- Risk scoring (0-100)
- Auto-generated recommendations
- Stores historical data

### Mental Wellness
- Daily mood tracking (1-10)
- PHQ-9 depression screening
- GAD-7 anxiety screening
- 30-day analytics

### Emergency Contacts
- Add emergency contacts
- Set primary contact
- Trigger emergency alerts
- Real-time notifications

### AI Chat Assistant
- Real-time streaming responses
- Medical knowledge base
- Empathetic conversation
- Chat history saved

---

## 📊 API Examples

### Create Health Assessment
```bash
curl -X POST http://localhost:3000/api/assessment \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "weight": 65,
    "height": 165,
    "menstrualCycleLength": 28,
    "cycleRegularity": "regular",
    "symptoms": ["fatigue"],
    "medicalHistory": [],
    "medications": []
  }'
```

### Log Mood Entry
```bash
curl -X POST http://localhost:3000/api/mood \
  -H "Content-Type: application/json" \
  -d '{
    "moodScore": 8,
    "depressionScore": 5,
    "anxietyScore": 3,
    "sleepQuality": 7
  }'
```

### Get Mood History
```bash
curl http://localhost:3000/api/mood?days=30
```

### Check System Health
```bash
curl http://localhost:3000/api/health
```

---

## 🗂️ Project Structure

```
app/
├── page.tsx              # Landing page
├── dashboard/            # Real-time dashboard
├── assessment/           # Health assessment
├── mental-wellness/      # Mood tracking
├── emergency/            # Emergency contacts
├── api/                  # REST API endpoints
│   ├── auth/            # Authentication
│   ├── assessment/       # Assessment API
│   ├── mood/            # Mood tracking API
│   ├── recommendations/ # Recommendations API
│   ├── emergency/       # Emergency API
│   ├── chat/            # AI chat API
│   └── health/          # Health check
└── actions/             # Server actions

lib/
├── auth.ts              # Better Auth config
├── auth-client.ts       # Client-side auth
├── db/
│   ├── index.ts         # Drizzle client
│   └── schema.ts        # Database schema
├── services/            # Business logic
│   ├── assessment.ts    # Assessment logic
│   ├── wellness.ts      # Wellness logic
│   └── emergency.ts     # Emergency logic
├── hooks/
│   └── useHealthData.ts # React Query hooks
└── server-utils.ts      # Server utilities

components/
├── navbar.tsx           # Navigation bar
├── assessment-form.tsx  # Assessment form
└── ...                  # Other components
```

---

## 🔒 Authentication Flow

1. **Sign Up**: Email + password → Better Auth
2. **Sign In**: Email + password → Session cookie
3. **Authenticated Requests**: Cookie sent automatically
4. **Protected Routes**: Redirect to login if not authenticated
5. **Sign Out**: Clears session

---

## 📈 Real-Time Updates

### Data Refetch Intervals
- **Assessments**: 5 minutes
- **Mood History**: 2 minutes
- **Recommendations**: 5 minutes
- **Emergency Contacts**: 10 minutes

### Chat Streaming
- Real-time message streaming via SSE
- Instant response display
- Full message history

---

## 🛠️ Debugging

### Check Database Connection
```bash
curl http://localhost:3000/api/health
```

### View Server Logs
```
Ctrl+C to see logs
pnpm dev to see full output
```

### Check Authentication
1. Open browser DevTools
2. Go to Application → Cookies
3. Look for `better-auth-*` session cookies

### Clear Session
1. Delete cookies in DevTools
2. Or logout via UI
3. Login again

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

### Set Production Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add `DATABASE_URL`
3. Add `BETTER_AUTH_SECRET`
4. Add `OPENAI_API_KEY`
5. Redeploy

### Database Backup

Neon automatically:
- Backs up daily
- Keeps 7-day history
- Allows point-in-time recovery

---

## 📚 Documentation

- **BACKEND_SETUP.md** - Complete backend guide
- **API_REFERENCE.md** - Full API docs
- **PRODUCTION_READY.md** - Production checklist

---

## ⚡ Performance Tips

1. **Use React Query** - Automatic caching
2. **Enable Compression** - Reduce payload
3. **Monitor Health** - `/api/health` endpoint
4. **Check Logs** - Find bottlenecks
5. **Scale Database** - Neon read replicas

---

## 🆘 Troubleshooting

### "Unauthorized" Error
→ Check BETTER_AUTH_SECRET is set
→ Clear cookies and login again

### "Database Connection" Error
→ Verify DATABASE_URL format
→ Check Neon project status
→ Test with /api/health

### "CORS" Error
→ Check baseURL in lib/auth.ts
→ Verify NEXT_PUBLIC_AUTH_URL

### Slow Dashboard
→ Check React Query cache settings
→ Monitor /api/mood refetch interval
→ Test database query performance

---

## 📞 Getting Help

1. Check error messages carefully
2. Review documentation files
3. Check API responses
4. Verify environment variables
5. Contact support at support@vercel.com

---

## ✅ Next Steps

- [ ] Complete assessment
- [ ] Log mood entry
- [ ] Add emergency contact
- [ ] Check dashboard
- [ ] Read recommendations
- [ ] Try AI chat
- [ ] Deploy to production

---

**You're ready to use HerGuardian AI! 🎉**
