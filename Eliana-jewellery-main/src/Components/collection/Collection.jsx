// components/Home/Collection.jsx (Modified for Responsiveness)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import collectionService from "../../Service/collectionService"; // Adjust path as needed

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCollectionsCount, setVisibleCollectionsCount] = useState(5); // Show initial 5
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await collectionService.getCollections();
        setCollections(data);
      } catch (err) {
        setError("Failed to load collections.");
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const handleViewAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setVisibleCollectionsCount(collections.length); // Show all
    } else {
      setVisibleCollectionsCount(5); // Show initial 5
    }
  };

  if (loading) {
    return <div className="text-center mt-28">Loading Collections...</div>;
  }

  if (error) {
    return <div className="text-center mt-28 text-red-500">{error}</div>;
  }

  return (
    <div id="collection" className="w-full mt-20 px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Adjusted mt-28 to mt-20 for better spacing */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#13524a] font-normal text-center font-moglan mb-12">
        {" "}
        {/* Added mb-12 for spacing */}
        Collections
      </h1>
      {/* Grid container for collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-8 justify-items-center mt-8">
        {collections.slice(0, visibleCollectionsCount).map((collection) => (
          <div
            key={collection._id}
            className="w-full max-w-[300px] h-[313px] bg-[#13524a] rounded-xl relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Link
              to={`/collection/${collection.name}`}
              className="block w-full h-full"
            >
              <img
                className="w-full h-[309px] object-cover rounded-xl"
                src={`http://localhost:5000${collection.imageUrl}`}
                alt={collection.name}
              />
              <div className="group">
                {/* Overlay for hover effect */}
                <div className="absolute bottom-0 left-0 w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300 ease-in-out"></div>
                {/* Collection Name */}
                <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] bottom-8 left-1/2 -translate-x-1/2 text-white group-hover:bottom-1/2 group-hover:translate-y-1/2 transition-all duration-300 ease-in-out font-moglan whitespace-nowrap">
                  {collection.name.toUpperCase()}
                </h1>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {collections.length > 5 && (
        <div className="flex justify-center mt-12">
          <button
            className="font-normal text-[20px] sm:text-[22px] leading-[29px] bg-[#fef5ee] border border-[#13524a] text-[#13524a] rounded-[6px] cursor-pointer w-[200px] sm:w-[245px] h-[50px] sm:h-[54px] hover:bg-[#13524a] hover:text-white font-moglan transition-colors duration-300"
            onClick={handleViewAll}
          >
            {showAll ? "Hide Collections" : "View All Collections"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Collection;
