import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCachedOrFetchWeekMatches } from '../utils/nflApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

const NFLMatchups = ({ week }) => {
  const { data: matches, isLoading, error, refetch } = useQuery({
    queryKey: ['nflMatches', week],
    queryFn: () => getCachedOrFetchWeekMatches(week),
  });

  if (isLoading) return <div>Loading NFL matchups...</div>;
  if (error) return <div>Error loading NFL matchups: {error.message}</div>;

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">NFL Matchups - Week {week}</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
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