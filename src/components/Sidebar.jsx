import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../nav-items';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { LogOutIcon, MenuIcon, XIcon } from 'lucide-react';

const Sidebar = () => {
  const { session, logout } = useSupabaseAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </Button>
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 h-full w-64 md:w-16 bg-secondary flex flex-col items-center py-4 space-y-4 z-40`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-muted-foreground hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
            onClick={() => setIsOpen(false)}
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
    </>
  );
};

export default Sidebar;