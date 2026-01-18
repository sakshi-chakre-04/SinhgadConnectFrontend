// Test utilities for rendering components with providers
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

// Create a mock store for testing
export const createTestStore = (preloadedState = {}) => {
    return configureStore({
        reducer: {
            auth: authReducer,
        },
        preloadedState,
    });
};

// Default authenticated user for tests
export const mockUser = {
    _id: 'test-user-123',
    name: 'Test User',
    email: 'test@sinhgad.edu',
    department: 'Computer',
    year: 'TE',
};

export const mockToken = 'fake-jwt-token-for-testing';

// Authenticated state
export const authenticatedState = {
    auth: {
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        loading: false,
        error: null,
    },
};

// Unauthenticated state
export const unauthenticatedState = {
    auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
};

/**
 * Custom render function that wraps component with all necessary providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.preloadedState - Initial Redux state
 * @param {Object} options.store - Custom store (optional)
 * @param {string} options.route - Initial route (default: '/')
 */
export const renderWithProviders = (
    ui,
    {
        preloadedState = authenticatedState,
        store = createTestStore(preloadedState),
        route = '/',
        ...renderOptions
    } = {}
) => {
    // Set initial route
    window.history.pushState({}, 'Test page', route);

    const Wrapper = ({ children }) => (
        <Provider store={store}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </Provider>
    );

    return {
        store,
        ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    };
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
