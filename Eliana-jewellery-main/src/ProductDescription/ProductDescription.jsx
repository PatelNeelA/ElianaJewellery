import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import product from "../store/Data";
import { add } from "../store/CartSlice";
import { useDispatch, useSelector } from "react-redux";

const ProductDescription = () => {
  const { id } = useParams();
  const [productDetail, setProductDetail] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    const filteredProduct = product.find((item) => item.id == id);
    setProductDetail(filteredProduct);
  }, [id]);

  const handleAddToCart = (item) => {
    const isItemInCart = cartItems.some((cartItem) => cartItem.id === item.id);
    if (!isItemInCart) {
      dispatch(add(item));
      toast.success("Item added to cart successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error("Item is already in the cart!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg mt-10">
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/2 px-2">
          <img
            src={productDetail?.image}
            alt={productDetail?.name}
            className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          />
        </div>

        <div className="w-full md:w-1/2 px-2 mt-6 md:mt-0">
          <h2 className="text-2xl font-bold text-white mb-4">
            {productDetail?.name}
          </h2>
          <p className="text-lg text-white mb-4">
            {productDetail?.productDetails}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 text-white">
            <p>
              <strong>Price:</strong> ₹ {productDetail?.price}
            </p>
            <p>
              <strong>Gender:</strong> {productDetail?.gender}
            </p>
            <p>
              <strong>Occasion:</strong> {productDetail?.occasion}
            </p>
            <p>
              <strong>Material Color:</strong> {productDetail?.materialColor}
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={() => handleAddToCart(productDetail)}
              className="bg-white text-green-500 hover:bg-green-500 hover:text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
            >
              Add to Cart
            </button>
            <Link
              to="/cart"
              className="bg-blue-500 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded w-full sm:w-auto"
            >
              Go to Cart
            </Link>
            <button
              onClick={handleBack}
              className="bg-white text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
            >
              Back to Page
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDescription;
