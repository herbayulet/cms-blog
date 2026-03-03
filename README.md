# ✦ Tulis — Blog & Simple CMS

Aplikasi blog dan CMS sederhana untuk **Frontend Developer Test**, dibangun dengan React + TypeScript, Clerk Auth (Google OAuth), Zustand, Tailwind CSS, dan integrasi API real via Sipabase.

---

## 🚀 Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Routing | React Router |
| State Management | Zustand (with devtools) |
| Styling | Tailwind CSS |
| Auth | Clerk (Google OAuth + Email/Password) |
| Database | Supabase (PostgreSQL) |
| API Client | Supabase JS SDK |
| Validasi Form | Zod + React Hook Form |
| Toast | React Hot Toast |
| Icons | Lucide React |

---

## ✨ Fitur

### 🌍 Public (User-facing)

- List posts dengan pagination (10 per halaman)
- Post detail page (`/post/:slug`)
- Filter berdasarkan kategori (`/category/:slug`)
- Multi-author support
- Loading state, error state, dan empty state
- mobile-friendly design

### 🔐 Authentication (Clerk)

- Sign in dengan Google OAuth
- Sign up dengan email & password
- Redirect ke dashboard setelah login
- Protected admin routes
- Setiap user memiliki post miliknya sendiri

### 🛠 Admin CMS (`/admin`)

- Dashboard
- Posts: List (milik sendiri), Create, Edit, Delete
- Categories: List, Create, Edit, Delete
- Pagination di admin
- Auto-generate slug
- Validasi form dengan Zod
- Delete kategori aman (post tidak ikut terhapus)
- Sidebar responsive

### 👤 Multi-Author Behavior

| Halaman | Behavior |
|---|---|
| Homepage | Menampilkan semua post dari semua user |
| Admin | Menampilkan hanya post milik user login |

Ownership disimpan menggunakan:
```
posts.user_id = Clerk user.id
```

---

## 🗄 Database Structure (Supabase)

### Table: `posts`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | int | Primary key |
| `title` | text | |
| `slug` | text | Unique |
| `body` | text | |
| `excerpt` | text | |
| `image` | text | |
| `thumbnail` | text | |
| `category_id` | int | Foreign key → `categories.id` |
| `user_id` | text | NOT NULL — Clerk `user.id` |
| `created_at` | timestamp | |

### Table: `categories`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | int | Primary key |
| `name` | text | |
| `slug` | text | Unique |
| `created_at` | timestamp | |

### Foreign Key Behavior
```sql
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE SET NULL
```

Jika kategori dihapus:
- Post tetap ada
- `category_id` menjadi `NULL`
- UI menampilkan **"Tanpa Kategori"**

---

## 📦 Cara Install & Run

### 1. Clone Project
```bash
git clone 
cd cms-blog
```

### 2. Install Dependencies
```bash
npm install
```

### 🔐 Setup Clerk

1. Buat akun di [https://clerk.com](https://clerk.com)
2. Buat Application baru
3. Aktifkan:
   - Google OAuth
   - Email + Password
4. Copy **Publishable Key**

### 🗄 Setup Supabase

1. Buat project di [https://supabase.com](https://supabase.com)
2. Buat tabel: `posts` dan `categories`
3. Setup foreign key dengan `ON DELETE SET NULL`
4. Copy **Project URL** dan **Anon Public Key**

### ⚙️ Environment Variable

Buat file `.env` di root project:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ Tanpa environment variable ini, aplikasi tidak bisa berjalan.

### ▶️ Jalankan Development Server
```bash
npm run dev
```

Buka: [http://localhost:3000](http://localhost:3000)

---

## 🏗 Arsitektur
```
Component
   ↓
Zustand Store
   ↓
Supabase Client
   ↓
PostgreSQL (Supabase)
```

**Auth Flow:**
```
Clerk → user.id → disimpan sebagai posts.user_id
```

---

## 📂 Struktur Folder
```
src/
├── api/
│   ├── posts.ts
│   └── categories.ts
├── components/
│   ├── layout/
│   └── ui/
├── pages/
│   ├── public/
│   ├── admin/
│   └── auth/
├── routes/
├── store/
│   ├── postsStore.ts
│   └── categoriesStore.ts
├── types/
└── utils/
```

---

## 🧠 State Management (Zustand)

**Store utama:**

- `usePostsStore`
  - `fetchPosts` (public + admin mode)
  - `fetchPostBySlug`
  - `createPost` (dengan userId)
  - `updatePost`
  - `deletePost`

- `useCategoriesStore`
  - CRUD categories

**Pattern action:**
```ts
set({ loading: true, error: null })
try {
  const result = await apiCall()
  set({ data: result, loading: false })
} catch (e) {
  set({ error: e.message, loading: false })
}
```

---

## 🛠 Scripts
```bash
npm run dev       # Jalankan development server
npm run build     # Build untuk production
npm run preview   # Preview build hasil
```

---

## 📌 Catatan Teknis

- Slug auto-generate dari title
- Admin hanya melihat post miliknya
- Homepage menampilkan semua post
- Delete kategori tidak menghapus post

---
