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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground">Away</TableHead>
                <TableHead className="text-foreground">Home</TableHead>
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
                    <TableCell className="text-foreground text-sm">{awayTeam}</TableCell>
                    <TableCell className="text-foreground text-sm">{homeTeam}</TableCell>
                    <TableCell className="text-foreground text-sm">{displayScore}</TableCell>
                    <TableCell className="text-foreground text-sm">{status}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFLMatchups;