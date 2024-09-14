import React from 'react';
import { Link } from 'react-router-dom';
import { navItems } from '../nav-items';

const Sidebar = () => {
  return (
    <div className="w-16 bg-secondary flex flex-col items-center py-4 space-y-4">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;