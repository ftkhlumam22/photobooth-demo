import { usePhotoboothContext } from "../../contexts/PhotoboothContext";
import { filters } from "../../features/filters/hooks/useFilter";

const FilterSelector = () => {
  const { activeFilter, setActiveFilter } = usePhotoboothContext();

  return (
    <div className="filter-selector">
      <h3 className="text-lg font-medium mb-3">Select Filter</h3>
      <div className="grid grid-cols-2 gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`p-2 text-sm rounded ${
              activeFilter.id === filter.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSelector;
