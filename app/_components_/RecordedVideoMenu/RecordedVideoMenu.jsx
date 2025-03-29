import useCamera from "../../_hooks_/useCamera";
import styles from "./RecordedVideoMenu.module.css";

const RecordedVideoMenu = (handleToggleRecordedVideo) => {

    const { videoUrl } = useCamera();

    return (
        <div>
            <button onClick={handleToggleRecordedVideo}>Toggle</button>
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