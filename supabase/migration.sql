-- BobaMatcha Database Migration (The Private Club System)
-- Run this against your Supabase project via the SQL Editor

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TYPE user_status AS ENUM ('pending', 'approved', 'waitlisted');

-- 1. Users table (Vibe Check updated)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  favorite_order TEXT,
  instagram TEXT,
  city TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  status user_status DEFAULT 'pending',
  bouncer_audit_result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.5 Daily Questions & Answers Tables
CREATE TABLE daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  question_date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE daily_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  question_id UUID NOT NULL REFERENCES daily_questions(id),
  answer_text TEXT NOT NULL,
  answer_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- 2. Spatial index
CREATE INDEX idx_users_location ON users USING GIST (location);
CREATE INDEX idx_users_city_status ON users (city, status);

-- 3. Matches table (Hang the DJ results + Secret Code + Edge Function Support)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES users(id),
  user_b_id UUID NOT NULL REFERENCES users(id),
  match_reasoning TEXT,
  hang_the_dj_score INTEGER,
  secret_code TEXT NOT NULL,
  venue_name TEXT,
  venue_address TEXT,
  maps_link TEXT,
  match_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes
CREATE INDEX idx_matches_date ON matches (match_date);
CREATE INDEX idx_matches_user_a ON matches (user_a_id);
CREATE INDEX idx_matches_user_b ON matches (user_b_id);
