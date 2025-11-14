import React from 'react';
import { NavLink } from 'react-router-dom';
import NavIcon from './NavIcon';

const NavLinkItem = ({ to, label, icon, className = '', onClick }) => {
  const navLinkStyles = ({ isActive }) =>
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    } ${className}`;

  return (
    <NavLink to={to} className={navLinkStyles} onClick={onClick}>
      <NavIcon type={icon} />
      <span className="ml-2">{label}</span>
    </NavLink>
  );
};

export default NavLinkItem;
