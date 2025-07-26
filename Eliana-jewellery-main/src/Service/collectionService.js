// services/collectionService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/collections"; // Ensure this matches your backend PORT

const createCollection = async (collectionData) => {
  // collectionData should be a FormData object
  const response = await axios.post(API_URL, collectionData, {
    headers: {
      "Content-Type": "multipart/form-data", // Important for file uploads
      // Add authorization header if your API is protected
      // Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getCollections = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const updateCollection = async (id, collectionData) => {
  // collectionData should be a FormData object
  const response = await axios.put(`${API_URL}/${id}`, collectionData, {
    headers: {
      "Content-Type": "multipart/form-data",
      // Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteCollection = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    // Add authorization header if your API is protected
    // headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const collectionService = {
  createCollection,
  getCollections,
  updateCollection,
  deleteCollection,
};

export default collectionService;
