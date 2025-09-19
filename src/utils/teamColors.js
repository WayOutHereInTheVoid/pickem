/**
 * A mapping of NFL team names to their primary colors.
 * @type {Object.<string, string>}
 */
const teamColors = {
  "Arizona Cardinals": "#97233F",
  "Atlanta Falcons": "#A71930",
  "Baltimore Ravens": "#241773",
  "Buffalo Bills": "#00338D",
  "Carolina Panthers": "#0085CA",
  "Chicago Bears": "#0B162A",
  "Cincinnati Bengals": "#FB4F14",
  "Cleveland Browns": "#FF3C00",
  "Dallas Cowboys": "#041E42",
  "Denver Broncos": "#FB4F14",
  "Detroit Lions": "#0076B6",
  "Green Bay Packers": "#203731",
  "Houston Texans": "#03202F",
  "Indianapolis Colts": "#002C5F",
  "Jacksonville Jaguars": "#006778",
  "Kansas City Chiefs": "#E31837",
  "Las Vegas Raiders": "#000000",
  "Los Angeles Chargers": "#0080C6",
  "Los Angeles Rams": "#003594",
  "Miami Dolphins": "#008E97",
  "Minnesota Vikings": "#4F2683",
  "New England Patriots": "#002244",
  "New Orleans Saints": "#101820",
  "New York Giants": "#0B2265",
  "New York Jets": "#125740",
  "Philadelphia Eagles": "#004C54",
  "Pittsburgh Steelers": "#000000",
  "San Francisco 49ers": "#AA0000",
  "Seattle Seahawks": "#002244",
  "Tampa Bay Buccaneers": "#D50A0A",
  "Tennessee Titans": "#002244",
  "Washington Commanders": "#5A1414"
};

/**
 * Gets the primary color for a given NFL team.
 * @param {string} teamName - The name of the team.
 * @returns {string} The hex code for the team's primary color.
 */
export const getTeamColor = (teamName) => {
  return teamColors[teamName] || '#000000'; // Default to black if team not found
};