// src/features/frames/frameOptions.ts
export type FrameType = {
  id: string;
  name: string;
  imgSrc: string;
  gridType: 'single' | '2x2' | '3x3' | '4x4' | 'custom';
};

export const frames: FrameType[] = [
  // Single Frames
  {
    id: 'single-simple',
    name: 'Simple Pink',
    imgSrc: '/assets/frames/single/simple-pink.png',
    gridType: 'single'
  },
  {
    id: 'single-hearts',
    name: 'Hearts',
    imgSrc: '/assets/frames/single/hearts.png',
    gridType: 'single'
  },
  {
    id: 'single-flowers',
    name: 'Flowers',
    imgSrc: '/assets/frames/single/flowers.png',
    gridType: 'single'
  },
  {
    id: 'single-polaroid',
    name: 'Polaroid',
    imgSrc: '/assets/frames/single/polaroid.png',
    gridType: 'single'
  },
  
  // 2x2 Grid Frames
  {
    id: 'grid-2x2-simple',
    name: 'Simple Grid',
    imgSrc: '/grid-1.jpg',
    gridType: '2x2'
  },
  {
    id: 'grid-2x2-hearts',
    name: 'Heart Grid',
    imgSrc: '/assets/frames/grid/2x2-hearts.png',
    gridType: '2x2'
  },
  {
    id: 'grid-2x2-flowers',
    name: 'Flower Grid',
    imgSrc: '/assets/frames/grid/2x2-flowers.png',
    gridType: '2x2'
  },
  
  // 3x3 Grid Frames
  {
    id: 'grid-3x3-simple',
    name: 'Simple 3x3',
    imgSrc: '/assets/frames/grid/3x3-simple.png',
    gridType: '3x3'
  },
  {
    id: 'grid-3x3-stars',
    name: 'Stars 3x3',
    imgSrc: '/assets/frames/grid/3x3-stars.png',
    gridType: '3x3'
  },
  
  // 4x4 Grid Frames
  {
    id: 'grid-4x4-simple',
    name: 'Simple 4x4',
    imgSrc: '/assets/frames/grid/4x4-simple.png',
    gridType: '4x4'
  }
];

export const getFramesByGridType = (gridType: string): FrameType[] => {
  return frames.filter(frame => frame.gridType === gridType);
};