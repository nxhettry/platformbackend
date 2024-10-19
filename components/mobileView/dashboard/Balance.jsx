"use client";
import React, { useState, useEffect } from "react";
import { TbHistory } from "react-icons/tb";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Balance = ({ assets, session, loggedIn, email }) => {
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const router = useRouter();
  const [showDrawer, setShowDrawer] = useState(true);
  const [totalValue, setTotalValue] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState("NPR");
  const [swiftBuyMethods, setSwiftBuyMethods] = useState([]);
  const [swiftBuyAmount, setSwiftBuyAmount] = useState("");
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);

  useEffect(() => {
    setFilteredPaymentMethods(filterPaymentMethods(selectedCurrency));
  }, [selectedCurrency]);

  const handleCurrencyChange = (event) => {
    const currency = event.target.value;
    setSelectedCurrency(currency);
    setFilteredPaymentMethods(filterPaymentMethods(currency));
  };

  //Function to Filter payment methods
  const filterPaymentMethods = (currency) => {
    switch (currency) {
      case "NPR":
        return ["khalti", "esewa", "banktransfer"];
      case "AED":
        return ["paypal", "stripe", "banktransfer"];
      case "USD":
        return ["paypal", "stripe"];
      case "INR":
        return ["paytm", "upi", "banktransfer"];
      default:
        return [];
    }
  };

  useEffect(() => {
    const total = assets?.reduce((acc, asset) => acc + asset.value, 0);
    setTotalValue(total);
  }, [assets]);

  //Function to carry out swift p2p
  const handleSwiftP2P = async () => {
    if (!swiftBuyAmount || !swiftBuyMethods.length) {
      toast({ title: "Please fill all the fields" });
      return;
    }

    setShowDrawer(false);

    //Get the user's email
    let userEmail, orderid;

    if (session) {
      userEmail = session.user.email;
    }

    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) {
      return;
    }

    //Make a request to the server to carry out the swift p2p
    try {
      const res = await fetch(
        "https://binaryp2p.sytes.net/api/p2p/order/createSwiftBuy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            amount: swiftBuyAmount,
            currency: selectedCurrency,
            paymentMethod: swiftBuyMethods,
          }),
        }
      );

      const response = await res.json();

      if (res.status !== 200) {
        toast({ title: "Order Creation failed" });
        return;
      }

      if (res.status === 200) {
        toast({ title: "Order Created Successfully" });

        setShowDrawer(false);
        setSwiftBuyAmount("");
        setSwiftBuyMethods([]);
        router.push(`/buy/${response.data}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedAssetData = assets?.find(
    (asset) => asset.coin === selectedAsset
  );

  return (
    <div className="rounded-xl relative w-[95%] mx-auto flex flex-col gap-6 justify-center items-center text-black">
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 justify-center items-center">
          <p className="font-black text-3xl balancetext">
            {!showBalance ? `${totalValue?.toFixed(2)} ` : "*****"}
          </p>
          {!showBalance ? (
            <svg
              onClick={() => setShowBalance(true)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
          ) : (
            <svg
              onClick={() => setShowBalance(false)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex w-full gap-2 px-4 justify-between items-center">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="px-3 py-2 text-lg bg-mainColor rounded-xl">
              Deposit
            </button>
          </DrawerTrigger>
          <DrawerContent
            style={{ width: "98%", height: "40%", margin: "0 auto" }}
          >
            <div className="flex flex-col h-full w-full gap-4 text-lg px-16 justify-center items-center">
              <Link
                href="/wallet/deposit"
                className="flex justify-center items-center h-16 w-full rounded-lg  border-yellow-200 border-2 text-center text-black"
              >
                Deposit Crypto
              </Link>

              <p className="text-slate-300">-------- or --------</p>

              <Dialog>
                <DialogTrigger asChild>
                  <button
                    onClick={() => {
                      setShowDrawer(true);
                    }}
                    className="h-16 w-full rounded-lg bg-mainColor text-center text-black"
                  >
                    Buy with NPR
                  </button>
                </DialogTrigger>

                {showDrawer && (
                  <DialogContent className="w-[94%] mx-auto rounded-xl">
                    <DialogHeader>
                      <DialogTitle>Swift P2P</DialogTitle>
                      <DialogDescription>
                        Make your selection to deposit
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col w-full gap-8 py-4">
                      {/* Currency selection */}
                      <div className="flex w-full justify-between items-center">
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
                        <div className="flex flex-col justify-start items-start gap-3">
                          <label htmlFor="amount" className="text-start">
                            Amount in NPR
                          </label>
                          <input
                            id="amount"
                            name="amount"
                            value={swiftBuyAmount}
                            onChange={(e) => setSwiftBuyAmount(e.target.value)}
                            placeholder="Eg: 100"
                            className="h-12 border border-slate-300 rounded-lg px-3 w-full"
                          />
                        </div>
                      </div>

                      {/* Payment method selection */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="payment-methods">Payment Method</label>
                        {filteredPaymentMethods.map((method) => (
                          <label key={method} className="flex items-center">
                            <input
                              type="checkbox"
                              name="payment-methods"
                              id={method}
                              value={method}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSwiftBuyMethods([
                                    ...swiftBuyMethods,
                                    method,
                                  ]);
                                } else {
                                  setSwiftBuyMethods(
                                    swiftBuyMethods.filter((m) => m !== method)
                                  );
                                }
                              }}
                              className="mr-2"
                            />
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                          </label>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleSwiftP2P}
                        className="h-12 w-full rounded-lg  bg-mainColor text-center text-black"
                      >
                        Buy USDT
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
            </div>
          </DrawerContent>
        </Drawer>
        <Link
          href="/wallet/withdraw"
          className="p-1 text-xl text-center bg-slate-100  w-full rounded-xl"
        >
          Withdraw
        </Link>
        <Link
          href="/wallet/transactions"
          className="p-1 text-xl text-center bg-slate-100 w-full rounded-xl"
        >
          History
        </Link>
      </div>
    </div>
  );
};

export default Balance;
