import axios from 'axios';
import { supabase } from '../lib/supabase.js';

// Sleeper Fantasy League Configuration
const LEAGUE_ID = '1256486983484583936';
const BASE_URL = 'https://api.sleeper.app/v1';

// Team name mapping (roster_id -> custom team name)
const teamNameMapping = {
  1: "Murder Hornets",
  2: "Lonestar Legends", 
  3: "Sugar Skulls",
  4: "Newfoundland Growlers",
  5: "California Burritos",
  6: "Food Mafia",
  7: "Brutal Hogs",
  8: "Southwest Aliens",
  9: "Rochester Jesters",
  10: "Somewheres",
  11: "Seattle Prestiges",
  12: "D-Town Swirlies"
};

/**
 * Gets the current NFL week and season information from Sleeper API.
 * @returns {Promise<object>} A promise that resolves with the current NFL state (week, season, season_type).
 */
export async function getCurrentNFLWeek() {
  try {
    const response = await axios.get(`${BASE_URL}/state/nfl`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current NFL week:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    // Return default values if API fails
    return { week: 1, season: '2025', season_type: 'regular' };
  }
}

/**
 * Fetches league matchups for a specific week from Sleeper API.
 * @param {number} week - The week to fetch matchups for.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of matchup objects.
 */
export async function getLeagueMatchups(week) {
  try {
    const response = await axios.get(`${BASE_URL}/league/${LEAGUE_ID}/matchups/${week}`);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching league matchups for week ${week}:`, error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    return [];
  }
}

/**
 * Fetches league users from Sleeper API (optional, for additional team info).
 * @returns {Promise<Array<object>>} A promise that resolves with an array of user objects.
 */
export async function getLeagueUsers() {
  try {
    const response = await axios.get(`${BASE_URL}/league/${LEAGUE_ID}/users`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching league users:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    return [];
  }
}

/**
 * Fetches league rosters from Sleeper API (optional, for wins/losses).
 * @returns {Promise<Array<object>>} A promise that resolves with an array of roster objects.
 */
export async function getLeagueRosters() {
  try {
    const response = await axios.get(`${BASE_URL}/league/${LEAGUE_ID}/rosters`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching league rosters:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    return [];
  }
}

/**
 * Groups raw matchup data into opponent pairs and formats with team names.
 * @param {Array<object>} rawMatchups - Raw matchup data from Sleeper API.
 * @returns {Array<object>} An array of formatted matchup objects with team names and scores.
 */
function formatMatchupsWithTeamNames(rawMatchups) {
  // Group matchups by matchup_id (teams with same matchup_id play each other)
  const matchupGroups = {};
  
  rawMatchups.forEach(matchup => {
    const matchupId = matchup.matchup_id;
    if (!matchupGroups[matchupId]) {
      matchupGroups[matchupId] = [];
    }
    matchupGroups[matchupId].push(matchup);
  });

  // Convert groups into formatted matchup objects
  const formattedMatchups = [];
  
  Object.entries(matchupGroups).forEach(([matchupId, teams]) => {
    if (teams.length === 2) {
      const [team1, team2] = teams;
      
      // Get team names from mapping
      const team1Name = teamNameMapping[team1.roster_id] || `Team ${team1.roster_id}`;
      const team2Name = teamNameMapping[team2.roster_id] || `Team ${team2.roster_id}`;
      
      // Determine winner (if points are available)
      let status = 'In Progress';
      let winner = null;
      
      if (team1.points !== null && team2.points !== null) {
        if (team1.points > team2.points) {
          winner = 'team1';
          status = `${team1Name} Wins`;
        } else if (team2.points > team1.points) {
          winner = 'team2';
          status = `${team2Name} Wins`;
        } else if (team1.points === team2.points && team1.points > 0) {
          status = 'Tie';
        }
      }
      
      formattedMatchups.push({
        matchupId: parseInt(matchupId),
        team1: {
          name: team1Name,
          rosterId: team1.roster_id,
          points: team1.points || 0
        },
        team2: {
          name: team2Name,
          rosterId: team2.roster_id,
          points: team2.points || 0
        },
        winner,
        status
      });
    } else {
      // Handle cases where matchup doesn't have exactly 2 teams (shouldn't happen in normal leagues)
      console.warn(`Matchup ${matchupId} has ${teams.length} teams instead of 2`);
    }
  });

  return formattedMatchups;
}

/**
 * Gets formatted fantasy matchups for a specific week, with caching support.
 * @param {number} week - The week to get matchups for.
 * @param {boolean} useCache - Whether to use cached data if available (default: true).
 * @returns {Promise<Array<object>>} A promise that resolves with formatted matchup objects.
 */
export async function getFormattedMatchups(week, useCache = true) {
  if (useCache) {
    // Check if we have cached data for this week
    const { data: cachedMatchups, error } = await supabase
      .from('fantasy_matchups_cache')
      .select('*')
      .eq('week', week);

    if (error) {
      console.error('Error fetching cached fantasy matchups:', error);
    }

    if (cachedMatchups && cachedMatchups.length > 0) {
      return JSON.parse(cachedMatchups[0].matchups);
    }
  }

  // If no cache or cache disabled, fetch new data
  const rawMatchups = await getLeagueMatchups(week);
  
  if (rawMatchups.length === 0) {
    console.log(`No fantasy matchups found for week ${week}`);
    return [];
  }

  const formattedMatchups = formatMatchupsWithTeamNames(rawMatchups);

  // Cache the formatted data
  if (useCache) {
    const { error: insertError } = await supabase
      .from('fantasy_matchups_cache')
      .upsert({ 
        week, 
        matchups: JSON.stringify(formattedMatchups),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error caching fantasy matchups:', insertError);
    }
  }

  return formattedMatchups;
}

/**
 * Forces a refresh of fantasy matchups for a given week, bypassing cache.
 * @param {number} week - The week to refresh matchups for.
 * @returns {Promise<Array<object>>} A promise that resolves with fresh formatted matchup data.
 */
export async function forceRefreshFantasyMatchups(week) {
  console.log(`Force refreshing fantasy matchups for week ${week}`);
  return await getFormattedMatchups(week, false);
}

/**
 * Clears cached fantasy matchup data for a specific week.
 * @param {number} week - The week to clear cache for.
 * @returns {Promise<boolean>} A promise that resolves with success status.
 */
export async function clearFantasyWeekCache(week) {
  const { error } = await supabase
    .from('fantasy_matchups_cache')
    .delete()
    .eq('week', week);

  if (error) {
    console.error('Error clearing fantasy cache:', error);
    return false;
  }

  return true;
}

/**
 * Gets the team name for a given roster ID.
 * @param {number} rosterId - The roster ID to get the team name for.
 * @returns {string} The custom team name or a fallback name.
 */
export function getTeamName(rosterId) {
  return teamNameMapping[rosterId] || `Team ${rosterId}`;
}
