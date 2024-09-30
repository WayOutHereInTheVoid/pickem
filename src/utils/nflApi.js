import axios from 'axios';

const nflWeeks2024 = {
  1: { start: '2024-09-05', end: '2024-09-10' },
  // ... (include all weeks as in the original code)
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
      'X-RapidAPI-Key': '36d1384792mshe01cc9caeff0647p1d0516jsn2f458adb4379',
      'X-RapidAPI-Host': 'nfl-ncaa-highlights-api.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching NFL matches for ${date}:`, error.message);
    return [];
  }
}

export async function fetchWeekMatches(week) {
  const weekDates = nflWeeks2024[week];
  if (!weekDates) {
    throw new Error(`Week ${week} data not available.`);
  }

  const dates = generateDateRange(weekDates.start, weekDates.end);
  let allMatches = [];

  for (const date of dates) {
    const matches = await fetchNFLMatches(date);
    allMatches = [...allMatches, ...matches];
    // Add a small delay to avoid hitting API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return allMatches;
}