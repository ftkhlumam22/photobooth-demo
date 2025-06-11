import { useRef, useEffect } from "react";
import FeminineButton from "../ui/FeminineButton";
import { frames } from "../../features/frames/frameOptions";

interface PhotoGridPreviewProps {
  photos: (string | null)[];
  rows: number;
  cols: number;
  onReset: (index: number) => void;
  onDownload: () => void;
  frameId: string | null;
}

const PhotoGridPreview = ({
  photos,
  rows,
  cols,
  onReset,
  onDownload,
  frameId,
}: PhotoGridPreviewProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const selectedFrame = frameId ? frames.find((f) => f.id === frameId) : null;

  // Pastikan semua gambar sudah dimuat sebelum download
  useEffect(() => {
    const preloadImages = () => {
      photos.forEach((photo) => {
        if (photo) {
          const img = new Image();
          img.src = photo;
        }
      });
      // Juga preload frame jika ada
      if (selectedFrame?.imgSrc) {
        const frameImg = new Image();
        frameImg.src = selectedFrame.imgSrc;
      }
    };

    preloadImages();
  }, [photos, selectedFrame]);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: "8px",
    aspectRatio: `${cols} / ${rows}`,
    position: "relative" as const,
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-600">
        Your Cute Photo Grid
      </h2>

      <div className="mb-8">
        <div
          id="photo-grid"
          className="relative bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg shadow-inner max-w-2xl mx-auto"
          ref={gridRef}
          style={{ minHeight: "400px" }}
        >
          {/* Frame overlay if selected */}
          {selectedFrame && (
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                backgroundImage: `url(${selectedFrame.imgSrc})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          <div style={gridStyle}>
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden bg-pink-50 rounded"
              >
                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt={`Grid photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <button
                      onClick={() => onReset(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 focus:outline-none z-20"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-pink-300">
                    Empty
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <FeminineButton
          onClick={() => onReset(photos.findIndex((p) => p === null) - 1)}
          variant="outline"
        >
          Back to Capture
        </FeminineButton>
        <FeminineButton
          onClick={onDownload}
          variant="primary"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Download Grid
        </FeminineButton>
      </div>
    </div>
  );
};

export default PhotoGridPreview;
