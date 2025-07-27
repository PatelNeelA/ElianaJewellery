import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import product from "../../store/Data"; // REMOVE THIS LINE
import productService from "../../Service/productService"; // Import productService
import { addToFavorites, removeFromFavorites } from "../../store/CartSlice";
import collectionService from "../../Service/collectionService"; // Import collectionService

const CardDetails = () => {
  const { collectionType } = useParams(); // This is the collection name, e.g., "Rings"
  const [products, setProducts] = useState([]); // Renamed from filteredProduct for clarity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.cart.favorites);

  // State for filtering/sorting
  const [currentGenderFilter, setCurrentGenderFilter] = useState("all");
  const [currentSortOrder, setCurrentSortOrder] = useState(""); // 'asc' or 'desc'

  useEffect(() => {
    const fetchProductsByCollection = async () => {
      setLoading(true);
      setError(null);
      try {
        // First, fetch all collections to find the ID for the given collectionType (name)
        // This is a workaround because your current routing uses collection name.
        // A better approach would be to pass collection ID in the URL or
        // modify the backend getProducts to filter by collection name directly.
        // For now, we'll fetch all and find the ID.
        const collections = await fetchCollections(); // Assume fetchCollections exists or import collectionService
        const targetCollection = collections.find(
          (col) => col.name.toLowerCase() === collectionType.toLowerCase()
        );

        if (targetCollection) {
          const data = await productService.getProducts(targetCollection._id);
          setProducts(data);
        } else {
          setProducts([]); // No collection found with that name
          setError("Collection not found.");
        }
      } catch (err) {
        setError("Failed to load products for this collection.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCollection();
    window.scrollTo(0, 0); // Keep this for scroll behavior
  }, [collectionType]); // Re-fetch when collectionType changes

  // Helper function to fetch collections (can be moved to collectionService if not there already)
  const fetchCollections = async () => {
    try {
      // Assuming you have collectionService imported at the top
      const data = await collectionService.getCollections();
      return data;
    } catch (err) {
      console.error("Error fetching collections:", err);
      return [];
    }
  };

  const applyFiltersAndSort = (productsToProcess) => {
    let tempProducts = [...productsToProcess];

    // Apply gender filter
    if (currentGenderFilter !== "all") {
      tempProducts = tempProducts.filter(
        (item) => item.gender === currentGenderFilter
      );
    }

    // Apply sorting
    if (currentSortOrder === "asc") {
      tempProducts.sort((a, b) => a.price - b.price);
    } else if (currentSortOrder === "desc") {
      tempProducts.sort((a, b) => b.price - a.price);
    }
    return tempProducts;
  };

  const filterAndSortData = async (
    gender = currentGenderFilter,
    order = currentSortOrder
  ) => {
    setLoading(true);
    setError(null);
    try {
      const collections = await fetchCollections();
      const targetCollection = collections.find(
        (col) => col.name.toLowerCase() === collectionType.toLowerCase()
      );

      if (targetCollection) {
        const data = await productService.getProducts(targetCollection._id);
        let processedData = data;

        // Apply gender filter
        if (gender !== "all") {
          processedData = processedData.filter(
            (item) => item.gender === gender
          );
        }

        // Apply sorting
        if (order === "asc") {
          processedData.sort((a, b) => a.price - b.price);
        } else if (order === "desc") {
          processedData.sort((a, b) => b.price - a.price);
        }

        setProducts(processedData);
        setCurrentGenderFilter(gender);
        setCurrentSortOrder(order);
      } else {
        setProducts([]);
        setError("Collection not found.");
      }
    } catch (err) {
      setError("Failed to load products.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => window.history.back();

  const handleAddToFavorites = (itemId) => {
    const item = products.find((item) => item._id === itemId); // Use _id from MongoDB
    if (item) dispatch(addToFavorites(item));
  };

  const isFavorite = (itemId) => favorites.some((item) => item._id === itemId); // Use _id for favorites

  const handleRemoveFromFavorites = (itemId) =>
    dispatch(removeFromFavorites(itemId));

  if (loading) {
    return <div className="text-center mt-28">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-28 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center mt-28">
        No products found in this collection.
      </div>
    );
  }

  return (
    <>
      <i
        onClick={handleBack}
        className="fa-solid fa-arrow-left text-3xl md:text-4xl lg:text-5xl text-[#13542a] mt-4 ml-4 cursor-pointer"
      ></i>

      <div className="flex flex-wrap justify-center gap-3 mt-8 px-4 sm:px-6 lg:px-8">
        {/* Gender Filters */}
        {["All Products", "Male", "Female"].map((label) =>
          collectionType.toLowerCase() === "rings" ||
          label === "All Products" ||
          products.some((p) => p.gender === label) ? ( // Show if Rings collection or if any product has that gender
            <button
              key={label}
              onClick={() =>
                filterAndSortData(label === "All Products" ? "all" : label)
              }
              className={`font-playfair-display w-[110px] sm:w-[126px] h-[37px] text-sm rounded-xl border border-[#13524a] ${
                currentGenderFilter ===
                (label === "All Products" ? "all" : label)
                  ? "bg-[#13524a] text-white"
                  : "bg-[#fef5ee] text-[#18544d] hover:bg-[#13524a] hover:text-white"
              }`}
            >
              {label === "All Products" ? "All" : label}
            </button>
          ) : null
        )}

        {/* Price Sorting */}
        {["asc", "desc"].map((order) => (
          <button
            key={order}
            onClick={() => filterAndSortData(currentGenderFilter, order)}
            className={`font-playfair-display w-[126px] h-[37px] text-sm rounded-xl border border-[#13524a] ${
              currentSortOrder === order
                ? "bg-[#13524a] text-white"
                : "bg-[#fef5ee] text-[#18544d] hover:bg-[#13524a] hover:text-white"
            }`}
          >
            {order === "asc" ? "Low to High" : "High to Low"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 px-4 sm:px-6 lg:px-12">
        {products.map((productItem) => (
          <div
            key={productItem._id} // Use _id from MongoDB
            className="bg-[#13524a] rounded-xl shadow-lg transition-transform transform hover:scale-[1.02]"
          >
            <Link to={`/product/${productItem._id}`}>
              {" "}
              {/* Updated Link to new product route */}
              <img
                className="w-full h-[200px] object-cover rounded-t-xl"
                src={`http://localhost:5000${productItem.imageUrl}`} // Use imageUrl from backend
                alt={productItem.name}
              />
            </Link>
            <div className="p-4">
              <h1 className="text-white font-playfair-display text-base md:text-lg">
                {productItem.name}
              </h1>
              <div className="flex justify-between items-center mt-4">
                <p className="text-white font-moglan text-sm md:text-base">
                  INR: {productItem.price}.00
                </p>
                <i
                  className="fa-regular fa-heart text-lg cursor-pointer"
                  style={{
                    color: isFavorite(productItem._id) ? "red" : "white",
                  }}
                  onClick={() =>
                    isFavorite(productItem._id)
                      ? handleRemoveFromFavorites(productItem._id)
                      : handleAddToFavorites(productItem._id)
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
