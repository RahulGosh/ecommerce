// import React, { useEffect, useState } from "react";
// import { products, Product } from "../assets/assets";
import Title from "./title";
// import ProductItem from "./productItem";

const BestSeller: React.FC = () => {
  // const [bestSeller, setBestSeller] = useState<Product[]>([]);

  // useEffect(() => {
  //   const bestProduct = products.filter((item) => item.bestseller);
  //   setBestSeller(bestProduct.slice(0, 5));
  // }, []);

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
        {/* {bestSeller.map((item) => (
          <ProductItem
            key={item._id} // Use _id from the Product interface
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))} */}

        Best Seller Mapping
      </div>
    </div>
  );
};

export default BestSeller;