'use client';

import styles from './VideoButton.module.css';
import useCamera from '../_hooks_/useCamera';
import useRecording from '../_hooks_/useRecording';
import { useEffect } from 'react';

const VideoButton = () => {

    const { videoRef, stream, error, startVideo, endVideo } = useCamera();
    const { 
        isRecording, 
        videoUrl, 
        error: recordingError, 
        startRecording, 
        stopRecording, 
        resetRecording 
    } = useRecording(stream);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    return (
        <div className={styles.container}>
            <button id="video-btn" className={styles.button} onClick={startVideo}>Start Camera</button>
            <button id="video-end-btn" className ={styles.buttonClose} onClick={endVideo}>End Camera</button>
            <video ref={videoRef} className={styles.video} autoPlay muted></video>
            {error && <div className={styles.error}>{error}</div>}

            {recordingError && <p>Error: {recordingError}</p>}
            {!isRecording ? (
                <button onClick={startRecording}>Start Recording</button>
            ) : (
                <button onClick={stopRecording}>Stop Recording</button>
            )}
            <button onClick={resetRecording}>Reset</button>
            {videoUrl && (
                <div>
                    <h2>Your recorded video:</h2>
                    <video controls width="400" height="300" src={videoUrl} />
                    <a href={videoUrl} download="recorded-video.webm">Download Video</a>
                </div>
            )}
        </div>
    );
};

export default VideoButton;

