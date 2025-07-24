import React from "react";
import prpose from "/assets/images/prpose.png";
import propose1 from "/assets/images/propose1.png";
import platinumRing from "/assets/images/platinum ring 1.png";
import { Link } from "react-router-dom";

const Engagement = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-12 pt-28 sm:pt-36 lg:pt-56">
      <div className="relative flex flex-col lg:flex-row items-center gap-10">
        <div className="relative w-full max-w-xl mx-auto lg:mx-0">
          <img
            className="w-full rounded-sm shadow-md"
            src={prpose}
            alt="Proposal"
          />
          <img
            className="absolute -top-16 -left-10 w-32 sm:w-40 md:w-48 lg:w-56 rounded-sm"
            src={propose1}
            alt="Couple"
          />
          <img
            className="absolute top-[70%] -left-14 w-20 sm:w-28 md:w-32 lg:w-40"
            src={platinumRing}
            alt="Platinum Ring"
          />
        </div>

        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="font-moglan text-[#13524a] text-sm sm:text-base">
            For Someone Special
          </h1>
          <h2 className="font-moglan text-black text-2xl sm:text-3xl lg:text-4xl mt-2">
            Ready To Wear Engagement Ring?
          </h2>
          <p className="mt-6 font-playfair-display text-black text-sm sm:text-base leading-relaxed">
            Discover elegance and sophistication with our exquisite collection
            of ready-to-wear engagement rings. Crafted with precision and
            passion, each piece in our collection embodies timeless beauty and
            exceptional craftsmanship.
          </p>
          <Link to="/collection/couplering">
            <button className="h-[50px] sm:h-[54px] w-[160px] sm:w-[187px] text-sm sm:text-[18px] md:text-[20px] mt-8 font-moglan bg-[#fef5ee] border border-[#13524a] rounded-md text-[#13524a] hover:bg-[#13524a] hover:text-white transition-all duration-300">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Engagement;
