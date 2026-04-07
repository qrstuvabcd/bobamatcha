-- BobaMatcha Database Migration (The Complete Industrial Matching System)
-- Run this against your Supabase project in the SQL Editor

-- 1. Base Tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  instagram TEXT NOT NULL,
  campus TEXT,
  preference TEXT DEFAULT 'any' CHECK (preference IN ('any', 'male', 'female')),
  location POINT,
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

-- 2. Enhanced Matches Table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES users(id),
  user_b_id UUID NOT NULL REFERENCES users(id),
  question_id UUID REFERENCES daily_questions(id),
  match_reasoning TEXT,
  match_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pairing Infrastructure
CREATE TABLE IF NOT EXISTS cron_locks (
    lock_key TEXT PRIMARY KEY,
    locked_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);
-- Safety ALTER for existing tables
ALTER TABLE cron_locks ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE cron_locks ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE TABLE IF NOT EXISTS solo_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES daily_questions(id),
    challenge_type TEXT NOT NULL DEFAULT 'solo_boba_run',
    reward_points INTEGER DEFAULT 50,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- 4. Performance Optimization
CREATE INDEX IF NOT EXISTS idx_matches_active ON matches(match_date, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_users_campus ON users(campus) WHERE campus IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cron_locks_cleanup ON cron_locks(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_solo_pending ON solo_challenges(user_id, completed) WHERE completed = FALSE;
CREATE INDEX IF NOT EXISTS idx_answers_question ON daily_answers(question_id);
