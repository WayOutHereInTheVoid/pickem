import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const ParsedPicks = ({ picks, onSave, isSaving, progress }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parsed Picks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Picked Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {picks.map((pick, index) => (
              <TableRow key={index} className="even:bg-muted/30">
                <TableCell>{pick.name}</TableCell>
                <TableCell className="font-medium text-primary">{pick.pick}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-6 space-y-4">
          <Button
            onClick={onSave}
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Picks and Calculate Scores'
            )}
          </Button>
          {isSaving && <Progress value={progress} className="w-full" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default ParsedPicks;