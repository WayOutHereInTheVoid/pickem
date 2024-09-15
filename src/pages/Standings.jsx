import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from '../lib/supabase';

const Standings = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [standings, setStandings] = useState({
    weekly: [],
    cumulative: []
  });

  useEffect(() => {
    const fetchStandings = async () => {
      // Fetch weekly scores
      const { data: weeklyScores, error: weeklyError } = await supabase
        .from('weekly_scores')
        .select('*')
        .eq('week', selectedWeek)
        .order('score', { ascending: false });

      if (weeklyError) {
        console.error('Error fetching weekly scores:', weeklyError);
        toast.error('Failed to fetch weekly scores');
        return;
      }

      // Fetch cumulative scores
      const { data: cumulativeScores, error: cumulativeError } = await supabase
        .from('cumulative_scores')
        .select('*')
        .order('score', { ascending: false });

      if (cumulativeError) {
        console.error('Error fetching cumulative scores:', cumulativeError);
        toast.error('Failed to fetch cumulative scores');
        return;
      }

      setStandings({
        weekly: weeklyScores.map((entry, index) => ({ ...entry, rank: index + 1 })),
        cumulative: cumulativeScores.map((entry, index) => ({ ...entry, rank: index + 1 }))
      });
    };

    fetchStandings();
  }, [selectedWeek]);

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
      </div>
    </div>
  );
};

export default Standings;
