"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaCaretDown } from "react-icons/fa";

const Transactionamount = ({
  selectedCurrency,
  border,
  setSelectedCurrency,
  allAds,
  setShowAds,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [filterAmount, setFilterAmount] = useState(0);

  const currencies = [
    { code: "NPR", label: "NPR", imgSrc: "/npr.png" },
    { code: "INR", label: "INR", imgSrc: "/inr.png" },
    { code: "AED", label: "AED", imgSrc: "/aed.png" },
    { code: "USD", label: "USD", imgSrc: "/usd.png" },
  ];

  // Function to handle currency filter for larger display
  const handleCurrencyFilter = (currency) => () => {
    setSelectedCurrency(currency);
    setIsDropdownOpen((prev) => !prev);

    //Filter currency based on user's selection
    const filteredAds = allAds.filter((ad) => ad.currency === currency);
    setShowAds(filteredAds);
  };

  //Function to handle amount filter for mobile screen
  const handleFilterAmount = () => {
    setIsDropdownOpen(false);
    //Filter amount based on user's selection

    const filteredAds = allAds.filter((ad) => {
      return ad.orderLimitfrom <= filterAmount && ad.orderLimitTo >= filterAmount;
    });
    setShowAds(filteredAds);

  };

  //Function to handle amount filter for larger display with live typing
  useEffect(() => {
    if (filterAmount === 0 || filterAmount === "") {
      setShowAds(allAds);
      return;
    };

    //Filter amount based on user's selection
    const filteredAds = allAds.filter((ad) => {
      return ad.orderLimitfrom <= filterAmount && ad.orderLimitTo >= filterAmount;
    });
    setShowAds(filteredAds);
  }, [filterAmount, allAds, setShowAds]);

  // Function to handle asset selection for mobile screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* This is for smaller screen */}
      <div className="sm:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button
              className="w-32 outline-none flex justify-center items-center sm:w-52 rounded-lg p-1 h-8 sm:h-12 text-xs sm:text-base"
            >
              <span className="font-bold">Quantity</span>
              <FaCaretDown />
            </button>
          </DrawerTrigger>
          <DrawerContent
            style={{ height: "45vh", width: "98vw", margin: "0 auto" }}
          >
            <div className="mx-auto w-full sm:w-2/5 flex flex-col justify-center gap-4 items-center">
              <DrawerHeader>
                <DrawerTitle>Amount</DrawerTitle>
                <DrawerDescription>
                  Enter the amount you want to filter
                </DrawerDescription>
              </DrawerHeader>
              <div className="sm:px-32 px-4 w-full flex flex-col justify-center items-start gap-3">
                <input
                  type="number"
                  placeholder="Eg: 1000"
                  onChange={(e) => setFilterAmount(e.target.value)}
                  value={filterAmount}
                  name="transactionAmount"
                  className="w-full h-12 p-2 border text-lg rounded-lg bg-transparent"
                />
                <div className="flex text-sm text-mainColor items-center gap-6">
                  <button className="border border-slate-50 rounded-sm bg-gray-50 w-10" onClick={() => setFilterAmount(1000)}>1k</button>
                  <button className="border border-slate-50 rounded-sm bg-gray-50 w-10" onClick={() => setFilterAmount(5000)}>5k</button>
                  <button className="border border-slate-50 rounded-sm bg-gray-50 w-10" onClick={() => setFilterAmount(10000)}>10k</button>
                  <button className="border border-slate-50 rounded-sm bg-gray-50 w-10" onClick={() => setFilterAmount(50000)}>50k</button>
                </div>
              </div>
              <DrawerFooter>

                <DrawerClose asChild>
                  <div className="flex justify-center items-center gap-6 w-full">
                    <button onClick={handleFilterAmount} className="h-12 w-40 bg-mainColor px-2 py-1 rounded-xl">
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setFilterAmount()
                        window.location.reload();
                      }}
                      className="text-red-500 hover:bg-gray-100 rounded-lg h-12 w-28"
                    >
                      Reset
                    </button>
                  </div>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* This is for bigger screens */}
      <div
        className={`h-8 sm:h-full ${border && " border hover:bg-slate-100"
          } sm:bg-white rounded-lg hidden sm:flex items-center`}
      >
        <input
          type="text"
          placeholder="Amount"
          name="transactionAmount"
          value={filterAmount}
          onChange={(e) => setFilterAmount(e.target.value)}
          className="h-full w-[4.5rem] sm:w-64 p-1 bg-transparent"
        />
        <span className="text-slate-300 text-md sm:text-2xl font-thin px-2">
          |
        </span>

        {/* Currency Dropdown */}
        <div className="relative sm:px-2" ref={dropdownRef}>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <Image
              src={currencies.find((c) => c.code === selectedCurrency).imgSrc}
              width={20}
              height={20}
              alt={selectedCurrency}
            />
            <span className="text-xs sm:text-md">{selectedCurrency}</span>
            {isDropdownOpen ? (
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
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
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
      </div>
    </>
  );
};

export default Transactionamount;
