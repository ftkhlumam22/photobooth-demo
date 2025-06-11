/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/photobooth/FrameSelector.tsx
import { useState } from "react";
import {
  frames,
  getFramesByGridType,
} from "../../features/frames/frameOptions";
import FeminineCard from "../ui/FeminineCard";

interface FrameSelectorProps {
  gridType: "single" | "2x2" | "3x3" | "4x4";
  onSelectFrame: (frameId: string) => void;
  selectedFrameId: string | null;
}

const FrameSelector: React.FC<FrameSelectorProps> = ({
  gridType,
  onSelectFrame,
  selectedFrameId,
}) => {
  const availableFrames = getFramesByGridType(gridType);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-pink-700 mb-3">
        Choose a Cute Frame
      </h3>

      {availableFrames.length === 0 ? (
        <p className="text-pink-400 italic">
          No frames available for this grid size
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div
            key="no-frame"
            className={`relative cursor-pointer rounded-lg border-2 p-1 ${
              selectedFrameId === null
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-pink-300"
            }`}
            onClick={() => onSelectFrame(null as any)}
          >
            <div className="aspect-square bg-gray-100 rounded flex items-center justify-center text-gray-400">
              No Frame
            </div>
            {selectedFrameId === null && (
              <div className="absolute top-1 right-1 bg-pink-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                ✓
              </div>
            )}
          </div>

          {availableFrames.map((frame) => (
            <div
              key={frame.id}
              className={`relative cursor-pointer rounded-lg border-2 p-1 ${
                selectedFrameId === frame.id
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 hover:border-pink-300"
              }`}
              onClick={() => onSelectFrame(frame.id)}
            >
              <img
                src={frame.imgSrc}
                alt={frame.name}
                className="w-full aspect-square object-contain"
              />
              {selectedFrameId === frame.id && (
                <div className="absolute top-1 right-1 bg-pink-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrameSelector;
