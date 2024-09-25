import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCumulativeScores } from '../integrations/supabase';

const Index = () => {
  const { data: cumulativeScores, isLoading, isError } = useCumulativeScores();

  const DashboardCard = ({ title, description, linkTo }) => (
    <Card className="bg-card hover:bg-secondary transition-colors duration-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Link to={linkTo}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Go to {title}</Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Football Pick 'Em League Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <DashboardCard
            title="View Standings"
            description="See weekly and cumulative standings"
            linkTo="/standings"
          />
        </div>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading scores...</p>
            ) : isError ? (
              <p className="text-center text-muted-foreground">Error loading scores. Please try again.</p>
            ) : cumulativeScores && cumulativeScores.length > 0 ? (
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
                      <TableRow key={score.name}>
                        <TableCell className="font-medium text-foreground">{index + 1}</TableCell>
                        <TableCell className="text-foreground">{score.name}</TableCell>
                        <TableCell className="text-right text-foreground">{score.score}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">No scores available. Import picks to see the leaderboard.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
