import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle } from 'lucide-react';

const ParsedGames = ({ games, onWinnerChange }) => {
  const allWinnersSelected = games.every(game => game.winner);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parsed Games</CardTitle>
        {allWinnersSelected && <CheckCircle className="h-6 w-6 text-green-500" />}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Home Team</TableHead>
              <TableHead>Away Team</TableHead>
              <TableHead className="text-center">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game, index) => (
              <TableRow key={index} className="even:bg-muted/30">
                <TableCell className="font-medium">{game.home_team}</TableCell>
                <TableCell className="font-medium">{game.away_team}</TableCell>
                <TableCell>
                  <RadioGroup
                    onValueChange={(value) => onWinnerChange(index, value)}
                    value={game.winner || ''}
                    className="flex justify-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id={`home-win-${index}`} />
                      <Label htmlFor={`home-win-${index}`}>Home</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="away" id={`away-win-${index}`} />
                      <Label htmlFor={`away-win-${index}`}>Away</Label>
                    </div>
                  </RadioGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ParsedGames;