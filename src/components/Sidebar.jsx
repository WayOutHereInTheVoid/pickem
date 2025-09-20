import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../nav-items';
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '../integrations/supabase';
import { LogOutIcon, MenuIcon, XIcon, ShieldCheck } from 'lucide-react';

const SidebarContent = ({ onLinkClick }) => {
  const { session, logout } = useSupabaseAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    if (onLinkClick) onLinkClick();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-center border-b border-border">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold ml-2">TRL Pick'em</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.filter(item => !item.hidden).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted/50 hover:text-accent-foreground'
              }`
            }
            onClick={onLinkClick}
          >
            {item.icon && React.cloneElement(item.icon, { className: "h-5 w-5 mr-3" })}
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>
      {session && (
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-foreground hover:bg-muted/50 hover:text-accent-foreground"
          >
            <LogOutIcon className="h-5 w-5 mr-3" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50 text-foreground hover:text-primary"
        onClick={toggleSidebar}
      >
        {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </Button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-card z-40 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <SidebarContent onLinkClick={() => setIsOpen(false)} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-card border-r border-border">
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;