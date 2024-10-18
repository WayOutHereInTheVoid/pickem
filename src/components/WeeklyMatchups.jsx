import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WeeklyMatchups = ({ leagueId, week, isCollapsed: initialIsCollapsed = false }) => {
  const [matchups, setMatchups] = useState([]);
  const [teams, setTeams] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(initialIsCollapsed);

  useEffect(() => {
    setIsCollapsed(initialIsCollapsed);
  }, [initialIsCollapsed]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchupsResponse, usersResponse] = await Promise.all([
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`),
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`)
        ]);

        const [matchupsData, usersData] = await Promise.all([
          matchupsResponse.json(),
          usersResponse.json()
        ]);

        const teamMap = {};
        usersData.forEach(user => {
          teamMap[user.roster_id] = user.display_name || user.metadata.team_name || user.username;
        });

        setTeams(teamMap);
        setMatchups(matchupsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [leagueId, week]);

  const groupedMatchups = matchups.reduce((acc, matchup) => {
    if (!acc[matchup.matchup_id]) {
      acc[matchup.matchup_id] = [];
    }
    acc[matchup.matchup_id].push(matchup);
    return acc;
  }, {});

  const getScoreColor = (team1Score, team2Score) => {
    if (team1Score > team2Score) {
      return { team1: 'text-accent', team2: 'text-primary' };
    } else if (team2Score > team1Score) {
      return { team1: 'text-primary', team2: 'text-accent' };
    }
    return { team1: 'text-foreground', team2: 'text-foreground' };
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <CardTitle className="text-foreground text-lg">TRL Week {week} Matchups</CardTitle>
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
            <CardContent className="py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Object.values(groupedMatchups).map((matchup, index) => {
                  const team1 = teams[matchup[0]?.roster_id];
                  const team2 = teams[matchup[1]?.roster_id];
                  const team1Score = matchup[0]?.points || 0;
                  const team2Score = matchup[1]?.points || 0;
                  const scoreColors = getScoreColor(team1Score, team2Score);

                  return (
                    <div key={index} className="bg-secondary p-2 rounded-lg text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">{team1}</span>
                        <span className={`${scoreColors.team1} font-bold`}>{team1Score.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">{team2}</span>
                        <span className={`${scoreColors.team2} font-bold`}>{team2Score.toFixed(2)}</span>
                      </div>
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

export default WeeklyMatchups;