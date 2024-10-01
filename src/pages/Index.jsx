import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCumulativeScores } from '../integrations/supabase';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

const Index = () => {
  const { data: cumulativeScores, isLoading, isError } = useCumulativeScores();

  const DashboardCard = ({ title, description, linkTo }) => (
    <Card className="bg-secondary hover:bg-secondary/90 transition-colors duration-200">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base text-muted-foreground mb-4">{description}</p>
        <Link to={linkTo}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Go to {title}</Button>
        </Link>
      </CardContent>
    </Card>
  );

  const getRankChangeIcon = (change) => {
    if (change > 0) return <ArrowUpIcon className="h-4 w-4 text-accent" />;
    if (change < 0) return <ArrowDownIcon className="h-4 w-4 text-primary" />;
    return <MinusIcon className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-4xl font-bold text-foreground">2024 TRL Pick'em Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        <DashboardCard
          title="View Standings"
          description="See weekly and cumulative standings"
          linkTo="/standings"
        />
      </div>
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-foreground bg-primary/10 p-4 rounded-t-lg">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading scores...</p>
          ) : isError ? (
            <p className="text-center text-muted-foreground">Error loading scores. Please try again.</p>
          ) : cumulativeScores && cumulativeScores.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/20">
                    <TableHead className="text-foreground font-bold">Rank</TableHead>
                    <TableHead className="text-foreground font-bold">Team Name</TableHead>
                    <TableHead className="text-right text-foreground font-bold">Score</TableHead>
                    <TableHead className="text-right text-foreground font-bold">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cumulativeScores
                    .sort((a, b) => b.score - a.score)
                    .map((score, index) => (
                      <TableRow key={score.name} className={index % 2 === 0 ? 'bg-secondary/50' : 'bg-secondary'}>
                        <TableCell className="font-medium text-foreground">{index + 1}</TableCell>
                        <TableCell className="text-foreground font-semibold">{score.name}</TableCell>
                        <TableCell className="text-right text-foreground">{score.score}</TableCell>
                        <TableCell className="text-right">
                          {getRankChangeIcon(score.rankChange)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No scores available. Import picks to see the leaderboard.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;