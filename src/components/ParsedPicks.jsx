import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from 'lucide-react';

/**
 * @typedef {Object} ParsedPicksProps
 * @property {Array<object>} picks - An array of pick objects.
 * @property {function} onSave - A callback function that is called when the save button is clicked.
 * @property {boolean} isSaving - Whether the picks are currently being saved.
 */

/**
 * A component that displays a list of parsed picks and allows the user to save them.
 * @param {ParsedPicksProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ParsedPicks = ({ picks, onSave, isSaving }) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Parsed Picks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {picks.map((pick, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-foreground">{pick.name}</span>
              <span className="text-primary">{pick.pick}</span>
            </div>
          ))}
        </div>
        <Button 
          onClick={onSave} 
          className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary-light transition-colors duration-300"
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
      </CardContent>
    </Card>
  );
};

export default ParsedPicks;