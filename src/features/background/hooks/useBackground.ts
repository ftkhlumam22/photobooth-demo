import { useState } from 'react';

export type BackgroundType = {
  id: string;
  name: string;
  color: string;
};

export const backgrounds: BackgroundType[] = [
  { id: 'transparent', name: 'None', color: 'transparent' },
  { id: 'white', name: 'White', color: '#ffffff' },
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'red', name: 'Red', color: '#ef4444' },
  { id: 'green', name: 'Green', color: '#10b981' },
  { id: 'yellow', name: 'Yellow', color: '#f59e0b' },
  { id: 'purple', name: 'Purple', color: '#8b5cf6' },
  { id: 'pink', name: 'Pink', color: '#ec4899' },
  { id: 'gray', name: 'Gray', color: '#6b7280' },
];

export const useBackground = () => {
  const [activeBackground, setActiveBackground] = useState<BackgroundType>(backgrounds[0]);

  return {
    backgrounds,
    activeBackground,
    setActiveBackground,
  };
};