"use client";
import React, { useState } from "react";
import Paymentmethods from "./p2p/p2pbar/Paymentmethods";
import Transactionamount from "./p2p/p2pbar/Transactionamount";
import Image from "next/image";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Settingsbar = ({
  selectedCurrency,
  setSelectedCurrency,
  paymentOptions,
  allAds,
  setShowAds
}) => {
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("USDT");

  // Function to handle asset selection for mobile screen
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setShowAssetDropdown(false);
    
    // Filter ads based on selected asset
    const filteredAds = allAds.filter((ad) => ad.asset === asset);
    setShowAds(filteredAds);
  };

  const toggleAssetDropdown = () => {
    setShowAssetDropdown((prev) => !prev);
  };


  return (
    <div className="border-b pb-2 sm:pb-0 sm:border-none w-full h-12 justify-start sm:justify-between gap-1 sm:gap-8 px-2 items-center flex">
      <div className="h-full sm:gap-8 flex justify-start items-center">
        {/* Dropdown for assets - visible on smaller screens */}
        <div className="rounded-md h-8 flex justify-center items-center w-24 hover:bg-slate-100 relative sm:hidden">
          <button
            onClick={toggleAssetDropdown}
            className="text-xs font-bold flex items-center"
          >
            <div className="flex justify-center gap-1 items-center">
              <Image
                src={`/${selectedAsset}.svg`}
                alt="USDT"
                width={selectedAsset === "ETH" ? 12 : 20}
                height={selectedAsset === "ETH" ? 12 : 20}
              />
              <span>{selectedAsset || "Assets"}</span>
            </div>
            {/* Display the selected asset or default text */}
            {showAssetDropdown ? <FaCaretUp /> : <FaCaretDown />}
          </button>
          {showAssetDropdown && (
            <div className="absolute right-4 top-6 mt-2 w-20 z-10 bg-white border border-gray-300 rounded shadow-lg">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => handleAssetSelect("USDT")}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-center items-center gap-2 w-full text-left"
                  >
                    <Image src="/usdt.svg" alt="USDT" width={20} height={20} />
                    <span>USDT</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAssetSelect("BTC")}
                    className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-center items-center gap-2 w-full text-left"
                  >
                    <Image src="/btc.svg" alt="USDT" width={20} height={20} />
                    <span>BTC</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleAssetSelect("ETH")}
                    className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-center items-center gap-2 w-full text-left"
                  >
                    <Image src="/eth.svg" alt="USDT" width={12} height={12} />
                    <span>ETH</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <Transactionamount
          allAds={allAds}
          setShowAds={setShowAds}
          border={true}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />

        <Paymentmethods
          allAds={allAds}
          setShowAds={setShowAds}
          paymentOptions={paymentOptions}
          selectedCurrency={selectedCurrency}
        />
      </div>

      {/* Only for large screens */}
      <div className="h-full w-full flex items-center justify-start">
        {/* Filter button */}
        <div className="h-full hidden sm:flex justify-center items-center w-12 rounded-lg hover:bg-slate-100 border bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Refresh frequency only for large screen */}
        <div className="h-8 sm:h-full gap-2 hidden sm:flex justify-center items-center px-2 pl-1 pr-3 rounded-lg hover:bg-slate-100 border bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4 sm:size-5"
          >
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="text-xs sm:text-lg">Refresh</span>
        </div>
      </div>
    </div>
  );
};

export default Settingsbar;
