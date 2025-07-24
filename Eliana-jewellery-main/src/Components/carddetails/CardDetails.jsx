import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import product from "../../store/Data";
import { addToFavorites, removeFromFavorites } from "../../store/CartSlice";

const CardDetails = () => {
  const { collectionType } = useParams();
  const [filteredProduct, setFilteredProduct] = useState([]);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.cart.favorites);

  useEffect(() => {
    const filteredProduct = product.filter(
      (item) => item.category === collectionType
    );
    setFilteredProduct(filteredProduct);
  }, [collectionType]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filterByGender = (gender) => {
    const items = product.filter((item) => item.category === collectionType);
    if (gender === "all") setFilteredProduct(items);
    else setFilteredProduct(items.filter((item) => item.gender === gender));
  };

  const sortByPrice = (order) => {
    const sortedData = [...filteredProduct];
    sortedData.sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price
    );
    return sortedData;
  };

  const handleBack = () => window.history.back();

  const handleAddToFavorites = (itemId) => {
    const item = filteredProduct.find((item) => item.id === itemId);
    if (item) dispatch(addToFavorites(item));
  };

  const isFavorite = (itemId) => favorites.some((item) => item.id === itemId);

  const handleRemoveFromFavorites = (itemId) =>
    dispatch(removeFromFavorites(itemId));

  return (
    <>
      <i
        onClick={handleBack}
        className="fa-solid fa-arrow-left text-3xl md:text-4xl lg:text-5xl text-[#13542a] mt-4 ml-4 cursor-pointer"
      ></i>

      <div className="flex flex-wrap justify-center gap-3 mt-8 px-4 sm:px-6 lg:px-8">
        {["All Products", "Men", "Women"].map((label) =>
          collectionType !== "Rings" && label !== "All Products" ? null : (
            <button
              key={label}
              onClick={() =>
                label === "All Products"
                  ? filterByGender("all")
                  : filterByGender(label)
              }
              className="font-playfair-display w-[110px] sm:w-[126px] h-[37px] text-sm bg-[#fef5ee] text-[#18544d] text-center rounded-xl border border-[#13524a] hover:bg-[#13524a] hover:text-white"
            >
              {label}
            </button>
          )
        )}

        {["asc", "desc"].map((order) => (
          <button
            key={order}
            onClick={() => setFilteredProduct(sortByPrice(order))}
            className="font-playfair-display w-[126px] h-[37px] text-sm bg-[#fef5ee] text-[#18544d] text-center rounded-xl border border-[#13524a] hover:bg-[#13524a] hover:text-white"
          >
            {order === "asc" ? "Low to High" : "High to Low"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 px-4 sm:px-6 lg:px-12">
        {filteredProduct.map((ring) => (
          <div
            key={ring.id}
            className="bg-[#13524a] rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]"
          >
            <Link to={`${ring.id}`}>
              <img
                className="w-full h-[200px] object-cover rounded-t-xl"
                src={ring.image}
                alt={ring.name}
              />
            </Link>
            <div className="p-4">
              <h1 className="text-white font-playfair-display text-base md:text-lg">
                {ring.name}
              </h1>
              <div className="flex justify-between items-center mt-4">
                <p className="text-white font-moglan text-sm md:text-base">
                  INR: {ring.price}.00
                </p>
                <i
                  className="fa-regular fa-heart text-lg cursor-pointer"
                  style={{ color: isFavorite(ring.id) ? "red" : "white" }}
                  onClick={() =>
                    isFavorite(ring.id)
                      ? handleRemoveFromFavorites(ring.id)
                      : handleAddToFavorites(ring.id)
                  }
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CardDetails;
