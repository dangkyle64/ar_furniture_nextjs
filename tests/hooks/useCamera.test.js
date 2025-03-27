import { renderHook, act, waitFor } from '@testing-library/react';
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import useCamera, { endVideo, startVideo } from '../../app/_hooks_/useCamera';

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

    it('should set error if getUserMedia fails', async () => {
        const errorMessage = 'Permission denied';
        global.navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useCamera());

        await act(async () => {
            await result.current.startVideo();
        });

        expect(result.current.error).toBe(`Error accessing camera: Error: ${errorMessage}`);
    });
});

describe('startVideo Function', () => {

    let videoRef;
    let stream;
    let setError;

    beforeEach(() => {
        videoRef = { current: { srcObject: null } };
        stream = { current: null };
        setError = vi.fn();
    });

    it('should access the camera and set the video stream', async () => {
        const mockStream = { getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]) };
        global.navigator.mediaDevices.getUserMedia = vi.fn().mockResolvedValue(mockStream);

        await startVideo(stream, videoRef, setError);

        expect(videoRef.current.srcObject).toBe(mockStream);
    });

    it('should set error if getUserMedia fails', async () => {
        const errorMessage = 'Permission denied';
        global.navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error(errorMessage));

        await startVideo(stream, videoRef, setError);

        expect(setError).toHaveBeenCalledWith(`Error accessing camera: Error: ${errorMessage}`);
    });
});

describe('endVideo function', () => {
    it('should stop all tracks and set videoRef.srcObject to null', async () => {
        const mockStop = vi.fn();
        const mockTrack = { stop: mockStop };
        const mockStream = { getTracks: vi.fn().mockReturnValue([mockTrack, mockTrack]) };
        const videoRef = { current: { srcObject: mockStream } };  // Mock videoRef

        await endVideo({ current: mockStream }, videoRef);

        expect(mockStream.getTracks).toHaveBeenCalled();
        expect(mockStop).toHaveBeenCalledTimes(2);
        expect(videoRef.current.srcObject).toBeNull();
    });

    it('should not call stop if there are no tracks', async () => {
        const mockStream = { getTracks: vi.fn().mockReturnValue([]) };
        const videoRef = { current: { srcObject: mockStream } };

        await endVideo({ current: mockStream }, videoRef);

        expect(mockStream.getTracks).toHaveBeenCalled();
        expect(mockStream.getTracks).toHaveReturnedWith([]);
        expect(videoRef.current.srcObject).toBeNull();
    });

    it('should not crash if stream is null or undefined', async () => {
        const videoRef = { current: { srcObject: null } }; 

        await endVideo({ current: null }, videoRef);

        expect(videoRef.current.srcObject).toBeNull();
    });
});