import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddPick, useAddGame, useAddScore } from '../integrations/supabase';
import ParsedGames from '../components/ParsedGames';
import ParsedPicks from '../components/ParsedPicks';
import NFLMatchups from '../components/NFLMatchups';
import FantasyScoreboard from '../components/FantasyScoreboard';
import { getCachedOrFetchWeekMatches, forceRefreshWeekMatches } from '../utils/nflApi';
import { Calendar, Clipboard, Loader } from 'lucide-react';

/**
 * A page for importing and processing poll results to determine weekly scores.
 * @returns {JSX.Element} The rendered ImportPicks page.
 */
const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);
  const [parsedGames, setParsedGames] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [nflMatches, setNflMatches] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const addPick = useAddPick();
  const addGame = useAddGame();
  const addScore = useAddScore();

  const teamNameMapping = {
    "Thumbz": "Murder Hornets", "PRfan790": "Somewheres", "chupalo": "Sonora Sugar Skulls",
    "Scrody": "Newfoundland Growlers", "JoshMartinez": "California Burritos", "GKIRBY05": "Lonestar Legends",
    "TheNewEra22": "Brutal Hogs", "ejdale4944": "Southwest Aliens", "ClemCola": "Rochester Jesters",
    "FoodMafia": "Food Mafia", "Econley19": "Seattle Prestiges", "Detroilet": "D-Town Swirlies"
  };

  React.useEffect(() => {
    const fetchNFLMatches = async () => {
      const matches = await getCachedOrFetchWeekMatches(parseInt(selectedWeek));
      setNflMatches(matches);
    };
    fetchNFLMatches();
  }, [selectedWeek]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshMatches = await forceRefreshWeekMatches(parseInt(selectedWeek));
      setNflMatches(freshMatches);
      toast.success(`NFL scores refreshed for Week ${selectedWeek}`);
    } catch (error) {
      console.error('Error refreshing NFL matches:', error);
      toast.error('Failed to refresh NFL scores');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInputChange = (e) => setPollResults(e.target.value);

  const parsePollResults = async () => {
    setIsParsing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lines = pollResults.split('\n');
    const picks = [];
    const games = [];
    let currentTeam = '';
    let isFirstGame = true;

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('"') && line.endsWith('"')) {
        currentTeam = line.replace(/"/g, '');
        if (isFirstGame) {
          // The first two "teams" are the fantasy matchup
          if (games.length === 0) {
            games.push({ home_team: currentTeam, away_team: '', winner: null });
          } else if (!games[0].away_team) {
            games[0].away_team = currentTeam;
            isFirstGame = false;
          }
        } else {
          if (games.length === 1 || games[games.length - 1].away_team) {
            games.push({ home_team: currentTeam, away_team: '', winner: null });
          } else {
            games[games.length - 1].away_team = currentTeam;
          }
        }
      } else if (line && currentTeam) {
        picks.push({ name: teamNameMapping[line] || line, pick: currentTeam });
      }
    });
    setParsedPicks(picks);
    setParsedGames(games);
    toast.success(`Successfully parsed ${picks.length} picks and ${games.length} games`);
    setIsParsing(false);
  };

  const handleWinnerChange = (index, winner) => {
    setParsedGames(prevGames => prevGames.map((game, i) =>
      i === index ? { ...game, winner } : game
    ));
  };

  const calculateScores = (games, picks) => {
    const weekScores = {};
    picks.forEach(pick => {
      const game = games.find(g => g.home_team === pick.pick || g.away_team === pick.pick);
      if (game && game.winner) {
        const correctPick = game.winner === 'home' ? game.home_team : game.away_team;
        weekScores[pick.name] = (weekScores[pick.name] || 0) + (pick.pick === correctPick ? 1 : 0);
      }
    });
    return weekScores;
  };

  const savePicks = async () => {
    setIsSaving(true);
    setSaveProgress(0);
    const totalOperations = parsedGames.length + parsedPicks.length + Object.keys(calculateScores(parsedGames, parsedPicks)).length * 2;
    let completedOperations = 0;
    const contestId = parseInt(selectedWeek) <= 10 ? 1 : 2;

    const updateProgress = () => {
      completedOperations++;
      setSaveProgress((completedOperations / totalOperations) * 100);
    };

    try {
      for (const game of parsedGames) {
        await addGame.mutateAsync({ ...game, week: parseInt(selectedWeek), contest_id: contestId });
        updateProgress();
      }
      for (const pick of parsedPicks) {
        await addPick.mutateAsync({ ...pick, week: parseInt(selectedWeek), contest_id: contestId });
        updateProgress();
      }
      const weekScores = calculateScores(parsedGames, parsedPicks);
      for (const [name, score] of Object.entries(weekScores)) {
        await addScore.mutateAsync({ week: parseInt(selectedWeek), name, score, contest_id: contestId });
        updateProgress();
      }
      toast.success(`Picks, games, and scores saved successfully for Week ${selectedWeek}!`);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(`Failed to save data: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Week Selection and NFL Matchups - More prominent layout */}
      <div className="space-y-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2" /> Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Select week" /></SelectTrigger>
              <SelectContent>
                {[...Array(18)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>Week {i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <NFLMatchups matches={nflMatches} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        
        <FantasyScoreboard week={parseInt(selectedWeek)} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Clipboard className="w-5 h-5 mr-2" /> Paste Poll Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste poll results here..."
            value={pollResults}
            onChange={handleInputChange}
            rows={10}
          />
          <Button onClick={parsePollResults} className="w-full" disabled={isParsing}>
            {isParsing ? <><Loader className="w-4 h-4 mr-2 animate-spin" /> Parsing...</> : 'Parse Picks and Games'}
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {parsedGames.length > 0 && (
          <ParsedGames games={parsedGames} onWinnerChange={handleWinnerChange} />
        )}
        {parsedPicks.length > 0 && (
          <ParsedPicks
            picks={parsedPicks}
            onSave={savePicks}
            isSaving={isSaving}
            progress={saveProgress}
          />
        )}
      </div>
    </div>
  );
};

export default ImportPicks;