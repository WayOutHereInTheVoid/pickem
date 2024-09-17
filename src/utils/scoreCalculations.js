export const calculateWeeklyScores = (games, picks, results) => {
  const scores = {};

  // Initialize scores for all participants
  picks.forEach(pick => {
    scores[pick.name] = 0;
  });

  games.forEach(game => {
    const result = results.find(r => r.id === game.id);
    if (!result) return;

    picks.forEach(pick => {
      if (pick.pick === result.winner) {
        scores[pick.name]++;
      }
    });
  });

  return Object.entries(scores).map(([name, score]) => ({ name, score }));
};

export const calculateCumulativeScores = (weeklyScores) => {
  const cumulativeScores = {};

  weeklyScores.forEach(score => {
    if (!cumulativeScores[score.name]) {
      cumulativeScores[score.name] = 0;
    }
    cumulativeScores[score.name] += score.score;
  });

  return Object.entries(cumulativeScores).map(([name, score]) => ({ name, score }));
};
