import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCumulativeScores } from '../integrations/supabase';

const Index = () => {
  const { data: cumulativeScores, isLoading, isError } = useCumulativeScores();

  const DashboardCard = ({ title, description, linkTo }) => (
    <Card className="bg-background hover:bg-secondary/10 transition-colors duration-200">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base text-secondary mb-4">{description}</p>
        <Link to={linkTo}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-accent button-hover">Go to {title}</Button>
        </Link>
      </CardContent>
    </Card>
  );

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
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-secondary">Loading scores...</p>
          ) : isError ? (
            <p className="text-center text-secondary">Error loading scores. Please try again.</p>
          ) : cumulativeScores && cumulativeScores.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Rank</TableHead>
                    <TableHead className="text-foreground">Team Name</TableHead>
                    <TableHead className="text-right text-foreground">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cumulativeScores
                    .sort((a, b) => b.score - a.score)
                    .map((score, index) => (
                      <TableRow key={score.name} className={index < 3 ? 'gradient-text font-bold' : ''}>
                        <TableCell className="font-medium text-accent">{index + 1}</TableCell>
                        <TableCell className="text-foreground">{score.name}</TableCell>
                        <TableCell className="text-right text-foreground">{score.score}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-secondary">No scores available. Import picks to see the leaderboard.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;