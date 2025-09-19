import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_KEY = '36d1384792mshe01cc9caeff0647p1d0516jsn2f458adb4379';

const nflWeeks2025 = {
  1: { start: '2025-09-04', end: '2025-09-09' },
  2: { start: '2025-09-11', end: '2025-09-16' },
  3: { start: '2025-09-18', end: '2025-09-23' },
  4: { start: '2025-09-25', end: '2025-09-30' },
  5: { start: '2025-10-02', end: '2025-10-07' },
  6: { start: '2025-10-09', end: '2025-10-14' },
  7: { start: '2025-10-16', end: '2025-10-21' },
  8: { start: '2025-10-23', end: '2025-10-28' },
  9: { start: '2025-10-30', end: '2025-11-04' },
  10: { start: '2025-11-06', end: '2025-11-11' },
  11: { start: '2025-11-13', end: '2025-11-18' },
  12: { start: '2025-11-20', end: '2025-11-25' },
  13: { start: '2025-11-27', end: '2025-12-02' },
  14: { start: '2025-12-04', end: '2025-12-09' },
  15: { start: '2025-12-11', end: '2025-12-16' },
  16: { start: '2025-12-18', end: '2025-12-23' },
  17: { start: '2025-12-25', end: '2025-12-30' },
  18: { start: '2026-01-03', end: '2026-01-05' }
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
  const weekDates = nflWeeks2025[week];
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