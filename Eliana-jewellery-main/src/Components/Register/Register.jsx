// Components/Register/Register.jsx (UI Updated)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage(
        "Registration successful! Please log in with your new account."
      );
      console.log("User Registration successful:", data);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration Error:", err.message);
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
          Register
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-moglan mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base" /* Updated input style */
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-moglan mb-2" /* Updated label font */
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base" /* Updated input style */
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-moglan mb-2" /* Updated label font */
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base" /* Updated input style */
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-moglan mb-2" /* Updated label font */
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-[#13524a] focus:border-[#13524a] text-sm md:text-base" /* Updated input style */
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13524a] hover:bg-[#18544d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13524a]" /* Updated button style */
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#13524a] hover:text-[#18544d]">
            {" "}
            {/* Updated link color */}
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
