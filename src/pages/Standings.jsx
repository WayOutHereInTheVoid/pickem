import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const Standings = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [standings, setStandings] = useState({
    weekly: [],
    cumulative: []
  });

  useEffect(() => {
    const fetchStandings = () => {
      const weeklyScores = JSON.parse(localStorage.getItem(`week${selectedWeek}Scores`) || '[]');
      const cumulativeScores = JSON.parse(localStorage.getItem('cumulativeScores') || '[]');

      setStandings({
        weekly: weeklyScores
          .map(entry => ({
            ...entry,
            name: teamNameMapping[entry.name] || entry.name
          }))
          .sort((a, b) => b.score - a.score)
          .map((entry, index) => ({ ...entry, rank: index + 1 })),
        cumulative: cumulativeScores
          .map(entry => ({
            ...entry,
            name: teamNameMapping[entry.name] || entry.name
          }))
          .sort((a, b) => b.score - a.score)
          .map((entry, index) => ({ ...entry, rank: index + 1 }))
      });
    };

    fetchStandings();
  }, [selectedWeek]);

  const StandingsTable = ({ data }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Team Name</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((entry) => (
          <TableRow key={entry.name}>
            <TableCell className="font-medium">{entry.rank}</TableCell>
            <TableCell>{entry.name}</TableCell>
            <TableCell className="text-right">{entry.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Standings</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="week-select">Week</Label>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>League Standings - Week {selectedWeek}</CardTitle>
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
