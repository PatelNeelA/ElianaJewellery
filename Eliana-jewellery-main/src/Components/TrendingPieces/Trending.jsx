// components/Home/Trending.jsx (MODIFIED - Adjusted width/height for image match)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import collectionService from "../../Service/collectionService"; // Use collectionService

const Trending = () => {
  const [trendingCollections, setTrendingCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await collectionService.getCollections({
          isTrending: true,
        });
        setTrendingCollections(data);
      } catch (err) {
        setError("Failed to load trending items.");
        console.error("Error fetching trending data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  if (loading) {
    return <div className="text-center mt-32">Loading Trending Items...</div>;
  }

  if (error) {
    return <div className="text-center mt-32 text-red-500">{error}</div>;
  }

  if (trendingCollections.length === 0) {
    return (
      <div className="w-full mt-32 px-4 text-center text-gray-600">
        <h2 className="text-center mt-10 font-normal text-2xl sm:text-[30px] md:text-[40px] text-[rgba(19,82,74,0.38)] font-moglan">
          What you Loved The Most
        </h2>
        <h1 className="text-center font-normal text-4xl sm:text-[60px] md:text-[80px] leading-tight md:leading-[107px] text-[#13524a] font-moglan mb-12">
          Trending Pieces
        </h1>
        <p>
          No trending items available. Please add some collections and mark them
          as trending from the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-32 px-4">
      <h2 className="text-center mt-10 font-normal text-2xl sm:text-[30px] md:text-[40px] text-[rgba(19,82,74,0.38)] font-moglan">
        What you Loved The Most
      </h2>
      <h1 className="text-center font-normal text-4xl sm:text-[60px] md:text-[80px] leading-tight md:leading-[107px] text-[#13524a] font-moglan mb-12">
        Trending Pieces
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 max-w-screen-xl mx-auto justify-items-center">
        {trendingCollections.map((collection) => (
          <Link
            to={`/collection/${collection.name}`}
            key={collection._id}
            className="w-full rounded-[7px] relative overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-105 group"
            style={{
              // Adjusted dimensions to better match image_82cba6.png
              // These are approximate and might need minor pixel adjustments
              width: "100%", // Take full width of its grid column
              maxWidth: "400px", // Increased max-width for wider appearance
              height: "150px", // Reduced height for a more rectangular shape
            }}
          >
            <img
              className="w-full h-full object-cover rounded-[7px] absolute inset-0 transition-opacity duration-300"
              // Adjusted opacity slightly to match the image's subtle visibility
              style={{ opacity: 0.6 }} // Base opacity for the image
              src={`http://localhost:5000${collection.imageUrl}`}
              alt={collection.name}
            />
            {/* Overlay Div - adjusted to match image visual */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-300"
              // Adjusted background color/opacity to match the image's overlay color
              style={{ backgroundColor: "rgba(19,82,74,0.38)" }} // Darker, less transparent overlay
            >
              <h1 className="font-normal text-lg md:text-[30px] text-white text-center font-playfair-display whitespace-nowrap">
                {collection.name.toUpperCase()}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Trending;
