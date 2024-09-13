import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SetupGames = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [games, setGames] = useState([
    { id: 1, homeTeam: '', awayTeam: '' },
    { id: 2, homeTeam: '', awayTeam: '' },
    { id: 3, homeTeam: '', awayTeam: '' },
  ]);
  const [submittedGames, setSubmittedGames] = useState([]);

  const handleInputChange = (id, team, value) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, [team]: value } : game
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const gamesWithWeek = games.map(game => ({ ...game, week: selectedWeek }));
    setSubmittedGames(gamesWithWeek);
    console.log('Submitted games:', gamesWithWeek);
    // TODO: Implement API call to save games
    localStorage.setItem(`week${selectedWeek}Games`, JSON.stringify(gamesWithWeek));
    toast.success(`Games for Week ${selectedWeek} submitted successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Set Up Games</h1>
        <Card className="mb-6">
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
              {games.map((game, index) => (
                <div key={game.id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Game {index + 1}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`home-team-${game.id}`}>Home Team</Label>
                      <Input
                        id={`home-team-${game.id}`}
                        value={game.homeTeam}
                        onChange={(e) => handleInputChange(game.id, 'homeTeam', e.target.value)}
                        placeholder="Enter home team"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`away-team-${game.id}`}>Away Team</Label>
                      <Input
                        id={`away-team-${game.id}`}
                        value={game.awayTeam}
                        onChange={(e) => handleInputChange(game.id, 'awayTeam', e.target.value)}
                        placeholder="Enter away team"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="submit" className="w-full">Save Games</Button>
            </form>
          </CardContent>
        </Card>

        {submittedGames.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Submitted Games for Week {selectedWeek}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {submittedGames.map((game, index) => (
                  <li key={game.id} className="mb-2">
                    Game {index + 1}: {game.homeTeam} vs {game.awayTeam}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SetupGames;