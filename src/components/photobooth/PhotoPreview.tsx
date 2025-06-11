interface PhotoPreviewProps {
  image: string;
  onRetake: () => void;
  onDownload: () => void;
}

const PhotoPreview = ({ image, onRetake, onDownload }: PhotoPreviewProps) => {
  return (
    <div className="photo-preview">
      <div className="mb-3">
        <img
          src={image}
          alt="Captured photo"
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
        >
          Retake Photo
        </button>

        <button
          onClick={onDownload}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default PhotoPreview;
