import styles from "./RecordedVideoMenu.module.css";

const RecordedVideoMenu = ({ videoUrl, handleToggleRecordedVideo, resetRecording }) => {

    //console.log(videoUrl);

    return (
        <div className={styles.container}>
            <button className={styles.buttonClose} onClick={handleToggleRecordedVideo}>Toggle</button>
            <button className={styles.buttonRecordReset} onClick={resetRecording}>Reset</button>
            {videoUrl && (
                <div className={styles.videoRecorded}>
                    <video controls src={videoUrl} />
                    <a href={videoUrl} download="recorded-video.webm">Download Video</a>
                </div>
            )}
        </div>
    );
};

export default RecordedVideoMenu;