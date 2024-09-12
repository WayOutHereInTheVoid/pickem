import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ImportPicks = () => {
  const [pollResults, setPollResults] = useState('');
  const [parsedPicks, setParsedPicks] = useState([]);

  const handleInputChange = (e) => {
    setPollResults(e.target.value);
  };

  const parsePollResults = () => {
    const lines = pollResults.split('\n');
    const picks = lines.map(line => {
      const [name, pick] = line.split(':');
      return { name: name.trim(), pick: pick.trim() };
    });
    setParsedPicks(picks);
    console.log('Parsed picks:', picks);
    // TODO: Implement API call to save parsed picks
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Import Picks</h1>
        <Card>
          <CardHeader>
            <CardTitle>Paste Poll Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste poll results here..."
              value={pollResults}
              onChange={handleInputChange}
              rows={10}
              className="mb-4"
            />
            <Button onClick={parsePollResults} className="w-full">
              Parse and Import Picks
            </Button>
            {parsedPicks.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Parsed Picks:</h3>
                <ul>
                  {parsedPicks.map((pick, index) => (
                    <li key={index}>{pick.name}: {pick.pick}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImportPicks;