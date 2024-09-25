import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from '../integrations/supabase';
import ImportPicks from './ImportPicks';
import { toast } from "sonner";

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
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Manager Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary text-foreground"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary text-foreground"
                />
                <Button type="submit" className="w-full bg-primary text-primary-foreground">
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Manager Dashboard</h1>
        <Button onClick={handleLogout} className="mb-6 bg-primary text-primary-foreground">
          Logout
        </Button>
        <ImportPicks />
      </div>
    </div>
  );
};

export default ManagerPage;
