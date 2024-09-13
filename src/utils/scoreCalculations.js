// Function to calculate scores for a single week
export const calculateWeeklyScores = (games, picks, results) => {
  const scores = {};

  // Initialize scores for all participants
  picks.forEach(pick => {
    scores[pick.name] = 0;
  });

  games.forEach(game => {
    const result = results.find(r => r.id === game.id);
    if (!result) return;

    const winner = result.homeScore > result.awayScore ? game.homeTeam : game.awayTeam;

    picks.forEach(pick => {
      if (pick.pick === winner) {
        scores[pick.name]++;
      }
    });
  });

  return Object.entries(scores).map(([name, score]) => ({ name, score }));
};

// Function to calculate cumulative scores
export const calculateCumulativeScores = (weeklyScores) => {
  const cumulativeScores = {};

  weeklyScores.forEach(week => {
    week.forEach(({ name, score }) => {
      if (!cumulativeScores[name]) {
        cumulativeScores[name] = 0;
      }
      cumulativeScores[name] += score;
    });
  });

  return Object.entries(cumulativeScores).map(([name, score]) => ({ name, score }));
};