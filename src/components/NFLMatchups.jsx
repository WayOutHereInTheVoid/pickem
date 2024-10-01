import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const NFLMatchups = ({ matches }) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">NFL Matchups</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Away Team</TableHead>
              <TableHead className="text-foreground">Home Team</TableHead>
              <TableHead className="text-foreground">Score</TableHead>
              <TableHead className="text-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match, index) => {
              const homeTeam = match.homeTeam.displayName;
              const awayTeam = match.awayTeam.displayName;
              const score = match.state.score.current;
              const status = match.state.description;
              
              let displayScore;
              if (score) {
                const [awayScore, homeScore] = score.split('-');
                displayScore = `${homeScore} - ${awayScore}`;
              } else {
                displayScore = 'Not started';
              }

              return (
                <TableRow key={index}>
                  <TableCell className="text-foreground">{awayTeam}</TableCell>
                  <TableCell className="text-foreground">{homeTeam}</TableCell>
                  <TableCell className="text-foreground">{displayScore}</TableCell>
                  <TableCell className="text-foreground">{status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NFLMatchups;