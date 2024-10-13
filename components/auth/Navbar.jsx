"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLoggedIn } from "../AuthContext";
import { useSession } from "next-auth/react";
import MenuImage from "../../public/menu.svg";

const Authnav = () => {
  const { loggedIn, setLoggedIn, email } = useLoggedIn();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="h-12 md:h-16 w-screen flex justify-between items-center px-5 md:px-12 py-8 border-b border-slate-300">
      <div className="hidden md:flex h-12 justify-center items-center gap-5 md:gap-20">
        <Link
          href={"/"}
          className="font-bold text-mainColor flex justify-center items-center hover:scale-110 transition ease-in-out duration-300"
        >
          <Image
            src="/mainLogo.png"
            alt="logo"
            width={400}
            height={400}
            className="h-16 object-cover w-28 md:w-44"
          />
        </Link>
        <div className="flex gap-5 md:gap-10 text-sm font-semibold">
          <Link
            href="/"
            className="hover:text-hoverNav hover:scale-110 transition ease-in-out duration-300"
          >
            Rewards
          </Link>
          <Link
            href="/"
            className="hover:text-hoverNav hover:scale-110 transition ease-in-out duration-300"
          >
            Buy Crypto
          </Link>
          <Link
            href="/buy"
            className="hover:text-hoverNav hover:scale-110 transition ease-in-out duration-300"
          >
            P2P
          </Link>
          <Link
            href="/"
            className="hover:text-hoverNav hover:scale-110 transition ease-in-out duration-300"
          >
            Learn
          </Link>
        </div>
      </div>

      <div className="flex gap-3 md:gap-8">
        <button className="hover:scale-110 transition ease-in-out duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="hover:text-mainColor size-6 md:size-8"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex justify-center items-center gap-2 md:gap-4">
          <Link
            href="/auth/login"
            className="w-12 md:w-16 text-sm md:text-base h-8 md:h-10 flex justify-center items-center rounded-lg bg-slate-600 text-white"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="w-16 md:w-16 text-sm md:text-base h-8 md:h-10 bg-mainColor flex justify-center items-center rounded-lg"
          >
            Sign Up
          </Link>
        </div>
        <div className="flex gap-3 justify-center items-center">
          <button className="hover:scale-110 transition ease-in-out duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="hover:text-mainColor size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="hover:scale-110 transition ease-in-out duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="hover:text-mainColor size-6"
            >
              <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
              <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
            </svg>
          </button>
          <button className="hover:scale-110 transition ease-in-out duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="hover:text-mainColor size-6"
            >
              <path d="M16.555 5.412a8.028 8.028 0 0 0-3.503-2.81 14.899 14.899 0 0 1 1.663 4.472 8.547 8.547 0 0 0 1.84-1.662ZM13.326 7.825a13.43 13.43 0 0 0-2.413-5.773 8.087 8.087 0 0 0-1.826 0 13.43 13.43 0 0 0-2.413 5.773A8.473 8.473 0 0 0 10 8.5c1.18 0 2.304-.24 3.326-.675ZM6.514 9.376A9.98 9.98 0 0 0 10 10c1.226 0 2.4-.22 3.486-.624a13.54 13.54 0 0 1-.351 3.759A13.54 13.54 0 0 1 10 13.5c-1.079 0-2.128-.127-3.134-.366a13.538 13.538 0 0 1-.352-3.758ZM5.285 7.074a14.9 14.9 0 0 1 1.663-4.471 8.028 8.028 0 0 0-3.503 2.81c.529.638 1.149 1.199 1.84 1.66ZM17.334 6.798a7.973 7.973 0 0 1 .614 4.115 13.47 13.47 0 0 1-3.178 1.72 15.093 15.093 0 0 0 .174-3.939 10.043 10.043 0 0 0 2.39-1.896ZM2.666 6.798a10.042 10.042 0 0 0 2.39 1.896 15.196 15.196 0 0 0 .174 3.94 13.472 13.472 0 0 1-3.178-1.72 7.973 7.973 0 0 1 .615-4.115ZM10 15c.898 0 1.778-.079 2.633-.23a13.473 13.473 0 0 1-1.72 3.178 8.099 8.099 0 0 1-1.826 0 13.47 13.47 0 0 1-1.72-3.178c.855.151 1.735.23 2.633.23ZM14.357 14.357a14.912 14.912 0 0 1-1.305 3.04 8.027 8.027 0 0 0 4.345-4.345c-.953.542-1.971.981-3.04 1.305ZM6.948 17.397a8.027 8.027 0 0 1-4.345-4.345c.953.542 1.971.981 3.04 1.305a14.912 14.912 0 0 0 1.305 3.04Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="md:hidden z-10">
        <button onClick={toggleDropdown} className="focus:outline-none">
          <Image src={MenuImage} alt="Menu" width={24} height={24} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white border rounded-lg shadow-lg">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={toggleDropdown}
            >
              Rewards
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={toggleDropdown}
            >
              Buy Crypto
            </Link>
            <Link
              href="/buy"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={toggleDropdown}
            >
              P2P
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={toggleDropdown}
            >
              Learn
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authnav;
