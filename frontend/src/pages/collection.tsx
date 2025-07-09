import React, { useContext, useEffect, useState, useMemo } from "react";
import { SearchContext } from "../context/searchContext";
import { useGetAllProductsQuery } from "../store/api/productApi";
import { Product } from "../types/types";
import Loader from "../utils/loader";
import CollectionSort from "../components/collection/collectionSort";
import CollectionFilters from "../components/collection/collectionFilters";
import CollectionProductCard from "../components/collection/collectionProductCard";
import CollectionPagination from "../components/collection/collectionPagination";
import { Link } from "react-router-dom";

const Collection: React.FC = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "SearchContext must be used within a SearchContextProvider"
    );
  }

  const { search } = context;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortType, setSortType] = useState("relevant");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch products from API
  const { data: products, isLoading } = useGetAllProductsQuery();

  // Handle category toggle
  const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handle subcategory toggle
  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Handle price range change
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange([0, 1000]);
    setCurrentPage(1);
  };

  // Apply filters to products
  const applyFilter = () => {
    if (!products) return;

    let productsCopy = [...products.products];

    // Filter by category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Filter by subcategory
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Filter by price range
    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Filter by search
    if (search) {
      productsCopy = productsCopy.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.subCategory.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterProducts(productsCopy);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Sort products based on selected sort type
  const sortedProducts = useMemo(() => {
    const fpCopy = [...filterProducts];
    switch (sortType) {
      case "low-high":
        return fpCopy.sort((a, b) => a.price - b.price);
      case "high-low":
        return fpCopy.sort((a, b) => b.price - a.price);
      case "newest":
        return fpCopy.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      default:
        return fpCopy;
    }
  }, [filterProducts, sortType]);

  // Pagination logic
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return sortedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [sortedProducts, currentPage]);

  useEffect(() => {
    if (products) {
      setFilterProducts(products.products);
    }
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, priceRange, search, products]);

  // Create count of active filters
  const activeFiltersCount =
    category.length +
    subCategory.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collection Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between pt-8 pb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              All Collections
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "item" : "items"} found
            </p>
          </div>

          <CollectionSort
            sortType={sortType}
            setSortType={setSortType}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Filters */}
            <CollectionFilters
              category={category}
              subCategory={subCategory}
              priceRange={priceRange}
              toggleCategory={toggleCategory}
              toggleSubCategory={toggleSubCategory}
              handlePriceChange={handlePriceChange}
              clearFilters={clearFilters}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              activeFiltersCount={activeFiltersCount}
            />

            {/* Product grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : (
                <>
                  {sortedProducts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products found
                      </h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Try adjusting your search or filter to find what you're
                        looking for.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <>
                      {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {paginatedProducts.map((product) => (
                            <Link to={`/product/${product?._id}`}>
                              <CollectionProductCard
                                key={product._id}
                                product={product}
                                viewMode={viewMode}
                              />
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {paginatedProducts.map((product) => (
                            <CollectionProductCard
                              key={product._id}
                              product={product}
                              viewMode={viewMode}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Pagination */}
              {sortedProducts.length > 0 && (
                <CollectionPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Collection;
