// Test setup file for Vitest + React Testing Library
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test to prevent memory leaks
afterEach(() => {
    cleanup();
});

// Mock window.matchMedia (used by some UI components)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver (used by some UI libraries)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock IntersectionObserver (used for lazy loading)
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock scrollTo (used in navigation)
window.scrollTo = vi.fn();

// Mock scrollIntoView (used in ChatWidget)
Element.prototype.scrollIntoView = vi.fn();

// Suppress console errors during tests (optional, remove if you want to see all errors)
// vi.spyOn(console, 'error').mockImplementation(() => {});
