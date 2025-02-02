import { useEffect, useState } from "react";
import {
  useGetAllProductsQuery,
  useRemoveProductMutation,
} from "../store/api/productApi";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const List = () => {
  const { data: response, isLoading, refetch } = useGetAllProductsQuery();
  const [removeProduct, { isLoading: isRemoving, error, isSuccess }] =
    useRemoveProductMutation();

  const [products, setProducts] = useState(response?.products || []);

  const handleRemoveProduct = async (productId: string) => {
    try {
      await removeProduct({ productId }).unwrap();

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      await refetch();
    } catch (error) {
      console.error("Failed to remove product:", error);
      toast.error("Failed to remove product");
    }
  };

  useEffect(() => {
    if (response) {
      setProducts(response.products);
    }
  }, [response]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product removed successfully");
    }
    if (error) {
      const errorData = (error as FetchBaseQueryError)?.data as {
        message?: string;
      };
      toast.error(errorData?.message || "Failed to remove product");
    }
  }, [isSuccess, error]);

  return (
    <div>
      <p className="mb-2">All Products List</p>

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {products.length === 0 ? (
          <p>No Product Found</p>
        ) : (
          <div>
            {products.map((item) => (
              <div
                className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 border text-sm"
                key={item._id}
              >
                <img className="w-12" src={item.images[0].imageUrl} alt="" />
                <p>{item?.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <button
                  onClick={() => handleRemoveProduct(item._id)}
                  className="text-right md:text-center cursor-pointer text-lg"
                  disabled={isRemoving}
                >
                  {isLoading ? "Removing..." : "X"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
