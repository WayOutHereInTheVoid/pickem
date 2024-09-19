import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useGames, usePicks, useScores, useCumulativeScores } from '../integrations/supabase';

const Standings = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [standings, setStandings] = useState({ weekly: [], cumulative: [] });
  const [weeklyData, setWeeklyData] = useState([]);
  const [seasonTrendData, setSeasonTrendData] = useState([]);

  const { data: games } = useGames();
  const { data: picks } = usePicks();
  const { data: scores } = useScores();
  const { data: cumulativeScores } = useCumulativeScores();

  useEffect(() => {
    if (games && picks && scores && cumulativeScores) {
      const weekScores = scores.filter(score => score.week === parseInt(selectedWeek));

      // Calculate weekly standings
      const weeklyStandings = weekScores
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      // Calculate cumulative standings
      const cumulativeStandings = cumulativeScores
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setStandings({
        weekly: weeklyStandings,
        cumulative: cumulativeStandings
      });

      setWeeklyData(weeklyStandings);
      setSeasonTrendData(cumulativeStandings);
    }
  }, [selectedWeek, games, picks, scores, cumulativeScores]);

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
        {data.map((entry) => (
          <TableRow key={entry.name}>
            <TableCell className="font-medium text-foreground">{entry.rank}</TableCell>
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
        <Card className="mt-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Scores Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#7ee787" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="mt-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Season Score Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={seasonTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#7ee787" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Standings;
