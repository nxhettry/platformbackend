"use client";
import Utilitybar from "@/components/p2p/UtilitybarUser";
import React, { useEffect, useState } from "react";
import Myads from "@/components/p2p/Myads";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import Image from "next/image";
import { History, Plus, Edit, Trash2 } from "lucide-react";
import Loading from "@/app/loading";

const Myad = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const { loggedIn, email } = useLoggedIn();
  const [loading, setLoading] = React.useState(true);
  const dropdownRef = React.useRef(null);
  const [mobileAds, setMobileAds] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("NPR");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); //Currency Dropdown
  const [isOnline, setIsOnline] = React.useState(true);
  const [isOffline, setIsOffline] = React.useState(false);
  const [isBuy, setIsBuy] = React.useState(false);
  const [isNPR, setIsNPR] = React.useState(true);
  const [isINR, setIsINR] = React.useState(false);
  const [isAED, setIsAED] = React.useState(false);
  const [isUSD, setIsUSD] = React.useState(false);

  //Functions to change the state of the buttons
  const handleMainToggle = () => {
    setIsBuy((prev) => !prev); // Toggle between Buy and Sell
  };

  const handleCurrencyFilter = (selectedCurrency) => {
    setIsDropdownOpen(!isDropdownOpen);

    if (selectedCurrency === "NPR") {
      setIsNPR(true);
      setIsINR(false);
      setIsAED(false);
      setIsUSD(false);
    }
    if (selectedCurrency === "INR") {
      setIsNPR(false);
      setIsINR(true);
      setIsAED(false);
      setIsUSD(false);
    }
    if (selectedCurrency === "AED") {
      setIsNPR(false);
      setIsINR(false);
      setIsAED(true);
      setIsUSD(false);
    }
    if (selectedCurrency === "USD") {
      setIsNPR(false);
      setIsINR(false);
      setIsAED(false);
      setIsUSD(true);
    }
  };

  const handleOnlineClick = () => {
    setIsOnline(true);
    setIsOffline(false);
  };

  const handleOfflineClick = () => {
    setIsOnline(false);
    setIsOffline(true);
  };

  const handleStatusChange = async (adId) => {
    if (!adId) {
      return;
    }

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }

    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) {
      return;
    }

    try {
      const res = await fetch ("http://localhost:8080/api/p2p/ad/updatead/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail, adId }),
      })

    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAd = async (adId) => {
    if (!adId) return;

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) return;

    const res = await fetch("http://localhost:8080/api/p2p/ad/updatead/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adId, email: userEmail }),
    });

    const data = res.json();

    if(res.status === 200) {
      router.refresh();
      toast({ title: "Ad deleted" });
      return;
    }

    toast({title: data.message});
  };

  const handleEditAd = async (adId) => {
    if (!adId) return;

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) return;

    const newPrice = prompt("Enter new price");

    if (!newPrice || isNaN(newPrice) || newPrice < 0) {
      toast({ title: "Invalid price" });
      return;
    }

    const res = await fetch("http://localhost:8080/api/p2p/ad/updatead/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adId, email: userEmail, newPrice }),
    });

    const data = res.json();

    if(res.status === 200) {
      router.refresh();
      toast({ title: "Ad updated" });
      return;
    }

    toast({title: data.message});

  };

  const currencies = [
    { code: "NPR", label: "NPR", imgSrc: "/npr.png" },
    { code: "INR", label: "INR", imgSrc: "/inr.png" },
    { code: "AED", label: "AED", imgSrc: "/aed.png" },
    { code: "USD", label: "USD", imgSrc: "/usd.png" },
  ];

  // To fetch the ads from the databse  for the mobile
  useEffect(() => {
    let filterStates = {
      isBuy,
      isOnline,
      isOffline,
      isNPR,
      isINR,
      isAED,
      isUSD,
    };

    async function fetchData(filterStates) {
      try {
        if (!session && !loggedIn) {
          return;
        }
        let userEmail;
        if (session) {
          userEmail = session.user.email;
        }
        if (loggedIn) {
          userEmail = email;
        }
        if (!userEmail) {
          toast({ title: "Could not catch email" });
        }

        const res = await fetch("http://localhost:8080/api/p2p/ad/getallad/myads/mobile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail, filterStates }),
        });

        const data = await res.json();

        if (res.status === 200) {
          setMobileAds(data.data);
        } else {
          console.log(data.message);
        }
         return;
      } catch (error) {
        console.log(error);
      }
    }
    fetchData(filterStates);
  }, [
    session,
    loggedIn,
    isBuy,
    isOnline,
    isOffline,
    isNPR,
    isINR,
    isAED,
    isUSD,
    email
  ]);

  useEffect(() => {
    if (status === "authenticated" || loggedIn) {
      setLoading(false);
    }
    if (status === "loading") return; // Avoids redirection during initial loading
    if (status === "unauthenticated" && !loggedIn) {
      toast({ title: "Please login first" });
      router.push("/auth/login");
    }
  }, [status, loggedIn, router, toast]);

  if (status === "loading" || loading) {
    return (
        <Loading />
    );
  }

  return (
    <div className="w-[90%] mt-12 md:mt-0 pb-16 md:pb-0 mx-auto flex flex-col">
      {/* Header for mobile screen */}
      <div className="md:hidden flex gap-3 pl-4 pr-8 flex-col gap-x-32 w-full justify-start">
        {/* Top section  */}
        <div className="sm:hidden w-full flex justify-between items-center">
          {/* Title */}
          <h1 className="text-lg font-bold text-center">My Ads</h1>

          {/* Add new button */}
          <div className="flex flex-row gap-8 justify-center items-center">
            <button onClick={() => router.push("/usercenter/ad/postad")}>
              <Plus size={24} />
            </button>

            <button
              onClick={() => {
                toast({ title: "Feature coming soon" });
              }}
            >
              <History size={16} />
            </button>
          </div>
        </div>

        {/* second section */}
        <div className="sm:hidden font-bold text-xs w-full flex justify-start gap-4 items-center">
          {/* toggle BUy / Sell */}
          <div className="flex justify-center items-center gap-2">
            <p className="text-green-500 text-sm">Buy</p>
            <input
              type="checkbox"
              onChange={handleMainToggle}
              value={isBuy}
              className="toggle-error toggle"
              defaultChecked
            />
            <p className="text-red-500 text-sm">Sell</p>
          </div>

          {/* Online / Offline */}
          <button
            onClick={handleOnlineClick}
            className={`${
              isOnline ? "bg-mainColor text-white" : "bg-gray-50"
            } p-1 px-2 rounded-lg`}
          >
            Online
          </button>
          <button
            onClick={handleOfflineClick}
            className={`${
              isOffline ? "bg-mainColor text-white" : "bg-gray-50"
            } p-1 px-2 rounded-lg`}
          >
            Offline
          </button>

          {/* Currency dropdown */}
          <div className="sm:hidden relative sm:px-2" ref={dropdownRef}>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleCurrencyFilter(selectedCurrency)}
            >
              <Image
                src={currencies.find((c) => c.code === selectedCurrency).imgSrc}
                width={20}
                height={20}
                alt={selectedCurrency}
              />
              <p className="text-md font-bold sm:text-md">{selectedCurrency}</p>
              {isDropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
            </div>

            {isDropdownOpen && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10 w-20 sm:w-40">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className={`flex items-center gap-1 cursor-pointer p-2 ${
                      selectedCurrency === currency.code
                        ? "text-mainColor bg-gray-200" // Highlight selected item
                        : "text-slate-600 hover:bg-gray-100" // Hover effect for non-selected items
                    }`}
                    onClick={() => {
                      setSelectedCurrency(currency.code);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Image
                      src={currency.imgSrc}
                      width={20}
                      height={20}
                      alt={currency.label}
                    />
                    <p className="text-xs">{currency.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table for mobile screen */}
      <div className="flex md:hidden flex-col-reverse gap-3 w-full justify-start mt-4">
        {/* Data for smaller screen */}

        {mobileAds.length > 0 ? (
          mobileAds.map((ad, index) => {
            return (
              <div key={index} className="px-3 py-2 w-full border rounded-lg flex flex-col justify-start">
                {/* Top bar */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-2 justify-center items-center">
                    <p
                      className={`${
                        ad.type === "buy" ? "text-green-500" : "text-red-500"
                      } `}
                    >
                      {ad.type}
                    </p>
                    <p className="font-bold">{ad.asset}</p>
                    <p className="text-xs text-slate-400">with</p>
                    <p className="font-bold">{ad.currency}</p>
                  </div>

                  <div className="flex justify-center gap-3 items-center">
                    <p
                      className={`${
                        ad.status === "Online"
                          ? "text-green-500"
                          : "text-red-500"
                      }   text-sm`}
                    >
                      {ad.status}
                    </p>
                    <input
                      type="checkbox"
                      name="adStatusToggle"
                      className="toggle-success toggle h-5 w-10"
                      onChange={() => handleStatusChange(ad._id)}
                      defaultChecked
                    />
                  </div>
                </div>

                {/* Middle bar */}
                <div className="flex justify-between items-center w-full px-2 py-2">
                  <div className="flex flex-col w-full justify-start">
                    {/* Price */}
                    <div className="w-full flex items-center justify-between">
                      <p className="text-xs text-slate-400">ad id: {ad._id}</p>
                      <div className="flex justify-center items-center">
                        {ad.currency === "NPR" ? "रु." : ad.currency}{" "}
                        <span className="font-bold">{ad.price}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex w-full justify-between items-center">
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="text-xs">
                        {" "}
                        <span className="flex-bold text-sm">
                          {ad.amount}
                        </span>{" "}
                        {ad.asset}
                      </p>
                    </div>

                    {/* Limit */}
                    <div className="flex w-full justify-between items-center">
                      <p className="text-xs text-slate-400">Limit</p>
                      <p className="text-xs">
                        <span className="text-xs font-bold">{`${ad.orderLimitfrom} - ${ad.orderLimitTo}`}</span>{" "}
                        {ad.currency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom bar / Payment Methods */}
                <div className="flex w-full justify-between py-2 items-center gap-3">
                  {ad.paymentMethod.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex justify-center items-center gap-1"
                      >
                        <div className="bg-green-500 h-[7px] w-[2px]"></div>
                        <p className="text-xs">{item.method}</p>
                      </div>
                    );
                  })}

                  <div className="flex gap-3 justify-center items-center">
                    <button
                      onClick={() => {
                        handleEditAd(ad._id);
                      }}
                    >
                      <Edit size={20} style={{ color: "#4169E1" }} />
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteAd(ad._id);
                      }}
                    >
                      <Trash2
                        size={20}
                        style={{ color: "red", marginRight: "1rem" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center text-sm font-bold">
            No ads found
          </div>
        )}
      </div>

      {/* Header for big screen */}
      <div className="hidden md:flex w-full justify-between items-center">
        <h1 className="text-2xl w-32 font-bold text-center">My Ads</h1>
        <Utilitybar />
      </div>

      {/* Table for big screen */}
      <div className="hidden w-full md:flex justify-center items-center">
        <div className="w-full">
          <div className="w-full flex justify-center items-center">
            <div className="bg-slate-100 w-full flex justify-between items-center px-12 py-2 text-xs sm:text-sm text-slate-400">
              <p className="text-xs">
                Ad Number <br />
                Type <br />
                Assets/Fiat
              </p>
              <p className="pl-10">Total Amount</p>
              <p className="">Price</p>
              <p className="text-xs">Payment Methods</p>
              <p className="text-xs">Time Limit</p>
              <p className="text-xs">Status</p>
              <p className="text-xs">Actions</p>
            </div>
          </div>
          <div>
            <Myads />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myad;
