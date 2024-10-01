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
            
            let homeScore = 'N/A';
            let awayScore = 'N/A';
            if (score) {
              [homeScore, awayScore] = score.split('-');
            }

            return (
              <div key={index} className="bg-secondary p-3 rounded-lg text-sm">
                <div className="grid grid-cols-3 items-center mb-2">
                  <div className="text-center">
                    <span className="font-semibold">{awayTeam}</span>
                    <div className="text-primary mt-1">{awayScore}</div>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">@</span>
                  <div className="text-center">
                    <span className="font-semibold">{homeTeam}</span>
                    <div className="text-primary mt-1">{homeScore}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">{status}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NFLMatchups;
