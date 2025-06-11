import { usePhotoboothContext } from "../../contexts/PhotoboothContext";
import { effects } from "../../features/effects/hooks/useEffect";

const EffectSelector = () => {
  const { activeEffect, setActiveEffect } = usePhotoboothContext();

  return (
    <div className="effect-selector">
      <h3 className="text-lg font-medium mb-3">Select Effect</h3>
      <div className="grid grid-cols-2 gap-2">
        {effects.map((effect) => (
          <div
            key={effect.id}
            className={`p-2 text-center rounded cursor-pointer ${
              activeEffect.id === effect.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveEffect(effect)}
          >
            {effect.imageSrc ? (
              <div className="flex flex-col items-center">
                <img
                  src={effect.imageSrc}
                  alt={effect.name}
                  className="h-12 w-12 object-contain mb-1"
                />
                <span className="text-xs">{effect.name}</span>
              </div>
            ) : (
              <span>{effect.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EffectSelector;
