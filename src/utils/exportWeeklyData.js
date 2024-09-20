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

  // Fetch cumulative scores up to and including the selected week
  const { data: cumulativeScores } = await supabase
    .from('scores')
    .select('name, score')
    .lte('week', week);

  // Calculate cumulative scores
  const cumulativeScoresMap = cumulativeScores.reduce((acc, score) => {
    acc[score.name] = (acc[score.name] || 0) + score.score;
    return acc;
  }, {});

  // Combine weekly and cumulative scores
  const combinedScores = weeklyScores.map(weeklyScore => ({
    name: weeklyScore.name,
    weeklyScore: weeklyScore.score,
    cumulativeScore: cumulativeScoresMap[weeklyScore.name] || 0
  }));

  // Sort combined scores by cumulative score (descending)
  combinedScores.sort((a, b) => b.cumulativeScore - a.cumulativeScore);

  // Generate HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Week ${week} Results - Football Pick 'Em League</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2 { color: #2c3e50; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .matchup { margin-bottom: 10px; }
        .winner { font-weight: bold; color: #27ae60; }
      </style>
    </head>
    <body>
      <h1>Football Pick 'Em League - Week ${week} Results</h1>
      
      <h2>Matchups:</h2>
      ${games.map(game => {
        const winner = game.winner === 'home' ? game.home_team : game.away_team;
        return `
          <div class="matchup">
            ${game.home_team} vs ${game.away_team}: 
            <span class="winner">${winner}</span>
          </div>
        `;
      }).join('')}
      
      <h2>Participant Scores:</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Participant</th>
            <th>Weekly Score</th>
            <th>Cumulative Score (Through Week ${week})</th>
          </tr>
        </thead>
        <tbody>
          ${combinedScores.map((score, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${score.name}</td>
              <td>${score.weeklyScore}</td>
              <td>${score.cumulativeScore}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  return htmlContent;
};
