import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useResults, useParticipants, useWeeklyPicks, useGames } from '../integrations/supabase';

const Standings = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [standings, setStandings] = useState({
    weekly: [],
    cumulative: []
  });

  const { data: results } = useResults();
  const { data: participants } = useParticipants();
  const { data: weeklyPicks } = useWeeklyPicks();
  const { data: games } = useGames();

  useEffect(() => {
    if (results && participants && weeklyPicks && games) {
      const weeklyScores = calculateWeeklyScores(selectedWeek, weeklyPicks, games, participants);
      const cumulativeScores = calculateCumulativeScores(weeklyPicks, games, participants);

      setStandings({
        weekly: weeklyScores,
        cumulative: cumulativeScores
      });
    }
  }, [selectedWeek, results, participants, weeklyPicks, games]);

  const calculateWeeklyScores = (week, picks, games, participants) => {
    const weekPicks = picks.filter(pick => pick.week.toString() === week);
    const weekGames = games.filter(game => game.week.toString() === week);

    return participants.map(participant => {
      const participantPicks = weekPicks.filter(pick => pick.participant_id === participant.id);
      let score = 0;

      participantPicks.forEach(pick => {
        const game1 = weekGames.find(game => game.id === pick.game1_id);
        const game2 = weekGames.find(game => game.id === pick.game2_id);

        if (game1 && game1.winner_id === pick.game1_pick) score++;
        if (game2 && game2.winner_id === pick.game2_pick) score++;
        // Fantasy matchup scoring logic can be added here if needed
      });

      return { name: participant.name, score };
    }).sort((a, b) => b.score - a.score);
  };

  const calculateCumulativeScores = (picks, games, participants) => {
    return participants.map(participant => {
      const participantPicks = picks.filter(pick => pick.participant_id === participant.id);
      let totalScore = 0;

      participantPicks.forEach(pick => {
        const game1 = games.find(game => game.id === pick.game1_id);
        const game2 = games.find(game => game.id === pick.game2_id);

        if (game1 && game1.winner_id === pick.game1_pick) totalScore++;
        if (game2 && game2.winner_id === pick.game2_pick) totalScore++;
        // Fantasy matchup scoring logic can be added here if needed
      });

      return { name: participant.name, score: totalScore };
    }).sort((a, b) => b.score - a.score);
  };

  const StandingsTable = ({ data }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-foreground">Rank</TableHead>
          <TableHead className="text-foreground">Team Name</TableHead>
          <TableHead className="text-right text-foreground">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry, index) => (
          <TableRow key={entry.name}>
            <TableCell className="font-medium text-foreground">{index + 1}</TableCell>
            <TableCell className="text-foreground">{entry.name}</TableCell>
            <TableCell className="text-right text-foreground">{entry.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Standings</h1>
        <Card className="mb-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="week-select" className="text-foreground">Week</Label>
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
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">League Standings - Week {selectedWeek}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
              </TabsList>
              <TabsContent value="weekly">
                <StandingsTable data={standings.weekly} />
              </TabsContent>
              <TabsContent value="cumulative">
                <StandingsTable data={standings.cumulative} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Standings;
