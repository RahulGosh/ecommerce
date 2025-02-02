import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RelatedProducts from "../components/relatedProducts";
import { assets } from "../assets/assets";
import { SearchContext } from "../context/searchContext";
import { useGetSingleProductQuery } from "../store/api/productApi";
import { useAddToCartMutation } from "../store/api/cartApi";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify

const Product: React.FC = () => {
  const params = useParams();
  const productId = params.productId || "";

  const [addToCart, { data: addToCartData, isSuccess: addToCartSuccess, isLoading: isAddingToCart }] = useAddToCartMutation(); // Use the mutation hook

  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("SearchContext is not provided");
  }

  const {
    data: productData,
    isLoading,
    isSuccess,
  } = useGetSingleProductQuery(productId, { skip: !productId });

  const [image, setImage] = useState<string>("");
  const [size, setSize] = useState<string>("");

  useEffect(() => {
    if (productData?.product) {
      setImage(productData.product.images[0]?.imageUrl || ""); // Set the first image as default
    }

    if (addToCartSuccess) {
      toast.success(addToCartData?.message);
    }
  }, [productData, addToCartSuccess, addToCartData]);

  const handleAddToCart = async (productId: string, size: string) => {
    await addToCart({ productId, size });  // Add product to cart API call
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isSuccess && productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.product.images.map((item, index) => (
              <img
                onClick={() => setImage(item.imageUrl)}
                src={item.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                key={item.publicId}
                className="w-full mb-3 cursor-pointer border border-gray-300 rounded hover:border-blue-500"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[85%]">
            <img
              className="w-full h-auto border border-gray-300 rounded"
              src={image}
              alt="Selected"
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">
            {productData.product.name}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img
              src={assets.star_dull_icon}
              alt="Star dull"
              className="w-3.5"
            />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            ${productData.product.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.product.description}
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.product.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  key={index}
                  className={`border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-500" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleAddToCart(productId, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding to Cart..." : "Add To Cart"}
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur
            minus eum voluptate, accusamus dignissimos incidunt corrupti
            asperiores sed expedita maxime ipsum eaque iste, aliquid tempora
            explicabo numquam, hic dolore quo!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            iure deserunt natus aspernatur voluptas alias explicabo nesciunt,
            enim atque saepe.
          </p>
        </div>
      </div>

      <RelatedProducts
        category={productData.product.category}
        subCategory={productData.product.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
