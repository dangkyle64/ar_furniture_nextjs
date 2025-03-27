import { renderHook, act } from '@testing-library/react';
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import useCamera from '../../app/_hooks_/useCamera';

beforeEach(() => {
    global.navigator.mediaDevices = {
        getUserMedia: vi.fn(),
    };
});

afterEach(() => {
    vi.clearAllMocks();
});

describe('useCamera hook', () => {
    it('should have initial state values', () => {
        const { result } = renderHook(() => useCamera());

        expect(result.current.videoRef).toBeDefined();
        expect(result.current.error).toBeNull();
        expect(typeof result.current.startVideo).toBe('function');
        expect(typeof result.current.endVideo).toBe('function');
    });
});