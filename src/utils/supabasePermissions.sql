-- Enable Row Level Security for all tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cumulative_scores ENABLE ROW LEVEL SECURITY;

-- Create a policy for the games table
CREATE POLICY "Enable read access for all users" ON games FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON games FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON games FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy for the picks table
CREATE POLICY "Enable read access for all users" ON picks FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON picks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON picks FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy for the weekly_scores table
CREATE POLICY "Enable read access for all users" ON weekly_scores FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON weekly_scores FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON weekly_scores FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a policy for the cumulative_scores table
CREATE POLICY "Enable read access for all users" ON cumulative_scores FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON cumulative_scores FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON cumulative_scores FOR UPDATE USING (auth.role() = 'authenticated');