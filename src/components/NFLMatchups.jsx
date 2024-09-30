import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWeekMatches } from '../utils/nflApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NFLMatchups = ({ week }) => {
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['nflMatches', week],
    queryFn: () => fetchWeekMatches(week),
  });

  if (isLoading) return <div>Loading NFL matchups...</div>;
  if (error) return <div>Error loading NFL matchups: {error.message}</div>;

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">NFL Matchups - Week {week}</CardTitle>
      </CardHeader>
      <CardContent>
        {matches.map((match, index) => (
          <div key={index} className="mb-2 text-foreground">
            <span>{match.awayTeam.displayName}</span>
            <span> @ </span>
            <span>{match.homeTeam.displayName}</span>
            <span>: {match.state.score.current || 'Not started'}</span>
            <span> ({match.state.description})</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NFLMatchups;