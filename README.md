# EduManage — School Management System
### Next.js 14 + Supabase Postgres (Prisma) — No Firebase

A complete full-stack school management platform. **Frontend and backend both run in Next.js.** Database is Supabase Postgres via Prisma.

---

## 🚀 Quick Start (5 minutes)

### 1. Extract and install dependencies
```bash
cd school-management
npm install
```

### 2. Configure environment variables
```bash
# Update .env with your Supabase connection strings:
# DATABASE_URL=... (pooler/runtime)
# DIRECT_URL=...   (direct connection for Prisma migrate)
```

### 3. Set up the database
```bash
# Create and apply migrations (creates all tables + relationships)
npx prisma migrate dev --name init

# Seed with sample data and demo users
npx tsx src/db/seed.ts
```

### 4. Run the development server
```bash
npm run dev
```

Open **http://localhost:3000**

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| 👑 CEO/Admin | admin@edumanage.cm | admin123 |
| 👨‍🏫 Teacher | paul.ngum@edumanage.cm | teacher123 |
| 🎓 Student | amara.fonkeng@student.edumanage.cm | student123 |

---

## 📁 Project Structure

```
school-management/
├── prisma/
│   └── schema.prisma        ← Database schema (Supabase Postgres)
├── src/
│   ├── app/
│   │   ├── api/             ← All backend API routes
│   │   │   ├── auth/        ← login, logout, register, me
│   │   │   ├── students/    ← CRUD
│   │   │   ├── teachers/    ← CRUD
│   │   │   ├── enrollments/ ← CRUD + approve/reject
│   │   │   ├── courses/     ← CRUD
│   │   │   ├── results/     ← Academic results
│   │   │   ├── fees/        ← Fee records
│   │   │   ├── announcements/
│   │   │   ├── messages/
│   │   │   ├── programs/
│   │   │   └── ai/          ← AI helper (explain, summarize, questions)
│   │   ├── dashboard/
│   │   │   ├── ceo/         ← 13 CEO pages
│   │   │   ├── student/     ← 12 Student pages
│   │   │   └── teacher/     ← 7 Teacher pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── enroll/
│   │   └── page.tsx         ← Public home page
│   ├── components/
│   │   ├── ui/              ← shadcn/ui components
│   │   ├── layout/Navbar.tsx
│   │   └── dashboard/Sidebar.tsx
│   ├── db/
│   │   └── seed.ts          ← Database seeder
│   ├── hooks/
│   │   ├── use-auth.tsx     ← Auth context (session-based)
│   │   └── use-toast.ts
│   └── lib/
│       ├── prisma.ts        ← Prisma client singleton
│       ├── session.ts       ← iron-session config
│       └── utils.ts
├── .env                     ← Environment variables
├── package.json
└── README.md
```

---

## 🗄️ Database

Supabase Postgres via **Prisma ORM**.

**To view/edit data in a GUI:**
```bash
npx prisma studio
```

**To create all tables and relationships from schema (Supabase/Postgres):**
```bash
npx prisma migrate dev --name init
```

**Production migration command:**
```bash
npx prisma migrate deploy
```

**Alternative schema sync (without migration files):**
```bash
npx prisma db push
```

**To reset and reseed (development only):**
```bash
npx prisma migrate reset
npx tsx src/db/seed.ts
```

**To create a new user manually from VS Code terminal:**
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
bcrypt.hash('yourpassword', 10).then(hash =>
  prisma.user.create({ data: { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: hash, role: 'student' } })
).then(u => { console.log('Created:', u.email); prisma.\$disconnect(); });
"
```

---

## 🔐 Authentication

Session-based authentication using **iron-session** (no Firebase, no JWT files).

- Sessions are stored in an encrypted HTTP-only cookie
- Role-based routing: CEO → `/dashboard/ceo`, Teacher → `/dashboard/teacher`, Student → `/dashboard/student`
- The dashboard layout auto-redirects to `/login` if not authenticated

---

## 🤖 AI Helper

The student AI Helper (`/dashboard/student/ai-helper`) uses **simple rule-based responses** by default — no API key needed.

To connect a real AI (optional), replace the logic in:
- `src/app/api/ai/explain/route.ts`
- `src/app/api/ai/summarize/route.ts`
- `src/app/api/ai/questions/route.ts`

with a call to any LLM API (OpenAI, Anthropic, Google Gemini, etc.).

---

## 🛠️ Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npx prisma studio    # Open database GUI
npx prisma migrate dev --name init # Create tables + relationships
npx prisma migrate deploy # Run migrations (production)
npx prisma db push   # Sync schema to database (no migration files)
npx tsx src/db/seed.ts  # Reseed database
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase Postgres via Prisma ORM |
| Auth | iron-session (cookie sessions) |
| Password | bcryptjs |
| Charts | Recharts |
| Icons | Lucide React |
