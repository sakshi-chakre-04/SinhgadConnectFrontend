import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavIcon from './navbar/NavIcon';

const SearchBar = ({ className = "" }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsLoading(false);
    }
  }, [query, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
          ) : (
            <NavIcon type="search" className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-4 py-2.5 border-none rounded-xl bg-gray-100/50 focus:bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:shadow-lg transition-all duration-300 ease-out"
          placeholder="Search SinhgadConnect..."
        />
      </form>
    </div>
  );
};

export default SearchBar;

