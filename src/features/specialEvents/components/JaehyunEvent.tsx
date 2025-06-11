/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useCamera } from "../../../features/camera/hooks/useCamera";
import { useDownload } from "../../../hooks/useDownload";
import { usePhotoboothContext } from "../../../contexts/PhotoboothContext";
import FeminineLayout from "../../../components/layout/FeminineLayout";
import FeminineCard from "../../../components/ui/FeminineCard";
import FeminineButton from "../../../components/ui/FeminineButton";
import FilterSelector from "../../../components/photobooth/FilterSelector";
import BackgroundSelector from "../../../components/photobooth/BackgroundSelector";
import FrameSelector from "../../../components/photobooth/FrameSelector";

const jaehyunImages = [
  "/jaehyun-1.png",
  "/jaehyun-2.png",
  "/jaehyun-3.png",
  "/jaehyun-4.png",
  "/jaehyun-5.png",
  "/jaehyun-6.png",
];

const JaehyunEvent = () => {
  const [selectedImage, setSelectedImage] = useState(jaehyunImages[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("poses");
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [isGrid, setIsGrid] = useState<boolean>(false);
  const [gridPhotos, setGridPhotos] = useState<(string | null)[]>(
    Array(4).fill(null)
  );
  const [currentGridIndex, setCurrentGridIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, startCamera, stopCamera } = useCamera();
  const { downloadImage } = useDownload();
  const { activeFilter, activeBackground, isBackgroundRemovalEnabled } =
    usePhotoboothContext();
  const [isLoading, setIsLoading] = useState(true);

  const setupCamera = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await startCamera();

      if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Failed to setup camera:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setupCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCanPlay = () => {
    setIsLoading(false);
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.error("Error playing video:", e));
    }
  };

  // Perbarui fungsi getJaehyunPosition untuk memastikan konsistensi preview

  const getJaehyunPosition = () => {
    if (isGrid) {
      // Untuk grid mode: posisi lebih ke kanan sedikit
      return {
        position: "absolute",
        right: "20%", // Geser ke kanan dari 30% menjadi 20%
        bottom: "3%",
        maxWidth: "35%",
        height: "auto",
        zIndex: 20,
      } as React.CSSProperties;
    } else {
      // Untuk single mode
      return {
        position: "absolute",
        right: "5%", // 5% dari kanan
        bottom: "3%",
        maxWidth: "38%",
        height: "auto",
        zIndex: 20,
      } as React.CSSProperties;
    }
  };

  // Perbaiki fungsi handleCapture untuk memastikan posisi Jaehyun konsisten dengan preview

  const handleCapture = async () => {
    if (videoRef.current && stream) {
      // Create a canvas to compose the image
      const canvas = document.createElement("canvas");
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Apply background if not transparent
      if (activeBackground.id !== "transparent") {
        ctx.fillStyle = activeBackground.color;
        ctx.fillRect(0, 0, width, height);
      }

      // Create a temporary canvas for applying filters
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempContext = tempCanvas.getContext("2d");

      if (tempContext) {
        // Draw video with filter
        tempContext.filter = activeFilter.cssFilter;
        tempContext.drawImage(videoRef.current, 0, 0, width, height);

        // Transfer to main canvas
        ctx.drawImage(tempCanvas, 0, 0);
      } else {
        // Fallback if temp context not available
        ctx.drawImage(videoRef.current, 0, 0, width, height);
      }

      // Load Jaehyun image
      const jaehyunImg = new Image();
      jaehyunImg.crossOrigin = "anonymous";
      jaehyunImg.src = selectedImage;

      await new Promise((resolve) => {
        jaehyunImg.onload = resolve;
        jaehyunImg.onerror = () => {
          console.error("Error loading Jaehyun image");
          resolve(null);
        };
        // Timeout safety
        setTimeout(resolve, 1000);
      });

      // PERBAIKAN: Menggunakan proporsi yang sama persis dengan getJaehyunPosition()
      // untuk memastikan konsistensi antara preview dan hasil foto
      const jaehyunWidth = width * (isGrid ? 0.35 : 0.38);
      const jaehyunHeight =
        (jaehyunImg.height / jaehyunImg.width) * jaehyunWidth;

      // Hitung posisi sesuai dengan yang ditampilkan di preview
      let horizontalPosition;

      if (isGrid) {
        // Untuk grid mode: right 20% - sesuaikan dengan getJaehyunPosition
        // Konversi dari CSS right percentage ke koordinat canvas
        horizontalPosition = width * 0.8 - jaehyunWidth; // 80% dari kiri (sama dengan right: 20%)
      } else {
        // Untuk single mode: right dengan 5% offset
        horizontalPosition = width - jaehyunWidth - width * 0.05;
      }

      // Posisi vertikal - 3% dari bottom
      const verticalPosition = height - jaehyunHeight + height * 0.03;

      // Draw Jaehyun dengan posisi yang konsisten dengan preview
      ctx.drawImage(
        jaehyunImg,
        horizontalPosition,
        verticalPosition,
        jaehyunWidth,
        jaehyunHeight
      );

      // Debug info - hapus pada produksi
      console.log("Capture info:", {
        isGrid,
        width,
        height,
        jaehyunWidth,
        jaehyunHeight,
        horizontalPosition,
        verticalPosition,
      });

      // Get the composite image as a data URL
      const compositeImage = canvas.toDataURL("image/jpeg");

      if (isGrid) {
        const newGridPhotos = [...gridPhotos];
        newGridPhotos[currentGridIndex] = compositeImage;
        setGridPhotos(newGridPhotos);

        // Move to next grid position or finish
        const nextEmptyIndex = newGridPhotos.findIndex(
          (photo) => photo === null
        );
        if (nextEmptyIndex !== -1) {
          setCurrentGridIndex(nextEmptyIndex);
        } else {
          setCapturedImage("grid");
        }
      } else {
        setCapturedImage(compositeImage);
      }
    }
  };

  const handleDownload = async () => {
    if (!isGrid && capturedImage) {
      downloadImage(capturedImage, "photo-with-jaehyun.jpg");
    } else if (isGrid && capturedImage === "grid") {
      try {
        // Get the grid element
        const gridElement = document.getElementById("jaehyun-grid");
        if (!gridElement) {
          console.error("Grid element not found");
          return;
        }

        // Create a temporary element to avoid gradient parsing issues
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.top = "0";
        document.body.appendChild(tempContainer);

        // Clone the grid element to work with
        const gridClone = gridElement.cloneNode(true) as HTMLElement;

        // Replace problematic gradient with a simple color
        gridClone.style.background = "#fcf0f7"; // Light pink color instead of gradient

        // Make sure any other elements with gradients are fixed
        const elementsWithGradients = gridClone.querySelectorAll("*");
        elementsWithGradients.forEach((el: Element) => {
          const element = el as HTMLElement;
          const style = window.getComputedStyle(element);
          if (style.backgroundImage.includes("gradient")) {
            element.style.backgroundImage = "none";
            element.style.backgroundColor = "#fcf0f7";
          }
        });

        tempContainer.appendChild(gridClone);

        // Use dom-to-image as an alternative if available
        if (typeof window.domtoimage !== "undefined") {
          try {
            const dataUrl = await window.domtoimage.toJpeg(gridClone, {
              quality: 0.95,
            });
            downloadImage(dataUrl, "jaehyun-grid.jpg");
            document.body.removeChild(tempContainer);
            return;
          } catch (err) {
            console.error(
              "dom-to-image failed, trying html2canvas as fallback",
              err
            );
          }
        }

        // Make sure html2canvas is loaded
        if (typeof window.html2canvas !== "function") {
          console.error("html2canvas not loaded, trying to load it");
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
              "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
            script.onload = () => resolve();
            script.onerror = (e) => reject(e);
            document.head.appendChild(script);
          });
        }

        // Capture with html2canvas with fixed settings
        window
          .html2canvas(gridClone, {
            useCORS: true,
            allowTaint: true,
            scale: 2,
            backgroundColor: "#ffffff", // Explicitly set background
            logging: false, // Disable logging
            removeContainer: false,
          })
          .then((canvas) => {
            const imageData = canvas.toDataURL("image/jpeg", 0.95);
            downloadImage(imageData, "jaehyun-grid.jpg");
            document.body.removeChild(tempContainer);
          })
          .catch((err) => {
            console.error("Error generating canvas:", err);
            document.body.removeChild(tempContainer);

            // Ultimate fallback - just download the individual photos
            alert(
              "Could not generate grid image. Individual photos will be downloaded instead."
            );
            gridPhotos.forEach((photo, index) => {
              if (photo) {
                downloadImage(photo, `jaehyun-photo-${index + 1}.jpg`);
              }
            });
          });
      } catch (error) {
        console.error("Error capturing jaehyun grid:", error);
      }
    }
  };

  const handleRetake = async () => {
    try {
      // Reset state untuk gambar yang diambil
      if (isGrid) {
        setGridPhotos(Array(4).fill(null));
        setCurrentGridIndex(0);
      }
      setCapturedImage(null);

      // Pastikan stream camera masih berjalan, jika tidak restart
      if (!videoRef.current?.srcObject || !stream?.active) {
        setIsLoading(true);
        // Restart camera jika stream tidak ada atau tidak aktif
        const mediaStream = await startCamera();
        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current
            .play()
            .catch((e) =>
              console.error("Error playing video after retake:", e)
            );
        }
      } else {
        // Jika stream masih aktif, pastikan video element menampilkannya
        if (videoRef.current) {
          videoRef.current
            .play()
            .catch((e) =>
              console.error("Error playing video after retake:", e)
            );
        }
      }
    } catch (error) {
      console.error("Error in handleRetake:", error);
      // Jika gagal restart camera, coba setup ulang
      setupCamera();
    }
  };

  // Pastikan video tidak mengisi seluruh div ketika background tidak transparan
  const videoStyle =
    activeBackground.id !== "transparent"
      ? {
          filter: activeFilter.cssFilter,
          width: "100%",
          height: "auto",
          padding: "20px",
        }
      : {
          filter: activeFilter.cssFilter,
          width: "100%",
          height: "auto",
        };

  const startCaptureWithCountdown = () => {
    setCountdown(3); // Start from 3

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Execute capture when countdown reaches 0
          if (prev === 1) {
            setTimeout(() => {
              handleCapture();
              setCountdown(null);
            }, 10);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <FeminineLayout title="Photo with Jaehyun">
      <FeminineCard className="max-w-5xl mx-auto overflow-hidden">
        {capturedImage ? (
          <div className="p-6">
            <div className="mb-6">
              {!isGrid ? (
                // Single photo preview
                <img
                  src={capturedImage}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                  alt="You and Jaehyun"
                />
              ) : (
                // Grid photo preview
                <div className="max-w-2xl mx-auto">
                  <div
                    id="jaehyun-grid"
                    className="relative bg-pink-100 p-6 rounded-lg shadow-inner"
                    style={{ backgroundColor: "#fcf0f7" }}
                  >
                    {/* Frame overlay if selected */}
                    {selectedFrameId && (
                      <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                          backgroundImage: `url(${
                            frames.find((f) => f.id === selectedFrameId)?.imgSrc
                          })`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    )}
                    <div
                      className="grid grid-cols-2 grid-rows-2 gap-2 relative"
                      style={{ aspectRatio: "1" }}
                    >
                      {gridPhotos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm"
                        >
                          {photo ? (
                            <img
                              src={photo}
                              alt={`Grid photo ${idx + 1}`}
                              className="w-full h-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                              <span className="text-pink-300 font-medium">
                                Empty
                              </span>
                            </div>
                          )}
                          <div className="absolute top-1 left-1 bg-pink-500 bg-opacity-70 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <FeminineButton onClick={handleRetake} variant="outline">
                Retake Photo
              </FeminineButton>

              <FeminineButton
                onClick={handleDownload}
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
                Download Photo
              </FeminineButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/3 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <FeminineButton
                    onClick={() => setIsGrid(false)}
                    variant={isGrid ? "outline" : "primary"}
                    size="small"
                  >
                    Single Photo
                  </FeminineButton>
                  <FeminineButton
                    onClick={() => setIsGrid(true)}
                    variant={isGrid ? "primary" : "outline"}
                    size="small"
                  >
                    Grid (2×2)
                  </FeminineButton>
                </div>

                {isGrid && (
                  <div className="flex gap-2">
                    {gridPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentGridIndex
                            ? "bg-pink-500"
                            : photo
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-4 border-pink-200 rounded-xl overflow-hidden">
                <div
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: activeBackground.color,
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative", // Make sure position is relative
                  }}
                >
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-pink-50 rounded-lg z-30">
                      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Video element with filter */}
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      className="rounded-lg w-full h-auto"
                      style={videoStyle}
                      autoPlay
                      playsInline
                      muted
                      onCanPlay={handleCanPlay}
                    />

                    {/* Jaehyun overlay - positioned the same way as in final capture */}
                    <img
                      src={selectedImage}
                      style={getJaehyunPosition()}
                      alt="Jaehyun pose"
                    />

                    {/* Grid indicator overlay for grid mode */}
                    {isGrid && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10 opacity-30"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, transparent, transparent calc(50% - 1px), rgba(255,192,203,0.5) 50%, transparent calc(50% + 1px)), linear-gradient(to bottom, transparent, transparent calc(50% - 1px), rgba(255,192,203,0.5) 50%, transparent calc(50% + 1px))",
                        }}
                      />
                    )}

                    {/* Frame overlay preview if selected */}
                    {isGrid && selectedFrameId && (
                      <div
                        className="absolute inset-0 z-25 pointer-events-none"
                        style={{
                          backgroundImage: `url(${
                            frames.find((f) => f.id === selectedFrameId)?.imgSrc
                          })`,
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                    )}
                  </div>

                  {/* Tampilkan overlay countdown */}
                  {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
                      <div className="w-24 h-24 rounded-full bg-pink-500 flex items-center justify-center">
                        <span className="text-4xl text-white font-bold animate-pulse">
                          {countdown}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <FeminineButton
                  onClick={startCaptureWithCountdown}
                  variant="primary"
                  size="large"
                  fullWidth
                  className="mt-4"
                  disabled={countdown !== null}
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
                  {countdown !== null
                    ? `Taking photo... ${countdown}`
                    : "Take Photo"}
                </FeminineButton>

                {isGrid && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {gridPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-md overflow-hidden border-2 cursor-pointer ${
                          index === currentGridIndex
                            ? "border-pink-500"
                            : "border-pink-200"
                        }`}
                        onClick={() => {
                          if (photo) {
                            resetGridPhoto(index);
                          } else {
                            setCurrentGridIndex(index);
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
                )}
              </div>
            </div>

            <div className="w-full lg:w-1/3 bg-pink-50 p-6 border-l border-pink-100">
              <div className="flex border-b border-pink-200 mb-4">
                <button
                  className={`px-3 py-2 ${
                    activeTab === "poses"
                      ? "border-b-2 border-pink-500 text-pink-600 font-medium"
                      : "text-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => setActiveTab("poses")}
                >
                  Poses
                </button>
                <button
                  className={`px-3 py-2 ${
                    activeTab === "filters"
                      ? "border-b-2 border-pink-500 text-pink-600 font-medium"
                      : "text-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => setActiveTab("filters")}
                >
                  Filters
                </button>
                <button
                  className={`px-3 py-2 ${
                    activeTab === "background"
                      ? "border-b-2 border-pink-500 text-pink-600 font-medium"
                      : "text-pink-400 hover:text-pink-600"
                  }`}
                  onClick={() => setActiveTab("background")}
                >
                  Background
                </button>
                {isGrid && (
                  <button
                    className={`px-3 py-2 ${
                      activeTab === "frames"
                        ? "border-b-2 border-pink-500 text-pink-600 font-medium"
                        : "text-pink-400 hover:text-pink-600"
                    }`}
                    onClick={() => setActiveTab("frames")}
                  >
                    Frames
                  </button>
                )}
              </div>

              <div className="px-1">
                {activeTab === "poses" && (
                  <div>
                    <h3 className="text-lg font-medium text-pink-700 mb-3">
                      Select Jaehyun Pose
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {jaehyunImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`relative cursor-pointer rounded-lg border-2 p-1 ${
                            selectedImage === img
                              ? "border-pink-500 bg-pink-50"
                              : "border-gray-200 hover:border-pink-300"
                          }`}
                          onClick={() => setSelectedImage(img)}
                        >
                          <img
                            src={img}
                            className="w-full aspect-square object-cover rounded"
                            alt={`Jaehyun pose ${idx + 1}`}
                          />
                          {selectedImage === img && (
                            <div className="absolute top-1 right-1 bg-pink-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                              ✓
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "filters" && <FilterSelector />}
                {activeTab === "background" && <BackgroundSelector />}
                {activeTab === "frames" && isGrid && (
                  <FrameSelector
                    gridType="2x2"
                    onSelectFrame={setSelectedFrameId}
                    selectedFrameId={selectedFrameId}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </FeminineCard>
    </FeminineLayout>
  );
};

export default JaehyunEvent;
