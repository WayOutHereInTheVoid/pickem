import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { calculateWeeklyScores, calculateCumulativeScores } from '../utils/scoreCalculations';

const EnterResults = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [games, setGames] = useState([]);
  const [weeklyScores, setWeeklyScores] = useState([]);
  const [cumulativeScores, setCumulativeScores] = useState([]);

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
    const results = games.map(game => ({
      id: game.id,
      homeScore: parseInt(game.homeScore),
      awayScore: parseInt(game.awayScore)
    }));

    const picks = JSON.parse(localStorage.getItem(`week${selectedWeek}Picks`) || '[]');
    const weekScores = calculateWeeklyScores(games, picks, results);
    const mappedWeekScores = weekScores.map(score => ({
      ...score,
      name: teamNameMapping[score.name] || score.name
    }));
    setWeeklyScores(mappedWeekScores);

    // Calculate cumulative scores
    const allWeeklyScores = [];
    for (let i = 1; i <= parseInt(selectedWeek); i++) {
      const weekScores = JSON.parse(localStorage.getItem(`week${i}Scores`) || '[]');
      allWeeklyScores.push(weekScores);
    }
    allWeeklyScores[parseInt(selectedWeek) - 1] = weekScores;
    const cumulativeScores = calculateCumulativeScores(allWeeklyScores);
    const mappedCumulativeScores = cumulativeScores.map(score => ({
      ...score,
      name: teamNameMapping[score.name] || score.name
    }));
    setCumulativeScores(mappedCumulativeScores);

    // Save weekly scores to localStorage
    localStorage.setItem(`week${selectedWeek}Scores`, JSON.stringify(weekScores));
    localStorage.setItem(`cumulativeScores`, JSON.stringify(cumulativeScores));

    toast.success("Scores calculated and saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Enter Results</h1>
        <Card className="mb-6">
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
                          onChange={(e) => handleScoreChange(game.id, 'homeScore', e.target.value)}
                          placeholder="Home Score"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={game.awayScore}
                          onChange={(e) => handleScoreChange(game.id, 'awayScore', e.target.value)}
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

        {weeklyScores.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Weekly Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyScores.map((score, index) => (
                    <TableRow key={index}>
                      <TableCell>{score.name}</TableCell>
                      <TableCell>{score.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {cumulativeScores.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Cumulative Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cumulativeScores.map((score, index) => (
                    <TableRow key={index}>
                      <TableCell>{score.name}</TableCell>
                      <TableCell>{score.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnterResults;
