import { useState } from 'react';

export type EffectType = {
  id: string;
  name: string;
  imageSrc: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'top-center' | 'bottom-center';
};

export const effects: EffectType[] = [
  { id: 'none', name: 'None', imageSrc: '', position: 'top-right' },
  { id: 'glasses', name: 'Glasses', imageSrc: '/assets/images/effects/glasses.png', position: 'center' },
  { id: 'hat', name: 'Hat', imageSrc: '/assets/images/effects/hat.png', position: 'top-center' },
  { id: 'beard', name: 'Beard', imageSrc: '/assets/images/effects/beard.png', position: 'bottom-center' },
  { id: 'crown', name: 'Crown', imageSrc: '/assets/images/effects/crown.png', position: 'top-center' },
  { id: 'stars', name: 'Stars', imageSrc: '/assets/images/effects/stars.png', position: 'top-right' },
  { id: 'hearts', name: 'Hearts', imageSrc: '/assets/images/effects/hearts.png', position: 'top-left' },
];

export const useEffect = () => {
  const [activeEffect, setActiveEffect] = useState<EffectType>(effects[0]);
  
  return {
    effects,
    activeEffect,
    setActiveEffect
  };
};