import { useEffect, useState } from "react";
import {
  useGetAllProductsQuery,
  useRemoveProductMutation,
  useUpdateProductMutation,
} from "../store/api/productApi";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FiTrash2, FiEdit, FiLoader, FiAlertCircle, FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../types/types";
import EditProductModal from "../components/editProductModal";

const List = () => {
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useGetAllProductsQuery();
  const [removeProduct, { isLoading: isRemoving, error, isSuccess }] = useRemoveProductMutation();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [products, setProducts] = useState<Product[]>(response?.products || []);

  const handleRemoveProduct = async (productId: string) => {
    try {
      await removeProduct({ productId }).unwrap();
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      await refetch();
    } catch (error) {
      console.error("Failed to remove product:", error);
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          Failed to remove product
        </div>
      );
    }
  };

  useEffect(() => {
    if (response) {
      setProducts(response.products);
    }
  }, [response]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(
        <div className="flex items-center">
          <FiTrash2 className="mr-2" />
          Product removed successfully
        </div>
      );
    }
    if (error) {
      const errorData = (error as FetchBaseQueryError)?.data as {
        message?: string;
      };
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          {errorData?.message || "Failed to remove product"}
        </div>
      );
    }
  }, [isSuccess, error]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Product Inventory</h1>
            <p className="text-gray-500">Manage your product catalog</p>
          </div>
          <button
            onClick={() => navigate("/admin/products/new")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <FiLoader className="animate-spin text-blue-500 text-2xl" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiAlertCircle className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
              <p className="text-gray-500">Get started by adding a new product</p>
              <button
                onClick={() => navigate("/admin/products/new")}
                className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiPlus /> Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/edit-product/${item?._id}`} className="flex-shrink-0 h-10 w-10 block">
                          <img className="h-10 w-10 rounded-md object-cover" src={item.images[0]?.imageUrl || '/placeholder-product.png'} alt={item.name} />
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/edit-product/${item?._id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <Link to={`/edit-product/${item?._id}`} className="text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {item.category}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <Link to={`/edit-product/${item?._id}`} className="text-sm font-semibold text-gray-900 hover:text-blue-600">
                          ${item.price.toFixed(2)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(item)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => handleRemoveProduct(item._id)}
                            disabled={isRemoving}
                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {isRemoving ? <FiLoader className="animate-spin" /> : <FiTrash2 />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
            <div>
              Showing <span className="font-medium">1</span> to <span className="font-medium">{products.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> results
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;