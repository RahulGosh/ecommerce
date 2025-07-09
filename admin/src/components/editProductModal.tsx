import { useState, useEffect } from 'react';
import { FiX, FiSave, FiUpload, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useUpdateProductMutation } from '../store/api/productApi';
import { Product, ProductType } from '../types/types';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: product?.name,
    description: product.description,
    price: product.price,
    category: product.category,
    subCategory: product.subCategory,
    sizes: product.sizes.join(','),
    bestSeller: product.bestSeller,
  });
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price.toString());
    data.append('category', formData.category);
    data.append('subCategory', formData.subCategory);
    data.append('sizes', formData.sizes);
    data.append('bestSeller', formData.bestSeller.toString());
    
    if (selectedImages.length > 0) {
      selectedImages.forEach(image => {
        data.append('images', image);
      });
    }

    try {
      const response = await updateProduct({
        productId: product._id,
        formData: data
      }).unwrap();
      
      toast.success(
        <div className="flex items-center">
          <FiSave className="mr-2" />
          Product updated successfully
        </div>
      );
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(
        <div className="flex items-center">
          <FiAlertCircle className="mr-2" />
          Failed to update product
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                step="0.01"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bestSeller"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="bestSeller" className="ml-2 block text-sm text-gray-700">
                Best Seller
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Images (Leave empty to keep current images)
            </label>
            <div className="mt-1 flex items-center">
              <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                <FiUpload className="mr-2" />
                Upload Images
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                  accept="image/*"
                />
              </label>
              {selectedImages.length > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  {selectedImages.length} file(s) selected
                </span>
              )}
            </div>
            
            <div className="mt-2 grid grid-cols-3 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.imageUrl}
                    alt={`Product ${index + 1}`}
                    className="h-24 w-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;