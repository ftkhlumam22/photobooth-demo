/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePhotoCapture } from "../hooks/usePhotoCapture";
import { useDownload } from "../hooks/useDownload";
import CameraView from "../components/photobooth/CameraView";
import PhotoGridPreview from "../components/photobooth/PhotoGridPreview";
import FilterSelector from "../components/photobooth/FilterSelector";
import EffectSelector from "../components/photobooth/EffectSelector";
import BackgroundSelector from "../components/photobooth/BackgroundSelector";
import FrameSelector from "../components/photobooth/FrameSelector";
import FeminineLayout from "../components/layout/FeminineLayout";
import FeminineCard from "../components/ui/FeminineCard";
import FeminineButton from "../components/ui/FeminineButton";

const PhotoboothGrid = () => {
  const [searchParams] = useSearchParams();
  const rows = parseInt(searchParams.get("rows") || "2");
  const cols = parseInt(searchParams.get("cols") || "2");

  const [gridPhotos, setGridPhotos] = useState<(string | null)[]>(
    Array(rows * cols).fill(null)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("filters");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const { capturePhoto } = usePhotoCapture();
  const { downloadImage } = useDownload();

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser doesn't support camera access");
    }
  }, []);

  // Determine the grid type for frame selection
  const getGridType = () => {
    if (rows === 1 && cols === 1) return "single";
    if (rows === 2 && cols === 2) return "2x2";
    if (rows === 3 && cols === 3) return "3x3";
    if (rows === 4 && cols === 4) return "4x4";
    return "custom";
  };

  const handleCapture = async () => {
    try {
      const image = await capturePhoto();
      if (image) {
        const newGridPhotos = [...gridPhotos];
        newGridPhotos[currentIndex] = image;
        setGridPhotos(newGridPhotos);

        // Move to next available slot, or finish if all filled
        const nextEmptyIndex = newGridPhotos.findIndex(
          (photo) => photo === null
        );
        if (nextEmptyIndex !== -1) {
          setCurrentIndex(nextEmptyIndex);
        } else {
          // All photos captured, switch to preview mode
          setIsPreviewMode(true);
        }
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleReset = (index: number) => {
    const newGridPhotos = [...gridPhotos];
    newGridPhotos[index] = null;
    setGridPhotos(newGridPhotos);
    setCurrentIndex(index);
    setIsPreviewMode(false);
  };

  const handleDownloadGrid = async () => {
    try {
      // Use HTML2Canvas to capture the entire grid
      const gridElement = document.getElementById("photo-grid");
      if (!gridElement) {
        console.error("Grid element not found");
        return;
      }

      // Pastikan html2canvas sudah dimuat
      if (typeof window.html2canvas !== "function") {
        console.error("html2canvas is not loaded");
        // Coba muat html2canvas jika belum ada
        await loadHTML2Canvas();
      }

      // Gunakan html2canvas dengan opsi yang lebih lengkap
      window
        .html2canvas(gridElement, {
          useCORS: true, // Penting untuk gambar dari sumber eksternal
          allowTaint: true, // Izinkan elemen yang tainted
          scale: 2, // Resolusi yang lebih tinggi
          backgroundColor: null, // Respects transparency
          logging: true, // Log untuk debugging
        })
        .then((canvas) => {
          const imageData = canvas.toDataURL("image/jpeg", 0.95); // Gunakan JPEG dengan kualitas 0.95
          downloadImage(imageData, "cute-photobooth-grid.jpg");
        })
        .catch((err) => {
          console.error("Error generating canvas:", err);
        });
    } catch (error) {
      console.error("Error in download grid process:", error);
    }
  };

  // Fungsi untuk memastikan html2canvas dimuat
  const loadHTML2Canvas = () => {
    return new Promise<void>((resolve, reject) => {
      if (typeof window.html2canvas === "function") {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  };

  return (
    <FeminineLayout title={`Cute Photo Grid ${rows}×${cols}`}>
      {isPreviewMode ? (
        <PhotoGridPreview
          photos={gridPhotos}
          rows={rows}
          cols={cols}
          onReset={handleReset}
          onDownload={handleDownloadGrid}
          frameId={selectedFrameId}
        />
      ) : (
        <FeminineCard className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3 p-6">
              {cameraError ? (
                <div className="bg-pink-100 border border-pink-400 text-pink-700 p-4 rounded mb-4">
                  <p>{cameraError}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-pink-600">
                      Photo {currentIndex + 1} of {rows * cols}
                    </h2>
                    <div className="flex gap-2">
                      {gridPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === currentIndex
                              ? "bg-pink-500"
                              : photo
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="border-4 border-pink-200 rounded-xl overflow-hidden">
                      <CameraView />
                    </div>
                    <FeminineButton
                      onClick={handleCapture}
                      variant="primary"
                      size="large"
                      fullWidth
                      className="mt-4"
                      icon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      }
                    >
                      Take Photo
                    </FeminineButton>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {gridPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-md overflow-hidden border-2 cursor-pointer ${
                          index === currentIndex
                            ? "border-pink-500"
                            : "border-pink-200"
                        }`}
                        onClick={() => {
                          if (photo) {
                            handleReset(index);
                          } else {
                            setCurrentIndex(index);
                          }
                        }}
                      >
                        {photo ? (
                          <img
                            src={photo}
                            alt={`Grid photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                            <span className="text-pink-400 font-medium">
                              {index + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-1/3 bg-pink-50 p-6 border-l border-pink-100">
              <div className="flex border-b border-pink-200 mb-4">
                {["filters", "effects", "background", "frames"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 py-2 ${
                      activeTab === tab
                        ? "border-b-2 border-pink-500 text-pink-600 font-medium"
                        : "text-pink-400 hover:text-pink-600"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="px-1">
                {/* Tab Content */}
                {activeTab === "filters" && <FilterSelector />}
                {activeTab === "effects" && <EffectSelector />}
                {activeTab === "background" && <BackgroundSelector />}
                {activeTab === "frames" && (
                  <FrameSelector
                    gridType={getGridType() as any}
                    onSelectFrame={setSelectedFrameId}
                    selectedFrameId={selectedFrameId}
                  />
                )}

                {gridPhotos.some((photo) => photo !== null) && (
                  <FeminineButton
                    onClick={() => setIsPreviewMode(true)}
                    variant="secondary"
                    fullWidth
                    className="mt-6"
                  >
                    Preview Grid
                  </FeminineButton>
                )}
              </div>
            </div>
          </div>
        </FeminineCard>
      )}
    </FeminineLayout>
  );
};

export default PhotoboothGrid;
