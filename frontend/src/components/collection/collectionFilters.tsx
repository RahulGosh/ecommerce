import React, { useState } from "react";
import { FiX, FiChevronDown, FiChevronUp, FiFilter } from "react-icons/fi";

interface CollectionFiltersProps {
  category: string[];
  subCategory: string[];
  priceRange: [number, number];
  toggleCategory: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSubCategory: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  clearFilters: () => void;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (value: boolean) => void;
  activeFiltersCount: number;
}

const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  category,
  subCategory,
  priceRange,
  toggleCategory,
  toggleSubCategory,
  handlePriceChange,
  clearFilters,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  activeFiltersCount
}) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>("categories");

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <>
      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-40 w-full max-w-xs bg-white shadow-xl overflow-y-auto transition-all transform duration-300 ease-in-out">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {/* Categories Section */}
              <div className="p-4">
                <button
                  className="flex items-center justify-between w-full py-2 text-gray-900"
                  onClick={() => toggleAccordion('categories')}
                >
                  <span className="font-medium">Categories</span>
                  {activeAccordion === 'categories' ? (
                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {activeAccordion === 'categories' && (
                  <div className="pt-3 pl-2 space-y-2">
                    {['Men', 'Women', 'Kids'].map((cat) => (
                      <div key={cat} className="flex items-center">
                        <input
                          id={`mobile-category-${cat}`}
                          name="category"
                          type="checkbox"
                          value={cat}
                          checked={category.includes(cat)}
                          onChange={toggleCategory}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`mobile-category-${cat}`} className="ml-3 text-sm text-gray-600">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Types Section */}
              <div className="p-4">
                <button
                  className="flex items-center justify-between w-full py-2 text-gray-900"
                  onClick={() => toggleAccordion('types')}
                >
                  <span className="font-medium">Types</span>
                  {activeAccordion === 'types' ? (
                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {activeAccordion === 'types' && (
                  <div className="pt-3 pl-2 space-y-2">
                    {['Topwear', 'Bottomwear', 'Winterwear', 'Footwear', 'Accessories'].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`mobile-type-${type}`}
                          name="subCategory"
                          type="checkbox"
                          value={type}
                          checked={subCategory.includes(type)}
                          onChange={toggleSubCategory}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor={`mobile-type-${type}`} className="ml-3 text-sm text-gray-600">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range Section */}
              <div className="p-4">
                <button
                  className="flex items-center justify-between w-full py-2 text-gray-900"
                  onClick={() => toggleAccordion('price')}
                >
                  <span className="font-medium">Price Range</span>
                  {activeAccordion === 'price' ? (
                    <FiChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {activeAccordion === 'price' && (
                  <div className="pt-3 px-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">${priceRange[0]}</span>
                      <span className="text-sm text-gray-600">${priceRange[1]}</span>
                    </div>
                    <div className="mb-4">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => handlePriceChange(e, 0)}
                          className="block w-full pl-7 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Min"
                        />
                      </div>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceChange(e, 1)}
                          className="block w-full pl-7 pr-3 py-2 sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="sticky top-6 space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">Filters</h3>
            
            {/* Categories */}
            <div className="mb-6">
              <button
                className="flex items-center justify-between w-full mb-2 text-gray-900"
                onClick={() => toggleAccordion('categories')}
              >
                <span className="font-medium">Categories</span>
                {activeAccordion === 'categories' ? (
                  <FiChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {activeAccordion === 'categories' && (
                <div className="pl-1 space-y-2 mt-2">
                  {['Men', 'Women', 'Kids'].map((cat) => (
                    <div key={cat} className="flex items-center">
                      <input
                        id={`category-${cat}`}
                        name="category"
                        type="checkbox"
                        value={cat}
                        checked={category.includes(cat)}
                        onChange={toggleCategory}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`category-${cat}`} className="ml-3 text-sm text-gray-600">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Types */}
            <div className="mb-6">
              <button
                className="flex items-center justify-between w-full mb-2 text-gray-900"
                onClick={() => toggleAccordion('types')}
              >
                <span className="font-medium">Types</span>
                {activeAccordion === 'types' ? (
                  <FiChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {activeAccordion === 'types' && (
                <div className="pl-1 space-y-2 mt-2">
                  {['Topwear', 'Bottomwear', 'Winterwear', 'Footwear', 'Accessories'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`type-${type}`}
                        name="subCategory"
                        type="checkbox"
                        value={type}
                        checked={subCategory.includes(type)}
                        onChange={toggleSubCategory}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`type-${type}`} className="ml-3 text-sm text-gray-600">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <button
                className="flex items-center justify-between w-full mb-3 text-gray-900"
                onClick={() => toggleAccordion('price')}
              >
                <span className="font-medium">Price Range</span>
                {activeAccordion === 'price' ? (
                  <FiChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {activeAccordion === 'price' && (
                <div className="mt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">${priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                  </div>
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="block w-full pl-7 pr-3 py-1.5 sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                    </div>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="block w-full pl-7 pr-3 py-1.5 sm:text-sm border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearFilters}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter button */}
      <button
        type="button"
        className="lg:hidden flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 bg-white rounded-md border border-gray-300 px-3 py-1.5 shadow-sm hover:bg-gray-50"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <FiFilter className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
        Filters {activeFiltersCount > 0 && <span className="ml-1 text-xs bg-indigo-600 text-white rounded-full px-1.5">{activeFiltersCount}</span>}
      </button>
    </>
  );
};

export default CollectionFilters;