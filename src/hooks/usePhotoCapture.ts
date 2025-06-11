import { useCallback } from 'react';
import { usePhotoboothContext } from '../contexts/PhotoboothContext';
import { useBackgroundRemoval } from './useBackgroundRemoval';

export const usePhotoCapture = () => {
  const { 
    activeFilter, 
    activeEffect, 
    activeBackground,
    isBackgroundRemovalEnabled
  } = usePhotoboothContext();
  
  const { removeBackground } = useBackgroundRemoval();

  const capturePhoto = useCallback(async () => {
    const video = document.querySelector('video');
    if (!video) {
      console.error('No video element found');
      return null;
    }

    try {
      // Make sure video has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video has no dimensions, possibly not loaded');
        return null;
      }

      // Create a canvas element with the same dimensions as the video
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('Could not get canvas context');
        return null;
      }
      
      // Handle background removal if enabled
      if (isBackgroundRemovalEnabled) {
        const processedImage = await removeBackground(video, activeBackground.color);
        if (processedImage) {
          // Create a temporary image to draw the processed image onto canvas
          const img = new Image();
          img.src = processedImage;
          
          // Wait for image to load
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;  // Continue even on error
            setTimeout(resolve, 1000);  // Timeout safety
          });
          
          // Apply filter
          context.filter = activeFilter.cssFilter;
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          context.filter = 'none';
        } else {
          // Fallback if processing failed
          context.fillStyle = activeBackground.color;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.filter = activeFilter.cssFilter;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          context.filter = 'none';
        }
      } else {
        // Standard processing without background removal
        if (activeBackground.id !== 'transparent') {
          context.fillStyle = activeBackground.color;
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add a small padding for the video on top of the background
          const padding = 20;
          const videoWidth = canvas.width - (padding * 2);
          const videoHeight = canvas.height - (padding * 2);
          
          // Apply filter to the video
          context.filter = activeFilter.cssFilter;
          context.drawImage(video, padding, padding, videoWidth, videoHeight);
          // Reset filter for other operations
          context.filter = 'none';
        } else {
          // No background case, just draw the video with filter
          context.filter = activeFilter.cssFilter;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          context.filter = 'none';
        }
      }
      
      // Add effects if present
      if (activeEffect && activeEffect.id !== 'none' && activeEffect.imageSrc) {
        // Load effect image
        const effectImg = new Image();
        effectImg.crossOrigin = 'anonymous';
        effectImg.src = activeEffect.imageSrc;
        
        // Wait for the image to load
        await new Promise((resolve) => {
          effectImg.onload = resolve;
          effectImg.onerror = () => {
            console.error('Failed to load effect image');
            resolve(null);
          };
          setTimeout(resolve, 1000); // Safety timeout
        });
        
        // Position based on effect position
        let x = 0, y = 0;
        const width = canvas.width / 3; // use 1/3 of the canvas width
        const height = (effectImg.height / effectImg.width) * width;
        
        switch (activeEffect.position) {
          case 'top-left':
            x = 0;
            y = 0;
            break;
          case 'top-right':
            x = canvas.width - width;
            y = 0;
            break;
          case 'bottom-left':
            x = 0;
            y = canvas.height - height;
            break;
          case 'bottom-right':
            x = canvas.width - width;
            y = canvas.height - height;
            break;
          case 'top-center':
            x = (canvas.width - width) / 2;
            y = 0;
            break;
          case 'bottom-center':
            x = (canvas.width - width) / 2;
            y = canvas.height - height;
            break;
          case 'center':
            x = (canvas.width - width) / 2;
            y = (canvas.height - height) / 2;
            break;
        }
        
        // Draw the effect
        context.drawImage(effectImg, x, y, width, height);
      }
      
      // Convert the canvas to a data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing photo:', error);
      return null;
    }
  }, [activeFilter, activeEffect, activeBackground, isBackgroundRemovalEnabled, removeBackground]);

  return { capturePhoto };
};