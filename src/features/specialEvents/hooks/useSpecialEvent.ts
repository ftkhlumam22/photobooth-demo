import { useState } from 'react';

export type SpecialEventType = {
  id: string;
  name: string;
  component: React.ComponentType;
};

export const useSpecialEvent = (events: SpecialEventType[]) => {
  const [activeEvent, setActiveEvent] = useState<SpecialEventType | null>(null);
  
  return {
    events,
    activeEvent,
    setActiveEvent
  };
};