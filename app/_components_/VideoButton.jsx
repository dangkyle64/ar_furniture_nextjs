'use client';

import styles from './VideoButton.module.css';
import useCamera from '../_hooks_/useCamera';

const VideoButton = () => {

    const { videoRef, error, startVideo, endVideo } = useCamera();

    return (
        <div className={styles.container}>
            <button id="video-btn" className={styles.button} onClick={startVideo}>Start Camera</button>
            <button id="video-end-btn" className ={styles.buttonClose} onClick={endVideo}>End Camera</button>
            <video ref={videoRef} className={styles.video} autoPlay muted></video>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default VideoButton;

