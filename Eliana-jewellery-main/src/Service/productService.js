// Service/productService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/products"; // Adjust if your backend URL changes

const productService = {
  createProduct: async (productData) => {
    // productData should be FormData
    const response = await axios.post(API_URL, productData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return response.data;
  },

  getProducts: async (collectionId = "") => {
    // Optional collectionId to filter products
    const url = collectionId
      ? `${API_URL}?collectionId=${collectionId}`
      : API_URL;
    const response = await axios.get(url);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    // productData should be FormData
    const response = await axios.put(`${API_URL}/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default productService;
