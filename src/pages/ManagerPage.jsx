import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from '../integrations/supabase';
import ImportPicks from './ImportPicks';
import { toast } from "sonner";
import { LogOut, Calendar, UserCog } from 'lucide-react';

const ManagerPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { session, login, logout } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error('Error logging in:', error.message);
      toast.error(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success("Logged out successfully");
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-card to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center gradient-text">Manager Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <UserCog className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Manager Dashboard</h1>
        </div>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span>Import Picks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImportPicks />
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerPage;