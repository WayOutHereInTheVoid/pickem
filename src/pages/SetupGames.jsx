import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const GameInput = ({ game, onInputChange }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2">Game {game.id}</h3>
    <div className="grid grid-cols-2 gap-4">
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
  </div>
);

const SetupGames = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [games, setGames] = useState([
    { id: 1, homeTeam: '', awayTeam: '' },
    { id: 2, homeTeam: '', awayTeam: '' },
    { id: 3, homeTeam: '', awayTeam: '' },
  ]);

  useEffect(() => {
    const storedGames = localStorage.getItem(`week${selectedWeek}Games`);
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    } else {
      setGames([
        { id: 1, homeTeam: '', awayTeam: '' },
        { id: 2, homeTeam: '', awayTeam: '' },
        { id: 3, homeTeam: '', awayTeam: '' },
      ]);
    }
  }, [selectedWeek]);

  const handleInputChange = (id, team, value) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, [team]: value } : game
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`week${selectedWeek}Games`, JSON.stringify(games));
    toast.success(`Games for Week ${selectedWeek} submitted successfully!`);
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
                <GameInput key={game.id} game={game} onInputChange={handleInputChange} />
              ))}
              <Button type="submit" className="w-full">Save Games</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupGames;
