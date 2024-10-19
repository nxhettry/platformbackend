"use client";
import Userinfo from "@/components/dashboard/Userinfo";
import Balanceinfo from "@/components/dashboard/Balanceinfo";
import Userassets from "@/components/dashboard/Userassets";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBitcoin } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import Balance from "@/components/mobileView/dashboard/Balance";
import Buttongroup from "@/components/mobileView/dashboard/Buttongroup";
import Banner from "@/components/mobileView/dashboard/Banner";
import Mobileassets from "@/components/mobileView/dashboard/Mobileasset";
import Bottomnav from "@/components/mobileView/dashboard/Bottomnav";
import Image from "next/image";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [btcPrice, setBtcPrice] = useState();
  const [ethPrice, setEthPrice] = useState();
  const [bnbPrice, setBnbPrice] = useState();
  const [btcChange, setBtcChange] = useState("0%");
  const [ethChange, setEthChange] = useState("0%");
  const [bnbChange, setBnbChange] = useState("0%");
  const [userAssets, setUserAssets] = useState([]);
  const [frozenAssets, setFrozenAssets] = useState([]);
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const { loggedIn, email } = useLoggedIn();

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }
  }, [session, loggedIn, router, status]);

  // Fetch BTC , ETH and BNB price and price change
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

        const res3 = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr?symbol=BNBUSDT"
        );
        const data3 = await res3.json();
        setBnbPrice(parseFloat(data3.lastPrice));
        setBnbChange(data3.priceChangePercent + "%");
      } catch (error) {
        console.error(error);
      }
    }
    fetchTicker();

    const interval = setInterval(fetchTicker, 10000); // Update every 10 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  //Fetch user assets and userInfo
  useEffect(() => {
    if (!session && !loggedIn) {
      return;
    }
    const userEmail = session ? session.user.email : email;
    const fetchBalance = async () => {
      try {
        const res = await fetch("https://binaryp2psytes.net/api/balance/getbalance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const response = await res.json();
        setUserAssets(response.data.userAssets);
        setFrozenAssets(response.data.frozenUserAssets);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBalance();

    const userDetails = async () => {
      const res = await fetch("https://binaryp2psytes.net/api/usercenter/getUserInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const response = await res.json();

      if (res.status === 200) {
        setUsername(response.data.username);
        setUid(response.data._id);
      }
      return;
    };

    userDetails();
  }, [session, loggedIn, email]);

  // Map over userAssets to create the assets array
  const assets = userAssets?.map((asset) => {
    let icon;
    switch (asset.asset) {
      case "BTC":
        icon = <FaBitcoin size={30} style={{ color: "orange" }} />;
        break;
      case "ETH":
        icon = <Image src="/eth.svg" width={26} height={26} alt="ETH" />;
        break;
      case "USDT":
        icon = <Image src="/USDT.svg" width={30} height={30} alt="USDT" />;
        break;
      case "BNB":
        icon = <Image src="/BNB.svg" width={30} height={30} alt="BNB" />;
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
          : asset.asset === "USDT"
          ? "USDT"
          : "BNB",
      amount: asset.amount,
      value:
        asset.asset === "USDT"
          ? asset.amount
          : asset.asset === "BNB"
          ? asset.amount * bnbPrice
          : asset.amount * (asset.asset === "BTC" ? btcPrice : ethPrice),
      price:
        asset.asset === "BTC"
          ? btcPrice
          : asset.asset === "ETH"
          ? ethPrice
          : asset.asset === "BNB"
          ? bnbPrice
          : 1,
      change:
        asset.asset === "BTC"
          ? btcChange
          : asset.asset === "ETH"
          ? ethChange
          : asset.asset === "BNB"
          ? bnbChange
          : "+0%",
      icon,
    };
  });

  return (
    <>
      {/* Code for Mobile view */}
      <div className="h-full py-16 w-screen flex sm:hidden flex-col items-start justify-start">
        <Balance
          status={status}
          session={session}
          loggedIn={loggedIn}
          email={email}
          assets={assets}
        />
        <Buttongroup />
        <Banner />
        <Mobileassets assets={assets} frozenAssets={frozenAssets} />
        <Bottomnav />
      </div>

      {/* Code for Desktop view */}
      <div className="sm:flex hidden w-[75%] flex-col gap-6 justify-start items-start pt-3">
        <Userinfo username={username} uid={uid} />
        <Balanceinfo
          status={status}
          session={session}
          loggedIn={loggedIn}
          email={email}
          assets={assets}
        />
        <Userassets assets={assets} />
        <RecentTransactions />
      </div>
    </>
  );
};

export default Dashboard;
