// Mock data for testing - mimics real API responses
import { vi } from 'vitest';

// ============================================
// Mock User Data
// ============================================
export const mockUser = {
    _id: 'user-123',
    name: 'Prem Kumar',
    email: 'prem@sinhgad.edu',
    department: 'Computer',
    year: 'TE',
    avatar: null,
    createdAt: '2024-01-01T00:00:00.000Z',
};

// ============================================
// Mock Post Data
// ============================================
export const mockPost = {
    _id: 'post-123',
    title: 'How to prepare for TCS placement?',
    content: 'I have my TCS interview next week. What topics should I focus on? Any tips from seniors who got placed?',
    author: {
        _id: 'user-456',
        name: 'Rahul Sharma',
        department: 'Computer',
    },
    department: 'Computer',
    postType: 'question',
    upvotes: ['user-1', 'user-2', 'user-3'],
    downvotes: ['user-4'],
    commentCount: 5,
    tags: ['placement', 'tcs', 'interview'],
    sentiment: { score: 0.2, label: 'neutral' },
    aiSummary: '',
    createdAt: '2024-01-15T10:30:00.000Z',
    userVote: 0,
};

export const mockPosts = [
    mockPost,
    {
        ...mockPost,
        _id: 'post-456',
        title: 'Best resources for Data Structures',
        content: 'Share your favorite resources for learning DSA.',
        postType: 'discussion',
        tags: ['dsa', 'coding', 'resources'],
    },
    {
        ...mockPost,
        _id: 'post-789',
        title: 'Hackathon announcement - 20th January',
        content: 'College hackathon is happening this weekend!',
        postType: 'announcement',
        tags: ['hackathon', 'event'],
    },
];

// ============================================
// Mock Comment Data
// ============================================
export const mockComment = {
    _id: 'comment-123',
    content: 'Focus on aptitude and coding basics. TCS NQT is not very hard.',
    author: {
        _id: 'user-789',
        name: 'Senior Student',
        department: 'IT',
    },
    post: 'post-123',
    createdAt: '2024-01-15T12:00:00.000Z',
};

// ============================================
// Mock Notification Data
// ============================================
export const mockNotification = {
    _id: 'notif-123',
    type: 'comment',
    message: 'Rahul Sharma commented on your post',
    post: { _id: 'post-123', title: 'How to prepare for TCS?' },
    read: false,
    createdAt: '2024-01-15T14:00:00.000Z',
};

// ============================================
// Mock API Responses
// ============================================
export const mockApiResponses = {
    // Auth
    login: {
        success: true,
        token: 'fake-jwt-token',
        user: mockUser,
    },
    register: {
        success: true,
        message: 'Registration successful',
        token: 'fake-jwt-token',
        user: mockUser,
    },

    // Posts
    getPosts: {
        success: true,
        posts: mockPosts,
        total: mockPosts.length,
        page: 1,
        totalPages: 1,
    },
    createPost: {
        success: true,
        post: mockPost,
    },
    vote: {
        success: true,
        upvoteCount: 4,
        downvoteCount: 1,
        userVote: 1,
    },

    // AI Features
    summarize: {
        success: true,
        summary: 'This post is asking for TCS placement preparation tips, focusing on aptitude and coding.',
        cached: false,
    },
    chat: {
        success: true,
        answer: 'Based on placement experiences shared by students, focus on aptitude, coding basics, and communication skills for TCS.',
        sources: [
            { id: 'post-123', title: 'TCS preparation tips' },
        ],
    },

    // Notifications
    getNotifications: {
        success: true,
        notifications: [mockNotification],
        unreadCount: 1,
    },
};

// ============================================
// API Mock Helpers
// ============================================

/**
 * Create a mock fetch function that returns specified response
 * @param {Object} response - Response data to return
 * @param {number} status - HTTP status code (default: 200)
 */
export const createMockFetch = (response, status = 200) => {
    return vi.fn(() =>
        Promise.resolve({
            ok: status >= 200 && status < 300,
            status,
            json: () => Promise.resolve(response),
        })
    );
};

/**
 * Setup global fetch mock with multiple endpoint handlers
 * @param {Object} handlers - Map of URL patterns to responses
 */
export const setupFetchMock = (handlers = {}) => {
    const defaultHandlers = {
        '/api/posts': mockApiResponses.getPosts,
        '/api/posts/.*?/summarize': mockApiResponses.summarize,
        '/api/posts/.*?/vote': mockApiResponses.vote,
        '/api/chat': mockApiResponses.chat,
        '/api/auth/login': mockApiResponses.login,
        '/api/auth/register': mockApiResponses.register,
        '/api/notifications': mockApiResponses.getNotifications,
    };

    const mergedHandlers = { ...defaultHandlers, ...handlers };

    global.fetch = vi.fn((url) => {
        for (const [pattern, response] of Object.entries(mergedHandlers)) {
            if (new RegExp(pattern).test(url)) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(response),
                });
            }
        }
        // Default 404 for unmatched routes
        return Promise.resolve({
            ok: false,
            status: 404,
            json: () => Promise.resolve({ message: 'Not found' }),
        });
    });
};

/**
 * Reset all mocks between tests
 */
export const resetMocks = () => {
    vi.clearAllMocks();
};
