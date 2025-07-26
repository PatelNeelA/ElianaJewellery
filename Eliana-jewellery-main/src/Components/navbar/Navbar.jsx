// Components/navbar/Navbar.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserProfileContext } from "../../contexts/userContext";

// Mocking react-redux (keep this if you're still mocking Redux, otherwise remove)
const useSelector = (selector) => {
  return selector({ cart: { items: [{ id: 1 }, { id: 2 }] } });
};

// Import Lucide React icons
import { Search, Heart, ShoppingBag, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = useSelector((state) => state.cart.items);

  const { userProfile, setUserProfile } = useContext(UserProfileContext);

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // This effect should ideally only run if userProfile from context is null
    // or if a stored user exists that needs to be loaded into context.
    const storedUser = JSON.parse(localStorage.getItem("userProfile"));
    if (storedUser && (!userProfile || userProfile.role === "guest")) {
      // Only set if stored and not already in context, or if current is guest
      setUserProfile(storedUser);
    } else if (!storedUser && userProfile && userProfile.role !== "guest") {
      // If no stored user, but a non-guest user in context (e.g. after logout in another tab)
      // This case might need careful handling depending on your app's behavior
      // For now, let's reset to guest if localStorage is truly empty
      setUserProfile({
        name: "Guest User",
        email: "guest@example.com",
        photoURL: "",
        role: "guest",
      });
    } else if (!storedUser && !userProfile) {
      // If nothing stored and nothing in context, set guest
      setUserProfile({
        name: "Guest User",
        email: "guest@example.com",
        photoURL: "",
        role: "guest",
      });
    }
  }, [userProfile, setUserProfile]); // Added userProfile to dependency array for re-evaluation

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    if (showMobileMenu) setShowMobileMenu(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (showProfile) setShowProfile(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("adminToken"); // Clear admin token too if it was set
    setUserProfile({
      // Explicitly set to guest after logout
      name: "Guest User",
      email: "guest@example.com",
      photoURL: "",
      role: "guest",
    });
    navigate("/login"); // Redirect to generic login page
    setShowProfile(false);
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Hamburger Menu Icon (Mobile Only) */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-[#15534b] font-normal text-4xl sm:text-5xl md:text-6xl leading-tight font-['Moglan'] mx-auto md:mx-0">
          <h1>Eliana</h1>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex flex-grow justify-center gap-8 list-none text-lg font-medium text-gray-700">
          <li>
            <Link
              className="hover:text-indigo-600 transition duration-200"
              to="/home"
            >
              Home
            </Link>
          </li>
          {location.pathname === "/home" && (
            <>
              <li>
                <Link
                  to="#collection"
                  className="hover:text-indigo-600 transition duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("collection");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  to="#blogs"
                  className="hover:text-indigo-600 transition duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("blogs");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="#contact"
                  className="hover:text-indigo-600 transition duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("contact");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Contact
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Icons Section */}
        <div className="flex items-center gap-6 md:gap-8 relative ml-auto md:ml-0">
          <Search className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition-transform cursor-pointer text-gray-700" />
          <Link to="/favorites">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition-transform text-gray-700" />
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition-transform text-gray-700" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
          <div className="relative">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="User"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-green-700 hover:scale-110 transition-transform cursor-pointer"
                onClick={toggleProfile}
              />
            ) : (
              <User
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-green-700 hover:scale-110 transition-transform cursor-pointer p-0.5 text-gray-700"
                onClick={toggleProfile}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-40 flex flex-col items-center justify-center md:hidden">
          <button
            className="absolute top-4 right-4 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={toggleMobileMenu}
            aria-label="Close navigation menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <ul className="flex flex-col gap-6 text-2xl font-semibold text-gray-800">
            <li>
              <Link
                className="hover:text-indigo-600 transition duration-200"
                to="/home"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
            </li>
            {location.pathname === "/home" && (
              <>
                <li>
                  <Link
                    to="#collection"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("collection");
                      if (element)
                        element.scrollIntoView({ behavior: "smooth" });
                      toggleMobileMenu();
                    }}
                  >
                    Collection
                  </Link>
                </li>
                <li>
                  <Link
                    to="#blogs"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("blogs");
                      if (element)
                        element.scrollIntoView({ behavior: "smooth" });
                      toggleMobileMenu();
                    }}
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to="#contact"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById("contact");
                      if (element)
                        element.scrollIntoView({ behavior: "smooth" });
                      toggleMobileMenu();
                    }}
                  >
                    Contact
                  </Link>
                </li>
              </>
            )}
            {/* Conditional rendering for Login/Logout for Mobile */}
            {userProfile && userProfile.role !== "guest" ? (
              <>
                <li>
                  <Link
                    to="/cart"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={toggleMobileMenu}
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={toggleMobileMenu}
                  >
                    Account Settings
                  </Link>
                </li>
                {userProfile.role === "admin" ||
                userProfile.role === "superadmin" ? (
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="text-purple-600 hover:underline transition duration-200"
                      onClick={toggleMobileMenu}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                ) : null}
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMobileMenu();
                    }}
                    className="text-red-600 hover:underline focus:outline-none text-left w-full"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // Show these if userProfile is guest or null
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={toggleMobileMenu}
                  >
                    User Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin-login"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={toggleMobileMenu}
                  >
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-indigo-600 transition duration-200"
                    onClick={toggleMobileMenu}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Profile Sidebar */}
      {showProfile && (
        <div className="fixed top-0 right-0 h-full w-64 bg-[#fef5ee] shadow-lg p-4 z-50 transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-gray-800">My Profile</div>
            <button
              onClick={toggleProfile}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
              aria-label="Close profile sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="text-lg font-semibold text-gray-900 mb-2">
            {userProfile?.name || "Guest User"}
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {userProfile?.email || "guest@example.com"}
          </div>
          {userProfile?.role && userProfile.role !== "guest" && (
            <div className="text-sm text-gray-500 mb-4">
              Role:{" "}
              {userProfile.role.charAt(0).toUpperCase() +
                userProfile.role.slice(1)}
            </div>
          )}

          <div className="border-t border-gray-200 w-full mb-4"></div>

          {userProfile && userProfile.role !== "guest" ? (
            <>
              <div className="flex flex-col">
                <Link
                  to="/cart"
                  className="text-blue-600 hover:underline mb-2"
                  onClick={toggleProfile}
                >
                  My Orders
                </Link>
                <Link
                  to="/settings"
                  className="text-blue-600 hover:underline mb-2"
                  onClick={toggleProfile}
                >
                  Account Settings
                </Link>
                {(userProfile.role === "admin" ||
                  userProfile.role === "superadmin") && (
                  <Link
                    to="/admin/dashboard"
                    className="text-purple-600 hover:underline mb-2"
                    onClick={toggleProfile}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:underline focus:outline-none mt-2 text-left"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigate("/login");
                  toggleProfile();
                }}
                className="text-blue-600 hover:underline text-left"
              >
                User Login
              </button>
              <button
                onClick={() => {
                  navigate("/admin-login");
                  toggleProfile();
                }}
                className="text-blue-600 hover:underline text-left"
              >
                Admin Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  toggleProfile();
                }}
                className="text-blue-600 hover:underline text-left"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
