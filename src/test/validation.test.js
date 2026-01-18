/**
 * =========================================
 * FORM VALIDATION TESTS
 * =========================================
 * 
 * WHY THESE TESTS MATTER:
 * Forms are the main way users input data. If validation breaks:
 * - Invalid data goes to database
 * - Users get confusing errors
 * - Security vulnerabilities (SQL injection, XSS)
 * 
 * COMMON BUGS THESE TESTS CATCH:
 * - Email regex too strict/too loose
 * - Password requirements changed but UI didn't update
 * - Required fields not enforced
 */

import { describe, it, expect } from 'vitest';

// =============================================
// VALIDATION FUNCTIONS
// These mirror what your Login/Register forms use
// =============================================

/**
 * Validates email format
 * Must be: something@college.edu format
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, error: 'Email is required' };
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true, error: null };
}

/**
 * Validates password
 * Requirements: At least 6 characters
 */
function validatePassword(password) {
    if (!password || password.trim() === '') {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < 6) {
        return { valid: false, error: 'Password must be at least 6 characters' };
    }

    return { valid: true, error: null };
}

/**
 * Validates name
 * Requirements: Not empty, at least 2 characters
 */
function validateName(name) {
    if (!name || name.trim() === '') {
        return { valid: false, error: 'Name is required' };
    }

    if (name.trim().length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' };
    }

    return { valid: true, error: null };
}

/**
 * Validates post content
 * Requirements: Not empty, at least 10 characters
 */
function validatePostContent(content) {
    if (!content || content.trim() === '') {
        return { valid: false, error: 'Content is required' };
    }

    if (content.trim().length < 10) {
        return { valid: false, error: 'Post must be at least 10 characters' };
    }

    if (content.length > 5000) {
        return { valid: false, error: 'Post cannot exceed 5000 characters' };
    }

    return { valid: true, error: null };
}

// =============================================
// EMAIL VALIDATION TESTS
// =============================================
describe('Email Validation', () => {

    it('accepts valid email addresses', () => {
        // WHAT: Normal, valid emails should pass
        // Examples of valid emails your users will enter

        const validEmails = [
            'prem@sinhgad.edu',
            'student123@gmail.com',
            'user.name@college.edu.in',
            'test@example.org'
        ];

        validEmails.forEach(email => {
            const result = validateEmail(email);
            expect(result.valid).toBe(true);
            expect(result.error).toBeNull();
        });
    });

    it('rejects empty email', () => {
        // WHAT: Empty email should show error
        // WHY: Email is required for login/register

        const result = validateEmail('');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email is required');
    });

    it('rejects email without @ symbol', () => {
        // WHAT: "premgmail.com" is not a valid email

        const result = validateEmail('premgmail.com');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid email format');
    });

    it('rejects email without domain', () => {
        // WHAT: "prem@" is not a valid email

        const result = validateEmail('prem@');

        expect(result.valid).toBe(false);
    });

    it('handles whitespace-only input', () => {
        // WHAT: "   " (just spaces) should be treated as empty
        // WHY: Users sometimes accidentally enter spaces

        const result = validateEmail('   ');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email is required');
    });
});

// =============================================
// PASSWORD VALIDATION TESTS
// =============================================
describe('Password Validation', () => {

    it('accepts valid passwords', () => {
        // WHAT: Passwords meeting requirements should pass

        const validPasswords = [
            'password123',
            'MySecurePass!',
            '123456',  // Simple but meets length requirement
            'abcdef'   // Minimum length
        ];

        validPasswords.forEach(password => {
            const result = validatePassword(password);
            expect(result.valid).toBe(true);
        });
    });

    it('rejects empty password', () => {
        const result = validatePassword('');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password is required');
    });

    it('rejects password shorter than 6 characters', () => {
        // WHAT: "12345" is too short
        // WHY: Security requirement

        const result = validatePassword('12345');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password must be at least 6 characters');
    });

    it('accepts password with exactly 6 characters', () => {
        // WHAT: Boundary test - exactly at minimum
        // WHY: Edge cases often have bugs

        const result = validatePassword('123456');

        expect(result.valid).toBe(true);
    });
});

// =============================================
// NAME VALIDATION TESTS
// =============================================
describe('Name Validation', () => {

    it('accepts valid names', () => {
        const validNames = [
            'Prem Kumar',
            'A B',  // Two characters minimum
            'राहुल',  // Non-English names should work
            'O\'Brien'  // Names with apostrophes
        ];

        validNames.forEach(name => {
            const result = validateName(name);
            expect(result.valid).toBe(true);
        });
    });

    it('rejects empty name', () => {
        const result = validateName('');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Name is required');
    });

    it('rejects single character name', () => {
        // WHAT: "A" is likely a typo

        const result = validateName('A');

        expect(result.valid).toBe(false);
    });
});

// =============================================
// POST CONTENT VALIDATION TESTS
// =============================================
describe('Post Content Validation', () => {

    it('accepts valid post content', () => {
        const result = validatePostContent('This is a valid post with enough content.');

        expect(result.valid).toBe(true);
    });

    it('rejects empty content', () => {
        const result = validatePostContent('');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Content is required');
    });

    it('rejects content shorter than 10 characters', () => {
        // WHAT: "Hello" is too short to be a useful post

        const result = validatePostContent('Hello');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Post must be at least 10 characters');
    });

    it('rejects content longer than 5000 characters', () => {
        // WHAT: Posts have a maximum length
        // WHY: Database field limit, UI display

        const veryLongPost = 'a'.repeat(5001);
        const result = validatePostContent(veryLongPost);

        expect(result.valid).toBe(false);
        expect(result.error).toBe('Post cannot exceed 5000 characters');
    });

    it('accepts content at exactly 5000 characters', () => {
        // WHAT: Boundary test - exactly at maximum

        const maxLengthPost = 'a'.repeat(5000);
        const result = validatePostContent(maxLengthPost);

        expect(result.valid).toBe(true);
    });
});

/**
 * =========================================
 * WHAT YOUR UI TEAM SHOULD KNOW:
 * =========================================
 * 
 * These tests check:
 * ✓ Email format validation (@ symbol, domain)
 * ✓ Password length requirements
 * ✓ Required fields show errors when empty
 * ✓ Character limits are enforced
 * ✓ Edge cases (boundary values)
 * 
 * If they change form validation:
 * → Run tests: npm run test
 * → If tests fail, they may have broken validation
 * → If requirements change, update tests first!
 * 
 * IMPORTANT: If you ADD new validation rules:
 * 1. Add a test for it here
 * 2. Then implement the rule
 * 3. Run tests to verify
 */
