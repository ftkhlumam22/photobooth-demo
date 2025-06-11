import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CameraView from "../components/photobooth/CameraView";
import EffectSelector from "../components/photobooth/EffectSelector";
import FilterSelector from "../components/photobooth/FilterSelector";
import BackgroundSelector from "../components/photobooth/BackgroundSelector";
import SpecialEventSelector from "../components/photobooth/SpecialEventSelector";
import PhotoPreview from "../components/photobooth/PhotoPreview";
import { usePhotoCapture } from "../hooks/usePhotoCapture";
import { useDownload } from "../hooks/useDownload";

const Photobooth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("filters"); // filters, effects, background, special
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { capturePhoto } = usePhotoCapture();
  const { downloadImage } = useDownload();

  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser doesn't support camera access");
    }
  }, []);

  const handleCapture = async () => {
    try {
      const image = await capturePhoto();
      if (image) {
        setCapturedImage(image);
      } else {
        console.error("Failed to capture photo - no image returned");
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleDownload = () => {
    if (capturedImage) {
      downloadImage(capturedImage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Photobooth</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 p-6">
              {cameraError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
                  <p>{cameraError}</p>
                </div>
              ) : capturedImage ? (
                <PhotoPreview
                  image={capturedImage}
                  onRetake={() => setCapturedImage(null)}
                  onDownload={handleDownload}
                />
              ) : (
                <div className="mb-4">
                  <CameraView />
                  <button
                    onClick={handleCapture}
                    className="mt-4 w-full py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Take Photo
                  </button>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/3 bg-gray-50 p-6 border-l">
              <div className="flex flex-wrap border-b mb-4">
                <button
                  className={`px-4 py-2 ${
                    activeTab === "filters" ? "border-b-2 border-blue-500" : ""
                  }`}
                  onClick={() => setActiveTab("filters")}
                >
                  Filters
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "effects" ? "border-b-2 border-blue-500" : ""
                  }`}
                  onClick={() => setActiveTab("effects")}
                >
                  Effects
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "background"
                      ? "border-b-2 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setActiveTab("background")}
                >
                  Background
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "special" ? "border-b-2 border-blue-500" : ""
                  }`}
                  onClick={() => setActiveTab("special")}
                >
                  Special
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "filters" && <FilterSelector />}
              {activeTab === "effects" && <EffectSelector />}
              {activeTab === "background" && <BackgroundSelector />}
              {activeTab === "special" && <SpecialEventSelector />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photobooth;
