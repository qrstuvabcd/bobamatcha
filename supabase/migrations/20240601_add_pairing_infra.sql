-- 資料庫遷移：補充必要表結構 -- supabase/migrations/20240601_add_pairing_infra.sql

-- 🔧 1. 擴展 matches 表
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS question_id UUID REFERENCES daily_questions(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 🔐 2. 創建 cron_locks 表（分佈式鎖）
CREATE TABLE IF NOT EXISTS cron_locks (
    lock_key TEXT PRIMARY KEY,
    locked_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_cron_locks_cleanup ON cron_locks(expires_at) 
WHERE expires_at IS NOT NULL;

-- 🎁 3. 創建 solo_challenges 表（落單用戶補償）
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
CREATE INDEX IF NOT EXISTS idx_solo_pending ON solo_challenges(user_id, completed) 
WHERE completed = FALSE;

-- 👤 4. 擴展 users 表（偏好與校區）
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS campus TEXT,
ADD COLUMN IF NOT EXISTS preference TEXT DEFAULT 'any' CHECK (preference IN ('any', 'male', 'female')),
ADD COLUMN IF NOT EXISTS location POINT; -- 可選：用於地理位置配對

-- ⚡ 5. 性能優化索引
CREATE INDEX IF NOT EXISTS idx_matches_active ON matches(match_date, status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_answers_question ON daily_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_users_campus ON users(campus) WHERE campus IS NOT NULL;

-- 🛡️ 6. （可選）行級安全策略例外：後台服務角色
-- 注意：使用 SUPABASE_SERVICE_ROLE_KEY 時 RLS 自動繞過，無需額外配置
