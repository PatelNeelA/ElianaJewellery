// Components/AdminLogin/AdminLogin.jsx (UI Modified)
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfileContext } from "../../contexts/userContext"; // Adjust path if needed

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserProfile } = useContext(UserProfileContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed");
      }

      setUserProfile(data);
      localStorage.setItem("userProfile", JSON.stringify(data));
      console.log("Admin Login successful:", data);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin Login Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-[#f3ece6] p-4">
      {" "}
      {/* Updated background color */}
      <div className="bg-[#fef5ee] border border-[#13524a] rounded-lg p-8 shadow-lg w-full max-w-md">
        {" "}
        {/* Updated form card style */}
        <h2 className="text-2xl font-moglan text-[#13524a] text-center mb-6">
          {" "}
          {/* Updated heading style */}
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="adminEmail"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="adminEmail"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base" /* Updated input style */
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="adminPassword"
              className="block text-gray-700 text-sm font-moglan mb-2" /* Updated label font */
            >
              Password:
            </label>
            <input
              type="password"
              id="adminPassword"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base" /* Updated input style */
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13524a] hover:bg-[#18544d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13524a]" /* Updated button style */
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
