"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UtilitybarUser from "@/components/p2p/UtilitybarUser";
import paymentCategory from "@/components/Paymentinp";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextareaAutosize } from "@mui/material";
import Loading from "@/app/loading";
import AddPayment from "@/components/p2p/Addpayment";

const Postad = () => {
  const { toast } = useToast();
  const { loggedIn, email } = useLoggedIn();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [showTerms, setShowTerms] = useState(false);
  const [isBuy, setIsBuy] = useState(true);
  const [adTerms, setAdTerms] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("NPR");
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const [adPrice, setAdPrice] = useState("");
  const [adAmount, setAdAmount] = useState("");
  const [adOrderLimitfrom, setAdOrderLimitfrom] = useState("");
  const [adOrderLimitTo, setAdOrderLimitTo] = useState("");
  const [adTimeLimitinmins, setAdTimeLimitinmins] = useState("5");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState([]);

  useEffect(() => {
    const availableMethods = Object.keys(paymentCategory).filter((method) => {
      switch (selectedCurrency) {
        case "NPR":
          return ["khalti", "esewa", "banktransfer"].includes(method);
        case "AED":
          return ["paypal", "stripe", "banktransfer"].includes(method);
        case "USD":
          return ["paypal", "stripe"].includes(method);
        case "INR":
          return ["paytm", "upi", "banktransfer"].includes(method);
        default:
          return false;
      }
    });

    setFilteredPaymentMethods(availableMethods);
  }, [selectedCurrency]);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleAssetChange = (event) => {
    setSelectedAsset(event.target.value);
  };

  const handlePaymentMethodsChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPaymentMethods((prev) =>
      checked ? [...prev, value] : prev.filter((method) => method !== value)
    );
  };

  const handleAdPriceChange = (event) => {
    setAdPrice(event.target.value);
  };

  const handleAdAmountChange = (event) => {
    setAdAmount(event.target.value);
  };

  const handleAdOrderLimitFromChange = (event) => {
    setAdOrderLimitfrom(event.target.value);
  };

  const handleAdOrderLimitToChange = (event) => {
    setAdOrderLimitTo(event.target.value);
  };

  const handleAdTimeLimitInMinsChange = (event) => {
    setAdTimeLimitinmins(event.target.value);
  };

  const submitAd = async () => {
    setShowTerms(false);

    let userEmail = session ? session.user.email : loggedIn ? email : null;

    if (!userEmail) {
      toast({ title: "Please try again later." });
      return;
    }

    if (
      adPrice <= 0 ||
      adAmount <= 0 ||
      adOrderLimitfrom <= 0 ||
      adOrderLimitTo <= 0
    ) {
      toast({ title: "Please enter valid values." });
      return;
    }

    const adData = {
      email: userEmail,
      asset: selectedAsset,
      currency: selectedCurrency,
      paymentMethod: selectedPaymentMethods,
      price: adPrice,
      amount: adAmount,
      orderLimitfrom: adOrderLimitfrom,
      orderLimitTo: adOrderLimitTo,
      timeLimitinmins: adTimeLimitinmins,
      type: isBuy ? "buy" : "sell",
      terms: adTerms,
    };

    // Submit the data to the server
    try {
      const res = await fetch("http://localhost:8080/api/p2p/ad/postad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });

      const responseData = await res.json();

      if (res.status !== 200) {

        if(responseData.message === "Please add all payment methods selected before posting an ad") {
          setShowAddPayment(true);
        }

        toast({ title: responseData.message });
        return;
      }

      if (res.status === 200) {
        alert(responseData.message);
        router.push("/usercenter/ad/myad");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (status === "authenticated" || loggedIn) {
      setLoading(false);
    }
    if (status === "loading") return;
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login first");
      router.push("/auth/login");
    }
  }, [status, loggedIn, router]);

  if (status === "loading" || loading) {
    return <Loading />;
  }

  return (
    <div className="w-4/5 mt-12 md:mt-0 pb-16 md:pb-0 mx-auto flex flex-col items-center gap-6">
      <div className="flex w-full px-3 py-3 flex-col gap-3 justify-between items-center">
        <span className="text-2xl text-center font-bold">Create Ad</span>
        <div className="flex justify-between items-center w-full gap-3">
          <div className="h-12 w-[20rem] p-[0.2rem] flex justify-center items-center gap-2 rounded-lg border border-slate-300 bg-white">
            <Link
              href="#"
              onClick={() => setIsBuy(true)}
              className={`${
                isBuy ? "bg-green-500 text-white" : ""
              } w-[48%] h-[90%] text-xs md:text-base rounded-md flex justify-center items-center`}
            >
              I want to Buy
            </Link>
            <Link
              href="#"
              onClick={() => setIsBuy(false)}
              className={`${
                isBuy ? "" : "bg-red-500 text-white"
              } w-[48%] h-[90%] text-xs md:text-base rounded-md flex justify-center items-center`}
            >
              I want to Sell
            </Link>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <UtilitybarUser />
          </div>
        </div>
      </div>

      <div className="w-full border border-slate-300 rounded-xl p-4 md:p-10 flex justify-center flex-col items-start">
        <form className="flex flex-col gap-5 md:gap-8" onSubmit={submitAd}>
          <div className="flex gap-4 justify-start items-end">
            <div className="flex flex-col gap-2 justify-center items-start">
              <label htmlFor="asset">Asset</label>
              <select
                name="asset"
                id="asset"
                className="h-10 w-24 bg-slate-100 px-1"
                value={selectedAsset}
                onChange={handleAssetChange}
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5 flex justify-center items-start mb-3"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col gap-2 justify-center items-start">
              <label htmlFor="currency">Currency</label>
              <select
                name="currency"
                id="currency"
                className="h-10 w-24 bg-slate-100 px-1"
                value={selectedCurrency}
                onChange={handleCurrencyChange}
              >
                <option value="NPR">NPR</option>
                <option value="AED">AED</option>
                <option value="USD">USD</option>
                <option value="INR">INR</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="payment-methods">Payment Method</label>
            {filteredPaymentMethods.map((method) => (
              <label key={method} className="flex items-center">
                <input
                  type="checkbox"
                  name="payment-methods"
                  id={method}
                  value={method}
                  onChange={handlePaymentMethodsChange}
                  className="mr-2"
                />
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={adPrice}
              onChange={handleAdPriceChange}
              className="h-10 w-full bg-slate-100 px-1"
              placeholder="Enter the price"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={adAmount}
              onChange={handleAdAmountChange}
              className="h-10 w-full bg-slate-100 px-1"
              placeholder={`0.00 ${selectedAsset}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="orderlimit">Order Limit</label>
            <div className="flex gap-4">
              <input
                type="number"
                id="orderlimitfrom"
                name="orderlimitfrom"
                value={adOrderLimitfrom}
                onChange={handleAdOrderLimitFromChange}
                className="h-10 w-full bg-slate-100 px-1"
                placeholder={`0.00 ${selectedCurrency}`}
              />
              <input
                type="number"
                id="orderlimitto"
                name="orderlimitto"
                value={adOrderLimitTo}
                onChange={handleAdOrderLimitToChange}
                className="h-10 w-full bg-slate-100 px-1"
                placeholder={`0.00 ${selectedCurrency}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label>Time Limit in minutes</label>
            <select
              name="time"
              id="time"
              value={adTimeLimitinmins}
              onChange={handleAdTimeLimitInMinsChange}
              className="bg-slate-100 border rounded-xl px-2 py-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="60">60</option>
            </select>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="h-10 w-[5rem] bg-mainColor text-white font-semibold rounded-lg"
              >
                Post Ad
              </button>
            </DialogTrigger>
            {showTerms && (
              <DialogContent className="sm:max-w-[425px]">
                <>
                  <DialogHeader>
                    <DialogTitle>Set Terms & Conditions</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex justify-start items-start gap-4">
                      <TextareaAutosize
                        id="terms"
                        value={adTerms}
                        onChange={(e) => setAdTerms(e.target.value)}
                        placeholder={`Eg : \n1. Terms and conditions\n2. Terms and conditions\n3. Terms and conditions`}
                        className="w-full min-h-32 border-2 rounded-lg p-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTerms(false);
                        submitAd();
                      }}
                      className="h-10 w-[5rem] bg-mainColor text-white font-semibold rounded-lg"
                    >
                      Post Ad
                    </button>
                  </DialogFooter>
                </>
              </DialogContent>
            )}
          </Dialog>
        </form>
      </div>

      {
        showAddPayment && <div className="fixed h-screen w-screen flex justify-center items-center">
          <AddPayment isAddPayment={showAddPayment} setIsAddPayment={setShowAddPayment} />
        </div>
      }
    </div>
  );
};

export default Postad;
