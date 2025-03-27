const useCamera = () => {
    const videoRef = useRef(null);
    const stream = useRef(null);
    
    const [error, setError] = useState(null);
    
    const startVideo = async () => {
        try {
            stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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

    return { videoRef, error, startVideo, endVideo };
};

export default useCamera;