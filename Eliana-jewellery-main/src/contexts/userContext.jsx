// contexts/userContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserProfileContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  // Initialize user profile from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserProfile(parsedUser);
      } catch (error) {
        console.error("Failed to parse userProfile from localStorage:", error);
        localStorage.removeItem("userProfile"); // Clear corrupted data
      }
    }
  }, []); // Run only once on mount

  // You might want to update localStorage whenever userProfile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    } else {
      localStorage.removeItem("userProfile");
    }
  }, [userProfile]);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
