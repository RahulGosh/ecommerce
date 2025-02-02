import React, { useEffect, useState } from "react";
import Title from "./title";
import ProductItem from "./productItem";
import { useGetAllProductsQuery } from "../store/api/productApi";
import { Product } from "../types/types";

interface RelatedProductsProps {
  category: string;
  subCategory: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  category,
  subCategory,
}) => {
  const [related, setRelated] = useState<Product[]>([]);
  const { data: products, isLoading, isError } = useGetAllProductsQuery();

  useEffect(() => {
    if (products && products.products && products.products.length > 0) {
      const filteredProducts = products.products.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(filteredProducts.slice(0, 5));
    }
  }, [products, category, subCategory]);

  useEffect(() => {
    // Scroll to the top whenever related products change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [related]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products.</div>;
  }

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.length > 0 ? (
          related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={
                Array.isArray(item.images) && item.images.length > 0
                  ? item.images[0].imageUrl
                  : ""
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No related products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
