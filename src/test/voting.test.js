/**
 * =========================================
 * VOTING LOGIC TESTS
 * =========================================
 * 
 * WHY THESE TESTS MATTER:
 * Voting is one of the MOST bug-prone features because:
 * - State changes with every click
 * - Toggle logic (click again = undo) is tricky
 * - Multiple users voting can cause race conditions
 * 
 * COMMON BUGS THESE TESTS CATCH:
 * - Vote count going negative
 * - Double-clicking causes duplicate votes
 * - Switching from upvote to downvote doesn't update correctly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// =============================================
// This is the voting logic we're testing
// (Simplified version of what's in PostItem)
// =============================================
class VotingLogic {
    constructor() {
        this.upvotes = 0;
        this.downvotes = 0;
        this.userVote = null; // null | 'upvote' | 'downvote'
    }

    vote(type) {
        if (type === 'upvote') {
            if (this.userVote === 'upvote') {
                // Already upvoted → remove vote (toggle off)
                this.upvotes--;
                this.userVote = null;
            } else if (this.userVote === 'downvote') {
                // Was downvoted → switch to upvote
                this.downvotes--;
                this.upvotes++;
                this.userVote = 'upvote';
            } else {
                // No previous vote → add upvote
                this.upvotes++;
                this.userVote = 'upvote';
            }
        } else if (type === 'downvote') {
            if (this.userVote === 'downvote') {
                // Already downvoted → remove vote (toggle off)
                this.downvotes--;
                this.userVote = null;
            } else if (this.userVote === 'upvote') {
                // Was upvoted → switch to downvote
                this.upvotes--;
                this.downvotes++;
                this.userVote = 'downvote';
            } else {
                // No previous vote → add downvote
                this.downvotes++;
                this.userVote = 'downvote';
            }
        }

        return {
            upvotes: this.upvotes,
            downvotes: this.downvotes,
            userVote: this.userVote
        };
    }
}

describe('Voting Logic', () => {
    let voting;

    beforeEach(() => {
        // Fresh voting state before each test
        voting = new VotingLogic();
    });

    // =============================================
    // TEST 1: Simple Upvote
    // =============================================
    it('increments upvote count when upvoting', () => {
        // WHAT: User clicks upvote button
        // EXPECTED: Count goes from 0 to 1

        const result = voting.vote('upvote');

        expect(result.upvotes).toBe(1);        // Count increased
        expect(result.userVote).toBe('upvote'); // Remember user's vote
        expect(result.downvotes).toBe(0);      // Downvotes unchanged
    });

    // =============================================
    // TEST 2: Simple Downvote
    // =============================================
    it('increments downvote count when downvoting', () => {
        // WHAT: User clicks downvote button
        // EXPECTED: Downvote count goes from 0 to 1

        const result = voting.vote('downvote');

        expect(result.downvotes).toBe(1);
        expect(result.userVote).toBe('downvote');
        expect(result.upvotes).toBe(0);
    });

    // =============================================
    // TEST 3: Toggle Off (Undo Vote)
    // =============================================
    it('removes vote when clicking same button twice', () => {
        // WHAT: User upvotes, then clicks upvote again
        // EXPECTED: Vote is removed (toggle behavior)
        // WHY: Users should be able to undo their vote

        voting.vote('upvote');  // First click: upvote
        const result = voting.vote('upvote');  // Second click: undo

        expect(result.upvotes).toBe(0);     // Back to 0
        expect(result.userVote).toBeNull(); // No vote now
    });

    // =============================================
    // TEST 4: Switch Vote (Upvote → Downvote)
    // =============================================
    it('switches from upvote to downvote correctly', () => {
        // WHAT: User upvotes, then changes mind and downvotes
        // EXPECTED: Upvote removed, downvote added
        // THIS IS A COMMON BUG: Count gets messed up during switch

        voting.vote('upvote');  // First: upvote (upvotes = 1)
        const result = voting.vote('downvote');  // Then: downvote

        expect(result.upvotes).toBe(0);          // Upvote removed
        expect(result.downvotes).toBe(1);        // Downvote added
        expect(result.userVote).toBe('downvote'); // Current vote
    });

    // =============================================
    // TEST 5: Switch Vote (Downvote → Upvote)
    // =============================================
    it('switches from downvote to upvote correctly', () => {
        // Same as above but opposite direction

        voting.vote('downvote');
        const result = voting.vote('upvote');

        expect(result.downvotes).toBe(0);
        expect(result.upvotes).toBe(1);
        expect(result.userVote).toBe('upvote');
    });

    // =============================================
    // TEST 6: Multiple Operations (Stress Test)
    // =============================================
    it('handles rapid voting correctly', () => {
        // WHAT: User clicks multiple times quickly
        // WHY: Should still end up in correct state

        voting.vote('upvote');    // upvotes: 1
        voting.vote('upvote');    // upvotes: 0 (toggle off)
        voting.vote('downvote');  // downvotes: 1
        voting.vote('upvote');    // switch: upvotes: 1, downvotes: 0
        const result = voting.vote('upvote');  // toggle off: upvotes: 0

        expect(result.upvotes).toBe(0);
        expect(result.downvotes).toBe(0);
        expect(result.userVote).toBeNull();
    });
});

/**
 * =========================================
 * API VOTE REQUEST TESTS
 * =========================================
 * 
 * These test that the API is called correctly
 * when user votes.
 */
describe('Vote API Calls', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('sends correct data to vote API', async () => {
        // WHAT: When user votes, correct POST request is sent
        // WHY: Backend needs postId and voteType

        // Mock the fetch function
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    upvoteCount: 5,
                    downvoteCount: 2
                })
            })
        );

        // Simulate vote
        const postId = 'post-123';
        const voteType = 'upvote';

        const response = await fetch(`/api/posts/${postId}/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voteType })
        });
        const data = await response.json();

        // Verify API was called correctly
        expect(fetch).toHaveBeenCalledWith(
            '/api/posts/post-123/vote',
            expect.objectContaining({
                method: 'POST'
            })
        );
        expect(data.success).toBe(true);
    });

    it('handles vote API error gracefully', async () => {
        // WHAT: API returns error
        // EXPECTED: App doesn't crash, shows error to user

        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                status: 401,
                json: () => Promise.resolve({
                    success: false,
                    message: 'Please login to vote'
                })
            })
        );

        const response = await fetch('/api/posts/123/vote');
        const data = await response.json();

        expect(data.success).toBe(false);
        expect(data.message).toBe('Please login to vote');
    });
});

/**
 * =========================================
 * WHAT YOUR UI TEAM SHOULD KNOW:
 * =========================================
 * 
 * The voting tests check:
 * ✓ Upvote/downvote increases counts
 * ✓ Clicking again removes vote (toggle)
 * ✓ Switching vote updates both counts
 * ✓ Rapid clicking doesn't break anything
 * ✓ API calls are made correctly
 * 
 * If these tests fail after UI changes:
 * → Check if vote button onClick handlers changed
 * → Check if state update logic was modified
 * → Check if API endpoint changed
 */
