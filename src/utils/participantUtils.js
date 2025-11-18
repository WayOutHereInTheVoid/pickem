// Master participant list - all 12 teams that should always appear
export const ALL_PARTICIPANTS = [
  'Food Mafia',
  'Brutal Hogs', 
  'Rochester Jesters',
  'Southwest Aliens',
  'Murder Hornets',
  'Seattle Prestiges',
  'California Burritos',
  'D-Town Swirlies',
  'Lonestar Legends',
  'Newfoundland Growlers',
  'Somewheres',
  'Sonora Sugar Skulls'  // Note: This handles both "Sugar Skulls" and "Sonora Sugar Skulls"
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
    const existingScore = weekScores.find(s => 
      s.name === name || 
      (name === 'Sugar Skulls' && s.name === 'Sonora Sugar Skulls')
    );
    
    return {
      name,
      score: existingScore?.score || 0,
      week
    };
  });
};

/**
 * Gets cumulative scores for all participants from weekly scores up to a certain week
 * @param {Array} weeklyScores - All weekly scores from the database for the contest
 * @param {number} currentWeek - The current week to calculate cumulative scores up to
 * @returns {Array} Complete list of 12 participants with their cumulative scores
 */
export const getCompleteCumulativeScores = (weeklyScores, currentWeek) => {
  const cumulativeScores = {};

  // Initialize scores for all participants to 0
  for (const name of ALL_PARTICIPANTS) {
    cumulativeScores[name] = 0;
  }

  // Sum scores up to the current week
  for (const score of weeklyScores) {
    if (score.week <= currentWeek) {
      // Handle "Sonora Sugar Skulls" and "Sugar Skulls" as the same entity
      const participantName = score.name === 'Sonora Sugar Skulls' ? 'Sonora Sugar Skulls' : score.name;
      if (ALL_PARTICIPANTS.includes(participantName)) {
        cumulativeScores[participantName] += score.score;
      }
    }
  }

  // Format the output to be an array of objects
  return ALL_PARTICIPANTS.map(name => {
    // Special handling for Sonora Sugar Skulls to match with "Sugar Skulls" if needed.
    // However, the master list has "Sonora Sugar Skulls", so we should probably stick to that.
    const participantName = name === 'Sugar Skulls' ? 'Sonora Sugar Skulls' : name;
    
    return {
      name: participantName,
      score: cumulativeScores[participantName] || 0
    };
  });
};
