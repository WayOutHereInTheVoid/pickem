-- Create table for games
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  week INTEGER NOT NULL,
  home_team VARCHAR(255) NOT NULL,
  away_team VARCHAR(255) NOT NULL,
  winner VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for picks
CREATE TABLE picks (
  id SERIAL PRIMARY KEY,
  week INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  pick VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for weekly scores
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  week INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table for cumulative scores
CREATE TABLE cumulative_scores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_games_week ON games(week);
CREATE INDEX idx_picks_week ON picks(week);
CREATE INDEX idx_scores_week ON scores(week);
CREATE INDEX idx_cumulative_scores_name ON cumulative_scores(name);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_cumulative_scores_updated_at
BEFORE UPDATE ON cumulative_scores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
