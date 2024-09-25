import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../nav-items';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { LogOutIcon } from 'lucide-react';

const Sidebar = () => {
  const { session, logout } = useSupabaseAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-16 bg-secondary flex flex-col items-center py-4 space-y-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `text-muted-foreground hover:text-primary transition-colors duration-200 ${
              isActive ? 'text-primary' : ''
            }`
          }
        >
          {item.icon}
        </NavLink>
      ))}
      {session && location.pathname === '/manager' && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="mt-auto text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          <LogOutIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
