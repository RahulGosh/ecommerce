import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { IoGrid, IoList } from "react-icons/io5";

interface CollectionSortProps {
  sortType: string;
  setSortType: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
}

const CollectionSort: React.FC<CollectionSortProps> = ({
  sortType,
  setSortType,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* View toggle */}
      <div className="flex border border-gray-300 rounded-md overflow-hidden">
        <button 
          className={`px-2.5 py-1.5 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-500'}`}
          onClick={() => setViewMode('grid')}
        >
          <IoGrid className="h-4 w-4" />
        </button>
        <button 
          className={`px-2.5 py-1.5 ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'bg-white text-gray-500'}`}
          onClick={() => setViewMode('list')}
        >
          <IoList className="h-4 w-4" />
        </button>
      </div>

      {/* Sort dropdown */}
      <div className="relative">
        <select
          id="sort"
          name="sort"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="appearance-none rounded-md border border-gray-300 px-3 py-1.5 bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="relevant">Most Relevant</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <FiChevronDown className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default CollectionSort;