"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

const UtilitybarDash = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const moreRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      // Check if the event is related to elements outside the ref elements
      if (
        moreRef.current &&
        dropdownRef.current &&
        !moreRef.current.contains(event.relatedTarget) &&
        !dropdownRef.current.contains(event.relatedTarget)
      ) {
        timeoutRef.current = setTimeout(() => setShowDropdown(false), 2000);
      }
    };

    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mouseout', handleMouseLeave);
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
    <div className="hidden sm:flex gap-4 items-center h-full ">
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

        <span>Orders</span>
      </Link>

      {/* 3rd icon */}
      <Link
        href={"/usercenter"}
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

        <span>P2P User Center</span>
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

          <span>More</span>
          {showDropdown ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
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
              className="size-5"
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
            className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg"
            ref={dropdownRef}
          >
            <ul className="py-1">
              <li>
                <Link
                  href="#"
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
  );
};

export default UtilitybarDash;
