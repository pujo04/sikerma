# SIKERMA Monorepo

Struktur project:

```
dashboard-with-charts/
├── frontend/          # Next.js frontend (development di sini)
│   └── lib/api-config.ts  # Konfigurasi URL backend
├── backend/          # Fastify + Prisma API server
│   ├── src/routes/   # API routes (auth, repository, pencairan, dll)
│   ├── prisma/       # Database schema
│   └── .env          # Konfigurasi database
└── package.json     # Root workspace monorepo
```

## Cara Jalankan Frontend + Backend

**1. Setup Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env - sesuaikan DATABASE_URL PostgreSQL Anda
npm install
npx prisma generate
npm run dev        # Backend jalan di http://localhost:3001
```

**2. Setup Frontend (di terminal baru):**
```bash
cd frontend
npm install
npm run dev        # Frontend jalan di http://localhost:3000
```

## Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```
DATABASE_URL="postgresql://postgres:sikerma@localhost:5432/sikerma"
PORT=3001
```

## Catatan

- Frontend menggunakan `lib/api-config.ts` sebagai single source untuk semua URL API
- Backend Fastify berjalan di port 3001
- Frontend Next.js proxy `/api/*` ke backend via `next.config.mjs`
- Untuk development, jalankan backend dan frontend di terminal terpisah