/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/photobooth/CameraView.tsx
import { useRef, useEffect, useState } from "react";
import { useCamera } from "../../features/camera/hooks/useCamera";
import { usePhotoboothContext } from "../../contexts/PhotoboothContext";
import { useBackgroundRemoval } from "../../hooks/useBackgroundRemoval";

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, startCamera, stopCamera } = useCamera();
  const [isLoading, setIsLoading] = useState(true);
  const {
    activeFilter,
    activeEffect,
    activeBackground,
    isBackgroundRemovalEnabled,
  } = usePhotoboothContext();
  const { removeBackground, isModelLoading } = useBackgroundRemoval();
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null
  );
  const processFrameIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        setIsLoading(true);
        const mediaStream = await startCamera();

        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Failed to setup camera:", error);
      } finally {
        setIsLoading(false);
      }
    }

    setupCamera();

    return () => {
      stopCamera();
      if (processFrameIntervalRef.current) {
        clearInterval(processFrameIntervalRef.current);
      }
    };
  }, [startCamera, stopCamera]);

  // Process video frames when background removal is enabled
  useEffect(() => {
    if (isBackgroundRemovalEnabled && !isModelLoading && videoRef.current) {
      // Clear any previous interval
      if (processFrameIntervalRef.current) {
        clearInterval(processFrameIntervalRef.current);
      }

      // Process a frame every 100ms (adjust for performance)
      processFrameIntervalRef.current = window.setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          const processedFrame = await removeBackground(
            videoRef.current,
            activeBackground.color
          );
          if (processedFrame) {
            setProcessedVideoUrl(processedFrame);
          }
        }
      }, 100);
    } else {
      // Clear interval if background removal is disabled
      if (processFrameIntervalRef.current) {
        clearInterval(processFrameIntervalRef.current);
        processFrameIntervalRef.current = null;
      }
      setProcessedVideoUrl(null);
    }

    return () => {
      if (processFrameIntervalRef.current) {
        clearInterval(processFrameIntervalRef.current);
      }
    };
  }, [
    isBackgroundRemovalEnabled,
    isModelLoading,
    activeBackground,
    removeBackground,
  ]);

  const handleCanPlay = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.error("Error playing video:", e));
    }
  };

  const getEffectPositionClasses = () => {
    switch (activeEffect.position) {
      case "top-left":
        return "top-0 left-0";
      case "top-right":
        return "top-0 right-0";
      case "bottom-left":
        return "bottom-0 left-0";
      case "bottom-right":
        return "bottom-0 right-0";
      case "top-center":
        return "top-0 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-0 left-1/2 transform -translate-x-1/2";
      case "center":
      default:
        return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    }
  };

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        backgroundColor: activeBackground.color,
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {(isLoading || (isBackgroundRemovalEnabled && isModelLoading)) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg z-20">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">
            {isBackgroundRemovalEnabled && isModelLoading
              ? "Loading background removal..."
              : "Loading camera..."}
          </p>
        </div>
      )}

      <div className="relative w-full h-full">
        {/* Hidden video element for processing */}
        <video
          ref={videoRef}
          className={
            isBackgroundRemovalEnabled ? "hidden" : "rounded-lg w-full h-auto"
          }
          style={{
            filter: activeFilter.cssFilter,
            display: isBackgroundRemovalEnabled ? "none" : "block",
          }}
          autoPlay
          playsInline
          muted
          onCanPlay={handleCanPlay}
        />

        {/* Display processed video frame with background removal */}
        {isBackgroundRemovalEnabled && processedVideoUrl && (
          <img
            src={processedVideoUrl}
            alt="Processed video"
            className="w-full h-auto rounded-lg"
            style={{ filter: activeFilter.cssFilter }}
          />
        )}
      </div>

      {/* Apply selected effect */}
      {activeEffect && activeEffect.id !== "none" && activeEffect.imageSrc && (
        <img
          src={activeEffect.imageSrc}
          className={`absolute ${getEffectPositionClasses()} h-auto w-1/3 object-contain z-10`}
          alt={`${activeEffect.name} effect`}
        />
      )}
    </div>
  );
};

export default CameraView;
