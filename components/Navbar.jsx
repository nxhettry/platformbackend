"use client";
import Link from "next/link";
import { useDarkMode } from "./DarkmodeContext";
import DropdownMenu from "./Avatar";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "./AuthContext";
import React, { useState, useEffect, useRef } from "react";
import Userfeatures from "./p2p/Userfeatures";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const { loggedIn, setLoggedIn, email } = useLoggedIn();
  const { data: session } = useSession();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [uid, setUid] = useState("************");
  const avatarMenuRef = useRef(null);

  //to get the uid of the user
  useEffect(() => {
    let userEmail;

    if (session?.user.email) {
      userEmail = session?.user.email;
    }

    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) {
      return;
    }

    const fetchUid = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/usercenter/getUserInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await res.json();

        if (res.status === 200) {
          setUid(data.data._id);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUid();
  }, [session, loggedIn, email]);

  // Close avatar menu on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(event.target)
      ) {
        setShowAvatarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { text: "Rewards", link: "/rewards" },
    { text: "Buy Crypto", link: "/buycrypto" },
    { text: "P2P", link: "/buy" },
    { text: "Deposit", link: "/wallet/deposit" },
    { text: "Withdraw", link: "/wallet/withdraw" },
    { text: "Play & Earn", link: "/learn" },
  ];

  const menuItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      iconPath: "M3 3v12h12V3H3z",
      iconViewBox: "0 0 24 24",
    },
    {
      name: "Assets",
      link: "/dashboard/sub/assets",
      iconPath: "M4 4h16v16H4V4z",
      iconViewBox: "0 0 24 24",
    },
    {
      name: "P2P Orders",
      link: "/dashboard/sub/p2porder",
      iconPath: "M10 20h4v-4h-4v4zM20 12H4v-4h16v4z",
      iconViewBox: "0 0 24 24",
    },
    {
      name: "Identification",
      link: "/dashboard/sub/account/identification",
      iconPath: "M12 4a6 6 0 016 6v6a6 6 0 01-12 0V10a6 6 0 016-6z",
      iconViewBox: "0 0 24 24",
    },
    {
      name: "Payment",
      link: "/usercenter#paymentmethod",
      iconPath: "M3 4h18v16H3V4z",
      iconViewBox: "0 0 24 24",
    },
    {
      name: "Security",
      link: "/dashboard/sub/security",
      iconPath:
        "M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.22L17.35 7 12 9.78 6.65 7 12 4.22zM4 9.42l8 4.66 8-4.66V14l-8 4.66L4 14V9.42z",
      iconViewBox: "0 0 24 24",
    },
  ];

  return (
    <div
      className={`h-12 sm:h-16 ${
        darkMode ? "bg-black text-white" : ""
      } fixed bg-navBg  z-10 sm:relative w-screen flex justify-between items-center pr-6 pb-2 sm:px-12 sm:py-10 border-b border-slate-100`}
    >
      {/* Only show the avatar icon if the user is logeed in or session */}
      {loggedIn || session && (
          <>
            {/* Avatar icon for mobile devices */}
            <div className="md:hidden justify-center pl-4 items-center gap-4">
              <div ref={avatarMenuRef} className="relative">
                <button
                  className="w-8 h-8 rounded-full dark:bg-gray-600"
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
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
                </button>

                {showAvatarMenu && (
                  <div className="fixed top-0 left-0 h-full w-56 shadow-2xl bg-white rounded-lg border border-gray-200 z-10">
                    <ul className="space-y-2 p-2">
                      <div className="flex flex-col pb-3">
                        <div className="flex flex-col justify-center items-center gap-2">
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
                        <Link
                          onClick={() => setShowAvatarMenu(false)}
                          key={index}
                          href={`${item.link}`}
                        >
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
                        onClick={() => setShowAvatarMenu(false)}
                      >
                        Logout
                      </button>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      <div className="flex justify-center items-center gap-20">
        {/* Mainlogo */}
        <Link
          href={"/"}
          className="text-2xl font-bold text-mainColor flex justify-center items-center hover:scale-110 transition ease-in-out duration-300"
        >
          <p className="text-xl pl-6 sm:pl-0 sm:text-4xl font-extrabold text-mainColor">
            LOGO
          </p>
        </Link>

        {/* Navlinks for large screen size */}
        <div className="hidden md:flex gap-10 text-base font-bold">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="hover:text-hoverNav hover:scale-110 transition ease-in-out duration-300"
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>

      {/* Right side of the navbar */}
      <div className="flex gap-3">
        {/* Search Icon */}
        <button className="hidden sm:flex justify-center items-center hover:scale-110 transition ease-in-out duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="hover:text-mainColor size-8"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dark mode toggle */}
        <div className="hidden sm:flex gap-3 justify-center items-center">
          <button
            onClick={() => toggleDarkMode(!darkMode)}
            className="hover:scale-110 transition ease-in-out duration-300"
          >
            {/* Dark mode toggle icon */}
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
          {/* Other icons */}
          <button className="hidden md:flex hover:scale-110 transition ease-in-out duration-300">
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

          <div className="hidden md:flex justify-center items-center gap-4">
            {session || loggedIn ? (
              <DropdownMenu menuItems={menuItems} uid={uid} />
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 h-10 flex justify-center items-center rounded-lg bg-slate-600 text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-mainColor px-4 h-10 flex justify-center items-center rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex justify-center items-center">
          <svg
            onClick={() => setShowMenu(true)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* Mobile menu */}
        <div
          className={`absolute top-0 right-0 h-screen pt-4 p-2 ${
            showMenu ? "flex" : "hidden"
          } flex-col items-center lg:hidden gap-3 bg-white shadow-2xl z-20 rounded-lg w-64 text-base font-bold`}
        >
          {/* hide menu button */}
          <button onClick={() => setShowMenu(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-7 hover:scale-125 hover:text-mainColor hover:rotate-180 transition-transform duration-300"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div
            onClick={() => setShowMenu(false)}
            className="flex flex-col justify-center items-center mb-4 w-full"
          >
            {session ? (
              <Link>
                <img
                  alt="avatar"
                  src={session?.user.image}
                  className="flex items-start h-8 w-8 text-slate-400 rounded-full"
                />
              </Link>
            ) : (
              <Link href="/dashboard">
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
            )}
            <p className="teext-md">{session ? session.user.email : email}</p>
            <p className="text-sm text-slate-500">UID : 2742640742</p>
          </div>

          {navLinks.map((item, index) => (
            <Link
              onClick={() => setShowMenu(false)}
              key={index}
              href={item.link}
              className="hover:text-white hover:shadow-2xl hover:bg-mainColor h-12 w-full flex justify-center items-center hover:scale-110 transition ease-in-out duration-300"
            >
              {item.text}
            </Link>
          ))}

          <div className="flex flex-col gap-3 w-full p-2">
            {(session || loggedIn) && (
              <Link
                onClick={() => {
                  setLoggedIn(false);
                  setShowMenu(false);
                }}
                href="/auth/login"
                className=" bg-mainColor text-white hover:scale-110 transition ease-in-out duration-500 h-12 w-full flex justify-center items-center rounded-lg"
              >
                Logout
              </Link>
            )}
            {!session && !loggedIn && (
              <>
                <Link
                  href="/auth/login"
                  className="border-slate-300 hover:bg-yellow-50 hover:scale-110 transition ease-in-out duration-500 border rounded-xl h-12 w-full flex justify-center items-center"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className=" bg-mainColor text-white hover:scale-110 transition ease-in-out duration-500 h-12 w-full flex justify-center items-center rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
