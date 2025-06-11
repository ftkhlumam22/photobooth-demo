import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { type FilterType, filters } from "../features/filters/hooks/useFilter";
import { type EffectType, effects } from "../features/effects/hooks/useEffect";
import {
  type BackgroundType,
  backgrounds,
} from "../features/background/hooks/useBackground";

interface PhotoboothContextType {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  activeEffect: EffectType;
  setActiveEffect: (effect: EffectType) => void;
  activeBackground: BackgroundType;
  setActiveBackground: (background: BackgroundType) => void;
  isBackgroundRemovalEnabled: boolean;
  setIsBackgroundRemovalEnabled: (value: boolean) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
}

const PhotoboothContext = createContext<PhotoboothContextType | undefined>(
  undefined
);

interface PhotoboothProviderProps {
  children: ReactNode;
}

export const PhotoboothProvider: React.FC<PhotoboothProviderProps> = ({
  children,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>(filters[0]);
  const [activeEffect, setActiveEffect] = useState<EffectType>(effects[0]);
  const [activeBackground, setActiveBackground] = useState<BackgroundType>(
    backgrounds[0]
  );
  const [isBackgroundRemovalEnabled, setIsBackgroundRemovalEnabled] =
    useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <PhotoboothContext.Provider
      value={{
        activeFilter,
        setActiveFilter,
        activeEffect,
        setActiveEffect,
        activeBackground,
        setActiveBackground,
        isBackgroundRemovalEnabled,
        setIsBackgroundRemovalEnabled,
        capturedImage,
        setCapturedImage,
      }}
    >
      {children}
    </PhotoboothContext.Provider>
  );
};

export const usePhotoboothContext = () => {
  const context = useContext(PhotoboothContext);
  if (context === undefined) {
    throw new Error(
      "usePhotoboothContext must be used within a PhotoboothProvider"
    );
  }
  return context;
};
