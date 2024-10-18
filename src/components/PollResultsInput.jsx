import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, Loader } from 'lucide-react';

const PollResultsInput = ({ pollResults, handleInputChange, parsePollResults, isParsing }) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center">
          <Clipboard className="w-5 h-5 mr-2" />
          Paste Poll Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste poll results here..."
          value={pollResults}
          onChange={handleInputChange}
          rows={10}
          className="mb-4 bg-secondary text-foreground focus:ring-2 focus:ring-primary transition-all duration-300"
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={parsePollResults}
            className="w-full bg-primary text-primary-foreground hover:bg-primary-light transition-colors duration-300"
            disabled={isParsing}
          >
            {isParsing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Parsing...
              </>
            ) : (
              'Parse Picks and Games'
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PollResultsInput;