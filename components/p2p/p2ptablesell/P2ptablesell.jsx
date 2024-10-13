import React from "react";
import Merchantdatasell from "./Merchantdatasell";
import { useDarkMode } from "@/components/DarkmodeContext";

const P2ptableSell = ({ showAds }) => {
  const { darkMode } = useDarkMode();
  const tableHead = [
    "Advertisers",
    "Price",
    "Available/Order Limit",
    "Payment Methods",
    "Trade",
  ];

  return (
    <>
      {/* This is for smaller screens size */}
      <div className="sm:hidden w-full px-2">
        <Merchantdatasell showAds={showAds} />
      </div>

      {/* This is for larger screens */}
      <div
        className={`${darkMode ? "bg-slate-700 text-white" : "bg-white text-black"
          } hidden sm:block`}
      >
        {/* Table Head */}
        <div className="flex">
          {tableHead.map((head, index) => (
            <div
              key={index}
              className="sm:px-4 py-2 text-start flex-1 font-semibold"
            >
              {head}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="text-slate-900 w-full">
          {/* Spacer Row */}
          <div className="h-4"></div>

          {/* Merchant Data Buy Component */}
          <Merchantdatasell showAds={showAds} />
        </div>
      </div>
    </>
  );
};

export default P2ptableSell;
