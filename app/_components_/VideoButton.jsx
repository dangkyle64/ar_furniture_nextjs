'use client';

import { useRef, useState } from 'react';
import styles from './VideoButton.module.css';

const VideoButton = () => {

    const videoRef = useRef(null);
    const stream = useRef(null);

    const [error, setError] = useState(null);

    const startVideo = async () => {
        try {
            stream.current = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log('Video Stream:', stream.current);
            videoRef.current.srcObject = stream.current;
            console.log('video started');

        } catch(error) {
            console.log(error);
            setError(`Error accessing camera: ${error}`);
        };
    };

    const endVideo = async () => {
        const tracks = stream.current?.getTracks();
        tracks?.forEach((tracks) => tracks.stop());
        videoRef.current.srcObject = null;
    };

    return (
        <div>
            <button id="video-btn" onClick={startVideo}>Start Camera</button>
            <button id="video-end-btn" onClick={endVideo}>End Camera</button>
            <video ref={videoRef} className={styles.video} autoPlay muted></video>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default VideoButton;