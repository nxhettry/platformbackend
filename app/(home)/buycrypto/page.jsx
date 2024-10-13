"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";

const Buycrypto = () => {
  const [convertedValue, setConvertedValue] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const router = useRouter();
  const { loggedIn } = useLoggedIn();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }
  }, [session, loggedIn, router, status]);

  if (status === "loading") {
    return (
        <Loading />
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-normal items-center">
      <div className="w-[90%] flex justify-around items-center px-4 py-4 pb-8">
        {/* Left section */}
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-4xl font-bold">Buy Crypto</h1>
          <div className="flex justify-center items-center gap-6">
            <span>Supported</span>
            <div className="flex justify-center items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 4A1.5 1.5 0 0 0 1 5.5V6h18v-.5A1.5 1.5 0 0 0 17.5 4h-15ZM19 8.5H1v6A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-6ZM3 13.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 4A1.5 1.5 0 0 0 1 5.5V6h18v-.5A1.5 1.5 0 0 0 17.5 4h-15ZM19 8.5H1v6A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-6ZM3 13.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 4A1.5 1.5 0 0 0 1 5.5V6h18v-.5A1.5 1.5 0 0 0 17.5 4h-15ZM19 8.5H1v6A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-6ZM3 13.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 4A1.5 1.5 0 0 0 1 5.5V6h18v-.5A1.5 1.5 0 0 0 17.5 4h-15ZM19 8.5H1v6A1.5 1.5 0 0 0 2.5 16h15a1.5 1.5 0 0 0 1.5-1.5v-6ZM3 13.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm4.75-.75a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* Right section */}
        <div className="flex flex-col gap-4 justify-center items-center w-2/5 border border-slate-300 rounded-xl px-3 pb-3 pt-1">
          {/* Buy Sell button */}
          <div className="flex w-full justify-around items-center">
            <Link
              href={"/buycrypto/buy"}
              className={`px-12 text-xl font-bold py-8 w-[45%] }`}
            >
              Buy
            </Link>
            <Link
              href={"/buycrypto/sell"}
              className={`px-12 py-8 w-[45%] text-xl font-bold bg-slate-100`}
            >
              Sell
            </Link>
          </div>

          {/* Assets */}
          <div className="border rounded-2xl flex flex-col justify-start items-start w-full mx-2 px-2 py-3">
            <span className="text-slate-500">I wanna Sell</span>
            <div className="h-16 flex items-center gap-4 justify-start w-4/5 text-xl">
              <input
                type="text"
                className="w-full px-2 text-xl text-slate-400 h-16"
                onChange={(e) => setConvertedValue(e.target.value)}
                value={convertedValue}
              />
              <div className="flex justify-center items-center">
                <Image
                  src={"/usdt.svg"}
                  alt="usdt"
                  height={50}
                  width={50}
                  className="h-6 w-6"
                />
                <p>USDT</p>
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="border rounded-2xl flex flex-col justify-start items-start w-full mx-2 px-2 py-3">
            <span className="text-slate-500">You&apos;ll receive</span>
            <div className="h-16 w-full text-slate-400 text-xl"></div>
          </div>

          {/* Sumbmit */}

          <button className="text-xl font-bold w-full py-3 rounded-xl bg-mainColor text-white">
            Sell USDT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buycrypto;
