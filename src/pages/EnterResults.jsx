import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const EnterResults = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [games, setGames] = useState([]);

  useEffect(() => {
    const storedGames = localStorage.getItem(`week${selectedWeek}Games`);
    if (storedGames) {
      const parsedGames = JSON.parse(storedGames);
      setGames(parsedGames.map(game => ({ ...game, homeScore: '', awayScore: '' })));
    } else {
      setGames([]);
    }
  }, [selectedWeek]);

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
            {games.length > 0 ? (
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
            ) : (
              <p>No games found for Week {selectedWeek}. Please set up games first.</p>
            )}
            {games.length > 0 && (
              <Button onClick={calculateScores} className="w-full mt-4">
                Calculate Scores
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnterResults;