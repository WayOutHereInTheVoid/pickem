import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../nav-items';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { LogOutIcon, MenuIcon, XIcon, ChevronRightIcon } from 'lucide-react';

/**
 * A sidebar component that displays navigation links.
 * @returns {JSX.Element}
 */
const Sidebar = () => {
  const { session, logout } = useSupabaseAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handles the logout process.
   */
  const handleLogout = async () => {
    await logout();
  };

  /**
   * Toggles the sidebar open and closed.
   */
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 text-foreground hover:text-primary"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}
      </Button>
      <div className={`${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out fixed top-0 right-0 h-full w-64 bg-accent flex flex-col items-start py-4 px-2 space-y-4 z-30`}>
        {navItems.filter(item => !item.hidden).map((item) => (
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
            {item.icon && React.cloneElement(item.icon, { className: "h-6 w-6 mr-2" })}
            <span>{item.title}</span>
          </NavLink>
        ))}
        {session && location.pathname === '/manager' && (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="mt-auto text-foreground hover:text-primary transition-colors duration-200 flex items-center w-full"
          >
            <LogOutIcon className="h-6 w-6 mr-2" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </>
  );
};

export default Sidebar;