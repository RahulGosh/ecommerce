import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAddProductMutation } from "../store/api/productApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Loader from "../utils/loader";

const Add = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("Men");
  const [subCategory, setSubCategory] = useState<string>("Topwear");
  const [bestSeller, setBestSeller] = useState<boolean>(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"details" | "images">("details");
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    price: false,
    images: false
  });
  const [attempted, setAttempted] = useState(false);

  const [addProduct, { data, isLoading, isSuccess, error }] = useAddProductMutation();
  const navigate = useNavigate();

  const validateDetailsTab = () => {
    const newErrors = {
      name: name.trim() === "",
      description: description.trim() === "",
      price: price.trim() === "",
      images: false
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.description && !newErrors.price;
  };

  const validateImagesTab = () => {
    const newErrors = {
      ...errors,
      images: images.length === 0
    };
    setErrors(newErrors);
    return !newErrors.images;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Check total images won't exceed 10
      if (images.length + newFiles.length > 10) {
        toast.error("You can upload a maximum of 10 images");
        return;
      }

      // Check each file size (max 5MB)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error(`Some files exceed 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
        return;
      }

      // Filter out duplicate filenames
      const existingNames = images.map(img => img.name);
      const uniqueNewFiles = newFiles.filter(file => !existingNames.includes(file.name));
      
      if (uniqueNewFiles.length < newFiles.length) {
        toast.warning("Some duplicate files were skipped");
      }

      if (uniqueNewFiles.length > 0) {
        const updatedImages = [...images, ...uniqueNewFiles];
        setImages(updatedImages);
        setErrors({...errors, images: false});

        const newPreviews = uniqueNewFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSizeClick = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleTabChange = (tab: "details" | "images") => {
    if (tab === "images") {
      if (validateDetailsTab()) {
        setCurrentTab(tab);
      } else {
        toast.error("Please fill all required fields before proceeding");
      }
    } else {
      setCurrentTab(tab);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAttempted(true);
    
    // First validate details tab
    const detailsValid = validateDetailsTab();
    
    // Then validate images tab
    const imagesValid = validateImagesTab();
    
    if (!detailsValid) {
      setCurrentTab("details");
      toast.error("Please fill all required fields in details");
      return;
    }
    
    if (!imagesValid) {
      setCurrentTab("images");
      toast.error("Please upload at least one product image");
      return;
    }

    setLoading(true);
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestSeller", bestSeller.toString());
    sizes.forEach((size) => formData.append("sizes", size));
    images.forEach((image) => formData.append("images", image));
  
    try {
      await addProduct(formData).unwrap();
      setLoading(false);
    } catch (error) {
      console.error("Error adding product:", error);
      
      const errorMessage =
        "data" in (error as FetchBaseQueryError) && (error as FetchBaseQueryError).data
          ? ((error as FetchBaseQueryError).data as { message?: string })?.message ||
            "Failed to add product."
          : "Failed to add product.";
  
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Product added successfully!");
      navigate("/list");
    }

    if (error) {
      const errorData = (error as FetchBaseQueryError)?.data as {
        message?: string;
      };
      toast.error(errorData?.message || "Failed to create product.");
    }
  }, [isSuccess, error, data, navigate]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {isLoading && <Loader />}
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Add New Product
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Fill in the details below to add a new product to your collection. You can upload up to 10 images (5MB each).
        </p>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentTab === 'details' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`ml-2 text-sm font-medium ${currentTab === 'details' ? 'text-indigo-600' : 'text-gray-500'}`}>Details</div>
        </div>
        
        <div className={`mx-2 h-1 w-20 ${currentTab === 'images' ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
        
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentTab === 'images' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`ml-2 text-sm font-medium ${currentTab === 'images' ? 'text-indigo-600' : 'text-gray-500'}`}>Images</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {currentTab === "details" ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Product Name *
                  </label>
                  <input
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                    type="text"
                    placeholder="e.g. Premium Cotton T-Shirt"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors({...errors, name: false});
                    }}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">Product name is required</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      className={`w-full pl-8 pr-4 py-3 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                      type="number"
                      placeholder="29.99"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setErrors({...errors, price: false});
                      }}
                      required
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1">Price is required</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                    </svg>
                    Category
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5rem]"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Men">Men's Fashion</option>
                    <option value="Women">Women's Fashion</option>  
                    <option value="Kids">Kids & Baby</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    Subcategory
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5rem]"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                  >
                    <option value="Topwear">Topwear (Shirts, T-shirts)</option>
                    <option value="Bottomwear">Bottomwear (Pants, Jeans)</option>
                    <option value="Winter">Winter Collection</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div
                        key={size}
                        onClick={() => handleSizeClick(size)}
                        className={`px-5 py-2 rounded-lg cursor-pointer transition-all border-2 flex items-center justify-center ${
                          sizes.includes(size)
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-md"
                            : "bg-white border-gray-300 text-gray-700 hover:border-indigo-300 hover:text-indigo-700"
                        }`}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={bestSeller}
                        onChange={(e) => setBestSeller(e.target.checked)}
                      />
                      <div className={`block w-14 h-8 rounded-full transition ${bestSeller ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${bestSeller ? 'translate-x-6' : ''} shadow-md`}></div>
                    </div>
                    <span className="text-gray-700 font-medium flex items-center">
                      <svg className="w-5 h-5 text-yellow-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                      Mark as Best Seller
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2 flex items-center">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  Product Description *
                </label>
                <textarea
                  className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-40`}
                  placeholder="Describe your product features, materials, care instructions..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors({...errors, description: false});
                  }}
                  required
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Product Images ({images.length}/10)</h2>
            
            <div className="mb-6">
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${attempted && errors.images ? 'border-red-500 bg-red-50' : images.length > 0 ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 hover:border-indigo-200'}`}>
                <input
                  id="imageUpload"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  disabled={images.length >= 10}
                />
                
                {images.length === 0 ? (
                  <label htmlFor="imageUpload" className="cursor-pointer block">
                    <div className="mx-auto w-20 h-20 mb-5 rounded-full bg-indigo-100 flex items-center justify-center transition-all hover:bg-indigo-200">
                      <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className={`font-medium text-lg ${attempted && errors.images ? 'text-red-600' : 'text-indigo-600'}`}>
                      Drag & drop images here or click to browse
                    </p>
                    <p className={`text-sm mt-2 ${attempted && errors.images ? 'text-red-500' : 'text-gray-500'}`}>
                      Supports JPG, PNG, WEBP (Max 5MB each)
                    </p>
                    <button 
                      type="button"
                      className={`mt-4 px-6 py-2 rounded-lg transition-colors ${attempted && errors.images ? 'bg-red-100 text-red-600 border border-red-300' : 'bg-white border border-indigo-500 text-indigo-500 hover:bg-indigo-50'}`}
                    >
                      Select Files
                    </button>
                    {attempted && errors.images && <p className="text-red-500 text-sm mt-2">At least one image is required</p>}
                  </label>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mb-6">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-xl flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {images[index].name.substring(0, 15)}{images[index].name.length > 15 ? '...' : ''}
                          </div>
                        </div>
                      ))}
                      
                      {images.length < 10 && (
                        <label htmlFor="imageUpload" className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors mb-3">
                            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                          </div>
                          <span className="text-gray-600 font-medium">Add more</span>
                          <span className="text-gray-400 text-xs mt-1">{10 - images.length} remaining</span>
                        </label>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between bg-indigo-50 rounded-lg p-4">
                      <p className="text-indigo-700 font-medium">
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {images.length} image(s) selected. First image will be used as featured.
                      </p>
                      <button 
                        type="button"
                        onClick={() => {
                          setImages([]);
                          imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
                          setImagePreviews([]);
                        }}
                        className="text-red-500 text-sm font-medium hover:text-red-700 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-6">
          {currentTab === "images" && (
            <button
              type="button"
              onClick={() => setCurrentTab("details")}
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Details
            </button>
          )}
          
          {currentTab === "details" ? (
            <button
              type="button"
              onClick={() => handleTabChange("images")}
              className="ml-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
            >
              Continue to Images
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || loading}
              className="ml-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center shadow-lg"
            >
              {isLoading || loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing Product...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Publish Product
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Add;