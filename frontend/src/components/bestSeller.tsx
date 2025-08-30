import React from "react";
import { useGetAllProductsQuery } from "../store/api/productApi"; // Adjust the import path if necessary
import Title from "./title";
import ProductItem from "./productItem"; // Ensure you have a ProductItem component to display each product
import LoadingScreen from "../utils/loadingScreen";

const BestSeller: React.FC = () => {
  const { data, isLoading, isError } = useGetAllProductsQuery();

  // Ensure that `products` is typed as an array and filter bestsellers
  const products = Array.isArray(data?.products) ? data?.products : [];
  const bestSeller = products.filter((item) => item.bestSeller);

  // Limit to the first 8 bestsellers
  const limitedBestSeller = bestSeller.slice(0, 8);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam iure
          pariatur odit quam temporibus facilis.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {limitedBestSeller.map((item) => (
          <ProductItem
            key={item._id} // Ensure you're using the unique identifier (e.g., _id)
            id={item._id}
            name={item.name}
            image={
              Array.isArray(item.images) && item.images.length > 0
                ? item.images[0].imageUrl
                : ""
            }
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;