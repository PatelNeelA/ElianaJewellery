import React from "react";
import arrow from "/assets/images/follow-arrow.png";
import instagram1 from "/assets/images/instagram1.png";
import instagram2 from "/assets/images/instagram2.png";
import instagram3 from "/assets/images/instagram3.png";
import instagram4 from "/assets/images/instagram4.png";
import instagram5 from "/assets/images/instagram5.png";

const Contact = () => {
  return (
    <div
      id="contact"
      className="w-full flex flex-col lg:flex-row items-center px-4 sm:px-8 lg:px-20 py-12"
    >
      <div className="w-full lg:w-1/2 relative mb-12 lg:mb-0 text-center lg:text-left">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-moglan text-[#13524a] mt-8 lg:mt-40">
          INSTAGRAM
        </h1>
        <h1 className="text-4xl md:text-6xl lg:text-[102px] font-moglan text-black mt-4">
          Follow Us
        </h1>
        <h1 className="text-4xl md:text-6xl lg:text-[102px] font-moglan text-[#13524a]">
          @Elianajewellery
        </h1>
        <p className="text-base md:text-xl lg:text-2xl font-playfair-display text-black mt-6">
          If you like daily updates why don't <br className="hidden lg:block" />
          you <span className="text-[#13524a]">follow</span> us
          <span className="text-[#13524a] px-1">on instagram?</span>
        </p>

        <div className="relative mt-8 flex justify-center lg:justify-start">
          <img
            className="absolute left-1/2 lg:left-[60%] -top-8 w-10 md:w-12"
            src={arrow}
            alt="arrow"
          />
          <button className="mt-12 w-36 h-12 bg-[#fef5ee] border border-black text-[#13524a] rounded-md hover:bg-[#13524a] hover:text-white transition-colors">
            FOLLOW
          </button>
        </div>
      </div>

      <div className="w-full lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[instagram1, instagram2, instagram3, instagram4, instagram5].map(
          (img, idx) => (
            <img
              key={idx}
              className="w-full rounded-md"
              src={img}
              alt={`Instagram ${idx + 1}`}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Contact;
