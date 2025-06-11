import { useState } from "react";
import { Link } from "react-router-dom";
import FeminineLayout from "../components/layout/FeminineLayout";
import FeminineCard from "../components/ui/FeminineCard";
import FeminineButton from "../components/ui/FeminineButton";

const Home = () => {
  const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({
    rows: 2,
    cols: 2,
  });

  const totalPhotos = gridSize.rows * gridSize.cols;

  return (
    <FeminineLayout showBackButton={false}>
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Welcome to Your Cute Photobooth
        </h1>
        <p className="text-lg text-purple-700">
          Create adorable photos with cute filters, frames and special effects!
        </p>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
        <FeminineCard
          variant="default"
          className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl p-6"
        >
          <div className="bg-pink-50 rounded-lg p-6 mb-4">
            <img
              src="/assets/illustrations/single-photo.svg"
              alt="Single Photo"
              className="h-40 mx-auto mb-2"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-pink-600">
            Single Photo
          </h2>
          <p className="text-purple-700 mb-6">
            Take a cute single photo with amazing filters, effects, and custom
            backgrounds.
          </p>
          <Link to="/photobooth">
            <FeminineButton variant="primary" fullWidth>
              Start Single Photo
            </FeminineButton>
          </Link>
        </FeminineCard>

        <FeminineCard
          variant="default"
          className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl p-6"
        >
          <div className="bg-purple-50 rounded-lg p-6 mb-4">
            <img
              src="/assets/illustrations/photo-grid.svg"
              alt="Photo Grid"
              className="h-40 mx-auto mb-2"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-purple-600">
            Photo Grid
          </h2>
          <p className="text-purple-700 mb-4">
            Create a cute photo grid with multiple pictures in adorable frames!
          </p>

          <div className="flex justify-center items-center gap-6 mb-4">
            <div>
              <label
                htmlFor="rows"
                className="block text-sm font-medium text-pink-700 mb-1"
              >
                Rows
              </label>
              <select
                id="rows"
                value={gridSize.rows}
                onChange={(e) =>
                  setGridSize((prev) => ({
                    ...prev,
                    rows: parseInt(e.target.value),
                  }))
                }
                className="block w-full px-3 py-2 border border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="cols"
                className="block text-sm font-medium text-pink-700 mb-1"
              >
                Columns
              </label>
              <select
                id="cols"
                value={gridSize.cols}
                onChange={(e) =>
                  setGridSize((prev) => ({
                    ...prev,
                    cols: parseInt(e.target.value),
                  }))
                }
                className="block w-full px-3 py-2 border border-pink-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-pink-500 mb-4">
            Total: {totalPhotos} photos
          </p>

          <Link
            to={`/photobooth-grid?rows=${gridSize.rows}&cols=${gridSize.cols}`}
          >
            <FeminineButton variant="secondary" fullWidth>
              Start Photo Grid
            </FeminineButton>
          </Link>
        </FeminineCard>
      </div> */}

      <FeminineCard
        variant="soft"
        className="max-w-5xl mx-auto p-8 text-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-purple-600">
          Special Events
        </h2>
        <p className="text-pink-700 mb-6">
          Take super cute photos with your favorite celebrities!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeminineCard className="p-4 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <img
              src="/jaehyun-1.png"
              alt="Jaehyun"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-pink-600 mb-2">Photo with Jaehyun</h3>
            <Link to="/special-event/jaehyun">
              <FeminineButton variant="accent" size="small" fullWidth>
                Start
              </FeminineButton>
            </Link>
          </FeminineCard>
        </div>
      </FeminineCard>
    </FeminineLayout>
  );
};

export default Home;
