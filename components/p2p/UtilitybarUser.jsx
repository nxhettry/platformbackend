"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

const Utilitybar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const moreRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Function to handle mouse leave event
    const handleMouseLeave = (event) => {
      if (
        moreRef.current &&
        dropdownRef.current &&
        !moreRef.current.contains(event.relatedTarget) &&
        !dropdownRef.current.contains(event.relatedTarget)
      ) {
        // Start a timeout to hide dropdown after 2 seconds
        timeoutRef.current = setTimeout(() => setShowDropdown(false), 2000);
      }
    };

    // Add event listeners to the document
    document.addEventListener('mouseover', handleMouseLeave);

    // Cleanup function
    return () => {
      // Remove event listeners
      document.removeEventListener('mouseover', handleMouseLeave);
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDropdownClick = () => {
    setShowDropdown(true);
  };

  const handleDropdownItemClick = () => {
    setShowDropdown(false);
  };

  const handleMouseEnterMore = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeaveMore = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(false), 2000);
  };

  return (
    <div className="flex w-full sm:pr-8 justify-start sm:justify-end items-center">
      <div className="flex gap-8 items-center h-16">
        {/* 1st icon */}
        <button className="justify-center items-center text-slate-500 hover:text-mainColor">
          <a className="flex items-center">
            <svg
              className="bn-svg h-6 text-slate-900 w-6"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.5 3H19v18H6.5v-2.5H4V16h2.5v-2.75H4v-2.5h2.5V8H4V5.5h2.5V3zm6.25 4.75c-.69 0-1.25.56-1.25 1.25v.5H9V9a3.75 3.75 0 116.402 2.652L14 13.053V14.5h-2.5v-2.482l2.134-2.134a1.25 1.25 0 00-.884-2.134zM11.5 19v-2.5H14V19h-2.5z"
                fill="currentColor"
              ></path>
            </svg>
            <span className="sm:ml-2 sm:text-md text-xs">P2P Help Center</span>
          </a>
        </button>

        {/* 2nd icon */}
        <Link
          href="/usercenter/ad/orders"
          className="justify-center items-center text-slate-500 flex gap-2 hover:text-mainColor"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-slate-900 size-5"
          >
            <path
              fillRule="evenodd"
              d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="text-xs sm:text-md">Orders</span>
        </Link>

        {/* 3rd icon */}
        <Link
          href={"/buy"}
          className="justify-center items-center text-slate-500 flex gap-2 hover:text-mainColor"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-slate-900 size-5"
          >
            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
          </svg>

          <span className="text-xs sm:text-md">P2P</span>
        </Link>

        {/* 4th icon with dropdown */}
        <div
          className="relative"
          ref={moreRef}
          onMouseEnter={handleMouseEnterMore}
          onMouseLeave={handleMouseLeaveMore}
        >
          <button
            className="justify-center items-center text-slate-500 flex gap-2 hover:text-mainColor"
            onClick={handleDropdownClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="text-slate-900 size-5"
            >
              <path
                fillRule="evenodd"
                d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>

            <span className="text-xs sm:text-md">More</span>
            {showDropdown ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 sm:size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 sm:size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.44l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {showDropdown && (
            <div
              className="absolute top-full left-0 mt-2 w-24 sm:w-48 bg-white border border-gray-300 rounded shadow-lg"
              ref={dropdownRef}
            >
              <ul className="py-1">
                <li>
                  <Link
                    href="/usercenter"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleDropdownItemClick}
                  >
                    Payment Methods
                  </Link>
                </li>
                <li>
                  <Link
                    href="/usercenter/ad/postad"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleDropdownItemClick}
                  >
                    Post new Ad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/usercenter/ad/myad"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleDropdownItemClick}
                  >
                    My Ads
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Utilitybar;
