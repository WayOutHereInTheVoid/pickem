import { supabase } from '../lib/supabase';

/**
 * Exports the weekly data to an HTML file.
 * @param {number} week - The week to export the data for.
 * @returns {Promise<string>} A promise that resolves with the HTML content.
 */
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

  // Generate HTML content with Week 1 styling
  let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>2025 TRL Pick'em</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --dark-green: #5DCB3C;
      --light-green: #B5F64D;
      --charcoal: #2C3033;
      --dark-charcoal: #0A090B;
      --gray: #BFBFBD;
      --font-family: 'Roboto', sans-serif;
    }

    body {
      font-family: var(--font-family);
      line-height: 1.2; 
      background-color: var(--dark-charcoal);
      color: var(--gray);
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .container {
      width: 95%;
      max-width: 700px;
      margin: 15px auto;
      background-color: var(--charcoal);
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
      padding: 20px;
    }

    h1, h2 {
      font-weight: 700;
      color: var(--light-green);
      text-align: center;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 1.8em;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    
    h2 {
      font-size: 1.4em;
      border-bottom: 2px solid var(--dark-green);
      padding-bottom: 10px;
    }

    /* Matchups Section */
    .matchups-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 25px;
    }

    .matchup {
      background-color: rgba(93, 203, 60, 0.1);
      border-left: 4px solid var(--dark-green);
      padding: 12px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 400;
      color: var(--gray);
    }

    .winner {
      font-weight: 700;
      color: var(--light-green);
      text-align: right;
    }
    
    /* Scores Table */
    .table-container {
      overflow-x: auto;
      -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black 95%, transparent);
      mask-image: linear-gradient(to right, transparent, black 10px, black 95%, transparent);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      white-space: nowrap;
    }

    thead th {
      background-color: var(--charcoal);
      color: var(--light-green);
      font-weight: 700;
      padding: 12px 15px;
      text-align: left;
      font-size: 1em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    
    tbody tr {
      border-bottom: 1px solid rgba(191, 191, 189, 0.1);
      font-size: 1em;
    }
    
    tbody tr:nth-child(even) {
      background-color: rgba(149, 148, 151, 0.05); 
    }

    tbody td {
      padding: 12px 15px;
      color: var(--gray);
    }

    tbody tr:hover {
      background-color: rgba(93, 203, 60, 0.15);
    }
    
    td:first-child {
      font-weight: 700;
      color: var(--dark-green);
      text-align: center;
    }

    td:nth-child(2) {
      font-weight: 700;
      color: var(--light-green);
    }
    
    /* Centering the weekly score */
    td:nth-child(3) {
        text-align: center;
        font-weight: 700;
    }

    /* Style for the 'Total' column header to make it stand out */
    thead th:last-child {
      border-left: 2px solid var(--dark-green);
      text-align: center;
    }

    /* Style for the 'Total' column data to make it stand out */
    td:last-child {
        text-align: center;
        font-weight: 700;
        color: var(--light-green); /* Make the total score color pop */
        border-left: 2px solid var(--dark-green); /* Add a separator line */
    }
    
    /* Mobile Optimization */
    @media (max-width: 480px) {
      .container {
        padding: 15px;
      }
      h1 {
        font-size: 1.5em;
      }
      h2 {
        font-size: 1.2em;
      }
      thead th,
      tbody td {
        padding: 10px 8px;
        font-size: 0.9em;
      }
      .matchups-container {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>2025 TRL Pick'em</h1>
    
    <h2>Week ${week} Results</h2>
    <div class="matchups-container">
      ${games.map(game => {
        const winner = game.winner === 'home' ? game.home_team : game.away_team;
        return `
      <div class="matchup">
        <span>${game.away_team} vs ${game.home_team}</span>
        <span class="winner">${winner}</span>
      </div>`;
      }).join('')}
    </div>
    
    <h2>Participant Scores</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Participant</th>
            <th>Weekly</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${combinedScores.map((score, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${score.name}</td>
            <td>${score.weeklyScore}</td>
            <td>${score.cumulativeScore}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

  return htmlContent;
};