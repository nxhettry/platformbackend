"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

// Step 2: Create a context
const LoggedInContext = createContext();

// Step 3: Create a provider component
export const LoggedInProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  // Function to handle login state persistence
  useEffect(() => {
    // Load state from local storage on initial render
    const storedLoggedIn = localStorage.getItem("loggedIn");
    const storedEmail = localStorage.getItem("email");

    if (storedLoggedIn === "true") {
      setLoggedIn(true);
      setEmail(storedEmail || ""); // Set email if stored, or default to an empty string
    }
  }, []);

  // Function to handle state changes
  useEffect(() => {
    // Update local storage whenever state changes
    localStorage.setItem("loggedIn", loggedIn.toString());
    localStorage.setItem("email", email);
  }, [loggedIn, email]);

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn, email, setEmail }}>
      {children}
    </LoggedInContext.Provider>
  );
};

// Step 4: Create a custom hook to use the context
export const useLoggedIn = () => {
  return useContext(LoggedInContext);
};
