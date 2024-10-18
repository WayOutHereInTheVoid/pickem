import { calculateScores } from './scoreCalculations';

export const teamNameMapping = {
  "Thumbz": "Murder Hornets",
  "JordyV1bez": "Black Hawk Bones",
  "chupalo": "Sonora Sugar Skulls",
  "Scrody": "Newfoundland Growlers",
  "JoshMartinez": "California Burritos",
  "iammickloven": "Kyoto Ninjas",
  "TheNewEra22": "Brutal Hogs",
  "ejdale4944": "Southwest Aliens",
  "ClemCola": "Jesters",
  "kailamartinez": "Mile High Melonheads",
  "Econley19": "Seattle Prestiges",
  "Detroilet": "D-Town Swirlies"
};

export const parsePollData = (pollResults) => {
  const lines = pollResults.split('\n');
  const picks = [];
  const games = [];
  let currentTeam = '';

  lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('"') && line.endsWith('"')) {
      currentTeam = line.replace(/"/g, '');
      if (games.length === 0 || games[games.length - 1].away_team) {
        games.push({ home_team: currentTeam, away_team: '', winner: null });
      } else {
        games[games.length - 1].away_team = currentTeam;
      }
    } else if (line && currentTeam) {
      picks.push({ name: teamNameMapping[line] || line, pick: currentTeam });
    }
  });

  return { picks, games };
};

export const savePicksAndGames = async (games, picks, week, addGame, addPick) => {
  for (const game of games) {
    await addGame.mutateAsync({ ...game, week: parseInt(week) });
  }

  for (const pick of picks) {
    await addPick.mutateAsync({ ...pick, week: parseInt(week) });
  }
};

export const calculateAndSaveScores = async (games, picks, week, addScore, updateCumulativeScore) => {
  const weekScores = calculateScores(games, picks);
  for (const [name, score] of Object.entries(weekScores)) {
    await addScore.mutateAsync({
      week: parseInt(week),
      name,
      score
    });

    await updateCumulativeScore.mutateAsync({
      name,
      score
    });
  }
};