// Service/orderService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/orders"; // Adjust if your backend URL changes

const orderService = {
  createOrder: async (orderData) => {
    // orderData includes cartItems, totalPrice, buyerDetails
    const response = await axios.post(`${API_URL}/create`, orderData);
    return response.data;
  },
  verifyPayment: async (verificationData) => {
    // verificationData includes orderId, paymentId, signature
    const response = await axios.post(`${API_URL}/verify`, verificationData);
    return response.data;
  },
  getAllOrders: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  updateOrderStatus: async (id, statusData) => {
    // statusData: { status: 'new_status' }
    const response = await axios.put(`${API_URL}/${id}`, statusData);
    return response.data;
  },
  deleteOrder: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default orderService;
