import { useRef, useState } from 'react';

const useCamera = () => {
    const videoRef = useRef(null);
    const stream = useRef(null);
    
    const [error, setError] = useState(null);
    
    const startVideoHandler = async () => {
        await startVideo(stream, videoRef, setError); 
    };

    return { 
        videoRef, 
        error, 
        startVideo: startVideoHandler, 
        endVideo:  () => endVideo(stream, videoRef)
    };
};

export default useCamera;

export const startVideo = async (stream, videoRef, setError) => {
    try {
        stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current.srcObject = stream.current;
    } catch(error) {
        //console.log(error);
        setError(`Error accessing camera: ${error}`);
    };
};

export const endVideo = async (stream, videoRef) => {
    const tracks = stream.current?.getTracks();
    tracks?.forEach((tracks) => tracks.stop());
    videoRef.current.srcObject = null;
};