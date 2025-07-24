import React, { useState } from "react";
import { Link } from "react-router-dom";
import girl2 from "/assets/images/girl2.png";
import girl3 from "/assets/images/girl3.png";
import girl4 from "/assets/images/girl4.png";
import girl5 from "/assets/images/girl5.png";
import girl6 from "/assets/images/girl6.png";
import pearl from "/assets/images/pearl-jewellery.jpg";
import bridal from "/assets/images/bridal-jewellery.png";
import Anklet from "/assets/images/Anklet.jpg";
import gemstone from "/assets/images/gemstone.jpg";
import bead from "/assets/images/bead.jpg";

const Collection = () => {
  const [showSecondSet, setShowSecondSet] = useState(false);
  const handleViewAll = () => {
    setShowSecondSet(!showSecondSet);
  };

  return (
    <div id="collection" className="w-full mt-28 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#13524a] font-normal text-center font-moglan">
        Collections
      </h1>

      <div className="w-full flex flex-wrap justify-center gap-8 mt-12">
        <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
          <Link to="/collection/Rings">
            <img
              className="rounded-xl w-full h-[309px] object-cover"
              src={girl2}
              alt="Rings"
            />
            <div className="group">
              <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
              <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                RINGS
              </h1>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
          <Link to="/collection/earrings">
            <img
              className="rounded-xl w-full h-[309px] object-cover"
              src={girl3}
              alt="Earrings"
            />
            <div className="group">
              <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
              <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                EARRINGS
              </h1>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
          <Link to="/collection/pendants">
            <img
              className="rounded-xl w-full h-[309px] object-cover"
              src={girl4}
              alt="Pendants"
            />
            <div className="group">
              <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
              <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                PENDANTS
              </h1>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
          <Link to="/collection/bracelet">
            <img
              className="rounded-xl w-full h-[309px] object-cover"
              src={girl5}
              alt="Bracelets"
            />
            <div className="group">
              <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
              <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[32px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                BRACELETS
              </h1>
            </div>
          </Link>
        </div>

        <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
          <Link to="/collection/necklace">
            <img
              className="rounded-xl w-full h-[309px] object-cover"
              src={girl6}
              alt="Necklace"
            />
            <div className="group">
              <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
              <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                NECKLACE
              </h1>
            </div>
          </Link>
        </div>
      </div>

      {showSecondSet && (
        <div className="w-full flex flex-wrap justify-center gap-8 mt-12">
          <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
            <Link to="/collection/Pearl">
              <img
                className="rounded-xl w-full h-[309px] object-cover"
                src={pearl}
                alt="Pearl"
              />
              <div className="group">
                <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
                <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                  PEARL
                </h1>
              </div>
            </Link>
          </div>

          <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
            <Link to="/collection/Bridal">
              <img
                className="rounded-xl w-full h-[309px] object-cover"
                src={bridal}
                alt="Bridal"
              />
              <div className="group">
                <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
                <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                  BRIDAL
                </h1>
              </div>
            </Link>
          </div>

          <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
            <Link to="/collection/anklet">
              <img
                className="rounded-xl w-full h-[309px] object-cover"
                src={Anklet}
                alt="Anklet"
              />
              <div className="group">
                <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
                <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-12 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                  ANKLET
                </h1>
              </div>
            </Link>
          </div>

          <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
            <Link to="/collection/gemstone">
              <img
                className="rounded-xl w-full h-[309px] object-cover"
                src={gemstone}
                alt="Gemstone"
              />
              <div className="group">
                <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
                <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[32px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                  GEMSTONE
                </h1>
              </div>
            </Link>
          </div>

          <div className="w-full sm:w-[229px] lg:w-[230px] h-[313px] bg-[#13524a] rounded-xl relative">
            <Link to="/collection/bead">
              <img
                className="rounded-xl w-full h-[309px] object-cover"
                src={bead}
                alt="Bead"
              />
              <div className="group">
                <div className="absolute top-[213px] w-full h-[100px] bg-[#13524a] rounded-b-xl opacity-30 group-hover:h-full group-hover:top-0 group-hover:rounded-t-lg transition-all duration-300"></div>
                <h1 className="absolute text-[30px] sm:text-[35px] lg:text-[35px] top-[230px] left-4 sm:left-6 lg:left-16 text-white group-hover:translate-y-[-100px] transition-all duration-300 font-moglan">
                  BEAD
                </h1>
              </div>
            </Link>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-12">
        <button
          className="font-normal text-[22px] leading-[29px] bg-[#fef5ee] border border-[#13524a] text-[#13524a] rounded-[6px] cursor-pointer w-[245px] h-[54px] hover:bg-[#13524a] hover:text-white font-moglan"
          onClick={handleViewAll}
        >
          {showSecondSet ? "Hide Collections" : "View All Collections"}
        </button>
      </div>
    </div>
  );
};

export default Collection;
