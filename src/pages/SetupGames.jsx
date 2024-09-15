import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useGames, useAddGame, useUpdateGame } from '../integrations/supabase';
import { useNflTeams } from '../integrations/supabase';

const GameInput = ({ game, onInputChange, onWinnerChange, nflTeams }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2 text-foreground">Game {game.id}</h3>
    <div className="grid grid-cols-2 gap-4 mb-2">
      <div>
        <Label htmlFor={`home-team-${game.id}`} className="text-foreground">Home Team</Label>
        <Select value={game.home_team_id} onValueChange={(value) => onInputChange(game.id, 'home_team_id', value)}>
          <SelectTrigger id={`home-team-${game.id}`} className="bg-secondary text-foreground">
            <SelectValue placeholder="Select home team" />
          </SelectTrigger>
          <SelectContent>
            {nflTeams.map((team) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor={`away-team-${game.id}`} className="text-foreground">Away Team</Label>
        <Select value={game.away_team_id} onValueChange={(value) => onInputChange(game.id, 'away_team_id', value)}>
          <SelectTrigger id={`away-team-${game.id}`} className="bg-secondary text-foreground">
            <SelectValue placeholder="Select away team" />
          </SelectTrigger>
          <SelectContent>
            {nflTeams.map((team) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
    <RadioGroup
      onValueChange={(value) => onWinnerChange(game.id, value)}
      value={game.winner_id}
      className="text-foreground"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={game.home_team_id} id={`home-win-${game.id}`} />
        <Label htmlFor={`home-win-${game.id}`}>Home Team Wins</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value={game.away_team_id} id={`away-win-${game.id}`} />
        <Label htmlFor={`away-win-${game.id}`}>Away Team Wins</Label>
      </div>
    </RadioGroup>
  </div>
);

const SetupGames = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [games, setGames] = useState([]);
  const { data: nflTeams } = useNflTeams();
  const { data: existingGames, refetch: refetchGames } = useGames();
  const addGame = useAddGame();
  const updateGame = useUpdateGame();

  useEffect(() => {
    if (existingGames) {
      const weekGames = existingGames.filter(game => game.week === selectedWeek);
      if (weekGames.length > 0) {
        setGames(weekGames);
      } else {
        setGames([
          { id: 1, week: selectedWeek, home_team_id: '', away_team_id: '', winner_id: null, game_date: new Date().toISOString().split('T')[0] },
          { id: 2, week: selectedWeek, home_team_id: '', away_team_id: '', winner_id: null, game_date: new Date().toISOString().split('T')[0] },
          { id: 3, week: selectedWeek, home_team_id: '', away_team_id: '', winner_id: null, game_date: new Date().toISOString().split('T')[0] },
        ]);
      }
    }
  }, [selectedWeek, existingGames]);

  const handleInputChange = (id, field, value) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, [field]: value } : game
    ));
  };

  const handleWinnerChange = (id, winnerId) => {
    setGames(games.map(game =>
      game.id === id ? { ...game, winner_id: winnerId } : game
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const game of games) {
      if (game.id.toString().startsWith('new')) {
        await addGame.mutateAsync(game);
      } else {
        await updateGame.mutateAsync({ id: game.id, ...game });
      }
    }
    await refetchGames();
    toast.success(`Games for Week ${selectedWeek} submitted successfully!`);
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
                <Select value={selectedWeek.toString()} onValueChange={(value) => setSelectedWeek(parseInt(value))}>
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
                  nflTeams={nflTeams || []}
                />
              ))}
              <Button type="submit" className="w-full bg-primary text-primary-foreground">Save Games</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupGames;
