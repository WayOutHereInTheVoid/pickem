import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useGames, useAddGame, useUpdateGame, usePicks, useAddScore, useUpdateCumulativeScore } from '../integrations/supabase';

const GameInput = ({ game, onInputChange, onWinnerChange }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2 text-foreground">Game {game.id || 'New'}</h3>
    <div className="grid grid-cols-2 gap-4 mb-2">
      <div>
        <Label htmlFor={`home_team-${game.id}`} className="text-foreground">Home Team</Label>
        <Input
          id={`home_team-${game.id}`}
          value={game.home_team}
          onChange={(e) => onInputChange(game.id, 'home_team', e.target.value)}
          placeholder="Enter home team"
          required
          className="bg-secondary text-foreground"
        />
      </div>
      <div>
        <Label htmlFor={`away_team-${game.id}`} className="text-foreground">Away Team</Label>
        <Input
          id={`away_team-${game.id}`}
          value={game.away_team}
          onChange={(e) => onInputChange(game.id, 'away_team', e.target.value)}
          placeholder="Enter away team"
          required
          className="bg-secondary text-foreground"
        />
      </div>
    </div>
    <RadioGroup
      onValueChange={(value) => onWinnerChange(game.id, value)}
      value={game.winner}
      className="text-foreground"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="home" id={`home-win-${game.id}`} />
        <Label htmlFor={`home-win-${game.id}`}>Home Team Wins</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="away" id={`away-win-${game.id}`} />
        <Label htmlFor={`away-win-${game.id}`}>Away Team Wins</Label>
      </div>
    </RadioGroup>
  </div>
);

const SetupGames = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [games, setGames] = useState([
    { id: 'new1', home_team: '', away_team: '', winner: null },
    { id: 'new2', home_team: '', away_team: '', winner: null },
    { id: 'new3', home_team: '', away_team: '', winner: null },
  ]);

  const { data: fetchedGames, refetch: refetchGames } = useGames();
  const { data: picks, refetch: refetchPicks } = usePicks();
  const addGame = useAddGame();
  const updateGame = useUpdateGame();
  const addScore = useAddScore();
  const updateCumulativeScore = useUpdateCumulativeScore();

  useEffect(() => {
    if (fetchedGames) {
      const weekGames = fetchedGames.filter(game => game.week === parseInt(selectedWeek));
      if (weekGames.length > 0) {
        setGames(weekGames);
      } else {
        setGames([
          { id: 'new1', home_team: '', away_team: '', winner: null },
          { id: 'new2', home_team: '', away_team: '', winner: null },
          { id: 'new3', home_team: '', away_team: '', winner: null },
        ]);
      }
    }
  }, [fetchedGames, selectedWeek]);

  const handleInputChange = (id, field, value) => {
    setGames(prevGames => prevGames.map(game => 
      game.id === id ? { ...game, [field]: value } : game
    ));
  };

  const handleWinnerChange = (id, winner) => {
    setGames(prevGames => prevGames.map(game =>
      game.id === id ? { ...game, winner } : game
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedGames = [];
      for (const game of games) {
        const gameData = { ...game, week: parseInt(selectedWeek) };
        let updatedGame;
        if (typeof game.id === 'string' && game.id.startsWith('new')) {
          const { id, ...newGameData } = gameData;
          const { data, error } = await addGame.mutateAsync(newGameData);
          if (error) throw error;
          updatedGame = data[0];
        } else {
          const { data, error } = await updateGame.mutateAsync(gameData);
          if (error) throw error;
          updatedGame = data[0];
        }
        updatedGames.push(updatedGame);
      }

      setGames(updatedGames);

      const weekPicks = picks.filter(pick => pick.week === parseInt(selectedWeek));
      const weekScores = calculateScores(updatedGames, weekPicks);

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

      toast.success(`Games and scores for Week ${selectedWeek} submitted successfully!`);
      refetchGames();
      refetchPicks();
    } catch (error) {
      console.error('Error submitting games and scores:', error);
      toast.error('Failed to submit games and scores. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Set Up Games</h1>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Input This Week's Matchups</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="week-select" className="text-foreground">Select Week</Label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger id="week-select" className="bg-secondary text-foreground">
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
              </div>
              {games.map((game) => (
                <GameInput 
                  key={game.id} 
                  game={game} 
                  onInputChange={handleInputChange}
                  onWinnerChange={handleWinnerChange}
                />
              ))}
              <Button type="submit" className="w-full bg-primary text-primary-foreground">Save Games and Calculate Scores</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupGames;
