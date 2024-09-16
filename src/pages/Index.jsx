import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { exportResultsToCSV } from '../utils/exportResults';

const Index = () => {
  const [cumulativeScores, setCumulativeScores] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("1");

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem('cumulativeScores') || '[]');
    setCumulativeScores(scores.sort((a, b) => b.score - a.score).slice(0, 5));
  }, []);

  const DashboardCard = ({ title, description, linkTo }) => {
    return (
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
  };

  const handleExport = async () => {
    try {
      const csvContent = await exportResultsToCSV(selectedWeek);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `NFL_Week_${selectedWeek}_Results.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success("Export completed successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Football Pick 'Em League Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DashboardCard
            title="Set Up Games"
            description="Input this week's matchups and results"
            linkTo="/setup-games"
          />
          <DashboardCard
            title="Import Picks"
            description="Import picks from poll results"
            linkTo="/import-picks"
          />
          <DashboardCard
            title="View Standings"
            description="See weekly and cumulative standings"
            linkTo="/standings"
          />
        </div>
        <Card className="bg-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Export Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="w-[180px] bg-secondary text-foreground">
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(16)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Week {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleExport} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Export Results
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {cumulativeScores.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Rank</TableHead>
                    <TableHead className="text-foreground">Team Name</TableHead>
                    <TableHead className="text-right text-foreground">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cumulativeScores.map((score, index) => (
                    <TableRow key={score.name}>
                      <TableCell className="font-medium text-foreground">{index + 1}</TableCell>
                      <TableCell className="text-foreground">{score.name}</TableCell>
                      <TableCell className="text-right text-foreground">{score.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground">No scores available. Import picks and set up games to see the leaderboard.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
