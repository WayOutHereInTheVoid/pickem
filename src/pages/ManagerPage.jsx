import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from '../integrations/supabase';
import ImportPicks from './ImportPicks';
import { toast } from "sonner";
import { LogOut, Calendar, Clipboard, UserCog, Menu } from 'lucide-react';

const ManagerPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-br from-background to-background/90 p-8">
        <div className="max-w-md mx-auto">
          <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Manager Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary text-foreground focus:ring-2 focus:ring-primary transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary text-foreground focus:ring-2 focus:ring-primary transition-all duration-300"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary-light transition-colors duration-300">
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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/90 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <UserCog className="w-8 h-8 mr-2 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manager Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={handleLogout} className="bg-accent hover:bg-accent/90 text-accent-foreground transition-colors duration-300">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
        
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          className="overflow-hidden md:hidden mb-4"
        >
          {/* Add mobile menu items here */}
        </motion.div>

        <Card className="bg-card shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-primary" />
              Import Picks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImportPicks />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerPage;