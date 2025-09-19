import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGames, usePicks, useScores, useCumulativeScores } from '../integrations/supabase';
import { exportWeeklyData } from '../utils/exportWeeklyData';
import { toast } from "sonner";

const Standings = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [standings, setStandings] = useState({ weekly: [], cumulative: [] });

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

      // Calculate cumulative standings up to the selected week
      const cumulativeStandings = cumulativeScores
        .map(entry => ({
          ...entry,
          score: scores
            .filter(score => score.name === entry.name && score.week <= parseInt(selectedWeek))
            .reduce((sum, score) => sum + score.score, 0)
        }))
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setStandings({
        weekly: weeklyStandings,
        cumulative: cumulativeStandings
      });
    }
  }, [selectedWeek, games, picks, scores, cumulativeScores]);

  const handleExport = async () => {
    try {
      const htmlContent = await exportWeeklyData(parseInt(selectedWeek));
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `week_${selectedWeek}_results.html`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success(`Week ${selectedWeek} data exported successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    }
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
          <TableRow key={entry.name} className={index < 3 ? 'gradient-text font-bold' : ''}>
            <TableCell className="font-medium text-accent">{entry.rank}</TableCell>
            <TableCell className="text-foreground">{entry.name}</TableCell>
            <TableCell className="text-right text-foreground text-2xl font-bold">{entry.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">2025 TRL Pick'em Standings</h1>
        <Card className="mb-6 bg-background">
          <CardHeader>
            <CardTitle className="text-foreground">Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
                <Label htmlFor="week-select" className="text-foreground">Week</Label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger id="week-select" className="bg-secondary/10 text-foreground">
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
              <Button onClick={handleExport} className="bg-primary text-primary-foreground hover:bg-accent button-hover">
                Export Week {selectedWeek} Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background mt-6">
          <CardHeader>
            <CardTitle className="text-foreground">League Standings - Week {selectedWeek}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Weekly</TabsTrigger>
                <TabsTrigger value="cumulative" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Cumulative</TabsTrigger>
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