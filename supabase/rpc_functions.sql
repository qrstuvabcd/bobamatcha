-- PostGIS RPC Functions for BobaMatcha
-- Run this AFTER the migration.sql

-- Find available users within a radius of a given user
CREATE OR REPLACE FUNCTION find_nearby_available_users(
  user_phone TEXT,
  radius_meters DOUBLE PRECISION DEFAULT 5000
)
RETURNS SETOF users AS $$
BEGIN
  RETURN QUERY
  SELECT u.*
  FROM users u, users me
  WHERE me.phone_number = user_phone
    AND u.phone_number != user_phone
    AND u.availability_status = TRUE
    AND u.onboarding_step = 'complete'
    AND u.location IS NOT NULL
    AND me.location IS NOT NULL
    AND ST_DWithin(u.location, me.location, radius_meters)
  ORDER BY ST_Distance(u.location, me.location) ASC;
END;
$$ LANGUAGE plpgsql;

-- Find idle (non-available) users within a radius of a given user
CREATE OR REPLACE FUNCTION find_nearby_idle_users(
  user_phone TEXT,
  radius_meters DOUBLE PRECISION DEFAULT 5000
)
RETURNS SETOF users AS $$
BEGIN
  RETURN QUERY
  SELECT u.*
  FROM users u, users me
  WHERE me.phone_number = user_phone
    AND u.phone_number != user_phone
    AND u.availability_status = FALSE
    AND u.onboarding_step = 'complete'
    AND u.location IS NOT NULL
    AND me.location IS NOT NULL
    AND ST_DWithin(u.location, me.location, radius_meters)
  ORDER BY ST_Distance(u.location, me.location) ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
