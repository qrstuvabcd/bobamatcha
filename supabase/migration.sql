-- BobaMatcha Database Migration (The Industrial-Grade Matching System)
-- Run this against your Supabase project via the SQL Editor

-- 1. Setup Base Tables (Existing)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  instagram TEXT NOT NULL,
  campus TEXT, -- New: For campus-based matching
  preference TEXT CHECK (preference IN ('male', 'female', 'any')), -- New: For preference matching
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  ai_answer TEXT,
  question_date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  question_id UUID NOT NULL REFERENCES daily_questions(id),
  answer_text TEXT NOT NULL,
  answer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- 2. Setup Refined Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES users(id),
  user_b_id UUID NOT NULL REFERENCES users(id),
  question_id UUID REFERENCES daily_questions(id),
  status TEXT DEFAULT 'active', -- New: match status
  match_reasoning TEXT,
  match_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Setup Distributed Locking for Cron Jobs
CREATE TABLE IF NOT EXISTS cron_locks (
  lock_key TEXT PRIMARY KEY,
  locked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Setup Solo Challenges for Leftover Users
CREATE TABLE IF NOT EXISTS solo_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  question_id UUID NOT NULL REFERENCES daily_questions(id),
  challenge_type TEXT DEFAULT 'solo_boba_run',
  reward_points INTEGER DEFAULT 50,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches (match_date);
CREATE INDEX IF NOT EXISTS idx_matches_user_a ON matches (user_a_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_b ON matches (user_b_id);
CREATE INDEX IF NOT EXISTS idx_users_campus ON users (campus);
