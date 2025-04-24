import React, { useState } from "react";
import { X } from "lucide-react";

const NewMenuItemForm = ({ onClose, onSave, editItem = null }) => {
  const [formData, setFormData] = useState({
    name: editItem?.name || "",
    price: editItem?.price?.replace('₵', '') || "",
    category: editItem?.category || "Main Course",
    description: editItem?.description || "",
    available: editItem?.available ?? true,
    image: editItem?.image || ""
  });
  
  const [previewImage, setPreviewImage] = useState(editItem?.image || "");
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: `₵${formData.price}`,
      id: editItem?.id || Date.now()
    });
    onClose();
  };
  
  const categories = ["Main Course", "Appetizer", "Dessert", "Beverage", "Side Dish"];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {editItem ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Item Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg" 
                placeholder="e.g., Jollof Rice with Chicken"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Price (₵)</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg" 
                placeholder="e.g., 25.00"
                min="0"
                step="0.10"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg" 
                rows="3"
                placeholder="Describe the menu item..."
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Item Image</label>
              <div className="flex items-center">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded-lg" 
                />
                {previewImage && (
                  <div className="ml-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80x80?text=Food";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-4 flex items-center">
              <input 
                type="checkbox" 
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="mr-2" 
                id="available"
              />
              <label htmlFor="available" className="text-gray-700">
                Available for Order
              </label>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                type="button"
                onClick={onClose} 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-red-900 text-white px-4 py-2 rounded"
              >
                {editItem ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMenuItemForm; 