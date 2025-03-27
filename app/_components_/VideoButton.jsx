'use client';

import { useRef, useState } from 'react';
import styles from './VideoButton.module.css';

const VideoButton = () => {

    const { videoRef, error, startVideo, endVideo } = useCamera();

    return (
        <div className={styles.container}>
            <button id="video-btn" onClick={startVideo}>Start Camera</button>
            <button id="video-end-btn" onClick={endVideo}>End Camera</button>
            <video ref={videoRef} className={styles.video} autoPlay muted></video>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default VideoButton;

