import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from "sonner";
import { KeyIcon, UserPlusIcon } from 'lucide-react';

/**
 * A component for setting up a manager account.
 * @returns {JSX.Element}
 */
const ManagerAccountSetup = () => {
  const [email, setEmail] = useState('manager@nflpickem.local');
  const [password, setPassword] = useState('Manager2025!');
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Creates a manager account using the provided email and password.
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const createManagerAccount = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation
          data: {
            role: 'manager' // Custom metadata
          }
        }
      });

      if (error) throw error;

      toast.success('Manager account created successfully!');
      toast.info('You can now use these credentials to log in');
      
      // Refresh the page to show login form
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error creating manager account:', error);
      toast.error(`Failed to create account: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 p-8">
      <div className="max-w-md mx-auto">
        <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <KeyIcon className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Manager Account Setup</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Create your NFL Pickem League manager account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={createManagerAccount} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Manager Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary text-foreground focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Manager Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary text-foreground focus:ring-2 focus:ring-primary transition-all duration-300"
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-foreground font-medium">📝 Save These Credentials:</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Email: {email}<br/>
                  Password: {password}
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary-light transition-colors duration-300"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>Creating Account...</>
                ) : (
                  <>
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Create Manager Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-2">After Account Creation:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use the credentials above to log in</li>
                <li>• Access the full manager dashboard</li>
                <li>• Import picks and manage your league</li>
                <li>• Set up games and calculate scores</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerAccountSetup;