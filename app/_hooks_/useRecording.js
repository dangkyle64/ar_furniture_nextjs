import { useState, useRef } from 'react';

const useRecording = (stream) => {
    const [isRecording, setIsRecording] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError]  = useState(null);

    const mediaRecorderRef = useRef(null);
    const recordedChunks = useRef([]);
    const videoRef = useRef(null);

    const startRecording = () => {
        if (!stream && stream !== null) {
            setError('No stream avaliable to record');
            return;
        };

        try {
            console.log(stream.current);
            const mediaRecorder = new MediaRecorder(stream.current);

            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                recordedChunks.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks.current, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(blob);
                setVideoUrl(videoUrl);
                recordedChunks.current = [];
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch(error) {
            setError(`Error starting the recording: ${error}`);
        };
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        };
    };

    const resetRecording = () => {
        setIsRecording(false);
        setVideoUrl(null);
        setError(null);
    };

    return {
        isRecording,
        videoUrl,
        error,
        startRecording,
        stopRecording,
        resetRecording,
    };
};

export default useRecording;