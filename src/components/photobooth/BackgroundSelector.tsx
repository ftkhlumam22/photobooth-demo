import { usePhotoboothContext } from "../../contexts/PhotoboothContext";
import { backgrounds } from "../../features/background/hooks/useBackground";
import Switch from "../ui/Switch";

const BackgroundSelector = () => {
  const {
    activeBackground,
    setActiveBackground,
    isBackgroundRemovalEnabled,
    setIsBackgroundRemovalEnabled,
  } = usePhotoboothContext();

  return (
    <div className="background-selector space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">Background Removal</h3>
          <Switch
            enabled={isBackgroundRemovalEnabled}
            onChange={setIsBackgroundRemovalEnabled}
          />
        </div>

        {isBackgroundRemovalEnabled && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-700 mb-4">
            <p>
              Background removal uses AI to separate you from your background.
              This may take a moment to process.
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Background Color</h3>
        <div className="grid grid-cols-5 gap-2">
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              className={`p-0 rounded-full w-10 h-10 flex items-center justify-center border-2 ${
                activeBackground.id === bg.id
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: bg.color,
                opacity: isBackgroundRemovalEnabled
                  ? 1
                  : bg.id === "transparent"
                  ? 0.3
                  : 1,
              }}
              onClick={() => setActiveBackground(bg)}
              title={bg.name}
              disabled={!isBackgroundRemovalEnabled && bg.id === "transparent"}
            >
              {activeBackground.id === bg.id && (
                <span
                  className={`text-xs ${
                    bg.color === "#ffffff" || bg.color === "transparent"
                      ? "text-blue-500"
                      : "text-white"
                  } drop-shadow-md`}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Selected: {activeBackground.name}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSelector;
