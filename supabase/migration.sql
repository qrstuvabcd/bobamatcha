-- BobaMatcha Database Migration
-- Run this against your Supabase project via the SQL Editor

-- 1. Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create enum types
CREATE TYPE onboarding_step AS ENUM (
  'awaiting_name',
  'awaiting_order',
  'awaiting_location',
  'complete'
);

CREATE TYPE run_status AS ENUM (
  'pending',    -- (unused historically, keeping for safety)
  'offered',    -- Daily drop match offered to both users
  'confirmed',  -- Both users accepted
  'completed',  -- Date happened
  'cancelled',  -- One user cancelled after confirming
  'declined'    -- One user declined the initial offer
);

-- 3. Users table
CREATE TABLE users (
  phone_number TEXT PRIMARY KEY,
  name TEXT,
  favorite_order TEXT,
  location GEOGRAPHY(POINT, 4326),
  onboarding_step onboarding_step DEFAULT 'awaiting_name',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Spatial index on user location for fast proximity queries
CREATE INDEX idx_users_location ON users USING GIST (location);

-- 6. Boba Runs table
CREATE TABLE boba_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_phone TEXT NOT NULL REFERENCES users(phone_number),
  user_b_phone TEXT NOT NULL REFERENCES users(phone_number),
  user_a_accepted BOOLEAN, -- NULL = pending, TRUE = accepted, FALSE = declined
  user_b_accepted BOOLEAN, -- NULL = pending, TRUE = accepted, FALSE = declined
  venue_name TEXT,
  venue_address TEXT,
  maps_link TEXT,
  meetup_time TIMESTAMPTZ,
  status run_status DEFAULT 'offered',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Indexes on boba_runs
CREATE INDEX idx_boba_runs_status ON boba_runs (status);
CREATE INDEX idx_boba_runs_user_a ON boba_runs (user_a_phone);
CREATE INDEX idx_boba_runs_user_b ON boba_runs (user_b_phone);
