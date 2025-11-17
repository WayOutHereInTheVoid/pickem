import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGames, usePicks, useScores, useCumulativeScores } from '../integrations/supabase';
import { exportWeeklyData } from '../utils/exportWeeklyData';
import { calculateRanksWithTies, calculateRanksWithTiesAndDisplay } from '../utils/scoreCalculations';
import { getCompleteWeeklyScores, getCompleteCumulativeScores } from '../utils/participantUtils';
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { DownloadIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUp, ArrowDown, Minus } from 'lucide-react';

/**
 * A component that displays the change in rank.
 * @param {object} props - The props for the component.
 * @param {number|null} props.change - The change in rank.
 * @returns {JSX.Element} The rendered RankChange component.
 */
const RankChange = ({ change }) => {
  if (change === null || change === 0) {
    return <span className="flex items-center text-muted-foreground"><Minus className="h-4 w-4" /></span>;
  }
  if (change > 0) {
    return <span className="flex items-center text-green-500"><ArrowUp className="h-4 w-4 mr-1" /> {change}</span>;
  }
  return <span className="flex items-center text-red-500"><ArrowDown className="h-4 w-4 mr-1" /> {Math.abs(change)}</span>;
};

/**
 * A component that displays a table of standings.
 * @param {object} props - The props for the component.
 * @param {Array<object>} props.data - The data to display.
 * @param {boolean} props.isLoading - Whether the data is loading.
 * @returns {JSX.Element} The rendered StandingsTable component.
 */
const StandingsTable = ({ data, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() =>
    data.filter(entry =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        {[...Array(12)].map((_, i) => (
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
              <TableHead className="w-16 font-bold">Rank</TableHead>
              <TableHead className="w-24 font-bold">Change</TableHead>
              <TableHead className="font-bold">Team Name</TableHead>
              <TableHead className="text-right font-bold">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? filteredData.map((entry, index) => (
              <TableRow key={entry.name} className="even:bg-muted/30">
                <TableCell className="font-medium text-primary p-4">{entry.displayRank}</TableCell>
                <TableCell className="p-4"><RankChange change={entry.rankChange} /></TableCell>
                <TableCell className="p-4">{entry.name}</TableCell>
                <TableCell className="text-right font-bold text-lg p-4">{entry.score}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

/**
 * A page that displays the league standings.
 * @returns {JSX.Element} The rendered Standings page.
 */
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
    if (scores && cumulativeScores) {
      const currentWeek = parseInt(selectedWeek);

      const getRankings = (week) => {
        if (week < 1) return {};
        const completeWeekScores = getCompleteWeeklyScores(scores, week);
        const rankedScores = calculateRanksWithTies(completeWeekScores);
        const rankings = {};
        rankedScores.forEach(s => {
          rankings[s.name] = s.rank;
        });
        return rankings;
      };

      const prevWeekRankings = getRankings(currentWeek - 1);

      const completeWeekScores = getCompleteWeeklyScores(scores, currentWeek);
      // Calculate proper rankings with tie handling
      const rankedWeekScores = calculateRanksWithTiesAndDisplay(completeWeekScores);
      const weeklyStandings = rankedWeekScores.map((entry) => {
        const prevRank = prevWeekRankings[entry.name];
        const rankChange = prevRank ? prevRank - entry.rank : null;
        return { ...entry, rankChange };
      });

      // Calculate proper rankings for cumulative scores with tie handling
      const completeCumulativeScores = getCompleteCumulativeScores(cumulativeScores);
      const rankedCumulativeScores = calculateRanksWithTiesAndDisplay(completeCumulativeScores);
      const cumulativeStandings = rankedCumulativeScores.map((entry) => ({
        ...entry,
        rankChange: null // No rank change calculation for cumulative view
      }));

      setStandings({ weekly: weeklyStandings, cumulative: cumulativeStandings });
    }
  }, [selectedWeek, scores, cumulativeScores]);

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
              <SelectTrigger className="w-full md:w-[180px] text-base py-6">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(18)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()} className="text-base">
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

      <Separator />

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-lg p-1">
          <TabsTrigger value="weekly" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md">Weekly</TabsTrigger>
          <TabsTrigger value="cumulative" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md">Cumulative</TabsTrigger>
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