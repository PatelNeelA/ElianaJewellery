// Service/contactService.js
import axios from "axios";

const API_URL = "https://elianajewellery-backend.onrender.com/api/contact"; // Adjust if your backend URL changes

const contactService = {
  submitMessage: async (messageData) => {
    const response = await axios.post(API_URL, messageData);
    return response.data;
  },

  getAllMessages: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  deleteMessage: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default contactService;
