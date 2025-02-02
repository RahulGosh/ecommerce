import React, { useContext, useEffect, useState, useMemo } from "react";
import { SearchContext } from "../context/searchContext";
import Title from "../components/title";
import ProductItem from "../components/productItem";
import { useGetAllProductsQuery } from "../store/api/productApi";
import { Product } from "../types/types";
import Loader from "../utils/loader";

const Collection: React.FC = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "SearchContext must be used within a SearchContextProvider"
    );
  }

  const { search } = context;

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filterProducts, setFilterProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [subCategory, setSubCategory] = useState<string[]>([]);
  const [sortType, setSortType] = useState("relevent");

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
  console.log(products, "products")
  // Handle subcategory toggle
  const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // Apply filters to products
  const applyFilter = () => {
    if (!products) return;

    let productsCopy = [...products.products]; // Use the fetched products array

    // Filter by category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    if (search) {
      productsCopy = productsCopy.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.subCategory.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterProducts(productsCopy);
  };

  // Sort products based on selected sort type
  const sortedProducts = useMemo(() => {
    const fpCopy = [...filterProducts];
    switch (sortType) {
      case "low-high":
        return fpCopy.sort((a, b) => a.price - b.price); // Sort by price (low to high)
      case "high-low":
        return fpCopy.sort((a, b) => b.price - a.price); // Sort by price (high to low)
      default:
        return fpCopy; // No sorting for 'relevant'
    }
  }, [filterProducts, sortType]);

  useEffect(() => {
    if (products) {
      setFilterProducts(products.products); // Set the initial products
    }
  }, [products]);

  useEffect(() => {
    applyFilter(); // Apply filters whenever category, subcategory, or search changes
  }, [category, subCategory, search, products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {isLoading && <Loader />}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            src="/assets/dropdown_icon.svg"
            alt="dropdown icon"
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
          />
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Men"
                onChange={toggleCategory}
              />{" "}
              Men
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Women"
                onChange={toggleCategory}
              />{" "}
              Women
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Kids"
                onChange={toggleCategory}
              />{" "}
              Kids
            </p>
          </div>
        </div>

        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Topwear"
                onChange={toggleSubCategory}
              />{" "}
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Bottomwear"
                onChange={toggleSubCategory}
              />{" "}
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Winterwear"
                onChange={toggleSubCategory}
              />{" "}
              Winterwear
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />

          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {sortedProducts.map((item, index) => (
            
            <ProductItem
              key={index}
              name={item.name}
              id={item._id} // Assuming _id is the unique identifier for each product
              price={item.price}
              image={item.images[0]?.imageUrl} // Display the first image URL
            />
          ))}
        </div>
      </div> 
    </div>
  );
};

export default Collection;
