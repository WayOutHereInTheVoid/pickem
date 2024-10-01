import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Sidebar from "./components/Sidebar";
import ManagerPage from "./pages/ManagerPage";
import { SupabaseAuthProvider } from './integrations/supabase/auth';

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SupabaseAuthProvider>
        <TooltipProvider>
          <Router>
            <Toaster />
            <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
              <Sidebar />
              <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                <Routes>
                  {navItems.map(({ to, page }) => (
                    <Route key={to} path={to} element={page} />
                  ))}
                  <Route path="/manager" element={<ManagerPage />} />
                </Routes>
              </main>
            </div>
          </Router>
        </TooltipProvider>
      </SupabaseAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;