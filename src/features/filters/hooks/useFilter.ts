import { useState } from 'react';

export type FilterType = {
  id: string;
  name: string;
  cssFilter: string;
};

export const filters: FilterType[] = [
  { id: 'normal', name: 'Normal', cssFilter: 'none' },
  { id: 'grayscale', name: 'Grayscale', cssFilter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', cssFilter: 'sepia(100%)' },
  { id: 'vintage', name: 'Vintage', cssFilter: 'sepia(80%) contrast(110%) brightness(110%) saturate(140%)' },
  { id: 'blur', name: 'Blur', cssFilter: 'blur(2px)' },
  { id: 'contrast', name: 'High Contrast', cssFilter: 'contrast(150%)' },
  { id: 'brightness', name: 'Bright', cssFilter: 'brightness(150%)' },
  { id: 'saturate', name: 'Saturated', cssFilter: 'saturate(200%)' },
];

export const useFilter = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(filters[0]);

  return {
    filters,
    activeFilter,
    setActiveFilter
  };
};