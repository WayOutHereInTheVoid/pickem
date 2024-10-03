import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePicks, useAddPick, useGames, useAddGame, useScores, useAddScore, useUpdateCumulativeScore, useCumulativeScores } from '../integrations/supabase';
import ParsedGames from '../components/ParsedGames';
import ParsedPicks from '../components/ParsedPicks';
import NFLMatchups from '../components/NFLMatchups';
import { getCachedOrFetchWeekMatches } from '../utils/nflApi';
import { Calendar, Clipboard, Loader } from 'lucide-react';

const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);
  const [parsedGames, setParsedGames] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [nflMatches, setNflMatches] = useState([]);
  const [isParsing, setIsParsing] = useState(false);

  const addPick = useAddPick();
  const addGame = useAddGame();
  const addScore = useAddScore();
  const updateCumulativeScore = useUpdateCumulativeScore();

  React.useEffect(() => {
    const fetchNFLMatches = async () => {
      const matches = await getCachedOrFetchWeekMatches(parseInt(selectedWeek));
      setNflMatches(matches);
    };

    fetchNFLMatches();
  }, [selectedWeek]);

  const teamNameMapping = {
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

  const handleInputChange = (e) => {
    setPollResults(e.target.value);
  };

  const parsePollResults = async () => {
    setIsParsing(true);
    // Simulate a delay for the parsing process
    await new Promise(resolve => setTimeout(resolve, 1500));

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

    setParsedPicks(picks);
    setParsedGames(games);
    console.log('Parsed picks:', picks);
    console.log('Parsed games:', games);
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
    try {
      for (const game of parsedGames) {
        await addGame.mutateAsync({ ...game, week: parseInt(selectedWeek) });
      }

      for (const pick of parsedPicks) {
        await addPick.mutateAsync({ ...pick, week: parseInt(selectedWeek) });
      }

      const weekScores = calculateScores(parsedGames, parsedPicks);
      for (const [name, score] of Object.entries(weekScores)) {
        await addScore.mutateAsync({
          week: parseInt(selectedWeek),
          name,
          score
        });

        await updateCumulativeScore.mutateAsync({
          name,
          score
        });
      }

      toast.success(`Picks, games, and scores saved successfully for Week ${selectedWeek}!`);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(`Failed to save data: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Select Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-full bg-secondary text-foreground">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(16)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Week {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <Clipboard className="w-5 h-5 mr-2" />
            Paste Poll Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste poll results here..."
            value={pollResults}
            onChange={handleInputChange}
            rows={10}
            className="mb-4 bg-secondary text-foreground focus:ring-2 focus:ring-primary transition-all duration-300"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={parsePollResults}
              className="w-full bg-primary text-primary-foreground hover:bg-primary-light transition-colors duration-300"
              disabled={isParsing}
            >
              {isParsing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Parsing...
                </>
              ) : (
                'Parse Picks and Games'
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      
      <NFLMatchups matches={nflMatches} />
      
      {parsedGames.length > 0 && (
        <ParsedGames games={parsedGames} onWinnerChange={handleWinnerChange} />
      )}
      
      {parsedPicks.length > 0 && (
        <ParsedPicks picks={parsedPicks} onSave={savePicks} />
      )}
    </div>
  );
};

export default ImportPicks;