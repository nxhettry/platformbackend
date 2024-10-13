"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HiSpeakerphone } from "react-icons/hi";

const Bottomnav = () => {
  const [home, setHome] = useState(false);
  const [p2p, setP2p] = useState(false);
  const [orders, setOrders] = useState(false);
  const [ads, setAds] = useState(false);
  const [wallet, setWallet] = useState(false);

  return (
    <div className="h-12 px-4 bg-white w-full fixed bottom-0 left-0 flex sm:hidden justify-around items-center">
      {/* Home */}
      <Link
        href="/"
        onClick={() => {
          setHome(true);
          setP2p(false);
          setOrders(false);
          setAds(false);
          setWallet(false);
        }}
        className={`${
          home && "text-mainColor"
        } flex flex-col py-2 justify-center items-center`}
      >
        <div className="flex flex-col justify-center items-center w-10 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7"
          >
            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
        </div>
        <p className="font-bold text-sm text-center">Home</p>
      </Link>

      {/* P2P */}
      <Link
        onClick={() => {
          setHome(false);
          setP2p(true);
          setOrders(false);
          setAds(false);
          setWallet(false);
        }}
        href="/buy"
        className={`${
          p2p && "text-mainColor"
        } flex flex-col py-2 justify-center items-center`}
      >
        <div className="flex flex-col justify-center items-center w-10 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7"
          >
            <path
              fillRule="evenodd"
              d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
              clipRule="evenodd"
            />
            <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
          </svg>
        </div>
        <p className="font-bold text-sm text-center">P2P</p>
      </Link>

      {/* Orders */}
      <Link
        onClick={() => {
          setHome(false);
          setP2p(false);
          setOrders(true);
          setAds(false);
          setWallet(false);
        }}
        href="/usercenter/ad/orders"
        className={`${
          orders && "text-mainColor"
        } flex flex-col py-2 justify-center items-center`}
      >
        <div className="flex flex-col justify-center items-center w-12 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7"
          >
            <path
              fillRule="evenodd"
              d="M3.75 3.375c0-1.036.84-1.875 1.875-1.875H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375Zm10.5 1.875a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25ZM12 10.5a.75.75 0 0 1 .75.75v.028a9.727 9.727 0 0 1 1.687.28.75.75 0 1 1-.374 1.452 8.207 8.207 0 0 0-1.313-.226v1.68l.969.332c.67.23 1.281.85 1.281 1.704 0 .158-.007.314-.02.468-.083.931-.83 1.582-1.669 1.695a9.776 9.776 0 0 1-.561.059v.028a.75.75 0 0 1-1.5 0v-.029a9.724 9.724 0 0 1-1.687-.278.75.75 0 0 1 .374-1.453c.425.11.864.186 1.313.226v-1.68l-.968-.332C9.612 14.974 9 14.354 9 13.5c0-.158.007-.314.02-.468.083-.931.831-1.582 1.67-1.694.185-.025.372-.045.56-.06v-.028a.75.75 0 0 1 .75-.75Zm-1.11 2.324c.119-.016.239-.03.36-.04v1.166l-.482-.165c-.208-.072-.268-.211-.268-.285 0-.113.005-.225.015-.336.013-.146.14-.309.374-.34Zm1.86 4.392V16.05l.482.165c.208.072.268.211.268.285 0 .113-.005.225-.015.336-.012.146-.14.309-.374.34-.12.016-.24.03-.361.04Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="font-bold text-sm text-center">Orders</p>
      </Link>

      {/* Ads */}
      <Link
        onClick={() => {
          setHome(false);
          setP2p(false);
          setOrders(false);
          setAds(true);
          setWallet(false);
        }}
        href="/usercenter/ad/myad"
        className={`${
          ads && "text-mainColor"
        } flex flex-col py-2 justify-center items-center`}
      >
        <div className="flex flex-col justify-center items-center w-10 rounded-full">
          <HiSpeakerphone className="text-3xl" />
        </div>
        <p className="font-bold text-sm text-center">Ads</p>
      </Link>

      {/* Wallet */}
      <Link
        href="/dashboard/"
        onClick={() => {
          setHome(false);
          setP2p(false);
          setOrders(false);
          setAds(false);
          setWallet(true);
        }}
        className={`${
          wallet && "text-mainColor"
        } flex flex-col py-2 justify-center items-center`}
      >
        <div className="flex flex-col justify-center items-center w-10 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-7"
          >
            <path d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
          </svg>
        </div>
        <p className="font-bold text-sm text-center">Wallet</p>
      </Link>
    </div>
  );
};

export default Bottomnav;
