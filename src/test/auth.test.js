/**
 * =========================================
 * AUTH STATE TESTS
 * =========================================
 * 
 * WHY THESE TESTS MATTER:
 * The auth state (user logged in/out, token, user info) affects 
 * the ENTIRE app. If auth breaks, users can't use anything.
 * 
 * WHAT WE'RE TESTING:
 * - Does Redux store the user correctly after login?
 * - Does logout clear everything?
 * - Do selectors return correct values?
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
    logout,
    clearError,
    selectUser,
    selectToken,
    selectIsAuthenticated,
    selectAuthError,
    selectAuthLoading
} from '../features/auth/authSlice';

// Mock localStorage (not available in test environment)
const localStorageMock = {
    store: {},
    getItem: vi.fn((key) => localStorageMock.store[key] || null),
    setItem: vi.fn((key, value) => { localStorageMock.store[key] = value; }),
    removeItem: vi.fn((key) => { delete localStorageMock.store[key]; }),
    clear: vi.fn(() => { localStorageMock.store = {}; })
};
global.localStorage = localStorageMock;

// Create a fresh store for each test
const createStore = (preloadedState = {}) => configureStore({
    reducer: { auth: authReducer },
    preloadedState
});

describe('Auth State Management', () => {
    let store;

    beforeEach(() => {
        // Reset mocks and localStorage before each test
        vi.clearAllMocks();
        localStorageMock.store = {};
        store = createStore();
    });

    // =============================================
    // TEST 1: Initial State
    // =============================================
    it('starts with user logged out when no stored data', () => {
        // WHAT: Check the initial state when app loads
        // WHY: User should NOT be logged in when they first open the app

        const state = store.getState().auth;

        expect(state.user).toBeNull();           // No user info
        expect(state.token).toBeNull();          // No auth token
        expect(state.isLoading).toBe(false);     // Not loading
        expect(state.error).toBeNull();          // No errors
    });

    // =============================================
    // TEST 2: Logout Clears Everything
    // =============================================
    it('clears all data when user logs out', () => {
        // WHAT: When user logs out, remove ALL their data
        // WHY: Security! Next user shouldn't see previous user's data

        // Setup: Create store with logged-in user
        store = createStore({
            auth: {
                user: { _id: '123', name: 'Test User', email: 'test@sinhgad.edu' },
                token: 'jwt-token-abc123',
                isLoading: false,
                error: null
            }
        });

        // Verify logged in initially
        expect(store.getState().auth.user).not.toBeNull();
        expect(store.getState().auth.token).not.toBeNull();

        // Now logout
        store.dispatch(logout());
        const state = store.getState().auth;

        // Verify everything cleared
        expect(state.user).toBeNull();         // User data GONE
        expect(state.token).toBeNull();        // Token GONE
        expect(state.error).toBeNull();        // Error cleared

        // Verify localStorage was cleared
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    // =============================================
    // TEST 3: Clear Error Action
    // =============================================
    it('clears error message when clearError is dispatched', () => {
        // WHAT: User dismisses error message
        // WHY: Allow user to retry after seeing error

        // Setup: Store with an error
        store = createStore({
            auth: {
                user: null,
                token: null,
                isLoading: false,
                error: 'Invalid email or password'
            }
        });

        // Verify error exists
        expect(store.getState().auth.error).toBe('Invalid email or password');

        // Clear the error
        store.dispatch(clearError());

        // Verify error is cleared
        expect(store.getState().auth.error).toBeNull();
    });
});

// =============================================
// SELECTOR TESTS
// =============================================
describe('Auth Selectors', () => {

    it('selectUser returns the user object', () => {
        // WHAT: Selector to get current user
        // WHY: Components need user info (name, email, etc.)

        const mockUser = { _id: '123', name: 'Prem Kumar', email: 'prem@sinhgad.edu' };
        const state = {
            auth: {
                user: mockUser,
                token: 'some-token',
                isLoading: false,
                error: null
            }
        };

        expect(selectUser(state)).toEqual(mockUser);
    });

    it('selectToken returns the JWT token', () => {
        // WHAT: Selector to get auth token
        // WHY: Needed for API calls that require authentication

        const state = {
            auth: {
                user: { name: 'Test' },
                token: 'jwt-token-xyz',
                isLoading: false,
                error: null
            }
        };

        expect(selectToken(state)).toBe('jwt-token-xyz');
    });

    it('selectIsAuthenticated returns true when token exists', () => {
        // WHAT: Check if user is logged in
        // WHY: Used to show/hide features, protect routes

        const loggedInState = {
            auth: { user: { name: 'Test' }, token: 'valid-token', isLoading: false, error: null }
        };
        const loggedOutState = {
            auth: { user: null, token: null, isLoading: false, error: null }
        };

        expect(selectIsAuthenticated(loggedInState)).toBe(true);
        expect(selectIsAuthenticated(loggedOutState)).toBe(false);
    });

    it('selectAuthError returns current error message', () => {
        // WHAT: Get error to display to user

        const stateWithError = {
            auth: { user: null, token: null, isLoading: false, error: 'Login failed' }
        };
        const stateNoError = {
            auth: { user: null, token: null, isLoading: false, error: null }
        };

        expect(selectAuthError(stateWithError)).toBe('Login failed');
        expect(selectAuthError(stateNoError)).toBeNull();
    });

    it('selectAuthLoading returns loading state', () => {
        // WHAT: Check if auth operation is in progress
        // WHY: Show loading spinner while waiting

        const loadingState = {
            auth: { user: null, token: null, isLoading: true, error: null }
        };
        const notLoadingState = {
            auth: { user: null, token: null, isLoading: false, error: null }
        };

        expect(selectAuthLoading(loadingState)).toBe(true);
        expect(selectAuthLoading(notLoadingState)).toBe(false);
    });
});

/**
 * =========================================
 * WHAT YOUR UI TEAM SHOULD KNOW:
 * =========================================
 * 
 * If they change ANYTHING in authSlice.js:
 * 1. Run: npm run test
 * 2. If tests fail → they broke something important
 * 3. If tests pass → changes are safe
 * 
 * These tests verify:
 * ✓ Logout properly clears data (security!)
 * ✓ Error clearing works
 * ✓ All selectors return correct values
 * 
 * NOTE: Login/Register are async thunks and would need
 * more complex mocking. The sync actions and selectors
 * are tested here as they're most likely to break.
 */
