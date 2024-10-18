import React, { useState, useEffect } from 'react';
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
import WeekSelector from '../components/WeekSelector';
import PollResultsInput from '../components/PollResultsInput';

const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);
  const [parsedGames, setParsedGames] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [nflMatches, setNflMatches] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNFLMatchupsCollapsed, setIsNFLMatchupsCollapsed] = useState(false);

  const addPick = useAddPick();
  const addGame = useAddGame();
  const addScore = useAddScore();
  const updateCumulativeScore = useUpdateCumulativeScore();

  useEffect(() => {
    const fetchNFLMatches = async () => {
      const matches = await getCachedOrFetchWeekMatches(parseInt(selectedWeek));
      setNflMatches(matches);
    };

    fetchNFLMatches();
  }, [selectedWeek]);

  const handleInputChange = (e) => {
    setPollResults(e.target.value);
  };

  const parsePollResults = async () => {
    setIsParsing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { picks, games } = parsePollData(pollResults);

    setParsedPicks(picks);
    setParsedGames(games);
    console.log('Parsed picks:', picks);
    console.log('Parsed games:', games);
    toast.success(`Successfully parsed ${picks.length} picks and ${games.length} games`);
    setIsParsing(false);
    setIsNFLMatchupsCollapsed(true);
  };

  const handleWinnerChange = (index, winner) => {
    setParsedGames(prevGames => prevGames.map((game, i) =>
      i === index ? { ...game, winner } : game
    ));
  };

  const savePicks = async () => {
    setIsSaving(true);
    try {
      await savePicksAndGames(parsedGames, parsedPicks, selectedWeek);
      await calculateAndSaveScores(parsedGames, parsedPicks, selectedWeek);

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
      <WeekSelector selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />
      <PollResultsInput
        pollResults={pollResults}
        handleInputChange={handleInputChange}
        parsePollResults={parsePollResults}
        isParsing={isParsing}
      />
      <NFLMatchups matches={nflMatches} isCollapsed={isNFLMatchupsCollapsed} />
      {parsedGames.length > 0 && (
        <ParsedGames games={parsedGames} onWinnerChange={handleWinnerChange} />
      )}
      {parsedPicks.length > 0 && (
        <ParsedPicks 
          picks={parsedPicks} 
          onSave={savePicks}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default ImportPicks;