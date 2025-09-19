import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/**
 * @typedef {Object} ParsedGamesProps
 * @property {Array<object>} games - An array of game objects.
 * @property {function} onWinnerChange - A callback function that is called when the winner of a game is changed.
 */

/**
 * A component that displays a list of parsed games and allows the user to select the winner of each game.
 * @param {ParsedGamesProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ParsedGames = ({ games, onWinnerChange }) => {
  return (
    <Card className="mb-6 bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Parsed Games</CardTitle>
      </CardHeader>
      <CardContent>
        {games.map((game, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {game.home_team} vs {game.away_team}
            </h3>
            <RadioGroup
              onValueChange={(value) => onWinnerChange(index, value)}
              value={game.winner || ''}
              className="text-foreground"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id={`home-win-${index}`} />
                <Label htmlFor={`home-win-${index}`}>{game.home_team} Wins</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="away" id={`away-win-${index}`} />
                <Label htmlFor={`away-win-${index}`}>{game.away_team} Wins</Label>
              </div>
            </RadioGroup>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ParsedGames;