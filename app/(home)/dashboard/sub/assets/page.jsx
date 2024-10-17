"use client";
import Userassets from "@/components/dashboard/Userassets";
import Balanceinfo from "@/components/dashboard/Balanceinfo";
import React, { useState, useEffect } from "react";
import { FaBitcoin, FaEthereum, FaDollarSign } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "@/components/AuthContext";
const Assets = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [btcPrice, setBtcPrice] = useState();
  const [ethPrice, setEthPrice] = useState();
  const [btcChange, setBtcChange] = useState("0%");
  const [ethChange, setEthChange] = useState("0%");
  const [userAssets, setUserAssets] = useState([]);
  const { loggedIn, email } = useLoggedIn();

  useEffect(() => {
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }
  }, [session, loggedIn, router, status]);

  // Fetch BTC and ETH prices
  useEffect(() => {
    async function fetchTicker() {
      try {
        const res1 = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
        );
        const data1 = await res1.json();
        setBtcPrice(parseFloat(data1.lastPrice));
        setBtcChange(data1.priceChangePercent + "%");

        const res2 = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT"
        );
        const data2 = await res2.json();
        setEthPrice(parseFloat(data2.lastPrice));
        setEthChange(data2.priceChangePercent + "%");
      } catch (error) {
        console.error(error);
      }
    }
    fetchTicker();

    const interval = setInterval(fetchTicker, 10000); // Update every 10 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  //Fetch user assets
  useEffect(() => {
    if (!session && !loggedIn) {
      return;
    }
    const userEmail = session ? session.user.email : email;
    const fetchBalance = async () => {
      try {
        const res = await fetch("https://binaryp2p.sytes.net/api/balance/getBalance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const response = await res.json();
        setUserAssets(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBalance();
  }, [session, loggedIn, email]);

  // Map over userAssets to create the assets array
  const assets = userAssets?.map((asset) => {
    let icon;
    switch (asset.asset) {
      case "BTC":
        icon = <FaBitcoin size={40} style={{ color: "orange" }} />;
        break;
      case "ETH":
        icon = <FaEthereum size={40} style={{ color: "darkblue" }} />;
        break;
      case "USDT":
        icon = <FaDollarSign size={37} style={{ color: "green" }} />;
        break;
      default:
        icon = null;
    }

    return {
      coin:
        asset.asset === "BTC"
          ? "Bitcoin"
          : asset.asset === "ETH"
          ? "Ethereum"
          : "USDT",
      amount: asset.amount,
      value:
        asset.asset === "USDT"
          ? asset.amount
          : asset.amount * (asset.asset === "BTC" ? btcPrice : ethPrice),
      price:
        asset.asset === "BTC" ? btcPrice : asset.asset === "ETH" ? ethPrice : 1,
      change:
        asset.asset === "BTC"
          ? btcChange
          : asset.asset === "ETH"
          ? ethChange
          : "+0%",
      icon,
    };
  });
  return (
    <div className="flex flex-col w-full gap-4 p-3">
      <Balanceinfo assets={assets} />
      <Userassets assets={assets} />
    </div>
  );
};

export default Assets;
