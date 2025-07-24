import React, { useState } from "react";
import ring from "/assets/images/footer-ring.png";
import instagram from "/assets/images/icons8-instagram-100 1.png";
import facebook from "/assets/images/icons8-facebook-100 1.png";
import twitter from "/assets/images/icons8-twitter-100 1.png";
import youtube from "/assets/images/icons8-youtube-100 1.png";
import visa from "/assets/images/visa.png";
import mastercard from "/assets/images/mastercard.png";
import amex from "/assets/images/amex.png";
import discover from "/assets/images/discover.png";
import amazon from "/assets/images/amazon.png";

const Footer = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleSubscribe = (event) => {
    event.preventDefault();
    const emailInput = event.target.elements.email.value;
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput);
    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return;
    }
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <footer className="w-full mt-32">
      <section className="bg-[#f3ece6] py-12 px-4 text-center">
        <h2 className="font-playfair-display text-sm text-[#13524a] tracking-wider">
          NEWSLETTER
        </h2>
        <h3 className="font-playfair-display text-3xl sm:text-4xl lg:text-[47px] text-black mt-2 leading-snug">
          Subscribe To Get <br className="hidden sm:block" />
          The Latest Updates
        </h3>
        <form
          onSubmit={handleSubscribe}
          className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <input
            className="w-full sm:w-[394px] h-[44px] rounded border border-[#13524a] pl-4 text-sm focus:outline-none"
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            required
          />
          <button
            type="submit"
            className="w-[126px] h-[44px] bg-[#f3ece6] border border-[#13524a] rounded font-playfair-display text-[#13524a] hover:bg-[#13524a] hover:text-white transition-all duration-300"
          >
            SUBSCRIBE
          </button>
        </form>
        {showMessage && (
          <p className="text-green-600 mt-4 font-semibold">
            Thank you for subscribing!
          </p>
        )}
      </section>

      <section className="bg-[#13524a] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="relative">
            <div className="bg-[#13524a] border border-white p-6 w-full max-w-sm relative rounded-md">
              <img
                src={ring}
                alt="Logo Decoration"
                className="absolute -top-4 right-2 w-16"
              />
              <h1 className="font-myFirstFont text-6xl text-white text-center">
                Eliana
              </h1>
              <h2 className="text-3xl text-white text-center mt-2">
                Jewellery
              </h2>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-playFair mb-2">Eliana Jewellerys</h3>
            <p className="text-sm">Crafted with love & loyalty</p>
            <div className="flex gap-4 mt-4">
              <img src={instagram} alt="Instagram" className="w-6 h-6" />
              <img src={facebook} alt="Facebook" className="w-6 h-6" />
              <img src={twitter} alt="Twitter" className="w-6 h-6" />
              <img src={youtube} alt="YouTube" className="w-6 h-6" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl mb-4 font-playfair-display">Navigate</h3>
            <ul className="space-y-2 text-base">
              <li>Home</li>
              <li>Collection</li>
              <li>Blogs</li>
              <li>Contact</li>
              <li>Cart</li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-2xl mb-4 font-playfair-display">
                Need Help?
              </h3>
              <ul className="space-y-2 text-base">
                <li>Store Location</li>
                <li>Pricing</li>
                <li>Regarding Stock</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl mb-4 font-playfair-display">Policy</h3>
              <ul className="space-y-2 text-base">
                <li>Term Of Service</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white pt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-sm font-myFirstFont">
            © 2025 All Rights Reserved Terms Of Use
          </p>
          <div className="text-center">
            <p className="font-playFair text-sm mb-2">
              Supported Payment Systems
            </p>
            <div className="flex justify-center items-center gap-2">
              <img src={visa} alt="Visa" className="h-6" />
              <img src={mastercard} alt="Mastercard" className="h-6" />
              <img src={amex} alt="Amex" className="h-6" />
              <img src={discover} alt="Discover" className="h-6" />
              <img src={amazon} alt="Amazon" className="h-6" />
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
