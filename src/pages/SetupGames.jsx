import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { calculateWeeklyScores, calculateCumulativeScores } from '../utils/scoreCalculations';

const GameInput = ({ game, onInputChange, onWinnerChange }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">Game {game.id}</h3>
    <div className="grid grid-cols-2 gap-4 mb-2">
      <div>
        <Label htmlFor={`home-team-${game.id}`}>Home Team</Label>
        <Input
          id={`home-team-${game.id}`}
          value={game.homeTeam}
          onChange={(e) => onInputChange(game.id, 'homeTeam', e.target.value)}
          placeholder="Enter home team"
          required
        />
      </div>
      <div>
        <Label htmlFor={`away-team-${game.id}`}>Away Team</Label>
        <Input
          id={`away-team-${game.id}`}
          value={game.awayTeam}
          onChange={(e) => onInputChange(game.id, 'awayTeam', e.target.value)}
          placeholder="Enter away team"
          required
        />
      </div>
    </div>
    <RadioGroup
      onValueChange={(value) => onWinnerChange(game.id, value)}
      value={game.winner}
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
    { id: 1, homeTeam: '', awayTeam: '', winner: null },
    { id: 2, homeTeam: '', awayTeam: '', winner: null },
    { id: 3, homeTeam: '', awayTeam: '', winner: null },
  ]);

  useEffect(() => {
    const storedGames = localStorage.getItem(`week${selectedWeek}Games`);
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    } else {
      setGames([
        { id: 1, homeTeam: '', awayTeam: '', winner: null },
        { id: 2, homeTeam: '', awayTeam: '', winner: null },
        { id: 3, homeTeam: '', awayTeam: '', winner: null },
      ]);
    }
  }, [selectedWeek]);

  const handleInputChange = (id, team, value) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, [team]: value } : game
    ));
  };

  const handleWinnerChange = (id, winner) => {
    setGames(games.map(game =>
      game.id === id ? { ...game, winner } : game
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`week${selectedWeek}Games`, JSON.stringify(games));
    
    // Calculate scores
    const picks = JSON.parse(localStorage.getItem(`week${selectedWeek}Picks`) || '[]');
    const results = games.map(game => ({
      id: game.id,
      winner: game.winner === 'home' ? game.homeTeam : game.awayTeam
    }));
    const weekScores = calculateWeeklyScores(games, picks, results);
    
    localStorage.setItem(`week${selectedWeek}Scores`, JSON.stringify(weekScores));
    
    // Update cumulative scores
    const allWeeklyScores = [];
    for (let i = 1; i <= parseInt(selectedWeek); i++) {
      const weekScores = JSON.parse(localStorage.getItem(`week${i}Scores`) || '[]');
      allWeeklyScores.push(weekScores);
    }
    const cumulativeScores = calculateCumulativeScores(allWeeklyScores);
    localStorage.setItem(`cumulativeScores`, JSON.stringify(cumulativeScores));

    toast.success(`Games and scores for Week ${selectedWeek} submitted successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Set Up Games</h1>
        <Card>
          <CardHeader>
            <CardTitle>Input This Week's Matchups</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="week-select">Select Week</Label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger id="week-select">
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
              <Button type="submit" className="w-full">Save Games and Calculate Scores</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupGames;
