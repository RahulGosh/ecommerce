import Title from "./title";
import ProductItem from "./productItem";
import { useLatestCollectionQuery } from "../store/api/productApi";

const LatestCollection = () => {
  const { data: latestProducts, isLoading, error } = useLatestCollectionQuery();
  console.log(latestProducts, "latestProducts")

    // Ensure that `products` is typed as an array and filter bestsellers
    const products = Array.isArray(latestProducts?.products) ? latestProducts?.products : [];

    console.log(products, "products")
  
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our latest collection of premium products curated just for you!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500">Loading latest products...</p>
        ) : error ? (
          <p className="col-span-full text-center text-red-500">Failed to load products.</p>
        ) : products && products.length > 0 ? (
          products.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              image={item.images?.[0]?.imageUrl || '/default-image.jpg'}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default LatestCollection;
