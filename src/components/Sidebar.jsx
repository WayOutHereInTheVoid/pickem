import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../nav-items';

const Sidebar = () => {
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
    </div>
  );
};

export default Sidebar;
