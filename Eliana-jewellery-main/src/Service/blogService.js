// Service/blogService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/blogs"; // Adjust if your backend URL changes

const blogService = {
  createBlogPost: async (blogData) => {
    // blogData should be FormData
    const response = await axios.post(API_URL, blogData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return response.data;
  },

  getAllBlogPosts: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getBlogPostById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  updateBlogPost: async (id, blogData) => {
    // blogData should be FormData
    const response = await axios.put(`${API_URL}/${id}`, blogData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    return response.data;
  },

  deleteBlogPost: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default blogService;
