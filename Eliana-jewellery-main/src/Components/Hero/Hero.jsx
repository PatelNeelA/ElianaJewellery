import React from "react";
import girl1 from "/assets/images/girl1.png";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="w-full relative overflow-hidden bg-[#fef5ee] pt-0 pb-0 sm:pt-14 sm:pb-0 md:pt-20 md:pb-0 lg:pt-0 lg:pb-0"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 px-4">
          <div className="text-center md:text-left space-y-4">
            <h1 className="text-[#15534b] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-moglan uppercase">
              Enchanting
            </h1>
            <h1 className="text-[#15534b] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-moglan">
              Jewellerys
            </h1>
          </div>

          <div className="w-full md:w-auto">
            <img
              src={girl1}
              alt="Hero Model"
              className="max-w-[90%] md:max-w-[500px] h-auto mx-auto"
            />
          </div>
        </div>
      </section>

      <div className="w-full h-[45px] bg-[#15534b] overflow-hidden relative">
        <p className="absolute text-white text-sm sm:text-base font-playfair-display whitespace-nowrap animate-scroll-text leading-[2.5rem] px-4">
          GET 20% DISCOUNT ON YOUR FIRST PRODUCT &nbsp;&nbsp;&nbsp;&nbsp;-
          &nbsp;&nbsp;&nbsp;&nbsp; DISCOVER LATEST COLLECTIONS AND TOP DESIGNERS
          &nbsp;&nbsp;&nbsp;&nbsp; - &nbsp;&nbsp;&nbsp;&nbsp; 10% DISCOUNT FOR
          REGISTERED USER
        </p>
      </div>
    </>
  );
};

export default Hero;
