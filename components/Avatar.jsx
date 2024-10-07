"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Userfeatures from "./p2p/Userfeatures";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "./AuthContext";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";

const DropdownMenu = ({menuItems, uid}) => {
  const { loggedIn, email, setLoggedIn } = useLoggedIn();
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => {
    setTimeout(() => setIsOpen(false), 3000);
  };

  const handleLogout = async () => {
    await signOut();
    setLoggedIn(false);
    router.push("/auth/login");
  };

  const getAvatar = () => {
    const userEmail = session?.user.email || (loggedIn ? email : "");
    if (session?.user.image) {
      return (
        <Image
          alt="avatar"
          src={session.user.image}
          width={32}
          height={32}
          className="h-8 w-8 text-slate-400 rounded-full"
        />
      );
    } else if (userEmail) {
      const firstLetter = userEmail.charAt(0).toUpperCase();
      return (
        <Avatar className="flex items-center justify-center h-8 w-8 bg-gray-500 text-white rounded-full">
          {firstLetter}
        </Avatar>
      );
    }
    return <Avatar className="h-8 w-8 bg-gray-500 text-white" />;
  };

  return (
    <div className="relative">
      <Link
        href="/dashboard"
        className="w-8 h-8 rounded-full dark:bg-gray-600"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-7 h-9 hover:text-mainColor hover:scale-110 transition ease-in-out duration-300 w-9"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>

      {isOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="absolute top-6 right-1 mt-2 w-56 shadow-2xl bg-white rounded-lg border border-gray-200 z-10"
        >
          <ul className="space-y-2 p-2">
            <div className="flex flex-col pb-3">
              <div className="flex flex-col justify-center items-center gap-2">
                {getAvatar()}
                <div className="flex flex-col gap-1 justify-center items-start">
                  <h2 className="text-sm font-bold">
                    {session?.user.email || (loggedIn ? email : "")}
                  </h2>
                  <Userfeatures text="KYC" color="green-500" />
                </div>
              </div>
              <div className="flex text-sm text-slate-400 items-center justify-start gap-2">
                <p>UID :</p>
                <span className="cursor-pointer text-xs">{uid}</span>
              </div>
            </div>
            {menuItems.map((item, index) => (
              <Link key={index} href={`${item.link}`}>
                <li
                  key={item.name}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
                    fill="currentColor"
                    viewBox={item.iconViewBox}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={item.iconPath} />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    {item.name}
                  </span>
                </li>
              </Link>
            ))}
            <button
              className="w-full text-center p-2 bg-mainColor hover:bg-red-500 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
