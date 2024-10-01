-- Existing tables...

-- Create table for NFL matches cache
CREATE TABLE nfl_matches_cache (
  id SERIAL PRIMARY KEY,
  week INTEGER NOT NULL,
  matches JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(week)
);

-- Create index for faster queries
CREATE INDEX idx_nfl_matches_cache_week ON nfl_matches_cache(week);