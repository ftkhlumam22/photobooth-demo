import { useState, useCallback, useRef } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      console.log("Requesting camera access...");
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      
      console.log("Camera access granted, tracks:", mediaStream.getTracks().length);
      
      setStream(mediaStream);
      streamRef.current = mediaStream;
      return mediaStream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      console.log("Stopping camera tracks...");
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}, enabled: ${track.enabled}`);
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  return { stream, startCamera, stopCamera };
};