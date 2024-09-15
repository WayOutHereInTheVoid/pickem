import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from 'react-router-dom';

const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("1");

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

  const handleInputChange = (e) => {
    setPollResults(e.target.value);
  };

  const parsePollResults = () => {
    const lines = pollResults.split('\n');
    const picks = [];
    let currentTeam = '';

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('"') && line.endsWith('"')) {
        currentTeam = line.replace(/"/g, '');
      } else if (line && currentTeam && !line.includes('vs')) {
        picks.push({ name: teamNameMapping[line] || line, pick: currentTeam });
      }
    });

    setParsedPicks(picks);
    console.log('Parsed picks:', picks);
    toast.success(`Successfully parsed ${picks.length} picks`);
  };

  const savePicks = () => {
    localStorage.setItem(`week${selectedWeek}Picks`, JSON.stringify(parsedPicks));
    toast.success("Picks saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Import Picks</h1>
        <Card className="mb-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Select Week</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[180px] bg-secondary text-foreground">
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
        <Card className="mb-6 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Paste Poll Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste poll results here..."
              value={pollResults}
              onChange={handleInputChange}
              rows={10}
              className="mb-4 bg-secondary text-foreground"
            />
            <Button onClick={parsePollResults} className="w-full bg-primary text-primary-foreground">
              Parse Picks
            </Button>
          </CardContent>
        </Card>
        
        {parsedPicks.length > 0 && (
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Parsed Picks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Team Name</TableHead>
                    <TableHead className="text-foreground">Pick</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedPicks.map((pick, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-foreground">{pick.name}</TableCell>
                      <TableCell className="text-foreground">{pick.pick}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between mt-4">
                <Button onClick={savePicks} className="bg-primary text-primary-foreground">
                  Save Picks
                </Button>
                <Link to={`/edit-picks/${selectedWeek}`}>
                  <Button className="bg-secondary text-secondary-foreground">
                    Edit Picks
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImportPicks;
