import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddPick } from '../integrations/supabase';
import { getCachedOrFetchWeekMatches } from '../utils/nflApi';
import { toast } from "sonner";
import { Loader, Send, AlertTriangle } from 'lucide-react';

const SubmitPicks = () => {
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [name, setName] = useState('');
  const [picks, setPicks] = useState({});
  const [matchups, setMatchups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const addPickMutation = useAddPick();

  const fetchMatchups = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCachedOrFetchWeekMatches(parseInt(selectedWeek));
      if (data.length === 0) {
        throw new Error("No matchups found for this week.");
      }
      setMatchups(data);
      setPicks({});
    } catch (e) {
      setError(e.message);
      setMatchups([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWeek]);

  useEffect(() => {
    fetchMatchups();
  }, [fetchMatchups]);

  const handlePickChange = (matchupId, pickedTeam) => {
    setPicks(prev => ({ ...prev, [matchupId]: pickedTeam }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(picks).length !== matchups.length) {
      toast.error("Please make a selection for every game.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const matchupId in picks) {
        const matchup = matchups.find(m => m.id === matchupId);
        const pickedTeam = picks[matchupId];
        await addPickMutation.mutateAsync({
          name,
          week: parseInt(selectedWeek),
          pick: pickedTeam,
          matchup: `${matchup.awayTeam.name} @ ${matchup.homeTeam.name}`
        });
      }
      toast.success("Your picks have been submitted successfully!");
      setName('');
      setPicks({});
    } catch (error) {
      toast.error("Failed to submit picks. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold gradient-text">Submit Picks</h1>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(18)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>Week {i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Name</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center">
            <Loader className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Fetching matchups...</p>
          </div>
        ) : error ? (
          <Card className="text-center p-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <h3 className="mt-2 text-lg font-medium text-destructive">Error fetching matchups</h3>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <Button onClick={fetchMatchups} className="mt-4">Try again</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchups.map((matchup) => (
              <Card key={matchup.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{matchup.awayTeam.name} @ {matchup.homeTeam.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup onValueChange={(value) => handlePickChange(matchup.id, value)} value={picks[matchup.id] || ''}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={matchup.awayTeam.name} id={`${matchup.id}-away`} />
                      <Label htmlFor={`${matchup.id}-away`}>{matchup.awayTeam.name}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={matchup.homeTeam.name} id={`${matchup.id}-home`} />
                      <Label htmlFor={`${matchup.id}-home`}>{matchup.homeTeam.name}</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting || isLoading || error}>
            {isSubmitting ? (
              <><Loader className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit All Picks</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitPicks;
