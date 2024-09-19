import { supabase } from '../lib/supabase';

export const exportWeeklyData = async (week) => {
  // Fetch games for the selected week
  const { data: games } = await supabase
    .from('games')
    .select('*')
    .eq('week', week);

  // Fetch scores for the selected week
  const { data: weeklyScores } = await supabase
    .from('scores')
    .select('*')
    .eq('week', week);

  // Fetch cumulative scores
  const { data: cumulativeScores } = await supabase
    .from('cumulative_scores')
    .select('*');

  // Generate CSV content
  let csvContent = `Week ${week} Results\n\n`;

  // Add matchups with winners
  csvContent += "Matchups:\n";
  games.forEach(game => {
    const winner = game.winner === 'home' ? game.home_team : game.away_team;
    csvContent += `${game.home_team} vs ${game.away_team}: ${winner} won\n`;
  });

  csvContent += "\nParticipant Scores:\n";
  csvContent += "Participant,Weekly Score,Cumulative Score\n";

  // Combine weekly and cumulative scores
  const combinedScores = weeklyScores.map(weeklyScore => {
    const cumulativeScore = cumulativeScores.find(cs => cs.name === weeklyScore.name);
    return {
      name: weeklyScore.name,
      weeklyScore: weeklyScore.score,
      cumulativeScore: cumulativeScore ? cumulativeScore.score : 0
    };
  });

  // Sort combined scores by cumulative score (descending)
  combinedScores.sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  // Add participant scores to CSV
  combinedScores.forEach(score => {
    csvContent += `${score.name},${score.weeklyScore},${score.cumulativeScore}\n`;
  });

  return csvContent;
};