import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCumulativeScores } from '../integrations/supabase';
import { TrophyIcon, BarChartIcon, ArrowRightIcon, AlertTriangleIcon, UserPlus, Send } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DashboardCard = ({ title, description, linkTo, icon: Icon }) => (
  <Card className="bg-card border border-border hover:border-primary transition-all duration-300 group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Link to={linkTo}>
        <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Go to {title}
          <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const LeaderboardSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-6 flex-grow" />
        <Skeleton className="h-6 w-12" />
      </div>
    ))}
  </div>
);

const Index = () => {
  const { data: cumulativeScores, isLoading, isError, refetch } = useCumulativeScores();

  const getRankClass = (rank) => {
    if (rank === 1) return 'bg-yellow-400/20';
    if (rank === 2) return 'bg-gray-400/20';
    if (rank === 3) return 'bg-yellow-600/20';
    return '';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the 2025 TRL Pick'em League</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="View Standings"
          description="See weekly and cumulative standings"
          linkTo="/standings"
          icon={BarChartIcon}
        />
        <DashboardCard
          title="Submit Picks"
          description="Submit your weekly picks"
          linkTo="/submit-picks"
          icon={Send}
        />
        <DashboardCard
          title="Manager Page"
          description="Access manager-specific functions"
          linkTo="/manager"
          icon={UserPlus}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <TrophyIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Leaderboard</CardTitle>
          </div>
          <Link to="/standings">
            <Button variant="ghost" size="sm">
              View all
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : isError ? (
            <div className="text-center py-8">
              <AlertTriangleIcon className="mx-auto h-12 w-12 text-destructive" />
              <h3 className="mt-2 text-lg font-medium text-destructive">Failed to load scores</h3>
              <p className="mt-1 text-sm text-muted-foreground">There was an error fetching the leaderboard data.</p>
              <Button onClick={refetch} className="mt-4">Try again</Button>
            </div>
          ) : cumulativeScores && cumulativeScores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cumulativeScores
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 5)
                  .map((score, index) => (
                    <TableRow key={score.name} className={getRankClass(index + 1)}>
                      <TableCell className="font-bold text-lg text-primary">{index + 1}</TableCell>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{score.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{score.name}</span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-xl">{score.score}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No scores available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;