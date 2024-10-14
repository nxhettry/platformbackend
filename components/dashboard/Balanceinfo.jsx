"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { FaHistory } from "react-icons/fa";

const Balanceinfo = ({ assets, session, loggedIn, email, status }) => {
  const [selectedAsset, setSelectedAsset] = useState("USDT");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    const total = assets?.reduce((acc, asset) => acc + asset.amount, 0);
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

    //Make a request to the server to carry out the swift p2p
    try {
      setLoading(true);

      const res = await fetch("http://35.154.71.2/api/p2p/order/createSwiftBuy", {
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
      });

      const response = await res.json();

      if (response.status !== 200) {
        toast({ title: "Order Creation failed" });
        return;
      }

      const orderid = response.data;

      toast({ title: "Order Created Successfully" });
      router.push(`/buy/${orderid}`);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }

    setSwiftBuyAmount("");
    setSwiftBuyMethods([]);
  };

  const selectedAssetData = assets?.find(
    (asset) => asset.coin === selectedAsset
  );

  if (status === "loading" || loading) {
    return <Loading />;
  }

  return (
    <div className="h-40 w-full flex items-center justify-between border border-gray-300 p-6 bg-white rounded-lg shadow-md">
      <div className="pl-12 flex flex-col h-full py-3 gap-3 justify-center items-start">
        <h1 className="text-2xl font-bold">Estimated Balance</h1>
        <div className="flex gap-3">
          <h1 className="text-3xl font-bold">
            {selectedAssetData
              ? (totalValue / selectedAssetData.price).toFixed(2)
              : "0.00"}
          </h1>{" "}
          <select
            value={selectedAsset}
            onChange={(e) => {
              setSelectedAsset(e.target.value);
            }}
          >
            {assets?.map((asset) => (
              <option key={asset.coin} value={asset.coin}>
                {asset.coin}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-3"
          >
            <path d="M3.75 6a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75ZM3.75 13.5a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5H3.75Z" />
          </svg>

          <p>{totalValue?.toFixed(2)}</p>
        </div>
      </div>
      <div className="relative h-full flex gap-3 justify-center items-center">
        <Drawer>
          <DrawerTrigger asChild>
            <button className="px-3 py-2 text-lg bg-mainColor hover:bg-blue-400 rounded-xl">
              Deposit
            </button>
          </DrawerTrigger>
          <DrawerContent
            style={{ width: "98%", height: "40%", margin: "0 auto" }}
          >
            <div className="flex h-full w-full gap-12 px-16 justify-center items-center">
              <Link
                href="/wallet/deposit"
                className="flex justify-center items-center h-16 w-full rounded-lg hover:bg-gray-100 hover:scale-110 transition ease-in-out duration-500 border-yellow-200 border-2 text-center text-black"
              >
                Deposit Crypto
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  <button
                    onClick={() => {
                      setShowDrawer(true);
                    }}
                    className="h-16 w-full rounded-lg hover:bg-yellow-500 hover:scale-110 transition ease-in-out duration-500 bg-mainColor text-center text-black"
                  >
                    Buy with NPR
                  </button>
                </DialogTrigger>
                {/* Conditionally render the Dialog */}
                {showDrawer && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Swift P2P</DialogTitle>
                      <DialogDescription>
                        Make your selection to deposit
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-8 py-4">
                      {/* Currency selection */}
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

                      <div className="flex flec-col justify-start items-start gap-3">
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
                    <DialogFooter>
                      <Button
                        onClick={handleSwiftP2P}
                        className="h-12 w-full rounded-lg hover:bg-yellow-500 hover:scale-110 transition ease-in-out duration-500 bg-mainColor text-center text-black"
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
          className="px-3 py-2 text-lg bg-slate-100 hover:bg-slate-200 rounded-xl"
          href="/wallet/withdraw"
        >
          Withdraw
        </Link>
        <Link
          className="px-3 py-2 text-lg border bg-white hover:bg-slate-200 rounded-xl"
          href="/buycrypto/buy"
        >
          Buy Crypto
        </Link>

        {/* History section */}
        <Link href="/wallet/transactions" className="absolute top-0 right-5 flex justify-center items-center gap-2 text-base text-slate-400"><span>Transaction History</span><FaHistory size={20}/></Link >
      </div>
    </div>
  );
};

export default Balanceinfo;
