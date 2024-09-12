import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const SubmitPicks = () => {
  // Mock data for games (in a real app, this would come from an API)
  const [games, setGames] = useState([
    { id: 1, homeTeam: 'Team A', awayTeam: 'Team B' },
    { id: 2, homeTeam: 'Team C', awayTeam: 'Team D' },
    { id: 3, homeTeam: 'Team E', awayTeam: 'Team F' },
  ]);

  const [picks, setPicks] = useState({});

  const handlePickChange = (gameId, pick) => {
    setPicks(prevPicks => ({
      ...prevPicks,
      [gameId]: pick
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted picks:', picks);
    // TODO: Implement API call to save picks
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit Picks</h1>
        <Card>
          <CardHeader>
            <CardTitle>Make Your Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {games.map((game) => (
                <div key={game.id} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Game {game.id}</h3>
                  <RadioGroup
                    onValueChange={(value) => handlePickChange(game.id, value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={game.homeTeam} id={`home-${game.id}`} />
                      <Label htmlFor={`home-${game.id}`}>{game.homeTeam}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={game.awayTeam} id={`away-${game.id}`} />
                      <Label htmlFor={`away-${game.id}`}>{game.awayTeam}</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
              <Button type="submit" className="w-full">Submit Picks</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmitPicks;