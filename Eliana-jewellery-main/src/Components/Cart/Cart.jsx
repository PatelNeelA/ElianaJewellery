import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { remove, increment, decrement } from "../../store/CartSlice";

const Cart = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    otp: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const productItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  // Use item._id for all dispatch actions
  const removeCartItem = (itemId) => dispatch(remove(itemId));
  const incrementQuantity = (itemId) => dispatch(increment(itemId));
  const decrementQuantity = (itemId) => dispatch(decrement(itemId));

  const handleBack = () => window.history.back();

  const handleBuyNow = () => {
    setShowModal(!showModal);
    if (!showModal) {
      setFormData({ name: "", mobile: "", email: "", address: "", otp: "" });
      setFormErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "mobile" && value.trim().length === 10) {
      const otp = Math.floor(100000 + Math.random() * 900000);
      setFormData((prev) => ({ ...prev, otp: otp.toString() }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    setSubmitted(Object.keys(errors).length === 0);
    // TODO: Add logic here to send order details to your backend
    // You'll likely need an order service to handle this.
    // For example:
    // if (Object.keys(errors).length === 0) {
    //   try {
    //     await orderService.placeOrder({ ...formData, items: productItems, totalPrice });
    //     // Clear cart after successful order
    //     dispatch(clearCart()); // You'll need to define a clearCart action in your CartSlice
    //     toast.success("Order placed successfully!", { position: "top-right" });
    //     setSubmitted(true);
    //     setShowModal(false);
    //   } catch (error) {
    //     console.error("Error placing order:", error);
    //     toast.error("Failed to place order. Please try again.", { position: "top-right" });
    //   }
    // }
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.name.trim()) errors.name = "Name is required";
    if (!data.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(data.mobile))
      errors.mobile = "Invalid mobile number";
    if (!data.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Invalid email";
    if (!data.address.trim()) errors.address = "Address is required";
    if (!data.otp.trim()) errors.otp = "OTP is required";
    return errors;
  };

  const totalPrice = productItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {productItems.length === 0 ? (
        <p className="text-center text-gray-600 text-base sm:text-lg">
          Your cart is empty.
        </p>
      ) : (
        <>
          {productItems.map((item) => (
            <div
              key={item._id}
              className="mb-4 p-4 border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center w-full sm:w-2/3">
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 text-sm">{item.productDetails}</p>
                  <p className="text-gray-700 text-sm">
                    Price: ₹ {item.price * item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center">
                  <button
                    onClick={() => decrementQuantity(item._id)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold px-3 py-1 rounded-l"
                  >
                    -
                  </button>
                  <span className="bg-gray-200 px-3 py-1">{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item._id)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-semibold px-3 py-1 rounded-r"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeCartItem(item._id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <p className="text-xl font-semibold">Total Price: ₹ {totalPrice}</p>
            <button
              onClick={handleBuyNow}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
      <div className="mt-8">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:text-blue-700 font-semibold"
        >
          Back to Page
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "mobile", "otp", "email", "address"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 capitalize"
                  >
                    {field}
                  </label>
                  {field === "address" ? (
                    <textarea
                      id={field}
                      name={field}
                      rows="3"
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className={`mt-1 p-2 w-full rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  ) : (
                    <input
                      type={
                        field === "email"
                          ? "email"
                          : field === "mobile" || field === "otp"
                          ? "tel"
                          : "text"
                      }
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className={`mt-1 p-2 w-full rounded-md border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                        formErrors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                  {formErrors[field] && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors[field]}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full sm:w-auto"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm text-center">
            <p className="text-xl font-semibold text-green-600">
              Order placed successfully!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
