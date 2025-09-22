import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamColor } from '../utils/teamColors';

/**
 * @typedef {Object} NFLMatchupsProps
 * @property {Array<object>} matches - An array of match objects.
 * @property {boolean} [isCollapsed=false] - Whether the component is collapsed by default.
 */

/**
 * A component that displays a list of NFL matchups.
 * @param {NFLMatchupsProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const NFLMatchups = ({ matches, isCollapsed: initialIsCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);

  useEffect(() => {
    setIsCollapsed(initialIsCollapsed);
  }, [initialIsCollapsed]);

  /**
   * Gets the color for the score based on which team is winning.
   * @param {number} homeScore - The home team's score.
   * @param {number} awayScore - The away team's score.
   * @returns {{home: string, away: string}} The colors for the scores.
   */
  const getScoreColor = (homeScore, awayScore) => {
    if (homeScore > awayScore) {
      return { home: 'text-accent', away: 'text-primary' };
    } else if (awayScore > homeScore) {
      return { home: 'text-primary', away: 'text-accent' };
    }
    return { home: 'text-foreground', away: 'text-foreground' };
  };

  /**
   * Toggles the collapsed state of the component.
   */
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-foreground text-lg">NFL Matchups</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="p-0 h-8 w-8"
        >
          {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
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
              <div className="grid grid-cols-1 gap-4">
                {matches.map((match, index) => {
                  const homeTeam = match.homeTeam.displayName;
                  const awayTeam = match.awayTeam.displayName;
                  const score = match.state.score.current;
                  const status = match.state.description;
                  
                  let homeScore = 'N/A';
                  let awayScore = 'N/A';
                  if (score) {
                    [homeScore, awayScore] = score.split('-');
                  }

                  const scoreColors = getScoreColor(parseInt(homeScore), parseInt(awayScore));

                  // Determine winning teams for star emoji
                  const homeScoreNum = parseInt(homeScore) || 0;
                  const awayScoreNum = parseInt(awayScore) || 0;
                  const isHomeWinner = homeScoreNum > awayScoreNum && homeScoreNum > 0;
                  const isAwayWinner = awayScoreNum > homeScoreNum && awayScoreNum > 0;

                  return (
                    <div key={index} className="bg-secondary p-4 rounded-lg border border-border shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="text-lg font-semibold truncate" style={{ color: getTeamColor(awayTeam) }}>
                            {isAwayWinner && "⭐ "}{awayTeam}
                          </span>
                        </div>
                        <span className={`${scoreColors.away} text-2xl font-bold`}>{awayScore}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <span className="text-lg font-semibold truncate" style={{ color: getTeamColor(homeTeam) }}>
                            {isHomeWinner && "⭐ "}{homeTeam}
                          </span>
                        </div>
                        <span className={`${scoreColors.home} text-2xl font-bold`}>{homeScore}</span>
                      </div>
                      <div className="text-xs text-muted-foreground text-center bg-muted rounded-md px-3 py-1 font-medium border">{status}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default NFLMatchups;