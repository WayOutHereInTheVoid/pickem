import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from '../lib/supabase';
import { calculateWeeklyScores, calculateCumulativeScores } from '../utils/scoreCalculations';

const GameInput = ({ game, onInputChange, onWinnerChange }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold mb-2 text-foreground">Game {game.id}</h3>
    <div className="grid grid-cols-2 gap-4 mb-2">
      <div>
        <Label htmlFor={`home-team-${game.id}`} className="text-foreground">Home Team</Label>
        <Input
          id={`home-team-${game.id}`}
          value={game.homeTeam}
          onChange={(e) => onInputChange(game.id, 'homeTeam', e.target.value)}
          placeholder="Enter home team"
          required
          className="bg-secondary text-foreground"
        />
      </div>
      <div>
        <Label htmlFor={`away-team-${game.id}`} className="text-foreground">Away Team</Label>
        <Input
          id={`away-team-${game.id}`}
          value={game.awayTeam}
          onChange={(e) => onInputChange(game.id, 'awayTeam', e.target.value)}
          placeholder="Enter away team"
          required
          className="bg-secondary text-foreground"
        />
      </div>
    </div>
    <RadioGroup
      onValueChange={(value) => onWinnerChange(game.id, value)}
      value={game.winner}
      className="text-foreground"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="home" id={`home-win-${game.id}`} />
        <Label htmlFor={`home-win-${game.id}`}>Home Team Wins</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="away" id={`away-win-${game.id}`} />
        <Label htmlFor={`away-win-${game.id}`}>Away Team Wins</Label>
      </div>
    </RadioGroup>
  </div>
);

const SetupGames = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [games, setGames] = useState([
    { id: 1, homeTeam: '', awayTeam: '', winner: null },
    { id: 2, homeTeam: '', awayTeam: '', winner: null },
    { id: 3, homeTeam: '', awayTeam: '', winner: null },
  ]);

  useEffect(() => {
    loadGames();
  }, [selectedWeek]);

  const loadGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('week', selectedWeek);
    
    if (error) {
      console.error('Error loading games:', error);
      toast.error('Failed to load games');
    } else if (data.length > 0) {
      setGames(data);
    } else {
      setGames([
        { id: 1, homeTeam: '', awayTeam: '', winner: null },
        { id: 2, homeTeam: '', awayTeam: '', winner: null },
        { id: 3, homeTeam: '', awayTeam: '', winner: null },
      ]);
    }
  };

  const handleInputChange = (id, team, value) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, [team]: value } : game
    ));
  };

  const handleWinnerChange = (id, winner) => {
    setGames(games.map(game =>
      game.id === id ? { ...game, winner } : game
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('games')
      .upsert(games.map(game => ({
        ...game,
        week: selectedWeek
      })));

    if (error) {
      console.error('Error saving games:', error);
      toast.error('Failed to save games');
    } else {
      toast.success(`Games for Week ${selectedWeek} submitted successfully!`);
      
      // Calculate and save scores
      const { data: picks, error: picksError } = await supabase
        .from('picks')
        .select('*')
        .eq('week', selectedWeek);

      if (picksError) {
        console.error('Error loading picks:', picksError);
      } else {
        const results = games.map(game => ({
          id: game.id,
          winner: game.winner === 'home' ? game.homeTeam : game.awayTeam
        }));
        const weekScores = calculateWeeklyScores(games, picks, results);
        
        const { error: scoresError } = await supabase
          .from('scores')
          .upsert(weekScores.map(score => ({
            ...score,
            week: selectedWeek
          })));

        if (scoresError) {
          console.error('Error saving scores:', scoresError);
        } else {
          // Update cumulative scores
          const { data: allScores, error: allScoresError } = await supabase
            .from('scores')
            .select('*');

          if (allScoresError) {
            console.error('Error loading all scores:', allScoresError);
          } else {
            const cumulativeScores = calculateCumulativeScores(allScores);
            
            const { error: cumulativeError } = await supabase
              .from('cumulative_scores')
              .upsert(cumulativeScores);

            if (cumulativeError) {
              console.error('Error saving cumulative scores:', cumulativeError);
            } else {
              toast.success('Scores updated successfully!');
            }
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Set Up Games</h1>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Input This Week's Matchups</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="week-select" className="text-foreground">Select Week</Label>
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                  <SelectTrigger id="week-select" className="bg-secondary text-foreground">
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
              </div>
              {games.map((game) => (
                <GameInput 
                  key={game.id} 
                  game={game} 
                  onInputChange={handleInputChange}
                  onWinnerChange={handleWinnerChange}
                />
              ))}
              <Button type="submit" className="w-full bg-primary text-primary-foreground">Save Games and Calculate Scores</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetupGames;
