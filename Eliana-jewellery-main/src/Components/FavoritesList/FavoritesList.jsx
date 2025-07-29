import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromFavorites } from "../../store/CartSlice";

const FavoritesList = () => {
  const favorites = useSelector((state) => state.cart.favorites);
  const dispatch = useDispatch();

  const handleRemoveFromFavorites = (itemId) => {
    // Changed itemId from item.id to item._id
    dispatch(removeFromFavorites(itemId));
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pt-24 pb-12">
      <h2 className="text-center text-[#13524a] text-2xl sm:text-3xl font-moglan mb-8">
        Your Favorites
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {favorites.length === 0 ? (
          <div className="col-span-full flex justify-center items-center">
            <p className="text-center text-gray-600 text-base sm:text-lg">
              Your wishlist is empty.
            </p>
          </div>
        ) : (
          favorites.map((favorite) => (
            <div
              key={favorite._id} // Changed key from favorite.id to favorite._id
              className="w-full max-w-sm bg-[#13524a] rounded-xl shadow-lg overflow-hidden card-hover"
            >
              <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72">
                <img
                  className="object-cover w-full h-full"
                  src={`https://elianajewellery-backend.onrender.com${favorite.imageUrl}`} // Changed src from favorite.image to favorite.imageUrl and added base URL
                  alt={favorite.name}
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-playfair-display text-lg mb-2">
                  {favorite.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-white font-moglan text-base">
                    INR: {favorite.price}
                  </span>
                  <i
                    className="fa-regular fa-heart text-red-500 text-lg cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleRemoveFromFavorites(favorite._id)} // Changed favorite.id to favorite._id
                    title="Remove from wishlist"
                  ></i>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleBack}
          className="text-[#13524a] hover:text-white hover:bg-[#13524a] border border-[#13524a] px-6 py-2 rounded-md transition-all duration-300 font-moglan"
        >
          Back to Page
        </button>
      </div>
    </div>
  );
};

export default FavoritesList;
