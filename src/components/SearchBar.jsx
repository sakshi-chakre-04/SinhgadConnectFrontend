import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavIcon from './navbar/NavIcon';
import { ClockIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchPosts } from '../services/api/searchService';

const STORAGE_KEY = 'sinhgad_recent_searches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_DELAY = 300; // ms

const SearchBar = ({ className = "" }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }
  }, []);

  // Debounced autocomplete search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim() || query.trim().length < 2) {
      setAutocompleteResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchPosts(query, { limit: 5 });
        setAutocompleteResults(data.results || []);
      } catch (err) {
        console.error('Autocomplete error:', err);
        setAutocompleteResults([]);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Save search to recent searches
  const saveRecentSearch = useCallback((searchQuery) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent search:', e);
      }

      return updated;
    });
  }, []);

  // Clear a specific recent search
  const clearRecentSearch = useCallback((searchToRemove, e) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== searchToRemove);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update recent searches:', e);
      }
      return updated;
    });
  }, []);

  // Clear all recent searches
  const clearAllRecentSearches = useCallback((e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear recent searches:', e);
    }
  }, []);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      saveRecentSearch(query);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsLoading(false);
      setIsFocused(false);
      setAutocompleteResults([]);
      inputRef.current?.blur();
    }
  }, [query, navigate, saveRecentSearch]);

  const handleRecentClick = useCallback((searchTerm) => {
    saveRecentSearch(searchTerm);
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setIsFocused(false);
    setQuery('');
    setAutocompleteResults([]);
  }, [navigate, saveRecentSearch]);

  const handleResultClick = useCallback((post) => {
    saveRecentSearch(post.title);
    navigate(`/posts/${post._id}`);
    setIsFocused(false);
    setQuery('');
    setAutocompleteResults([]);
  }, [navigate, saveRecentSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setAutocompleteResults([]);
      inputRef.current?.blur();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = isFocused && (recentSearches.length > 0 || autocompleteResults.length > 0 || isSearching);
  const hasQuery = query.trim().length >= 2;

  return (
    <div className={className} ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          {isLoading || isSearching ? (
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
          ) : (
            <NavIcon type="search" className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 focus:bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:shadow-lg transition-all duration-300 ease-out"
          placeholder="Search SinhgadConnect..."
          autoComplete="off"
        />

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">

            {/* Autocomplete Results */}
            {hasQuery && (autocompleteResults.length > 0 || isSearching) && (
              <div className="border-b border-gray-100">
                <div className="px-3 py-2 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <MagnifyingGlassIcon className="w-3.5 h-3.5" />
                    {isSearching ? 'Searching...' : `Results for "${query}"`}
                  </span>
                </div>
                {autocompleteResults.map((post) => (
                  <button
                    key={post._id}
                    type="button"
                    onClick={() => handleResultClick(post)}
                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 text-sm line-clamp-1">
                      {post.title}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {post.content?.substring(0, 80)}...
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-indigo-600 font-medium">
                        {Math.round(post.similarity * 100)}% match
                      </span>
                      <span className="text-xs text-gray-400">
                        by {post.author?.name || 'Unknown'}
                      </span>
                    </div>
                  </button>
                ))}
                {hasQuery && !isSearching && autocompleteResults.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                  >
                    See all results for "{query}" →
                  </button>
                )}
              </div>
            )}

            {/* Recent Searches - Show only when no query */}
            {!hasQuery && recentSearches.length > 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5" />
                    Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearAllRecentSearches}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRecentClick(search)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors group/item"
                    >
                      <span className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        {search}
                      </span>
                      <XMarkIcon
                        className="w-4 h-4 text-gray-400 opacity-0 group-hover/item:opacity-100 hover:text-red-500 transition-all"
                        onClick={(e) => clearRecentSearch(search, e)}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard hint */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600 font-mono text-xs">Enter</kbd> to search
              </span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
