import { api } from './api';

/**
 * Search posts using semantic similarity
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {number} options.limit - Maximum number of results (default: 10)
 * @param {string} options.department - Filter by department (optional)
 * @returns {Promise<Object>} Search results
 */
export const searchPosts = async (query, { limit = 10, department } = {}) => {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    if (department && department !== 'General') {
        params.append('department', department);
    }
    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
};
