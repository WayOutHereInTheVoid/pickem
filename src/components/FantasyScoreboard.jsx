import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getFormattedMatchups, forceRefreshFantasyMatchups } from '../utils/sleeperApi';
import { toast } from "sonner";

/**
 * @typedef {Object} FantasyScoreboardProps
 * @property {number} week - The week to display fantasy matchups for.
 * @property {boolean} [isCollapsed=false] - Whether the component is collapsed by default.
 * @property {Function} [onRefresh] - Function to call when refresh button is clicked.
 * @property {boolean} [isRefreshing=false] - Whether a refresh is currently in progress.
 */

/**
 * A component that displays fantasy league matchups and scores.
 * @param {FantasyScoreboardProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const FantasyScoreboard = ({ week, isCollapsed: initialIsCollapsed = false, onRefresh, isRefreshing = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);
  const [matchups, setMatchups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  useEffect(() => {
    setIsCollapsed(initialIsCollapsed);
  }, [initialIsCollapsed]);

  /**
   * Fetches fantasy matchups for the current week.
   */
  const fetchFantasyMatchups = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      let fantasyMatchups;
      if (forceRefresh) {
        fantasyMatchups = await forceRefreshFantasyMatchups(week);
      } else {
        fantasyMatchups = await getFormattedMatchups(week);
      }
      setMatchups(fantasyMatchups);
    } catch (error) {
      console.error('Error fetching fantasy matchups:', error);
      toast.error(`Failed to load fantasy matchups for week ${week}`);
    } finally {
      setIsLoading(false);
    }
  }, [week]);

  // Load matchups when component mounts or week changes
  useEffect(() => {
    if (week) {
      fetchFantasyMatchups();
    }
  }, [week, fetchFantasyMatchups]);

  /**
   * Handles refresh button click - uses external refresh handler if provided, otherwise uses internal.
   */
  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else {
      setInternalRefreshing(true);
      try {
        await fetchFantasyMatchups(true);
        toast.success(`Fantasy scores refreshed for Week ${week}`);
      } catch (error) {
        console.error('Error refreshing fantasy matchups:', error);
        toast.error('Failed to refresh fantasy scores');
      } finally {
        setInternalRefreshing(false);
      }
    }
  };

  /**
   * Gets the color for the score based on which team is winning.
   * @param {number} team1Points - The first team's points.
   * @param {number} team2Points - The second team's points.
   * @returns {{team1: string, team2: string}} The colors for the scores.
   */
  const getScoreColor = (team1Points, team2Points) => {
    if (team1Points > team2Points) {
      return { team1: 'text-accent', team2: 'text-primary' };
    } else if (team2Points > team1Points) {
      return { team1: 'text-primary', team2: 'text-accent' };
    }
    return { team1: 'text-foreground', team2: 'text-foreground' };
  };

  /**
   * Toggles the collapsed state of the component.
   */
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const currentRefreshing = isRefreshing || internalRefreshing;

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-foreground text-lg">Fantasy League - Week {week}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="p-0 h-8 w-8"
            disabled={currentRefreshing || isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${currentRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="p-0 h-8 w-8"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="py-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Loading fantasy matchups...
                  </div>
                </div>
              ) : matchups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No fantasy matchups found for Week {week}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {matchups.map((matchup) => {
                    const team1Points = parseFloat(matchup.team1.points) || 0;
                    const team2Points = parseFloat(matchup.team2.points) || 0;
                    const scoreColors = getScoreColor(team1Points, team2Points);

                    // Determine winning teams for star emoji
                    const isTeam1Winner = team1Points > team2Points && team1Points > 0;
                    const isTeam2Winner = team2Points > team1Points && team2Points > 0;

                    return (
                      <div key={matchup.matchupId} className="bg-secondary p-3 rounded-lg border border-border shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="text-sm font-semibold truncate">
                              {isTeam1Winner && "⭐ "}{matchup.team1.name}
                            </span>
                          </div>
                          <span className={`${scoreColors.team1} text-lg font-bold`}>
                            {team1Points.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-center text-xs text-muted-foreground mb-2">vs</div>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <span className="text-sm font-semibold truncate">
                              {isTeam2Winner && "⭐ "}{matchup.team2.name}
                            </span>
                          </div>
                          <span className={`${scoreColors.team2} text-lg font-bold`}>
                            {team2Points.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground text-center bg-muted rounded-md px-3 py-1 font-medium border">
                          {matchup.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default FantasyScoreboard;