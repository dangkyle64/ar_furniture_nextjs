'use client';

import styles from './VideoButton.module.css';
import useCamera from '../_hooks_/useCamera';
import { useState, useEffect } from 'react';

import RecordedVideoMenu from './RecordedVideoMenu/RecordedVideoMenu';

const VideoButton = () => {

    const { videoRef, isRecording, videoUrl, error, startVideo, endVideo, startRecording, stopRecording, resetRecording } = useCamera();
    const [showRecordedVideo, setShowRecordedVideo] = useState(true);
    const [showRecordedVideoOptions, setShowRecordedVideoOptions] = useState(false);
    const [showVideo, setShowVideo] = useState(true);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    const handleRecordingStart = async () => {
        await startVideo();
        startRecording();
    };

    const handleRecordingEnd = () => {
        endVideo();
        stopRecording();
        setShowRecordedVideoOptions(true);
        setShowVideo(false);
        setShowRecordedVideo(true);
    };

    const handleToggleRecordedVideo = () => {
        setShowRecordedVideo(!showRecordedVideo);
        setShowRecordedVideoOptions(false);
        setShowVideo(true);
    };

    return (
        <>
            {showVideo && (
                <div className={styles.container}>
                    <video ref={videoRef} className={styles.video} autoPlay muted></video>
                    {error && <div className={styles.error}>{error}</div>}
    
                    {!isRecording ? (
                        <button className={styles.buttonRecord} onClick={handleRecordingStart}>Start Recording</button>
                    ) : (
                        <button className={styles.buttonRecordClose} onClick={handleRecordingEnd}>Stop Recording</button>
                    )}
                    <button className={styles.buttonRecordReset} onClick={resetRecording}>Reset</button>    
                </div>
            )}

            {showRecordedVideoOptions && (
                <RecordedVideoMenu
                    videoUrl={videoUrl}
                    handleToggleRecordedVideo={handleToggleRecordedVideo}
                />
            )}        
        </>
    );
    
};

export default VideoButton;

