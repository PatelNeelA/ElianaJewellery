import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { remove, increment, decrement, clearCart } from "../../store/CartSlice";
import orderService from "../../Service/orderService";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Function to load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const productItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  // Ensure userProfile is available. If it's only in context, you might need to adjust:
  // const { userProfile } = useContext(UserProfileContext);
  // For now, assuming it's in Redux or accessible as state.userProfile
  const userProfile = useSelector((state) => state.userProfile);

  const removeCartItem = (itemId) => dispatch(remove(itemId));
  const incrementQuantity = (itemId) => dispatch(increment(itemId));
  const decrementQuantity = (itemId) => dispatch(decrement(itemId));

  const handleBack = () => window.history.back();

  const handleBuyNow = () => {
    setShowModal(true);
    setSubmitted(false);
    if (userProfile && userProfile.role !== "guest") {
      setFormData((prev) => ({
        ...prev,
        name: userProfile.name || "",
        email: userProfile.email || "",
      }));
    } else {
      setFormData({ name: "", mobile: "", email: "", address: "" });
    }
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full Name is required"; // Changed to Full Name to match label
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile))
      errors.mobile = "Invalid mobile number";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email";
    if (!formData.address.trim()) errors.address = "Address is required";
    return errors;
  };

  const displayRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you offline?", {
        position: "top-center",
      });
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      toast.error("Please fill in all required details.", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = await orderService.createOrder({
        cartItems: productItems,
        totalPrice: totalPrice,
        buyerDetails: formData,
        userId:
          userProfile && userProfile.role !== "guest" ? userProfile._id : null,
      });

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Eliana Jewellery",
        description: "Purchase from Eliana Jewellery",
        order_id: orderData.order_id,
        handler: async function (response) {
          setLoading(true);
          try {
            const verificationRes = await orderService.verifyPayment({
              orderId: orderData.order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            toast.success(verificationRes.message, { position: "top-center" });
            dispatch(clearCart());
            setShowModal(false);
            setSubmitted(true);
          } catch (verificationError) {
            toast.error(
              verificationError.response?.data?.message ||
                "Payment verification failed!",
              { position: "top-center" }
            );
            console.error("Payment verification error:", verificationError);
            setSubmitted(false);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#13524a",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error initiating payment!",
        { position: "top-center" }
      );
      console.error("Payment initiation error:", error);
    } finally {
      setLoading(false);
    }
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
              className="bg-[#13524a] hover:bg-[#18544d] text-white font-bold py-2 px-4 rounded w-full sm:w-auto" // Themed button
            >
              Buy Now
            </button>
          </div>
        </>
      )}
      <div className="mt-8">
        <button
          onClick={handleBack}
          className="text-[#13524a] hover:text-[#18544d] font-semibold" // Themed link button
        >
          Back to Page
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
          <div className="bg-[#fef5ee] border border-[#13524a] rounded-lg w-full max-w-md p-6 shadow-lg">
            {" "}
            {/* Themed modal card */}
            <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
              {" "}
              {/* Themed heading */}
              Enter Your Details
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                displayRazorpay();
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-moglan text-gray-700" // Themed label font
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base ${
                    // Themed input
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-moglan text-gray-700" // Themed label font
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base ${
                    // Themed input
                    formErrors.mobile ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                  pattern="[0-9]{10}"
                  title="Mobile number must be 10 digits"
                />
                {formErrors.mobile && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.mobile}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-moglan text-gray-700" // Themed label font
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base ${
                    // Themed input
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-moglan text-gray-700" // Themed label font
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base resize-y ${
                    // Themed input
                    formErrors.address ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full sm:w-auto" // Secondary button
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13524a] hover:bg-[#18544d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13524a] disabled:opacity-50" // Themed button
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {submitted && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
          <div className="bg-[#fef5ee] border border-[#13524a] rounded-lg p-6 w-full max-w-sm text-center shadow-lg">
            {" "}
            {/* Themed modal card */}
            <p className="text-xl font-semibold text-green-600">
              Order processed successfully!
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Your order has been placed. You will receive an email confirmation
              shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                navigate("/home");
              }}
              className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13524a] hover:bg-[#18544d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13524a]" // Themed button
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
