import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../nav-items';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { LogOutIcon, MenuIcon, XIcon, ChevronRightIcon } from 'lucide-react';

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
        className="md:hidden fixed top-4 left-4 z-50 text-foreground hover:text-primary"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
      </Button>
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 h-full w-16 md:w-16 bg-accent flex flex-col items-center py-4 space-y-4 z-40`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-foreground hover:text-primary transition-colors duration-200 ${
                isActive ? 'text-primary' : ''
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            {React.cloneElement(item.icon, { className: "h-7 w-7" })}
          </NavLink>
        ))}
        {session && location.pathname === '/manager' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="mt-auto text-foreground hover:text-primary transition-colors duration-200"
          >
            <LogOutIcon className="h-7 w-7" />
          </Button>
        )}
      </div>
      <div className={`${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out fixed top-0 right-0 h-full w-40 bg-accent flex flex-col items-start py-4 px-2 space-y-4 z-30`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `text-foreground hover:text-primary transition-colors duration-200 flex items-center w-full ${
                isActive ? 'text-primary' : ''
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            {React.cloneElement(item.icon, { className: "h-5 w-5 mr-2" })}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50 text-foreground hover:text-primary"
        onClick={toggleSidebar}
      >
        <ChevronRightIcon className="h-7 w-7" />
      </Button>
    </>
  );
};

export default Sidebar;