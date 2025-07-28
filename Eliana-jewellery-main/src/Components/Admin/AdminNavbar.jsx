import React, { useState } from "react"; // Added useState for mobile menu state
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile menu

  const handleAdminLogout = () => {
    // In a real application, you'd likely clear admin-specific tokens
    // or call a logout API endpoint for admins.
    localStorage.removeItem("adminToken"); // Example: if you store admin token separately
    localStorage.removeItem("userProfile"); // Clear userProfile too if it might contain admin data
    navigate("/admin-login"); // Redirect to admin login page
    setShowMobileMenu(false); // Close mobile menu on logout
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="bg-[#fef5ee] shadow-md p-4 sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Hamburger Menu Icon (Mobile Only) */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          onClick={toggleMobileMenu}
          aria-label="Toggle admin navigation menu"
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

        {/* Admin Logo/Brand */}
        <div className="text-[#15534b] font-normal text-3xl sm:text-4xl md:text-5xl leading-tight font-['Moglan'] mx-auto md:mx-0">
          <h1>Admin Panel</h1>
        </div>

        {/* Desktop Admin Navigation Links */}
        <ul className="hidden md:flex flex-grow justify-center gap-6 md:gap-8 list-none text-lg font-medium text-gray-700">
          <li>
            <Link
              className="hover:text-indigo-600 transition duration-200"
              to="/admin/dashboard"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-indigo-600 transition duration-200"
              to="/admin/collection"
            >
              Manage Collection
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-indigo-600 transition duration-200"
              to="/admin/blog"
            >
              Manage Blog
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-indigo-600 transition duration-200"
              to="/admin/products"
            >
              Manage Product
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-indigo-600 transition duration-200"
              to="/admin/contact-messages"
            >
              Manage Contact
            </Link>
          </li>
        </ul>

        {/* Admin Actions (Logout for Desktop) */}
        {/* Hidden on small screens as it will be part of the mobile menu */}
        <div className="hidden md:flex items-center ml-auto">
          <button
            onClick={handleAdminLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-40 flex flex-col items-center justify-center md:hidden">
          <button
            className="absolute top-4 right-4 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={toggleMobileMenu}
            aria-label="Close admin navigation menu"
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
                to="/admin/dashboard"
                onClick={toggleMobileMenu} // Close menu on click
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-indigo-600 transition duration-200"
                to="/admin/collection"
                onClick={toggleMobileMenu} // Close menu on click
              >
                Manage Collection
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-indigo-600 transition duration-200"
                to="/admin/blog"
                onClick={toggleMobileMenu} // Close menu on click
              >
                Manage Blog
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-indigo-600 transition duration-200"
                to="/admin/orders"
                onClick={toggleMobileMenu} // Close menu on click
              >
                Manage Orders
              </Link>
            </li>
            {/* Logout button in mobile menu */}
            <li>
              <button
                onClick={() => {
                  handleAdminLogout();
                  toggleMobileMenu(); // Close menu after logout
                }}
                className="text-red-600 hover:underline focus:outline-none text-left w-full"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
