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
        <CardTitle className="text-xl md:text-2xl font-semibold text-foreground font-oswald">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base text-secondary mb-4 font-source-sans">{description}</p>
        <Link to={linkTo}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-accent button-hover font-oswald">Go to {title}</Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-4xl font-bold text-foreground font-oswald">2024 TRL Pick'em Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        <DashboardCard
          title="View Standings"
          description="See weekly and cumulative standings"
          linkTo="/standings"
        />
      </div>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-foreground font-oswald">Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-secondary font-source-sans">Loading scores...</p>
          ) : isError ? (
            <p className="text-center text-secondary font-source-sans">Error loading scores. Please try again.</p>
          ) : cumulativeScores && cumulativeScores.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground font-oswald">Rank</TableHead>
                    <TableHead className="text-foreground font-oswald">Team Name</TableHead>
                    <TableHead className="text-right text-foreground font-oswald">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cumulativeScores
                    .sort((a, b) => b.score - a.score)
                    .map((score, index) => (
                      <TableRow key={score.name} className={index < 3 ? 'gradient-text font-bold' : ''}>
                        <TableCell className="font-medium text-accent font-oswald">{index + 1}</TableCell>
                        <TableCell className="text-foreground font-source-sans">{score.name}</TableCell>
                        <TableCell className="text-right text-foreground font-oswald">{score.score}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-secondary font-source-sans">No scores available. Import picks to see the leaderboard.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;