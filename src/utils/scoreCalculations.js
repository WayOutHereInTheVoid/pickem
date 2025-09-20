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

/**
 * Calculates ranks with proper tie handling.
 * Teams with the same score get the same rank, and subsequent ranks skip appropriately.
 * @param {Array<object>} scores - An array of score objects with name and score properties.
 * @returns {Array<object>} An array of score objects with added rank property.
 */
export const calculateRanksWithTies = (scores) => {
  if (!scores || scores.length === 0) return [];

  // Sort by score descending
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  
  let currentRank = 1;
  let previousScore = null;

  return sortedScores.map((scoreEntry, index) => {
    if (previousScore === null || scoreEntry.score !== previousScore) {
      // New score group - set rank to current position + 1
      currentRank = index + 1;
    }

    previousScore = scoreEntry.score;
    
    return {
      ...scoreEntry,
      rank: currentRank
    };
  });
};

/**
 * Formats rank display with tie handling.
 * @param {number} rank - The numerical rank
 * @param {Array<object>} allRankedData - Array of all ranked data to check for ties
 * @returns {string} Formatted rank string (e.g., "T1", "4", "T7")
 */
export const formatRankDisplay = (rank, allRankedData) => {
  if (!allRankedData || allRankedData.length === 0) return rank.toString();
  
  // Count how many teams have this rank
  const teamsWithSameRank = allRankedData.filter(entry => entry.rank === rank).length;
  
  // If more than one team has this rank, it's a tie
  if (teamsWithSameRank > 1) {
    return `T${rank}`;
  }
  
  return rank.toString();
};

/**
 * Calculates ranks with proper tie handling and formatted display.
 * @param {Array<object>} scores - An array of score objects with name and score properties.
 * @returns {Array<object>} An array of score objects with added rank and displayRank properties.
 */
export const calculateRanksWithTiesAndDisplay = (scores) => {
  const rankedScores = calculateRanksWithTies(scores);
  
  return rankedScores.map(entry => ({
    ...entry,
    displayRank: formatRankDisplay(entry.rank, rankedScores)
  }));
};

