"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Merchantdata = ({ selectedCurrency, coin, showAds }) => {
  const { data: session } = useSession();
  const { loggedIn, email } = useLoggedIn();
  const { toast } = useToast();

  const router = useRouter();
  const [wannaSell, setWannaSell] = useState(false);
  const [selectedAd, setSelectedAd] = useState();
  const [toSellFiat, setToSellFiat] = useState();
  const [toSellAsset, setToSellAsset] = useState();
  const [amountError, setAmountError] = useState("");

  //Function to initiate p2p order creation
  const handlep2pSell = async (e, selectedAd) => {
    e.preventDefault();

    // Validation checks for input of amount and assets
    if (
      toSellFiat < selectedAd.orderLimitfrom ||
      toSellFiat > selectedAd.orderLimitTo ||
      toSellFiat > selectedAd.amount * selectedAd.price
    ) {
      setAmountError("Invalid amount. Please check the order limit.");
      return;
    }
    if (toSellAsset > selectedAd.amount) {
      setAmountError("Invalid amount. Please check the order limit.");
      return;
    }
    setWannaSell(false);

    if (!toSellFiat || !toSellAsset || toSellFiat <= 0 || toSellAsset <= 0) {
      alert("Invalid input. Please check the order limit.");
      return;
    }

    let userEmail = session?.user?.email || email;
    let selectedAsset = selectedAd.asset;
    let toCheckAmount = toSellFiat / selectedAd.price;

    if (!userEmail || !selectedAsset || !toCheckAmount) {
      toast({ title: "Please try again" });
      return;
    }

    //Check if the seller has the assets to sell
    let hasAssets = await validateSellerAssets(
      toCheckAmount,
      userEmail,
      selectedAsset
    );

    if (!hasAssets) {
      toast({ title: "You do not have enough assets to sell" });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    }

    const orderDetails = {
      adId: selectedAd._id,
      currency: selectedAd.currency,
      asset: selectedAd.asset,
      fiatAmount: toSellFiat,
      price: selectedAd.price,
      totalAsset: (toSellFiat / selectedAd.price),
      paymentDetails: [
        {
          paymentMethod: selectedAd.paymentMethod,
        },
      ],
    };
    let seller = session?.user?.email || email;

    let orderData = {
      adId: selectedAd._id,
      orderdetails: orderDetails,
      isComplete: false,
      isPaid: false,
      isCancelled: false,
      isDisputed: false,
      isRefunded: false,
      isPending: true,
      isExpired: false,
      timer: selectedAd.timeLimitinmins,
      buyer: selectedAd.email,
      seller: seller,
      messages: [],
    };

    try {
      const res = await fetch("https://binaryp2psytes.net/api/p2p/order/createP2POrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      const orderid = data.data;

      if (!res.ok) {
        alert("Order creation failed");
      }
      router.push(`/sell/${orderid}`);
    } catch (error) {
      console.log(error);
      alert("Error in creating order");
    }
  };

  //Function to validate seller assets
  const validateSellerAssets = async (
    toCheckAmount,
    userEmail,
    selectedAsset
  ) => {
    try {
      const res = await fetch("https://binaryp2psytes.net/api/wallet/validateSellerAssets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toCheckAmount, userEmail, selectedAsset }),
      });

      const data = await res.json();

      if (res.status === 200) {
        toast({ title: data.message });
        return data.data;
      } else {
        return false;

      }

    } catch (error) {
      console.log(error);
      return false;
    }
  };

  //Function to update fiat amount
  const handleUpdateFiat = (e) => {
    setToSellFiat(e.target.value);
    setToSellAsset(e.target.value / selectedAd.price);
  };

  //Function to update asset amount
  const handleUpdateAsset = (e) => {
    setToSellAsset(e.target.value);
    setToSellFiat(e.target.value * selectedAd.price);
  };

  return (
    <>
      {showAds?.map((ad, index) => (
        <div key={index}>

          {
            //Only display the data when the form is not open
            !wannaSell && (
              <>


                {/* Data display for smaller screens */}
                <div className="sm:hidden border-b flex flex-col py-4">
                  <div className="flex justify-between items-start">
                    {/* Merchant details */}
                    <div>
                      <div className="flex h-full gap-1">
                        {/* Profile pic */}
                        <div className="h-full">
                          <div className="relative mt-1 bg-black rounded-lg flex justify-center items-center text-white h-5 w-5">
                            <span className="text-xs">{ad.email[0]}</span>
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-2 w-2"></div>
                          </div>
                        </div>

                        {/* All details */}
                        <div className="h-full gap-[2px] flex flex-col items-start justify-start">
                          {/* User email */}
                          <div className="font-semibold w-full p-1 flex justify-start items-center">
                            <span className="text-sm">{ad.email}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-4 text-mainColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>

                          {/* Order details */}
                          <div className="flex gap-1 px-1 justify-start items-center text-xs text-slate-600">
                            <span>{`${ad.orders} orders`}</span>
                            <span className="text-slate-300">|</span>
                            <span>{`${ad.completionRate} completion`}</span>
                          </div>
                          {/* Available */}
                          <div className="flex w-full items-center justify-start px-1">
                            <div className="h-full w-full text-xs flex gap-1 text-slate-500 justify-start items-start">
                              <span>Available :</span>
                              <span>
                                {`${ad.amount.toFixed(2)}`} {coin}
                              </span>
                            </div>
                            <div className="flex w-full justify-center items-center gap-1 text-xs text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="size-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{`${ad.timeLimitinmins} mins`}</span>
                            </div>
                          </div>

                          {/* Payment Methods */}
                          {ad.paymentMethod && ad.paymentMethod.length > 0 ? (
                            <div className="sm:hidden flex justify-center items-center gap-2">
                              {ad.paymentMethod.map((method, index) => (
                                <div
                                  key={index}
                                  className="flex gap-1 justify-center text-xs items-center"
                                >
                                  <div className={`h-3 w-[1px] bg-green-400`}></div>
                                  <span>{method.method}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="sm:hidden flex gap-1 justify-center text-xs items-center">
                              {ad.paymentMethod && ad.paymentMethod.length === 0 ? (
                                <span>No payment methods available</span>
                              ) : (
                                // Handle cases where ad.paymentMethod is null or undefined
                                <span>No payment methods data</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Action */}
                    <div className="flex flex-col gap-2 items-end justify-start">
                      <div className="p-1 w-full text-xs text-slate-500 flex flex-col justify-start items-end">
                        {/* Time limit */}
                        <div className="flex justify-center gap-1 items-center">
                          <span>Time:</span>
                          <div className="flex w-full justify-center items-center gap-1 text-xs text-slate-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{`${ad.timeLimitinmins} mins`}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <p className="text-sm text-slate-900">
                          {ad.currency}
                          <span className="text-xl font-bold">{` ${ad.price}`}</span>
                          <span className="text-xs text-slate-400">{`/${ad.asset}`}</span>
                        </p>
                      </div>
                      {/* Sell button */}
                      <div className="h-full flex justify-center items-center">
                        <button
                          onClick={() => {
                            if (!loggedIn && !session) {
                              alert("Please login to sell");
                              router.push("/auth/login");
                              return;
                            }
                            setSelectedAd(ad);
                            setWannaSell(true);
                          }}
                          className="h-7 w-24 rounded-lg hover:scale-110 transition ease-in-out duration-300  text-white bg-red-500"
                        >
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data display for larger screens */}
                <div
                  key={index}
                  style={{
                    paddingTop: "3px",
                    borderTop: "1px solid #cbd5e1",
                    borderBottom: "1px solid #cbd5e1",
                  }}
                  className="hidden w-full sm:flex hover:bg-gray-50"
                >
                  {/* Merchant details */}
                  <div className="flex sm:px-4 py-2 w-full">
                    <div className="flex h-full gap-1">
                      <div className="h-full">
                        <div className="relative mt-1 bg-black rounded-lg flex justify-center items-center text-white h-6 w-6">
                          <span className="text-xs">A</span>
                          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-2 w-2"></div>
                        </div>
                      </div>
                      <div className="h-full flex flex-col gap-2 items-start justify-start">
                        <div className="font-semibold w-full p-1 flex justify-start items-center gap-2">
                          <span>{ad.email}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-4 text-mainColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex gap-2 px-1 justify-start items-center text-sm text-slate-600">
                          <span>{`${ad.orders} orders`}</span>
                          <span className="text-slate-300">|</span>
                          <span>{`${ad.completionRate} completion`}</span>
                        </div>
                        <div className="flex w-full gap-4 items-center justify-start px-1">
                          <span className="text-sm text-green-500 ">{ad.status}</span>
                          <div className="flex justify-center items-center gap-1 text-xs text-slate-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="size-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{`${ad.timeLimitinmins} mins`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex sm:px-4 py-2 w-full justify-start items-start">
                    <p className="text-2xl font-bold">{ad.price}</p>
                    <p className="text-sm text-slate-700 ml-2 pt-2 font-semibold">
                      {ad.selectedCurrency}
                    </p>
                  </div>

                  {/* Available/Order Limit */}
                  <div className="sm:px-4 py-2 w-full flex flex-col gap-2 justify-start items-start">
                    <p>
                      {`${ad.amount}`} {coin}
                    </p>
                    <p>
                      {`${ad.orderLimitfrom} - ${ad.orderLimitTo}`} {selectedCurrency}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="sm:px-4 py-2 w-full">
                    <div className="flex gap-2 justify-start items-center">
                      <div className="sm:px-4 py-2 w-full">
                        <div className="flex gap-2 justify-start items-center">
                          {ad.paymentMethod && ad.paymentMethod.length > 0 ? (
                            <div className="hidden sm:flex justify-center items-center gap-2">
                              {ad.paymentMethod.map((method, index) => (
                                <div
                                  key={index}
                                  className="flex gap-1 justify-center text-sm items-center"
                                >
                                  <div className={`h-3 w-[2px] bg-green-400`}></div>
                                  <span>{method.method}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="hidden sm:flex gap-1 justify-center text-sm items-center">
                              {ad.paymentMethod && ad.paymentMethod.length === 0 ? (
                                <span>No payment methods available</span>
                              ) : (
                                // Handle cases where ad.paymentMethod is null or undefined
                                <span>No payment methods data</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sell Button */}
                  <div className="sm:px-4 py-2 w-full">
                    <div className="flex h-full justify-center items-center">
                      <button
                        onClick={() => {
                          if (!loggedIn && !session) {
                            alert("Please login to buy");
                            router.push("/auth/login");
                            return;
                          }
                          setSelectedAd(ad);
                          setWannaSell(true);
                        }}
                        className="h-10 w-28 rounded-xl hover:scale-110 transition ease-in-out duration-300 text-white bg-red-500"
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                </div>
              </>

            )
          }
        </div>
      ))}

      {/* Sell form second level */}
      {wannaSell && selectedAd && (
        <div
          className={`${wannaSell ? "flex" : "hidden"
            } absolute overflow-y-hidden inset-0 h-full w-screen justify-center items-center bg-white bg-opacity-50`}
        >
          <div className="border bg-slate-100 text-black mt-16 sm:mt-0 h-full w-full sm:h-3/5 sm:w-[70%] rounded-xl sm:pl-4 flex justify-between items-center">
            {/* Form left */}
            <div className="hidden sm:flex flex-col gap-12 py-3 h-full w-[53%] ">
              <div className="flex w-full gap-24 justify-start items-center">
                {/* This is User Info */}
                <div className="flex h-full gap-1">
                  <div className="h-full">
                    <div className="relative mt-1 bg-black rounded-lg flex justify-center items-center text-white h-6 w-6">
                      <span className="text-xs">A</span>
                      <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-2 w-2"></div>
                    </div>
                  </div>
                  <div className="h-full flex flex-col gap-2 items-start justify-start ">
                    <div className="font-semibold w-full p-1 flex justify-start items-center gap-2">
                      <span>{selectedAd.email}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4 text-mainColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex gap-2 px-1 justify-start items-center text-sm text-slate-600">
                      <span>{`${selectedAd.orders} orders`}</span>
                      <span className="text-slate-300">|</span>
                      <span>{`${selectedAd.completionRate} completion`}</span>
                    </div>
                    <div className="flex w-full gap-4 items-center justify-start px-1">
                      <span className="text-sm text-green-500 ">
                        {selectedAd.status}
                      </span>
                      <div className="flex justify-center items-center gap-1 text-xs text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{`${selectedAd.timeLimitinmins} mins`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* This contains available order */}
                <div className="flex-col flex justify-center items-center gap-3">
                  {/* This is Ad detail */}
                  <p className="text-sm">Available/Order Limit</p>
                  <div className="h-full text-xs w-full flex flex-col gap-2 justify-start items-start">
                    <p>
                      {`${selectedAd.amount}`} {selectedAd.asset}
                    </p>
                    <p>
                      {`${selectedAd.orderLimitfrom} - ${selectedAd.orderLimitTo}`}{" "}
                      {selectedAd.currency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full pl-8">
                <h1 className="text-lg font-bold">
                  Advertiser&apos;s Terms & Conditions :
                </h1>
                <div className="w-3/5 px-2 py-3 rounded-xl border">
                  <p className="p-2 text-xs">{selectedAd.terms}</p>
                </div>
              </div>
            </div>

            {/* Form right */}
            <div className="flex flex-col mt-10 sm:mt-0 gap-6 h-full w-full sm:w-[43%] bg-white sm:px-4">
              {/* rate display at the top */}
              <div className="text-sm px-2 pl-12 sm:pl-0 sm:ox-0 text-slate-400 flex justify-start sm:justify-center items-center gap-1 ">
                <p>Price</p>
                <span className="text-slate-900 font-semibold sm:text-green-400">
                  {
                    selectedAd.currency === "NPR" && "रु."
                  }
                  {selectedAd.price}
                  {selectedAd.currency !== "NPR" &&
                    selectedAd.currency
                  }
                </span>
              </div>

              {/* You pay */}
              <div className="relative sm:h-24 w-4/5 sm:w-full mx-auto border-slate-300 border rounded-xl px-3 flex flex-col justify-center gap-2 py-1">
                <p className="text-sm text-slate-900 font-semibold ">You Pay</p>
                <div className="flex bg-gray-100 rounded-lg px-3 w-full gap-2 items-center justify-center">
                  <span className="text-sm text-slate-900">
                    {selectedAd.currency === "NPR" ? "रु." :
                      selectedAd.currency
                    }
                  </span>
                  <input
                    type="number"
                    required
                    value={toSellFiat}
                    onChange={handleUpdateFiat}
                    className="rounded-md bg-gray-100 text-lg h-12 w-full p-1"
                    style={{
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  />
                  <span className="text-sm h-full flex items-center justify-center text-mainColor sm:text-slate-900">
                    All
                  </span>
                </div>
                <div className=" w-full no-underline text-xs sm:hidden flex justify-start gap-8 items-center text-slate-400">
                  <p>
                    Limit{" "}
                    {`${selectedAd.currency} ${selectedAd.orderLimitfrom}-${selectedAd.orderLimitTo}`}
                  </p>
                  <p>| Available {`${selectedAd.amount.toFixed(2)}`}</p>
                </div>
                {amountError && (
                  <span style={{ color: "red", fontSize: "12px" }}>
                    {amountError}
                  </span>
                )}
              </div>
              {/* You'll receive */}
              <div className="flex flex-col gap-1 justify-center items-center w-full">
                <div className="relative h-20 mt-3 sm:mt-0 sm:h-24 w-4/5 sm:w-full mx-auto border-slate-300 border rounded-xl px-3 flex flex-col justify-center">
                  <p className="text-sm text-slate-900 font-bold">You receive</p>
                  <div className="flex w-full gap-2 items-center justify-center">
                    <span className="text-sm text-slate-900">
                      {selectedAd.asset}
                    </span>
                    <input
                      type="number"
                      required
                      value={toSellAsset}
                      onChange={handleUpdateAsset}
                      className="rounded-md text-lg h-12 w-full p-1"
                      style={{
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                      }}
                    />
                  </div>

                </div>
                <div className="w-4/5 no-underline text-xs sm:hidden flex flex-col justify-start items-start text-slate-400">
                  <span className="sm:hidden text-xs text-slate-400 pl-4">
                    Payment time limit: {`${selectedAd.timeLimitinmins} mins`}
                  </span>
                  <p className="sm:hidden text-xs text-slate-400 pl-4">
                    Advertiser status:{" "}
                    <span className="text-green-500">online</span>
                  </p>
                </div>
              </div>

              {/* User Details for smaller screen size */}
              <div className="sm:hidden pl-3 gap-3 text-xs w-4/5 mx-auto flex flex-col justify-center items-start">
                <div className="flex flex-col justify-start items-start">
                  <p className="text-lg font-slate-900 font-semibold">
                    {selectedAd.type === "buy" ? "Buyer" : "Seller"} & Terms
                  </p>
                  <p className="text-xs text-start text-slate-400">
                    * Please read the{" "}
                    {selectedAd.type === "buy" ? "Buyer" : "Seller"}&apos;s terms
                    and conditions carefully
                  </p>
                  <div className="mt-2 w-full px-2 py-3 rounded-xl border">
                    <p className="p-2">{selectedAd.terms}</p>
                  </div>
                </div>
                <div className="flex border rounded-lg w-full py-2 px-2 shadow-sm h-full gap-1">
                  <div className="h-full">
                    <div className="relative mt-1 bg-black rounded-lg flex justify-center items-center text-white h-6 w-6">
                      <span className="text-xs">A</span>
                    </div>
                  </div>
                  <div className="h-full flex flex-col items-start justify-start ">
                    <div className="font-semibold w-full p-1 flex justify-start items-center gap-2">
                      <span>{selectedAd.email}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="size-4 text-mainColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="flex gap-2 px-1 justify-start items-center text-sm text-slate-600">
                      <span>{`${selectedAd.orders} orders`}</span>
                      <span className="text-slate-300">|</span>
                      <span>{`${selectedAd.completionRate} completion`}</span>
                    </div>
                    <div className="flex w-full gap-4 items-center justify-start px-1">
                      <span className="text-sm text-green-500 ">
                        {selectedAd.status}
                      </span>
                      <div className="flex justify-center items-center gap-1 text-xs text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="size-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{`${selectedAd.timeLimitinmins} mins`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons for smaller screen size */}
              <div className="sm:hidden bg-white w-full mx-auto fixed bottom-12 border-b border-slate-100">
                <div className="sm:hidden px-3 mx-auto w-4/5 flex justify-center items-center gap-4">
                  <button
                    onClick={() => {
                      setWannaSell(false);
                    }}
                    className="h-10 hover:bg-red-500 w-28 rounded-xl hover:scale-110 transition ease-in-out duration-300 text-md font-bold  text-white bg-slate-300"
                  >
                    Cancel
                  </button>

                  {/* Submit button */}
                  <button
                    onClick={(e) => {
                      handlep2pSell(e, selectedAd);
                    }}
                    className="h-10 w-full rounded-xl hover:scale-110 transition ease-in-out duration-300 text-md font-bold  text-white bg-red-500"
                  >
                    Sell {selectedAd.asset}
                  </button>
                </div>
              </div>

              {/* Buttons for larger screen size */}
              <div className="hidden sm:flex px-3 w-4/5 mx-auto sm:w-full justify-start items-center gap-4">
                <button
                  onClick={() => {
                    setWannaSell(false);
                  }}
                  className="h-10 hover:bg-red-500 w-28 rounded-xl hover:scale-110 transition ease-in-out duration-300 text-md font-bold  text-white bg-slate-300"
                >
                  Cancel
                </button>

                {/* Submit button */}
                <button
                  onClick={(e) => {
                    handlep2pSell(e, selectedAd);
                  }}
                  className="h-10 w-full rounded-xl hover:scale-110 transition ease-in-out duration-300 text-md font-bold  text-white bg-red-500"
                >
                  Sell{selectedAd.asset}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Merchantdata;
