import React, { useEffect, useState } from "react";
import { assets } from "../admin_assets/assets";
import { useAddProductMutation } from "../store/api/productApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Loader from "../utils/loader";

const Add = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [addProduct, { data, isLoading, isSuccess, error }] =
    useAddProductMutation();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);

      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSizeClick = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("bestSeller", bestSeller.toString()); // Changed from JSON.stringify to toString()
    sizes.forEach((size) => formData.append("sizes", size));
    images.forEach((image) => formData.append("images", image));
  
    try {
      await addProduct(formData).unwrap();
      setLoading(false);
    } catch (error) {
      console.error("Error adding product:", error);
      
      const errorMessage =
        "data" in (error as FetchBaseQueryError) && (error as FetchBaseQueryError).data
          ? ((error as FetchBaseQueryError).data as { message?: string }).message ||
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full items-start gap-3"
    >
      {isLoading && <Loader />}
      <div>
        <p className="mb-2">Upload Images</p>
        <div className="flex gap-2">
          {imagePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
          <label htmlFor="imageUpload" className="cursor-pointer">
            <img className="w-20" src={assets.upload_area} alt="Upload" />
            <input
              id="imageUpload"
              type="file"
              multiple
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>
        <p>{images.length} image(s) selected</p>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            className="w-full px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Subcategory</p>
          <select
            className="w-full px-3 py-2"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          >
            <option value="topwear">Topwear</option>
            <option value="bottomwear">Bottomwear</option>
            <option value="winter">Winter</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              className={`px-3 py-1 cursor-pointer ${
                sizes.includes(size) ? "bg-gray-800 text-white" : "bg-slate-200"
              }`}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestSeller"
          checked={bestSeller}
          onChange={(e) => setBestSeller(e.target.checked)}
        />
        <label className="cursor-pointer" htmlFor="bestSeller">
          Add to bestseller
        </label>
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white"
        disabled={isLoading || loading}
      >
        {isLoading || loading ? "Loading..." : "Add"}
      </button>
    </form>
  );
};

export default Add;