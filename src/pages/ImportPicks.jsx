import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);

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
    const currentWeek = localStorage.getItem('currentWeek') || '1';
    localStorage.setItem(`week${currentWeek}Picks`, JSON.stringify(parsedPicks));
    toast.success("Picks saved successfully!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Import Picks</h1>
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
              <Button onClick={savePicks} className="w-full mt-4 bg-primary text-primary-foreground">
                Save Picks
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ImportPicks;
