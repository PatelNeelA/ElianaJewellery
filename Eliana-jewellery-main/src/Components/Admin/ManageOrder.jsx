// components/Admin/ManageOrder.jsx
import React from "react";
import { useState, useEffect } from "react";
import orderService from "../../Service/orderService"; // Import orderService

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    const newStatus = prompt(
      `Enter new status for order ${orderId} (e.g., pending, processing, shipped, delivered, cancelled, refunded):`,
      currentStatus
    );
    if (!newStatus) return; // User cancelled

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await orderService.updateOrderStatus(orderId, {
        status: newStatus,
      });
      setSuccess(result.message);
      fetchOrders(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status.");
      console.error("Error updating order status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const result = await orderService.deleteOrder(id);
        setSuccess(result.message);
        fetchOrders(); // Refresh list
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete order.");
        console.error("Error deleting order:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-[#f3ece6]">
      {" "}
      {/* Main container background */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Manage Orders
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="bg-[#fef5ee] border border-[#13524a] p-6 rounded-lg shadow-lg">
        {" "}
        {/* Table card style */}
        <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
          {" "}
          {/* Heading style */}
          All Orders
        </h2>
        {loading && <p>Loading orders...</p>}
        {orders.length === 0 && !loading && <p>No orders found.</p>}
        {orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ...{order.razorpay?.orderId?.slice(-6)}
                      </div>{" "}
                      {/* Show last 6 chars */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.buyerDetails.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{order.totalAmount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "shipped"
                            ? "bg-indigo-100 text-indigo-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ...{order.razorpay?.paymentId?.slice(-6) || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, order.status)
                        }
                        className="text-[#13524a] hover:text-[#18544d] mr-4"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrder;
