import React from 'react';
import NavIcon from './navbar/NavIcon';

const SearchBar = ({ className = "" }) => (
  <div className={className}>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <NavIcon type="search" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Search SinhgadConnect"
      />
    </div>
  </div>
);

export default SearchBar;
