import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePicks, useAddPick, useGames, useAddGame, useUpdateGame } from '../integrations/supabase';

const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);
  const [parsedGames, setParsedGames] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("1");

  const { data: savedPicks, isLoading, isError } = usePicks();
  const addPick = useAddPick();
  const { data: savedGames } = useGames();
  const addGame = useAddGame();
  const updateGame = useUpdateGame();

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

  const parsePollResults = () => {
    const lines = pollResults.split('\n');
    const picks = [];
    const games = [];
    let currentTeam = '';
    let gameIndex = 0;

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('"') && line.endsWith('"')) {
        currentTeam = line.replace(/"/g, '');
        if (gameIndex % 2 === 0) {
          games.push({ home_team: currentTeam, away_team: '', winner: null });
        } else {
          games[Math.floor(gameIndex / 2)].away_team = currentTeam;
        }
        gameIndex++;
      } else if (line && currentTeam) {
        picks.push({ name: teamNameMapping[line] || line, pick: currentTeam });
      }
    });

    setParsedPicks(picks);
    setParsedGames(games);
    console.log('Parsed picks:', picks);
    console.log('Parsed games:', games);
    toast.success(`Successfully parsed ${picks.length} picks and ${games.length} games`);
  };

  const handleWinnerChange = (index, winner) => {
    setParsedGames(prevGames => prevGames.map((game, i) =>
      i === index ? { ...game, winner } : game
    ));
  };

  const savePicks = async () => {
    try {
      // Save games
      for (const game of parsedGames) {
        const gameData = { ...game, week: parseInt(selectedWeek) };
        if (game.id) {
          await updateGame.mutateAsync(gameData);
        } else {
          await addGame.mutateAsync(gameData);
        }
      }

      // Save picks
      for (const pick of parsedPicks) {
        await addPick.mutateAsync({ ...pick, week: parseInt(selectedWeek) });
      }

      toast.success(`Picks and games saved successfully for Week ${selectedWeek}!`);
    } catch (error) {
      console.error('Error saving picks and games:', error);
      toast.error(`Failed to save picks and games: ${error.message}`);
    }
  };

  const handlePickEdit = (index, newPick) => {
    const updatedPicks = [...parsedPicks];
    updatedPicks[index].pick = newPick;
    setParsedPicks(updatedPicks);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading picks</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Import Picks</h1>
        <Card className="mb-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[180px] bg-secondary text-foreground">
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
        <Card className="mb-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Paste Poll Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste poll results here..."
              value={pollResults}
              onChange={handleInputChange}
              rows={10}
              className="mb-4 bg-secondary text-foreground"
            />
            <Button onClick={parsePollResults} className="w-full bg-primary text-primary-foreground">
              Parse Picks and Games
            </Button>
          </CardContent>
        </Card>
        
        {parsedGames.length > 0 && (
          <Card className="mb-6 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Parsed Games</CardTitle>
            </CardHeader>
            <CardContent>
              {parsedGames.map((game, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {game.home_team} vs {game.away_team}
                  </h3>
                  <RadioGroup
                    onValueChange={(value) => handleWinnerChange(index, value)}
                    value={game.winner || ''}
                    className="text-foreground"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id={`home-win-${index}`} />
                      <Label htmlFor={`home-win-${index}`}>{game.home_team} Wins</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="away" id={`away-win-${index}`} />
                      <Label htmlFor={`away-win-${index}`}>{game.away_team} Wins</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {parsedPicks.length > 0 && (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Parsed Picks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Team Name</TableHead>
                    <TableHead className="text-foreground">Pick</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedPicks.map((pick, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-foreground">{pick.name}</TableCell>
                      <TableCell className="text-foreground">
                        <Input
                          value={pick.pick}
                          onChange={(e) => handlePickEdit(index, e.target.value)}
                          className="bg-secondary text-foreground"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={savePicks} className="w-full mt-4 bg-primary text-primary-foreground">
                Save Picks and Games
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImportPicks;
