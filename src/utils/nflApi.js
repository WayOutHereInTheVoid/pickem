import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_KEY = '36d1384792mshe01cc9caeff0647p1d0516jsn2f458adb4379';

const nflWeeks2024 = {
  1: { start: '2024-09-05', end: '2024-09-10' },
  2: { start: '2024-09-12', end: '2024-09-17' },
  3: { start: '2024-09-19', end: '2024-09-24' },
  4: { start: '2024-09-26', end: '2024-10-01' },
  5: { start: '2024-10-03', end: '2024-10-08' },
  6: { start: '2024-10-10', end: '2024-10-15' },
  7: { start: '2024-10-17', end: '2024-10-22' },
  8: { start: '2024-10-24', end: '2024-10-29' },
  9: { start: '2024-10-31', end: '2024-11-05' },
  10: { start: '2024-11-07', end: '2024-11-12' },
  11: { start: '2024-11-14', end: '2024-11-19' },
  12: { start: '2024-11-21', end: '2024-11-26' },
  13: { start: '2024-11-28', end: '2024-12-03' },
  14: { start: '2024-12-05', end: '2024-12-10' },
  15: { start: '2024-12-12', end: '2024-12-17' },
  16: { start: '2024-12-19', end: '2024-12-24' },
  17: { start: '2024-12-25', end: '2024-12-31' },
  18: { start: '2025-01-04', end: '2025-01-06' }
};

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
  const weekDates = nflWeeks2024[week];
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