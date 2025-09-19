/**
 * Calculates the weekly scores for each participant.
 * @param {Array<object>} games - An array of game objects.
 * @param {Array<object>} picks - An array of pick objects.
 * @param {Array<object>} results - An array of result objects.
 * @returns {Array<object>} An array of objects containing the weekly scores for each participant.
 */
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

/**
 * Calculates the cumulative scores for each participant.
 * @param {Array<object>} weeklyScores - An array of weekly score objects.
 * @returns {Array<object>} An array of objects containing the cumulative scores for each participant.
 */
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
