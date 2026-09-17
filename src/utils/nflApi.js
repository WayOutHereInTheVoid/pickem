import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_KEY = '36d1384792mshe01cc9caeff0647p1d0516jsn2f458adb4379';

const nflWeeks2026 = {
  1: { start: '2026-09-09', end: '2026-09-15' },
  2: { start: '2026-09-17', end: '2026-09-22' },
  3: { start: '2026-09-24', end: '2026-09-29' },
  4: { start: '2026-10-01', end: '2026-10-06' },
  5: { start: '2026-10-08', end: '2026-10-13' },
  6: { start: '2026-10-15', end: '2026-10-20' },
  7: { start: '2026-10-22', end: '2026-10-27' },
  8: { start: '2026-10-29', end: '2026-11-03' },
  9: { start: '2026-11-05', end: '2026-11-10' },
  10: { start: '2026-11-12', end: '2026-11-17' },
  11: { start: '2026-11-19', end: '2026-11-24' },
  12: { start: '2026-11-26', end: '2026-12-01' },
  13: { start: '2026-12-03', end: '2026-12-08' },
  14: { start: '2026-12-10', end: '2026-12-15' },
  15: { start: '2026-12-17', end: '2026-12-22' },
  16: { start: '2026-12-24', end: '2026-12-29' },
  17: { start: '2026-12-31', end: '2027-01-05' },
  18: { start: '2027-01-09', end: '2027-01-11' }
};

/**
 * Generates a range of dates between a start and end date.
 * @param {string} start - The start date in YYYY-MM-DD format.
 * @param {string} end - The end date in YYYY-MM-DD format.
 * @returns {Array<string>} An array of dates in YYYY-MM-DD format.
 */
function generateDateRange(start, end) {
  const dates = [];
  let currentDate = new Date(start);
  const endDate = new Date(end);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

/**
 * Fetches NFL matches for a given date from the API.
 * @param {string} date - The date to fetch matches for in YYYY-MM-DD format.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of match objects.
 */
async function fetchNFLMatches(date) {
  const options = {
    method: 'GET',
    url: 'https://nfl-ncaa-highlights-api.p.rapidapi.com/matches',
    params: { league: 'NFL', date: date },
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'nfl-ncaa-highlights-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching NFL matches for ${date}:`, error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    return [];
  }
}

/**
 * Gets the NFL matches for a given week, either from the cache or by fetching from the API.
 * @param {number} week - The week to get matches for.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of match objects.
 */
export async function getCachedOrFetchWeekMatches(week) {
  // Check if we have cached data for this week
  const { data: cachedMatches, error } = await supabase
    .from('nfl_matches_cache')
    .select('*')
    .eq('week', week);

  if (error) {
    console.error('Error fetching cached matches:', error);
  }

  if (cachedMatches && cachedMatches.length > 0) {
    return JSON.parse(cachedMatches[0].matches);
  }

  // If no cache, fetch new data
  const weekDates = nflWeeks2026[week];
  if (!weekDates) {
    console.log(`Week ${week} data not available.`);
    return [];
  }

  const dates = generateDateRange(weekDates.start, weekDates.end);
  let allMatches = [];

  for (const date of dates) {
    const matches = await fetchNFLMatches(date);
    allMatches = allMatches.concat(matches);
    // Add a small delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Cache the fetched data
  const { error: insertError } = await supabase
    .from('nfl_matches_cache')
    .upsert({ week, matches: JSON.stringify(allMatches) });

  if (insertError) {
    console.error('Error caching matches:', insertError);
  }

  return allMatches;
}

/**
 * Forces a refresh of NFL matches for a given week, bypassing cache.
 * @param {number} week - The week to refresh matches for.
 * @returns {Promise<Array<object>>} A promise that resolves with fresh match data.
 */
export async function forceRefreshWeekMatches(week) {
  const weekDates = nflWeeks2026[week];
  if (!weekDates) {
    console.log(`Week ${week} data not available.`);
    return [];
  }

  const dates = generateDateRange(weekDates.start, weekDates.end);
  let allMatches = [];

  for (const date of dates) {
    const matches = await fetchNFLMatches(date);
    allMatches = allMatches.concat(matches);
    // Add a small delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Update cache with fresh data
  const { error: updateError } = await supabase
    .from('nfl_matches_cache')
    .upsert({ week, matches: JSON.stringify(allMatches) });

  if (updateError) {
    console.error('Error updating cache:', updateError);
  }

  return allMatches;
}

/**
 * Clears cached data for a specific week.
 * @param {number} week - The week to clear cache for.
 * @returns {Promise<boolean>} A promise that resolves with success status.
 */
export async function clearWeekCache(week) {
  const { error } = await supabase
    .from('nfl_matches_cache')
    .delete()
    .eq('week', week);

  if (error) {
    console.error('Error clearing cache:', error);
    return false;
  }

  return true;
}
