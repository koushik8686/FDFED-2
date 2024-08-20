import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AddItem = ({ onClose, onAdd }) => {
  const seller = Cookies.get('seller');
  const [image, setImage] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    basePrice: 0,
    type: "",
  });

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();

    console.log(newItem, "forndata");
      try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('basePrice', newItem.basePrice);
      formData.append('type', newItem.type);
      formData.append('image', image);

      const result = await fetch(`/create/${seller}`, {
        method: 'POST',
        body: formData,
      });

      console.log(result.data);
      // Assuming the server returns the added item, you can pass it back to the parent
      // Reset the form
      setNewItem({
        name: "",
        basePrice: 0,
        type: "",
      });
      setImage(null);
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={submit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          ✖
        </button>
        <div className="space-y-4">
          <div className="text-lg font-bold text-gray-800">Add New Item</div>
          <div className="text-sm text-gray-600">Fill out the details for the new item you want to add.</div>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="image"
              name="name"
              placeholder="Enter item name"
              value={newItem.name}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              id="image"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              accept="image/*"
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
              Base Price
            </label>
            <input
              id="basePrice"
              name="basePrice"
              type="number"
              placeholder="Enter base price"
              value={newItem.basePrice}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={newItem.type}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Select item type
              </option>
              <option value="Art">Art</option>
              <option value="Antique">Antique</option>
              <option value="Used">Used</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Item
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
