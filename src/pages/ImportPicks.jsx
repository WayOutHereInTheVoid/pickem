import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAddWeeklyPick, useParticipants, useGames, useFantasyMatchups } from '../integrations/supabase';

const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("1");
  const { data: participants } = useParticipants();
  const { data: games } = useGames();
  const { data: fantasyMatchups } = useFantasyMatchups();
  const addWeeklyPick = useAddWeeklyPick();

  const handleInputChange = (e) => {
    setPollResults(e.target.value);
  };

  const parsePollResults = () => {
    const lines = pollResults.split('\n');
    const picks = [];
    let currentGame = null;

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('"') && line.endsWith('"')) {
        currentGame = line.replace(/"/g, '');
      } else if (line && currentGame) {
        const participant = participants?.find(p => p.name === line);
        if (participant) {
          picks.push({ name: participant.name, pick: currentGame, participant_id: participant.id });
        }
      }
    });

    setParsedPicks(picks);
    console.log('Parsed picks:', picks);
    toast.success(`Successfully parsed ${picks.length} picks`);
  };

  const savePicks = async () => {
    const weekGames = games?.filter(game => game.week.toString() === selectedWeek);
    const weekFantasyMatchup = fantasyMatchups?.find(matchup => matchup.week.toString() === selectedWeek);

    if (!weekGames || weekGames.length === 0 || !weekFantasyMatchup) {
      toast.error("No games or fantasy matchup found for the selected week");
      return;
    }

    for (const pick of parsedPicks) {
      const weeklyPick = {
        participant_id: pick.participant_id,
        week: parseInt(selectedWeek),
        game1_id: weekGames[0]?.id,
        game1_pick: weekGames[0]?.home_team_id === pick.pick ? weekGames[0]?.home_team_id : weekGames[0]?.away_team_id,
        game2_id: weekGames[1]?.id,
        game2_pick: weekGames[1]?.home_team_id === pick.pick ? weekGames[1]?.home_team_id : weekGames[1]?.away_team_id,
        fantasy_matchup_id: weekFantasyMatchup.id,
        fantasy_matchup_pick: weekFantasyMatchup.team1_id === pick.participant_id ? weekFantasyMatchup.team1_id : weekFantasyMatchup.team2_id,
      };

      try {
        await addWeeklyPick.mutateAsync(weeklyPick);
      } catch (error) {
        console.error('Error saving pick:', error);
        toast.error(`Failed to save pick for ${pick.name}`);
      }
    }
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
            <div className="mb-4">
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="bg-secondary text-foreground">
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
