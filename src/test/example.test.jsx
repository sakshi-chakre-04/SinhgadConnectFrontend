// Simple smoke tests to verify testing setup works
// These serve as examples for your UI team to follow
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

// Simple render helper
const createStore = (preloadedState = {}) => {
    return configureStore({
        reducer: { auth: authReducer },
        preloadedState,
    });
};

const renderWithProviders = (ui, options = {}) => {
    const store = createStore(options.preloadedState || {
        auth: {
            user: { _id: '123', name: 'Test User', email: 'test@test.com', department: 'Computer' },
            token: 'fake-token',
            isAuthenticated: true,
            loading: false,
            error: null,
        }
    });

    return render(
        <Provider store={store}>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </Provider>
    );
};

describe('Testing Setup Verification', () => {
    it('React Testing Library is working', () => {
        render(<div data-testid="test">Hello World</div>);
        expect(screen.getByTestId('test')).toHaveTextContent('Hello World');
    });

    it('jest-dom matchers are available', () => {
        render(<button disabled>Click me</button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('mocking works correctly', () => {
        const mockFn = vi.fn();
        mockFn('test');
        expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('async operations work', async () => {
        const promise = Promise.resolve('success');
        const result = await promise;
        expect(result).toBe('success');
    });
});

describe('API Mocking Examples', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('can mock fetch for API calls', async () => {
        // Mock fetch to return fake data
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    summary: 'This is an AI summary'
                }),
            })
        );

        // Call the mocked fetch
        const response = await fetch('/api/posts/123/summarize');
        const data = await response.json();

        // Verify the mock was called and returned expected data
        expect(fetch).toHaveBeenCalledWith('/api/posts/123/summarize');
        expect(data.success).toBe(true);
        expect(data.summary).toBe('This is an AI summary');
    });

    it('can mock different API responses', async () => {
        // Mock fetch for login
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    token: 'jwt-token-123',
                    user: { name: 'Test User' }
                }),
            })
        );

        const response = await fetch('/api/auth/login');
        const data = await response.json();

        expect(data.token).toBe('jwt-token-123');
        expect(data.user.name).toBe('Test User');
    });
});

describe('Component Testing Pattern Examples', () => {
    it('renders component with Redux store', () => {
        // Example: Testing a simple component that uses Redux
        const SimpleComponent = () => <div>Component loaded</div>;

        renderWithProviders(<SimpleComponent />);
        expect(screen.getByText('Component loaded')).toBeInTheDocument();
    });

    it('renders component with routing', () => {
        // Example: Testing a component with Link
        const ComponentWithLink = () => (
            <a href="/dashboard">Go to Dashboard</a>
        );

        renderWithProviders(<ComponentWithLink />);
        expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    });
});

// ============================================
// GUIDE FOR YOUR UI TEAM
// ============================================
//
// How to add tests for a new component:
//
// 1. Create a file next to your component: ComponentName.test.jsx
//
// 2. Import these:
//    import { describe, it, expect, vi } from 'vitest';
//    import { render, screen, fireEvent } from '@testing-library/react';
//
// 3. Write tests like:
//    describe('MyComponent', () => {
//      it('renders correctly', () => {
//        render(<MyComponent />);
//        expect(screen.getByText('Expected Text')).toBeInTheDocument();
//      });
//    });
//
// 4. Run tests with: npm run test
// 5. Run tests in watch mode: npm run test:watch
//
// Common patterns:
// - screen.getByText('text') - Find by visible text
// - screen.getByRole('button') - Find by role (button, link, etc.)
// - screen.getByPlaceholderText('placeholder') - Find form inputs
// - screen.getByTestId('id') - Find by data-testid attribute
// - fireEvent.click(element) - Simulate click
// - expect(element).toBeInTheDocument() - Check if element exists
// - expect(mockFn).toHaveBeenCalled() - Check if function was called
