import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchPosts } from '../services/api/searchService';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchedQuery, setSearchedQuery] = useState('');

    useEffect(() => {
        const performSearch = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const data = await searchPosts(query);
                setResults(data.results || []);
                setSearchedQuery(query);
            } catch (err) {
                console.error('Search error:', err);
                setError('Failed to search. Please try again.');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Search Results
            </h1>

            {searchedQuery && (
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Showing results for "<span className="font-medium">{searchedQuery}</span>"
                </p>
            )}

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && results.length === 0 && searchedQuery && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        Try different keywords or check your spelling.
                    </p>
                </div>
            )}

            {!loading && results.length > 0 && (
                <div className="space-y-4">
                    {results.map((post) => (
                        <Link
                            key={post._id}
                            to={`/posts/${post._id}`}
                            className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {post.author?.name || 'Unknown'}
                                        </span>
                                        <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                                            {post.department}
                                        </span>
                                        <span>{formatDate(post.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="ml-4 flex flex-col items-end">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                        {Math.round(post.similarity * 100)}% match
                                    </span>
                                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            {post.upvoteCount || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            {post.commentCount || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
