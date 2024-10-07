"use client";
import Link from "next/link";
import React, { useState } from "react";

const Sidebar = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const toggleAccountDropdown = () => {
    setIsAccountOpen(!isAccountOpen);
  };

  return (
    <div className="h-full w-1/5 pr-4 hidden sm:flex flex-col justify-start items-end gap-4 pt-3">
      <Link
        href="/dashboard"
        className="h-12 w-full p-3 hover:rounded-xl hover:bg-slate-100 text-lg text-slate-400 hover:text-slate-900"
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/sub/assets"
        className="h-12 w-full p-3 hover:rounded-xl hover:bg-slate-100 text-lg text-slate-400 hover:text-slate-900"
      >
        Assets
      </Link>
      <Link
        href="/dashboard/sub/p2porder"
        className="h-12 w-full p-3 hover:rounded-xl hover:bg-slate-100 text-lg text-slate-400 hover:text-slate-900"
      >
        P2P Orders
      </Link>
      <Link
        href="/rewards"
        className="h-12 w-full p-3 hover:rounded-xl hover:bg-slate-100 text-lg text-slate-400 hover:text-slate-900"
      >
        Reward hub
      </Link>

      {/* Account Button */}
      <button
        onClick={toggleAccountDropdown}
        className="h-12 w-full flex justify-start gap-16 items-center p-3 hover:rounded-xl hover:bg-slate-100 text-lg text-slate-400 hover:text-slate-900"
      >
        Account
        {isAccountOpen ? (
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

      {/* Dropdown Menu for Account */}
      {isAccountOpen && (
        <div className="w-full flex flex-col pl-6 gap-2">
          <Link
            href="/dashboard/sub/account/identification"
            className="h-10 w-full p-2 hover:rounded-xl hover:bg-slate-200 text-lg text-slate-500 hover:text-slate-800"
          >
            Identification
          </Link>
          
          <Link
            href="/usercenter#paymentmethod"
            className="h-10 w-full p-2 hover:rounded-xl hover:bg-slate-200 text-lg text-slate-500 hover:text-slate-800"
          >
            Payment
          </Link>
        </div>
      )}

      <Link
        href="/dashboard/sub/security"
        className="h-12 w-full p-3 hover:rounded-xl hover:bg-slate-100 text-lg text-slate-400 hover:text-slate-900"
      >
        Security Center
      </Link>
    </div>
  );
};

export default Sidebar;
