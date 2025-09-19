import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCumulativeScores } from '../integrations/supabase';
import { TrophyIcon, BarChartIcon, ArrowRightIcon } from 'lucide-react';

const Index = () => {
  const { data: cumulativeScores, isLoading, isError } = useCumulativeScores();

  const DashboardCard = ({ title, description, linkTo, icon: Icon }) => (
    <Card className="bg-gradient-subtle hover:bg-secondary/10 transition-all duration-300 shadow-md hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl md:text-2xl font-semibold text-foreground font-oswald">{title}</CardTitle>
        <Icon className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-sm md:text-base text-muted-foreground mb-4 font-source-sans">{description}</p>
        <Link to={linkTo}>
          <Button className="w-full bg-gradient-to-r from-primary to-primary-light text-primary-foreground hover:from-primary-light hover:to-primary button-hover font-oswald group">
            Go to {title}
            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6 md:p-10">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground font-oswald mb-8 gradient-text">2025 TRL Pick'em Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="View Standings"
          description="See weekly and cumulative standings"
          linkTo="/standings"
          icon={BarChartIcon}
        />
        {/* Add more cards here as needed */}
      </div>
      <Card className="bg-gradient-subtle mt-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl md:text-3xl font-semibold text-foreground font-oswald">Leaderboard</CardTitle>
          <TrophyIcon className="h-8 w-8 text-primary" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground font-source-sans">Loading scores...</p>
          ) : isError ? (
            <p className="text-center text-muted-foreground font-source-sans">Error loading scores. Please try again.</p>
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
                    .slice(0, 5) // Show only top 5
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
            <p className="text-center text-muted-foreground font-source-sans">No scores available. Import picks to see the leaderboard.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;