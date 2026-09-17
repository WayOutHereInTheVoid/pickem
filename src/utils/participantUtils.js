// Master participant list - all 12 teams that should always appear
export const ALL_PARTICIPANTS = [
  'Food Mafia',
  'Brutal Hogs',
  'Jesters',
  'Bird Gang',
  'Murder Hornets',
  'Prestige',
  'Burritos',
  'Swirlies',
  'Legends',
  'Gamblers',
  'Yetis',
  'Sugar Skulls'
];

/**
 * Gets weekly scores for all participants, filling in 0 for missing entries
 * @param {Array} scores - All scores from database
 * @param {number} week - Week to get scores for
 * @returns {Array} Complete list of 12 participants with their weekly scores
 */
export const getCompleteWeeklyScores = (scores, week) => {
  const weekScores = scores.filter(s => s.week === week);

  return ALL_PARTICIPANTS.map(name => {
    const existingScore = weekScores.find(s => s.name === name);

    return {
      name,
      score: existingScore?.score || 0,
      week
    };
  });
};

/**
 * Gets cumulative scores for all participants
 * @param {Array} cumulativeScores - Cumulative scores from database
 * @returns {Array} Complete list of 12 participants with their cumulative scores
 */
export const getCompleteCumulativeScores = (cumulativeScores) => {
  return ALL_PARTICIPANTS.map(name => {
    const existingScore = cumulativeScores.find(s => s.name === name);

    return {
      name,
      score: existingScore?.score || 0
    };
  });
};
