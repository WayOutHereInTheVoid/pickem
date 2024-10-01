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
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

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

  const getRankChangeIcon = (change) => {
    if (change > 0) return <ArrowUpIcon className="h-4 w-4 text-teal-500" />;
    if (change < 0) return <ArrowDownIcon className="h-4 w-4 text-primary" />;
    return <MinusIcon className="h-4 w-4 text-muted-foreground" />;
  };

  const StandingsTable = ({ data }) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-primary/20">
          <TableHead className="text-foreground font-bold">Rank</TableHead>
          <TableHead className="text-foreground font-bold">Team Name</TableHead>
          <TableHead className="text-right text-foreground font-bold">Score</TableHead>
          <TableHead className="text-right text-foreground font-bold">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry, index) => (
          <TableRow key={entry.name} className={index % 2 === 0 ? 'bg-secondary/50' : 'bg-secondary'}>
            <TableCell className="font-medium text-foreground">{entry.rank}</TableCell>
            <TableCell className="text-foreground font-semibold">{entry.name}</TableCell>
            <TableCell className="text-right text-foreground">{entry.score}</TableCell>
            <TableCell className="text-right">
              {getRankChangeIcon(entry.rankChange)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">2024 TRL Pick'em Standings</h1>
        <Card className="mb-6 bg-secondary">
          <CardHeader>
            <CardTitle className="text-foreground">Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-grow">
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
              </div>
              <Button onClick={handleExport} className="bg-primary text-primary-foreground">
                Export Week {selectedWeek} Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary mt-6">
          <CardHeader>
            <CardTitle className="text-foreground bg-primary/10 p-4 rounded-t-lg">League Standings - Week {selectedWeek}</CardTitle>
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