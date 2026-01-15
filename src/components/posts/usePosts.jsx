import { useCallback, useEffect, useState } from 'react';

export function usePosts({ filter, sortBy }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    let ignore = false;

    try {
      const params = new URLSearchParams({
        sortBy,
        sortOrder: 'desc',
        limit: '20',
      });
      if (filter !== 'all') params.append('department', filter);

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://sinhgadconnectbackend.onrender.com/api'}/posts?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch posts');
      if (!ignore) setPosts(data.posts || []);
    } catch (err) {
      if (!ignore) setError(err.message || 'Failed to fetch posts');
    } finally {
      if (!ignore) setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [filter, sortBy]);

  useEffect(() => {
    let cleanup = () => { };
    fetchPosts().then((c) => {
      if (typeof c === 'function') cleanup = c;
    });
    return () => cleanup();
  }, [fetchPosts]);

  return { posts, setPosts, loading, error, refetch: fetchPosts };
}
