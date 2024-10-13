"use client";
import Utilitybar from "@/components/p2p/UtilitybarP2P";
import Settingsbar from "@/components/Settingsbar";
import P2ptablebuy from "@/components/p2p/p2ptablebuy/P2ptablebuy";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import Loading from "@/app/loading";

const Buy = () => {
  const { loggedIn } = useLoggedIn();
  const router = useRouter();
  const [allAds, setAllAds] = useState([]);
  const [showAds, setShowAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const [selectedCurrency, setSelectedCurrency] = useState("NPR");
  const [paymentOptions] = useState({
    NPR: [
      { code: "Esewa", color: "bg-green-500" },
      { code: "Khalti", color: "bg-purple-500" },
      { code: "Bank Transfer", color: "bg-orange-500" },
    ],
    INR: [
      { code: "Paytm", color: "bg-blue-500" },
      { code: "UPI", color: "bg-gray-500" },
      { code: "Bank transfer", color: "bg-yellow-500" },
    ],
    AED: [
      { code: "PayPal", color: "bg-blue-500" },
      { code: "Stripe", color: "bg-gray-500" },
    ],
    USD: [
      { code: "PayPal", color: "bg-blue-500" },
      { code: "Stripe", color: "bg-gray-500" },
    ],
  });

  //Function to fetch all ads and refresh the page
  useEffect(() => {
    let isMounted = true;

    async function fetchAds() {
      try {
        const res = await fetch("http://localhost:8080/api/p2p/ad/getallad/buy");
        const data = await res.json();
        if (isMounted) {
          setAllAds(data.data);
          setShowAds(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchAds();

    const intervalId = setInterval(() => {
      fetchAds();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated" || loggedIn) {
      setLoading(false);
    }
    if (status === "loading") return; // Avoids redirection during initial loading
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login first");
      router.push("/auth/login");
    }
  }, [status, loggedIn, router]);

  if (status === "loading" || loading) {
    return (
      <Loading />
    );
  }

  return (
    <div className="mt-12 sm:mt-0 h-full w-full mx-auto flex items-center justify-start flex-col">
      <div className="flex sm:px-24 flex-col gap-1 sm:gap-4 w-full">
        <Utilitybar
          isBuy={true}
          isSell={false}
          allAds={allAds}
          setShowAds={setShowAds}
        />
        <Settingsbar
          allAds={allAds}
          setShowAds={setShowAds}
          paymentOptions={paymentOptions}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />
        <P2ptablebuy
          showAds={showAds}
          paymentOptions={paymentOptions}
          selectedCurrency={selectedCurrency}
        />
      </div>
    </div>
  );
};

export default Buy;
