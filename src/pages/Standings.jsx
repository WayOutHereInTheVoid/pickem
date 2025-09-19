import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGames, usePicks, useScores, useCumulativeScores } from '../integrations/supabase';
import { exportWeeklyData } from '../utils/exportWeeklyData';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { DownloadIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const StandingsTable = ({ data, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = useMemo(() =>
    data.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]);

  const paginatedData = useMemo(() =>
    filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredData, currentPage]
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(itemsPerPage)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by team name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Rank</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? paginatedData.map((entry, index) => (
              <TableRow key={entry.name} className={entry.rank === 1 ? 'bg-primary/10' : ''}>
                <TableCell className="font-medium text-primary">{entry.rank}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell className="text-right font-bold text-lg">{entry.score}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      {totalPages > 1 && (
        <div className="flex justify-end items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}
    </div>
  );
};

const Standings = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [standings, setStandings] = useState({ weekly: [], cumulative: [] });
  const [isExporting, setIsExporting] = useState(false);

  const { data: games, isLoading: gamesLoading } = useGames();
  const { data: picks, isLoading: picksLoading } = usePicks();
  const { data: scores, isLoading: scoresLoading } = useScores();
  const { data: cumulativeScores, isLoading: cumulativeLoading } = useCumulativeScores();

  const isLoading = gamesLoading || picksLoading || scoresLoading || cumulativeLoading;

  useEffect(() => {
    if (games && picks && scores && cumulativeScores) {
      const weekScores = scores.filter(score => score.week === parseInt(selectedWeek));
      const weeklyStandings = weekScores
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      const cumulativeStandings = cumulativeScores
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      setStandings({ weekly: weeklyStandings, cumulative: cumulativeStandings });
    }
  }, [selectedWeek, games, picks, scores, cumulativeScores]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const htmlContent = await exportWeeklyData(parseInt(selectedWeek));
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `week_${selectedWeek}_results.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Week ${selectedWeek} data exported successfully!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold gradient-text">League Standings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Week Selection & Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-center">
          <div className="grid gap-2 w-full md:w-auto">
            <Select value={selectedWeek} onValueChange={setSelectedWeek} disabled={isLoading}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(18)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    Week {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport} disabled={isExporting || isLoading} className="w-full md:w-auto">
            <DownloadIcon className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : `Export Week ${selectedWeek} Data`}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <StandingsTable data={standings.weekly} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="cumulative">
          <StandingsTable data={standings.cumulative} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Standings;