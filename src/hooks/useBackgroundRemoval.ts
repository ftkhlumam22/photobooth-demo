import { useCallback, useEffect, useState } from 'react';
import * as bodyPix from '@tensorflow-models/body-pix';
import '@tensorflow/tfjs';

export const useBackgroundRemoval = () => {
  const [model, setModel] = useState<bodyPix.BodyPix | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);

  useEffect(() => {
    async function loadModel() {
      try {
        setIsModelLoading(true);
        const loadedModel = await bodyPix.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2
        });
        console.log('BodyPix model loaded');
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Failed to load BodyPix model:', error);
        setIsModelLoading(false);
      }
    }

    loadModel();
  }, []);

  const removeBackground = useCallback(async (
    inputImageElement: HTMLImageElement | HTMLVideoElement,
    backgroundToApply: string
  ): Promise<string | null> => {
    if (!model) return null;
    
    try {
      const segmentation = await model.segmentPerson(inputImageElement);
      
      const canvas = document.createElement('canvas');
      canvas.width = inputImageElement instanceof HTMLVideoElement 
        ? inputImageElement.videoWidth 
        : inputImageElement.width;
      canvas.height = inputImageElement instanceof HTMLVideoElement 
        ? inputImageElement.videoHeight 
        : inputImageElement.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Draw background color/image
      if (backgroundToApply !== 'transparent') {
        ctx.fillStyle = backgroundToApply;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw person
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Draw the original image onto the canvas
      ctx.drawImage(inputImageElement, 0, 0);
      
      // Get the image data from the canvas
      const originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Apply the background
      for (let i = 0; i < segmentation.data.length; i++) {
        // If this pixel is NOT part of a person
        if (segmentation.data[i] === 0) {
          // Make this pixel transparent in the output
          const pixelIndex = i * 4;
          
          if (backgroundToApply === 'transparent') {
            // For transparent background, set alpha to 0
            originalImageData.data[pixelIndex + 3] = 0;
          } else {
            // For colored background, use the background color we created
            originalImageData.data[pixelIndex] = imageData.data[pixelIndex];
            originalImageData.data[pixelIndex + 1] = imageData.data[pixelIndex + 1];
            originalImageData.data[pixelIndex + 2] = imageData.data[pixelIndex + 2];
            originalImageData.data[pixelIndex + 3] = imageData.data[pixelIndex + 3];
          }
        }
      }
      
      // Put the modified image data back on the canvas
      ctx.putImageData(originalImageData, 0, 0);
      
      // Return as data URL
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error in background removal:', error);
      return null;
    }
  }, [model]);

  return { 
    removeBackground, 
    isModelLoading 
  };
};