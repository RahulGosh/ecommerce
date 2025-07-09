import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Collection from "./pages/collection";
import About from "./pages/about";
import Contact from "./pages/contact";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Login from "./pages/login";
import PlaceOrder from "./pages/placeOrder";
import Orders from "./pages/orders";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import SearchBar from "./components/searchBar";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { User } from "./types/types";
import { RootState } from "./store/store";
import { AuthenticatedUser, ProtectedRoute } from "./utils/protectedRoute";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import OrderSuccess from "./pages/order-success";

function App() {
  const { user } = useSelector((store: RootState) => store.auth) as {
    user: User | null;
  };
  console.log(user, "admin");

  return (
    <div className="">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthenticatedUser>
              <Login />
            </AuthenticatedUser>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthenticatedUser>
              <ForgotPassword />
            </AuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <AuthenticatedUser>
              <ResetPassword />
            </AuthenticatedUser>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;



// import React, { useContext, useEffect, useState, useMemo } from "react";
// import { SearchContext } from "../context/searchContext";
// import Title from "../components/title";
// import ProductItem from "../components/productItem";
// import { useGetAllProductsQuery } from "../store/api/productApi";
// import { Product } from "../types/types";
// import Loader from "../utils/loader";
// import { FiFilter, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import ProductCard from "../components/productCard";

// const Collection: React.FC = () => {
//   const context = useContext(SearchContext);

//   if (!context) {
//     throw new Error("SearchContext must be used within a SearchContextProvider");
//   }

//   const { search } = context;
  
//   const [hoveredItem, setHoveredItem] = useState<string | null>(null);
//   const [showFilter, setShowFilter] = useState<boolean>(false);
//   const [filterProducts, setFilterProducts] = useState<Product[]>([]);
//   const [category, setCategory] = useState<string[]>([]);
//   const [subCategory, setSubCategory] = useState<string[]>([]);
//   const [sortType, setSortType] = useState("relevent");
//   const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
//   const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

//   // Fetch products from API
//   const { data: products, isLoading } = useGetAllProductsQuery();

//   // Handle category toggle
//   const toggleCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCategory((prev) =>
//       prev.includes(value)
//         ? prev.filter((item) => item !== value)
//         : [...prev, value]
//     );
//   };

//   // Handle subcategory toggle
//   const toggleSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSubCategory((prev) =>
//       prev.includes(value)
//         ? prev.filter((item) => item !== value)
//         : [...prev, value]
//     );
//   };

//   // Toggle filter section
//   const toggleFilterSection = (section: string) => {
//     setExpandedFilter(expandedFilter === section ? null : section);
//   };

//   // Apply filters to products
//   const applyFilter = () => {
//     if (!products) return;

//     let productsCopy = [...products.products];

//     // Filter by category
//     if (category.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         category.includes(item.category)
//       );
//     }

//     if (subCategory.length > 0) {
//       productsCopy = productsCopy.filter((item) =>
//         subCategory.includes(item.subCategory)
//       );
//     }

//     // Filter by price range
//     productsCopy = productsCopy.filter(
//       (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
//     );

//     if (search) {
//       productsCopy = productsCopy.filter(
//         (item) =>
//           item.name.toLowerCase().includes(search.toLowerCase()) ||
//           item.category.toLowerCase().includes(search.toLowerCase()) ||
//           item.subCategory.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     setFilterProducts(productsCopy);
//   };

//   // Sort products based on selected sort type
//   const sortedProducts = useMemo(() => {
//     const fpCopy = [...filterProducts];
//     switch (sortType) {
//       case "low-high":
//         return fpCopy.sort((a, b) => a.price - b.price);
//       case "high-low":
//         return fpCopy.sort((a, b) => b.price - a.price);
//       default:
//         return fpCopy;
//     }
//   }, [filterProducts, sortType]);

//   useEffect(() => {
//     if (products) {
//       setFilterProducts(products.products);
//     }
//   }, [products]);

//   useEffect(() => {
//     applyFilter();
//   }, [category, subCategory, search, products, priceRange]);

//   // Clear all filters
//   const clearFilters = () => {
//     setCategory([]);
//     setSubCategory([]);
//     setPriceRange([0, 1000]);
//   };

//   console.log(products, "products")

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Mobile filter toggle */}
//         <div className="sm:hidden flex justify-between items-center mb-6">
//           <button
//             onClick={() => setShowFilter(!showFilter)}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
//           >
//             <FiFilter />
//             {showFilter ? "Hide Filters" : "Show Filters"}
//           </button>
//           <div className="relative">
//             <select
//               onChange={(e) => setSortType(e.target.value)}
//               className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="relevent">Relevant</option>
//               <option value="low-high">Price: Low to High</option>
//               <option value="high-low">Price: High to Low</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <FiChevronDown />
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-8">
//           {/* Filters sidebar */}
//           <AnimatePresence>
//             {(showFilter || !isLoading) && (
//               <motion.div
//                 initial={{ x: -300, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: -300, opacity: 0 }}
//                 transition={{ type: "spring", damping: 25 }}
//                 className={`w-full sm:w-64 bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${
//                   !showFilter ? "hidden sm:block" : ""
//                 }`}
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h3 className="text-lg font-semibold">Filters</h3>
//                   <button
//                     onClick={clearFilters}
//                     className="text-sm text-indigo-600 hover:text-indigo-800"
//                   >
//                     Clear all
//                   </button>
//                 </div>

//                 {/* Price Range Filter */}
//                 <div className="mb-6">
//                   <div
//                     className="flex justify-between items-center cursor-pointer"
//                     onClick={() => toggleFilterSection("price")}
//                   >
//                     <h4 className="font-medium">Price Range</h4>
//                     {expandedFilter === "price" ? <FiChevronUp /> : <FiChevronDown />}
//                   </div>
//                   {expandedFilter === "price" && (
//                     <div className="mt-3 space-y-4">
//                       <div className="flex justify-between text-sm text-gray-600">
//                         <span>${priceRange[0]}</span>
//                         <span>${priceRange[1]}</span>
//                       </div>
//                       <input
//                         type="range"
//                         min="0"
//                         max="1000"
//                         value={priceRange[0]}
//                         onChange={(e) =>
//                           setPriceRange([parseInt(e.target.value), priceRange[1]])
//                         }
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                       />
//                       <input
//                         type="range"
//                         min="0"
//                         max="1000"
//                         value={priceRange[1]}
//                         onChange={(e) =>
//                           setPriceRange([priceRange[0], parseInt(e.target.value)])
//                         }
//                         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Categories Filter */}
//                 <div className="mb-6">
//                   <div
//                     className="flex justify-between items-center cursor-pointer"
//                     onClick={() => toggleFilterSection("categories")}
//                   >
//                     <h4 className="font-medium">Categories</h4>
//                     {expandedFilter === "categories" ? <FiChevronUp /> : <FiChevronDown />}
//                   </div>
//                   {expandedFilter === "categories" && (
//                     <div className="mt-3 space-y-2">
//                       {["Men", "Women", "Kids"].map((cat) => (
//                         <label key={cat} className="flex items-center space-x-3">
//                           <input
//                             type="checkbox"
//                             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                             value={cat}
//                             checked={category.includes(cat)}
//                             onChange={toggleCategory}
//                           />
//                           <span className="text-gray-700">{cat}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Subcategories Filter */}
//                 <div className="mb-6">
//                   <div
//                     className="flex justify-between items-center cursor-pointer"
//                     onClick={() => toggleFilterSection("subcategories")}
//                   >
//                     <h4 className="font-medium">Types</h4>
//                     {expandedFilter === "subcategories" ? <FiChevronUp /> : <FiChevronDown />}
//                   </div>
//                   {expandedFilter === "subcategories" && (
//                     <div className="mt-3 space-y-2">
//                       {["Topwear", "Bottomwear", "Winterwear"].map((subCat) => (
//                         <label key={subCat} className="flex items-center space-x-3">
//                           <input
//                             type="checkbox"
//                             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                             value={subCat}
//                             checked={subCategory.includes(subCat)}
//                             onChange={toggleSubCategory}
//                           />
//                           <span className="text-gray-700">{subCat}</span>
//                         </label>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Products grid */}
//           <div className="flex-1">
//             {isLoading ? (
//               <Loader />
//             ) : (
//               <>
//                 <div className="hidden sm:flex justify-between items-center mb-8">
//                   <Title text1="ALL" text2="COLLECTIONS" />
//                   <div className="relative">
//                     <select
//                       onChange={(e) => setSortType(e.target.value)}
//                       className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="relevent">Sort by: Relevant</option>
//                       <option value="low-high">Sort by: Price: Low to High</option>
//                       <option value="high-low">Sort by: Price: High to Low</option>
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                       <FiChevronDown />
//                     </div>
//                   </div>
//                 </div>

//                 {sortedProducts.length === 0 ? (
//                   <div className="bg-white rounded-xl shadow-sm p-8 text-center">
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       No products found
//                     </h3>
//                     <p className="text-gray-500">
//                       Try adjusting your filters or search term
//                     </p>
//                     <button
//                       onClick={clearFilters}
//                       className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                     >
//                       Clear all filters
//                     </button>
//                   </div>
//                 ) : (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5 }}
//                     className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//                   >
//                     {sortedProducts.map((product) => {
//                         console.log("Product Image URL:", product.images[0]?.imageUrl); // Debug

//                       return (
//                         <ProductCard
//                      key={product._id}
//                      product={product}
//                      isHovered={hoveredItem === product._id}
//                      onMouseEnter={() => setHoveredItem(product._id)}
//                      onMouseLeave={() => setHoveredItem(null)}
//                      showQuickView={true}
//                      showColorOptions={true}
//                      showCategory={true}
//                      showAddToCart={false}
//                    />
//                       )
//                     })}
//                   </motion.div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;