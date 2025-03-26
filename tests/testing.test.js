import { describe, it, expect } from 'vitest';

describe('testing', () => {
    it('should return true', () => {

        const value = 2 + 2;

        expect(value).toBeGreaterThanOrEqual(4);
    });
});