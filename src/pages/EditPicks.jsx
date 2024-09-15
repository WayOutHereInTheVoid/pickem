import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const EditPicks = () => {
  const { week } = useParams();
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    const storedPicks = JSON.parse(localStorage.getItem(`week${week}Picks`) || '[]');
    setPicks(storedPicks);
  }, [week]);

  const handlePickChange = (index, newPick) => {
    const updatedPicks = [...picks];
    updatedPicks[index].pick = newPick;
    setPicks(updatedPicks);
  };

  const savePicks = () => {
    localStorage.setItem(`week${week}Picks`, JSON.stringify(picks));
    toast.success("Picks updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Edit Picks - Week {week}</h1>
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Adjust Picks</CardTitle>
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
                    <TableCell>
                      <Input
                        value={pick.pick}
                        onChange={(e) => handlePickChange(index, e.target.value)}
                        className="bg-secondary text-foreground"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={savePicks} className="w-full mt-4 bg-primary text-primary-foreground">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPicks;