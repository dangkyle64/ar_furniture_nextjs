import { renderHook, act } from '@testing-library/react';
import { it, expect, describe, vi, beforeEach, afterEach } from 'vitest';
import useCamera, { endVideo, startVideo, stopRecording } from '../../app/_hooks_/useCamera';

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

        expect(result.current.error).toBeNull();
        expect(result.current.isRecording).toBe(false);
        expect(result.current.videoUrl).toBe(null);
        expect(result.current.videoRef).toBeDefined();

        expect(typeof result.current.startVideo).toBe('function');
        expect(typeof result.current.endVideo).toBe('function');
        expect(typeof result.current.startRecording).toBe('function');
        expect(typeof result.current.stopRecording).toBe('function');
        expect(typeof result.current.resetRecording).toBe('function');
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

    let stream;
    let setError;

    beforeEach(() => {
        stream = { current: null };
        setError = vi.fn();
    });

    it('should access the camera and set the video stream', async () => {
        const mockStream = { getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]) };
        global.navigator.mediaDevices.getUserMedia = vi.fn().mockResolvedValue(mockStream);

        await startVideo(stream, setError);
        expect(stream.current).toBe(mockStream);
    });

    it('should set error if getUserMedia fails', async () => {
        const errorMessage = 'Permission denied';
        global.navigator.mediaDevices.getUserMedia = vi.fn().mockRejectedValue(new Error(errorMessage));

        await startVideo(stream, setError);

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

describe('stopRecording', () => {
    let mediaRecorderRef;
    let setIsRecording;

    beforeEach(() => {
        mediaRecorderRef = { current: { stop: vi.fn() } };
        setIsRecording = vi.fn();
    });

    it('should stop the current mediaRecorderRef if valid', () => {
        stopRecording(mediaRecorderRef, setIsRecording);

        expect(mediaRecorderRef.current.stop).toHaveBeenCalledTimes(1);
        expect(setIsRecording).toHaveBeenCalledWith(false);
    });

    it('should not call stop if mediaRecorderRef.current is null', () => {
        mediaRecorderRef.current = null;

        console.log('Calling stopRecording');
        stopRecording(mediaRecorderRef, setIsRecording);

        expect(mediaRecorderRef.current).toBeNull();
        expect(setIsRecording).toHaveBeenCalledWith(false);
    });

    it('should call setIsRecording if an error occurs', () => {
        const error = new Error('Failed to stop recording');
        mediaRecorderRef.current.stop.mockImplementationOnce(() => {
            throw error;
        });
    
        stopRecording(mediaRecorderRef, setIsRecording);
    
        expect(setIsRecording).toHaveBeenCalledWith(false);
    });
});