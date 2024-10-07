"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useLoggedIn } from "../AuthContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Utilitybar = ({ setShowAds, allAds, isBuy, isSell }) => {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const { data: session } = useSession();
  const { loggedIn } = useLoggedIn();
  const [isHover, setIsHover] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); //More Dropdown
  const moreRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); //Currency Dropdown
  const [selectedCurrency, setSelectedCurrency] = useState("NPR");
  const currencies = [
    { code: "NPR", label: "NPR", imgSrc: "/npr.png" },
    { code: "INR", label: "INR", imgSrc: "/inr.png" },
    { code: "AED", label: "AED", imgSrc: "/aed.png" },
    { code: "USD", label: "USD", imgSrc: "/usd.png" },
  ];

  // Filtering assets for larger screens
  const handleFilterAsset = (asset) => () => {
    if (asset === "USDT") {
      setShowAds(allAds.filter((ad) => ad.asset === "USDT"));
    } else if (asset === "BTC") {
      setShowAds(allAds.filter((ad) => ad.asset === "BTC"));
    } else if (asset === "ETH") {
      setShowAds(allAds.filter((ad) => ad.asset === "ETH"));
    }
  };

  //Filtering currency dropdown for smaller screens
  const handleCurrencyFilter = (currency) => () => {
    setSelectedCurrency(currency);
    setIsDropdownOpen(false);

    const filteredAds = allAds.filter((ad) => ad.currency === currency);
    setShowAds(filteredAds);
  };

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

    // Add event listener
    document.addEventListener("mouseover", handleMouseLeave);

    // Cleanup function
    return () => {
      // Remove event listener
      document.removeEventListener("mouseover", handleMouseLeave);
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

  // Check login status
  useEffect(() => {
    if (!session && !loggedIn) {
      router.push("/auth.login");
    }
  }, [session, loggedIn, router]);

  return (
    <div className="flex flex-col sm:flex-row w-full justify-start sm:justify-between items-center">
      <div className="sm:px-0 px-2 pt-2 sm:pt-0 flex gap-16 justify-center items-center">
        {/* Buy and sell button */}
        <div className="h-9 w-[8.5rem] sm:h-12 sm:w-[11rem] p-[0.2rem] flex justify-center items-center gap-1 rounded-lg border border-slate-200 sm:border-slate-300 sm:bg-white">
          <Link
            href="/buy"
            className={`${isBuy && "text-white bg-green-500"}  w-[48%] h-[90%] rounded-md flex justify-center items-center`}
          >
            Buy
          </Link>
          <Link
            href="/sell"
            className={`${isSell && "text-white bg-red-500"}  w-[48%] h-[90%] rounded-md flex justify-center items-center`}
          >
            Sell
          </Link>
        </div>

        {/* More and user center for mobile view */}
        <div className="flex gap-4 justify-center items-center">
          {/* Currency Dropdown */}
          <div className="sm:hidden relative sm:px-2" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Image
                src={currencies.find((c) => c.code === selectedCurrency).imgSrc}
                width={20}
                height={20}
                alt={selectedCurrency}
              />
              <span className="text-md font-bold sm:text-md">{selectedCurrency}</span>
              {isDropdownOpen ? (
                <FaCaretUp />
              ) : (
                <FaCaretDown />
              )}
            </div>

            {isDropdownOpen && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10 w-20 sm:w-40">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className={`flex items-center gap-1 cursor-pointer p-2 ${selectedCurrency === currency.code
                        ? "text-mainColor bg-gray-200" // Highlight selected item
                        : "text-slate-600 hover:bg-gray-100" // Hover effect for non-selected items
                      }`}
                    onClick={handleCurrencyFilter(currency.code)}
                  >
                    <Image
                      src={currency.imgSrc}
                      width={20}
                      height={20}
                      alt={currency.label}
                    />
                    <span>{currency.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* More icon for mobile */}
          <div
            className="sm:hidden h-8 relative"
            ref={moreRef}
            onMouseEnter={handleMouseEnterMore}
            onMouseLeave={handleMouseLeaveMore}
          >
            {/* The more button */}
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  className="justify-center items-center h-8 text-slate-500 flex hover:text-mainColor"
                  onClick={handleDropdownClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-slate-900 size-4 sm:size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="text-sm text-black font-bold sm:text-md">More</span>
                </button>
              </DrawerTrigger>
              <DrawerContent
                style={{ width: "98%", height: "40%", margin: "0 auto" }}
              >
                <div className="mx-auto w-full max-w-sm">
                  {/* Main body part */}
                  <ul className="py-1 pt-8 h-full flex flex-col gap-3 justify-around items-center">
                    <li>
                      <Link
                        href={"/usercenter"}
                        className="sm:hidden h-8 justify-center items-center text-slate-500 flex gap-2 hover:text-mainColor"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="text-slate-900 size-4 sm:size-5"
                        >
                          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                        </svg>

                        <span className="text-md font-bold sm:text-md">
                          P2P User Center
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-md font-bold text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleDropdownItemClick}
                      >
                        Payment Methods
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/usercenter/ad/postad"
                        className="block px-4 py-2 text-md font-bold text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleDropdownItemClick}
                      >
                        Post new Ad
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/usercenter/ad/myad"
                        className="block px-4 py-2 text-md font-bold text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleDropdownItemClick}
                      >
                        My Ads
                      </Link>
                    </li>
                  </ul>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Assets button group - visible on larger screens */}
        <div className="hidden sm:flex gap-4 sm:gap-6 text-sm sm:text-lg font-bold">
          <button onClick={handleFilterAsset("USDT")}>USDT</button>
          <button onClick={handleFilterAsset("BTC")}>BTC</button>
          <button onClick={handleFilterAsset("ETH")}>ETH</button>
        </div>
      </div>

      {/* 4 icons for larger screens */}
      <div className="hidden sm:flex gap-3 sm:gap-8 items-center pt-4 sm:pt-0 sm:h-16">
        {/* 1st icon */}
        <button
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
          className="hidden sm:flex justify-center items-center text-slate-500 hover:text-mainColor"
        >
          <a className="flex text-xs sm:text-md items-center">
            <svg
              className="bn-svg h-5 w-5 sm:h-6 text-slate-900 sm:w-h-6"
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
            <span className="sm:ml-2">P2P Help Center</span>
            {isHover ? (
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
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </a>
        </button>

        {/* 2nd icon */}
        <Link
          href="/usercenter/ad/orders"
          className="hidden sm:flex justify-center items-center text-slate-500 gap-2 hover:text-mainColor"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="text-slate-900 size-4 sm:size-5"
          >
            <path
              fillRule="evenodd"
              d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="text-md font-bold sm:text-md">Orders</span>
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
            className="text-slate-900 size-4 sm:size-5"
          >
            <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
          </svg>

          <span className="text-md font-bold sm:text-md">P2P User Center</span>
        </Link>

        {/* 4th icon */}
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
              className="text-slate-900 size-4 sm:size-5"
            >
              <path
                fillRule="evenodd"
                d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>

            <span className="text-md font-bold sm:text-md">More</span>
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
              className="absolute top-full right-2 sm:left-0 mt-2 w-28 sm:w-44 z-10 bg-white border border-gray-300 rounded shadow-lg"
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
                <li>
                  <Link
                    href="/usercenter/helpcenter"
                    className="block sm:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleDropdownItemClick}
                  >
                    Help Center
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
