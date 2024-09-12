import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const EnterResults = () => {
  const [games, setGames] = useState([
    { id: 1, homeTeam: 'Team A', awayTeam: 'Team B', homeScore: '', awayScore: '' },
    { id: 2, homeTeam: 'Team C', awayTeam: 'Team D', homeScore: '', awayScore: '' },
    { id: 3, homeTeam: 'Team E', awayTeam: 'Team F', homeScore: '', awayScore: '' },
  ]);

  const handleScoreChange = (id, team, value) => {
    setGames(games.map(game =>
      game.id === id ? { ...game, [`${team}Score`]: value } : game
    ));
  };

  const calculateScores = () => {
    // TODO: Implement score calculation logic
    console.log('Calculating scores for:', games);
    toast.success("Scores calculated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Enter Results</h1>
        <Card>
          <CardHeader>
            <CardTitle>Input Game Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Home Team</TableHead>
                  <TableHead>Away Team</TableHead>
                  <TableHead>Home Score</TableHead>
                  <TableHead>Away Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.homeTeam}</TableCell>
                    <TableCell>{game.awayTeam}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={game.homeScore}
                        onChange={(e) => handleScoreChange(game.id, 'home', e.target.value)}
                        placeholder="Home Score"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={game.awayScore}
                        onChange={(e) => handleScoreChange(game.id, 'away', e.target.value)}
                        placeholder="Away Score"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={calculateScores} className="w-full mt-4">
              Calculate Scores
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterResults;