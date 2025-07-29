// Service/collectionService.js (MODIFIED - Pass excludeTrending param)
import axios from "axios";

const API_URL = "https://elianajewellery-backend.onrender.com/api/collections";

const collectionService = {
  createCollection: async (collectionData) => {
    const response = await axios.post(API_URL, collectionData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Now accepts an object of params { isTrending, excludeTrending }
  getCollections: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${API_URL}?${queryString}` : API_URL;
    const response = await axios.get(url);
    return response.data;
  },

  updateCollection: async (id, collectionData) => {
    const response = await axios.put(`${API_URL}/${id}`, collectionData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteCollection: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default collectionService;
