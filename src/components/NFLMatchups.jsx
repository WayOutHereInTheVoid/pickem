import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NFLMatchups = ({ matches }) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">NFL Matchups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
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
              <div key={index} className="bg-secondary p-3 rounded-lg text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{awayTeam}</span>
                  <span className="text-xs text-muted-foreground">@</span>
                  <span className="font-semibold">{homeTeam}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary">{displayScore}</span>
                  <span className="text-xs text-muted-foreground">{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NFLMatchups;