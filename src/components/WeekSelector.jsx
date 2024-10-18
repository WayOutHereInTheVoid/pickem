import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from 'lucide-react';

const WeekSelector = ({ selectedWeek, setSelectedWeek }) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Select Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-full bg-secondary text-foreground">
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
      </CardContent>
    </Card>
  );
};

export default WeekSelector;