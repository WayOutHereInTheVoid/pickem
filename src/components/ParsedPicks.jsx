import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ParsedPicks = ({ picks, onSave }) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Parsed Picks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground">Team Name</TableHead>
              <TableHead className="text-foreground">Pick</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {picks.map((pick, index) => (
              <TableRow key={index}>
                <TableCell className="text-foreground">{pick.name}</TableCell>
                <TableCell className="text-foreground">{pick.pick}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={onSave} className="w-full mt-4 bg-primary text-primary-foreground">
          Save Picks, Games, and Calculate Scores
        </Button>
      </CardContent>
    </Card>
  );
};

export default ParsedPicks;