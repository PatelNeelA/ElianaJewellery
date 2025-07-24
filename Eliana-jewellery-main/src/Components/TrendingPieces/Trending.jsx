import React from "react";
import { Link } from "react-router-dom";

const trendingItems = [
  {
    src: "/assets/images/wedding ring 1.png",
    title: "Wedding Rings",
    category: "WeddingRing",
  },
  {
    src: "/assets/images/couple ring.png",
    title: "Couple Ring",
    category: "couplering",
  },
  {
    src: "/assets/images/shine like a night.png",
    title: "Shine Like A Night",
    category: "WeddingRing",
  },
  {
    src: "/assets/images/Rose Gold Radiance.png",
    title: "Rose Gold Radiance",
    category: "rosegold",
  },
  {
    src: "/assets/images/Golden Glow.png",
    title: "Golden Glow",
    category: "WeddingRing",
  },
  {
    src: "/assets/images/Whisper Winter.png",
    title: "Whisper Winter",
    category: "WeddingRing",
  },
];

const Trending = () => {
  return (
    <div className="w-full mt-32 px-4">
      <h2 className="text-center mt-10 font-normal text-2xl sm:text-[30px] md:text-[40px] text-[rgba(19,82,74,0.38)] font-moglan">
        What you Loved The Most
      </h2>
      <h1 className="text-center font-normal text-4xl sm:text-[60px] md:text-[80px] leading-tight md:leading-[107px] text-[#13524a] font-moglan">
        Trending Pieces
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {trendingItems.map((item, index) => (
          <Link
            to={`/collection/${item.category}`}
            key={index}
            className="w-full rounded-[7px] relative overflow-hidden transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="bg-[rgba(19,82,74,0.38)] absolute inset-0 flex items-center justify-center">
              <h1 className="font-normal text-lg md:text-[30px] text-white text-center font-playfair-display">
                {item.title}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Trending;
