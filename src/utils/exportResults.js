/**
 * Exports the results of a given week to a CSV string.
 * @param {number} week - The week to export the results for.
 * @returns {Promise<string>} A promise that resolves with the CSV content.
 * @throws {Error} If there is incomplete data for the selected week.
 */
export const exportResultsToCSV = async (week) => {
  const weeklyScores = JSON.parse(localStorage.getItem(`week${week}Scores`) || '[]');
  const cumulativeScores = JSON.parse(localStorage.getItem('cumulativeScores') || '[]');
  const games = JSON.parse(localStorage.getItem(`week${week}Games`) || '[]');

  if (weeklyScores.length === 0 || cumulativeScores.length === 0 || games.length === 0) {
    throw new Error("Incomplete data for the selected week");
  }

  const sortedWeeklyScores = weeklyScores.sort((a, b) => b.score - a.score);
  const sortedCumulativeScores = cumulativeScores.sort((a, b) => b.score - a.score);

  let csvContent = `Weekly Scores - NFL Week ${week}\n`;
  csvContent += "Rank,Team Name,Weekly Score\n";
  sortedWeeklyScores.forEach((score, index) => {
    csvContent += `${index + 1},${score.name},${score.score}\n`;
  });

  csvContent += "\nNFL Games Results\n";
  games.forEach(game => {
    const winner = game.winner === 'home' ? game.homeTeam : game.awayTeam;
    csvContent += `${game.homeTeam} vs ${game.awayTeam}: ${winner} won\n`;
  });

  csvContent += `\nCumulative Scores (Through Week ${week})\n`;
  csvContent += "Rank,Team Name,Cumulative Score\n";
  sortedCumulativeScores.forEach((score, index) => {
    csvContent += `${index + 1},${score.name},${score.score}\n`;
  });

  return csvContent;
};