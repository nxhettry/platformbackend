"use client";
import React from "react";
import Merchantdatabuy from "./Merchantdatabuy";
import { useDarkMode } from "@/components/DarkmodeContext";

const P2ptablebuy = ({ fromHome, showAds }) => {
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
      <div className="pb-16 sm:hidden w-full px-2">
        <Merchantdatabuy showAds={showAds} fromHome={fromHome} />
      </div>

      {/* This is for larger screens */}
      <div
        className={`${darkMode ? "bg-slate-700 text-white" : "bg-white text-black"
          } ${fromHome ? "w-4/5 mx-auto" : "hidden sm:block w-full sm:h-full"} hidden sm:block`}
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
          <Merchantdatabuy showAds={showAds} fromHome={fromHome} />
        </div>
      </div>
    </>
  );
};

export default P2ptablebuy;
