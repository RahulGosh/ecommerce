// import React, { useState } from "react";
import Title from "./title";
// import ProductItem from "./productItem";
// import { products } from "../assets/assets";

const LatestCollection = () => {
  // const [latestProducts, setLatestProducts] = useState(products);
  // console.log(products);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima
          expedita aut iste consequuntur! Dolore, minima?
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {/* {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image[0]?.imageUrl} // Display the first image URL
            name={item.name}
            price={item.price}
          />
        ))} */}

        Latest Products Map
      </div>
    </div>
  );
};

export default LatestCollection;
