
# Smart Bookmark App

A production-ready bookmark manager built with Next.js 14, Supabase, and Tailwind CSS. managing your bookmarks in real-time.

## 🚀 Features

- **Authentication**: Google OAuth login via Supabase Auth.
- **Protected Routes**: Dashboard accessible only to authenticated users (via Middleware).
- **CRUD Operations**: Add, list, and delete bookmarks.
- **Real-time Updates**: Changes reflect instantly across all open tabs/devices using Supabase Realtime.
- **Security**: Row Level Security (RLS) ensures users only access their own data.
- **Modern UI**: Clean, responsive design with Tailwind CSS.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel Ready

## 📦 Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd smart-bookmark-app
npm install
```

### 2. Supabase Setup
1. Create a new project at [Supabase](https://supabase.com).
2. Go to **Authentication > Providers** and enable **Google**.
   - You will need to configure Google Cloud Credentials (Client ID/Secret).
   - Set the redirect URL in Google Cloud Console to `https://<your-project>.supabase.co/auth/v1/callback`.
3. Go to **SQL Editor** and run the following queries to set up the database:

```sql
-- 1. Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
alter table bookmarks enable row level security;

-- 3. Create RLS Policies
-- Allow users to view their own bookmarks
create policy "Users can view their own bookmarks" on bookmarks
  for select using (auth.uid() = user_id);

-- Allow users to insert their own bookmarks
create policy "Users can insert their own bookmarks" on bookmarks
  for insert with check (auth.uid() = user_id);

-- Allow users to delete their own bookmarks
create policy "Users can delete their own bookmarks" on bookmarks
  for delete using (auth.uid() = user_id);

-- 4. Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Get these values from Supabase Dashboard > Project Settings > API.

### 4. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🚀 Deployment (Vercel)

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the **Environment Variables** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel settings.
4. Deploy!

## 🔒 Security Note
- Row Level Security (RLS) is enabled to strictly isolate user data.
- Middleware protects the `/dashboard` route from unauthenticated access.
