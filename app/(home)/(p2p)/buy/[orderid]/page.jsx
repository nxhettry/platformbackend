"use client";
import UtilitybarDash from "@/components/dashboard/UtilitybarDash";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { useLoggedIn } from "@/components/AuthContext";
import { useRef } from "react";
import PaidConfirm from "@/components/p2p/PaidConfirm";
import { useToast } from "@/hooks/use-toast";
import ReleaseCrypto from "@/components/p2p/ConfirmRelase";
import Loading from "@/app/loading";

const Mainbuy = ({ params }) => {
  const { toast } = useToast();
  const { loggedIn, email } = useLoggedIn();
  const [messages, setMessages] = useState([]);
  const { orderid } = params;
  const { data: session, status } = useSession();
  const [time, setTime] = useState(3600);
  const form = useRef();
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [allMethods, setAllMethods] = useState([]);
  const [oneMethod, setOneMethod] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  //To get the order details
  useEffect(() => {
    setLoading(true);

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }

    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) return;

    //Funciton to fetch the order
    const fetchDetails = async (orderid) => {
      try {
        let data;

        const res = await fetch("http://localhost:8080/api/p2p/order/getThisOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderid, email: userEmail }),
        });

        data = await res.json();

        if (res.status === 200) {
          setOrderDetails(data.data[0]);
          setIsBuyer(data.isBuyer);
          setIsSeller(!data.isBuyer);
          setTime(data.data[0].timer * 60);
          setIsPaid(data.data[0].isPaid);
          setIsComplete(data.data[0].isComplete);
          setIsCancelled(data.data[0].isCancelled);
          setCancelReason(data.data[0].cancelReason);
          setAllMethods(
            data.data[0].orderdetails.paymentDetails[0].paymentMethod
          );
        } else {
          console.error(data.message); // Log the error message if not 200 status
        }

        setLoading(false);
      } catch (error) {
        console.error("An error occurred while fetching order details:", error);
      }
    };

    if (!isComplete) {
      setInterval(() => {
        fetchDetails(orderid);
      }, 7000);
    }
    return;
  }, [orderid, session, email, loggedIn, isComplete]);

  //This formats the timer countdown
  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [time]);

  // Function to handle the mark paid button
  const handleMarkpaid = async () => {
    const res = await fetch("http://localhost:8080/api/p2p/order/getOrderStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderid: orderDetails.orderid,
        status: "isPaid",
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      toast({
        title: "Order Marked as paid",
        description:
          "Please wait patiently for the seller to confirm and release the assets",
      });
      console.log(data);
    } else {
      toast({
        title: "Failed to mark order as paid",
        description: "Check the console for error",
      });
      console.error(data);
    }
  };

  // Function to handle the timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  //Function to send messages
  const sendMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const message = formData.get("message");

    if (!message) {
      alert("Please type a message");
    } else {
      alert("Message: " + message);
    }
  };

  // Function to set the payment method
  const setAMethod = (method) => {
    setOneMethod(method);
  };

  // Function to handle the cancel form
  const handleCancelForm = async (e) => {
    e.preventDefault();
    let finalReason = "";

    if (selectedReason === "Other") {
      if (!otherReason.trim()) {
        toast({ title: "Please specify a reason in the 'Other' field." });
        return; // Do not proceed if no input for 'Other'
      } else {
        finalReason = otherReason; // Use the 'Other' text
      }
    } else if (!selectedReason) {
      toast({ title: "Please select a reason for cancellation." });
      return;
    } else {
      finalReason = selectedReason; // Use the selected radio option
    }

    try {
      if (!orderDetails.orderid) return;

      const res = await fetch("http://localhost:8080/api/p2p/order/cancelP2POrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderDetails.orderid,
          reason: finalReason,
        }),
      });

      const data = await res.json();
      toast({
        title: data.message,
      });
    } catch (error) {
      console.log("An error occurred while cancelling order:", error);
    }
  };

  if (!session && !loggedIn) {
    return (
      <div className="h-full w-full flex justify-center items-center font-bold text-2xl">
        Please{" "}
        <Link href="/auth/login" className="text-mainColor">
          Login
        </Link>{" "}
        or{" "}
        <Link href="/auth/signup" className="text-mainColor">
          Signup
        </Link>{" "}
        first
      </div>
    );
  }

  // if (status === "loading" || loading) {
  //   return <Loading />;
  // }

  return (
    <div className="flex pb-12 sm:pb-0 mt-12 sm:mt-0 flex-col gap-4 justify-start items-start w-[90%]">
      <div className="text-xl sm:px-16 py-3 w-full flex justify-start sm:justify-between items-center">
        <div className="flex flex-col gap-2">
          <div
            className={`${
              isComplete && "hidden"
            } text-sm pl-4 sm:pl-0 flex flex-col sm:flex-row sm:gap-4 sm:text-xl`}
          >
            {" "}
            <span className="font-bold text-xl w-full">
              {isPaid ? "Confirming payment" : "Order created"}
            </span>
            {/* This is chat for mobile */}
            <div className="sm:hidden fixed top-0 left-0 h-full w-full">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Chat</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="fixed top-0 left-0 flex-col w-full h-full my-3 shadow-xl px-4 py-2 rounded-lg">
                    <div className="w-full h-full border px-2 rounded-lg border-slate-300">
                      {messages?.length > 0 &&
                        messages.map((msg, index) => (
                          <div
                            key={index}
                            className="w-full h-12 flex gap-3 justify-start items-center"
                          >
                            <div className="h-6 w-6 rounded-full bg-black flex justify-center items-center">
                              <span className="text-white">{msg.email[0]}</span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        ))}
                      {messages?.length === 0 && (
                        <div className="w-full h-12 flex justify-start items-center">
                          <p className="text-sm">No messages yet</p>
                        </div>
                      )}
                    </div>
                    <form>
                      <input type="text" placeholder="Type your message" />
                      <button type="submit">Send</button>
                    </form>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            <p className="flex w-full sm:justify-center items-center sm:text-sm">
              {" "}
              {isPaid ? (
                `You'll receive ${
                  orderDetails?.orderdetails?.asset
                } in ${formatTime(time)}`
              ) : (
                <>
                  {" "}
                  <span> Payment time</span>
                  <span className="text-md pl-3 font-bold">
                    {formatTime(time)}
                  </span>
                </>
              )}
            </p>
          </div>
          <p className="text-sm pl-3 sm:pl-0 flex text-slate-400">
            Order ID : {orderDetails?.orderid}
          </p>
        </div>
        <UtilitybarDash />
      </div>
      <div className="flex w-full justify-between sm:px-16 items-center">
        {/* Timeline for order info */}
        <div className="flex w-full sm:w-[50%] sm:justify-between items-start">
          <ol className="relative w-full border-s border-gray-200 dark:border-gray-700">
            {/* First item */}
            <li className="mb-7 ms-3 flex flex-col gap-1">
              <div className="hidden sm:flex absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm sm:text-lg font-bold leading-none text-black ">
                Order Details
              </time>
              <div className="flex flex-col sm:gap-1 w-full bg-slate-50 rounded-lg px-3 sm:p-3">
                <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                  <p className=" text-sm sm:text-lg">Fiat amount</p>
                  <p className=" text-sm sm:text-lg">
                    {orderDetails?.orderdetails?.currency === "NPR" && "रु"}{" "}
                    <span className="font-bold">
                      {orderDetails?.orderdetails?.fiatAmount}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                  <p className=" text-sm sm:text-lg">Price</p>
                  <p className=" text-sm sm:text-lg">
                    {orderDetails?.orderdetails?.currency === "NPR" && "रु"}{" "}
                    <span className="font-bold">
                      {orderDetails?.orderdetails?.price}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                  <p className=" text-sm sm:text-lg">Total</p>
                  <p className=" text-sm sm:text-lg">
                    <span className="font-bold">
                      {orderDetails?.orderdetails?.totalAsset.toFixed(2)}{" "}
                      {orderDetails?.orderdetails?.asset}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col justify-start items-start px-2 py-1 sm:p-2 w-full gap-4">
                  {isComplete && (
                    <>
                      <div className="text-lg flex flex-col gap-2 font-slate-400">
                        Payment method used:{" "}
                        {allMethods.map((method, index) => {
                          return (
                            <span key={index} className="text-sm font-bold">
                              - {method.method}
                            </span>
                          );
                        })}
                      </div>
                      <div className="text-lg flex justify-between items-center w-full font-slate-400">
                        <span>Creation Time :</span>{" "}
                        <span>
                          {new Date(orderDetails?.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </li>

            {/* Second item */}
            {!isPaid && (
              <li className="mb-7 ms-3 flex flex-col gap-1">
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1  text-sm sm:text-lg font-bold leading-none text-black ">
                  Pay {orderDetails?.orderdetails?.currency === "NPR" && "रु"}{" "}
                  {orderDetails?.orderdetails?.fiatAmount} using{" "}
                  {
                    <select
                      className="h-12 w-full sm:w-full mx-auto border rounded-xl px-2 py-2"
                      name="inputPaymentMethod"
                      id="inputPaymentMethod"
                      defaultValue=""
                      onChange={(e) => {
                        setAMethod(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Select payment method
                      </option>
                      {allMethods.map((method, index) => {
                        return (
                          <option key={index} value={method.method}>
                            {method.method}
                          </option>
                        );
                      })}
                    </select>
                  }
                </time>
                <div className="flex flex-col gap-1 w-full bg-slate-50 rounded-lg p-3">
                  {oneMethod === "esewa" && (
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const method = allMethods.find(
                          (method) => method.method === "esewa"
                        );
                        return method ? (
                          <>
                            <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                              <p className="text-sm sm:text-lg">
                                Payment Method
                              </p>
                              <p className="text-sm sm:text-lg">
                                {method.method}
                              </p>
                            </div>
                            {method.email && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Email Address
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.email}
                                </p>
                              </div>
                            )}
                            {method.phonenumber && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Phone number
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.phonenumber}
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {oneMethod === "khalti" && (
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const method = allMethods.find(
                          (method) => method.method === "khalti"
                        );
                        return method ? (
                          <>
                            <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                              <p className="text-sm sm:text-lg">
                                Payment Method
                              </p>
                              <p className="text-sm sm:text-lg">
                                {method.method}
                              </p>
                            </div>
                            {method.email && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Email Address
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.email}
                                </p>
                              </div>
                            )}
                            {method.phonenumber && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Phone number
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.phonenumber}
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {oneMethod === "banktransfer" && (
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const method = allMethods.find(
                          (method) => method.method === "banktransfer"
                        );
                        return method ? (
                          <>
                            <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                              <p className="text-sm sm:text-lg">
                                Payment Method
                              </p>
                              <p className="text-sm sm:text-lg">
                                {method.method}
                              </p>
                            </div>
                            {method.accname && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Account Name
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.accname}
                                </p>
                              </div>
                            )}
                            {method.accnumber && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Account Number
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.accnumber}
                                </p>
                              </div>
                            )}
                            {method.bankname && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">Bank Name</p>
                                <p className="text-sm sm:text-lg">
                                  {method.bankname}
                                </p>
                              </div>
                            )}
                            {method.branch && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">Branch</p>
                                <p className="text-sm sm:text-lg">
                                  {method.branch}
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {oneMethod === "paytm" && (
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const method = allMethods.find(
                          (method) => method.method === "paytm"
                        );
                        return method ? (
                          <>
                            <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                              <p className="text-sm sm:text-lg">
                                Payment Method
                              </p>
                              <p className="text-sm sm:text-lg">
                                {method.method}
                              </p>
                            </div>
                            {method.accnumber && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Account Number
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.accnumber}
                                </p>
                              </div>
                            )}
                            {method.phonenumber && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Phone Number
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.phonenumber}
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {oneMethod === "upi" && (
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const method = allMethods.find(
                          (method) => method.method === "upi"
                        );
                        return method ? (
                          <>
                            <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                              <p className="text-sm sm:text-lg">
                                Payment Method
                              </p>
                              <p className="text-sm sm:text-lg">
                                {method.method}
                              </p>
                            </div>
                            {method.phonenumber && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Phone Number
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.phonenumber}
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {oneMethod === "paypal" && (
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const method = allMethods.find(
                          (method) => method.method === "paypal"
                        );
                        return method ? (
                          <>
                            <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                              <p className="text-sm sm:text-lg">
                                Payment Method
                              </p>
                              <p className="text-sm sm:text-lg">
                                {method.method}
                              </p>
                            </div>
                            {method.email && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Email Address
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.email}
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}

                  {oneMethod === "stripe" && (
                    <div className="flex flex-col gap-1">
                      {(() => {
                        const method = allMethods.find(
                          (method) => method.method === "stripe"
                        );
                        return method ? (
                          <>
                            <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                              <p className="text-sm sm:text-lg">
                                Payment Method
                              </p>
                              <p className="text-sm sm:text-lg">
                                {method.method}
                              </p>
                            </div>
                            {method.email && (
                              <div className="flex justify-between items-center px-2 py-1 sm:p-2 w-full gap-8">
                                <p className="text-sm sm:text-lg">
                                  Email Address
                                </p>
                                <p className="text-sm sm:text-lg">
                                  {method.email}
                                </p>
                              </div>
                            )}
                          </>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              </li>
            )}

            {/* Third item */}
            <li className="ms-3 flex flex-col gap-1">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1  text-sm sm:text-lg font-bold leading-none text-black ">
                {isComplete
                  ? "Order Completed ✅"
                  : !isCancelled && "Transfer Completed ?"}
                {isCancelled && "Order Cancelled ❌"}
              </time>
              <div className="flex flex-col gap-3 sm:gap-8 justify-center items-start p-3 border rounded-lg">
                <p className="text-sm font-slate-400">
                  {isComplete
                    ? `Successfully ${
                        isBuyer ? "bought" : "sold"
                      } ${orderDetails?.orderdetails?.totalAsset.toFixed(2)}  ${
                        orderDetails?.orderdetails?.asset
                      }`
                    : isCancelled
                    ? `Reason For Cancellation : ${cancelReason}`
                    : "Please pay before clicking on the transferred button and wait for the seller to release crypto."}
                </p>
                <div className="flex justify-start gap-4 items-center">
                  {isComplete && (
                    <Link
                      href={`/${isBuyer ? "buy" : "sell"}`}
                      className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer"
                    >
                      {isBuyer ? "Buy Again" : "Sell Again"}
                    </Link>
                  )}
                  {isCancelled && (
                    <Link
                      href={`/${isBuyer ? "buy" : "sell"}`}
                      className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer"
                    >
                      ← go back
                    </Link>
                  )}
                  {isBuyer &&
                    !isComplete &&
                    !isCancelled &&
                    (isPaid ? (
                      <button
                        onClick={() => alert("Notify Seller button clicked")}
                        className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer"
                      >
                        Alert Seller
                      </button>
                    ) : (
                      <PaidConfirm handleMarkpaid={handleMarkpaid} />
                    ))}
                  {isSeller &&
                    !isComplete &&
                    (isPaid ? (
                      <ReleaseCrypto releaseCrypto={releaseCrypto} />
                    ) : (
                      <button className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer">
                        Waiting for buyer to transfer
                      </button>
                    ))}

                  {/* Toggle cancel drawer */}
                  {isBuyer && !isComplete && !isCancelled && (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <button className="w-2/5 ml-8 h-10 sm:h-12 font-bold text-red-500 hover:text-orange-400 text-sm sm:text-lg flex justify-center items-center cursor-pointer">
                          Cancel Order
                        </button>
                      </DrawerTrigger>
                      <DrawerContent
                        style={{
                          height: "70vh",
                          width: "98vw",
                          margin: "0 auto",
                        }}
                      >
                        <div className="flex flex-col gap-4 w-full h-full bg-white rounded-lg p-4">
                          <h2 className="text-center w-full text-base sm:text-lg font-bold">
                            Reason for Cancellation
                          </h2>

                          {/* Input form inside drawer */}
                          <div className="flex w-4/5 sm:w-3/5 mx-auto flex-col space-y-4">
                            {/* Reason radio buttons */}
                            <div className="flex flex-col space-y-3">
                              <h1 className="text-base font-bold">
                                Select a reason
                              </h1>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="reason"
                                  onChange={(e) =>
                                    setSelectedReason(e.target.value)
                                  }
                                  value="Price too high"
                                  className="form-radio"
                                  checked={selectedReason === "Price too high"}
                                />
                                <span>Price too high</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="reason"
                                  onChange={(e) =>
                                    setSelectedReason(e.target.value)
                                  }
                                  value="Payment issues"
                                  className="form-radio"
                                  checked={selectedReason === "Payment issues"}
                                />
                                <span>Payment issues</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="reason"
                                  onChange={(e) =>
                                    setSelectedReason(e.target.value)
                                  }
                                  value="Found better offer"
                                  className="form-radio"
                                  checked={
                                    selectedReason === "Found better offer"
                                  }
                                />
                                <span>Found better offer</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="reason"
                                  onChange={(e) =>
                                    setSelectedReason(e.target.value)
                                  }
                                  value="Transaction taking too long"
                                  className="form-radio"
                                  checked={
                                    selectedReason ===
                                    "Transaction taking too long"
                                  }
                                />
                                <span>Transaction taking too long</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="reason"
                                  value="Other"
                                  onChange={() => setSelectedReason("Other")}
                                  className="form-radio"
                                  checked={selectedReason === "Other"}
                                />
                                <span>Other</span>
                              </label>

                              {/* Other input text box */}
                              {selectedReason === "Other" && (
                                <textarea
                                  className="border border-gray-300 rounded-md p-2 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  name="otherReason"
                                  value={otherReason}
                                  onChange={(e) =>
                                    setOtherReason(e.target.value)
                                  }
                                  placeholder="Please specify if 'Other'"
                                  rows="3"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <DrawerFooter>
                          <DrawerClose asChild>
                            <button
                              onClick={handleCancelForm}
                              className="bg-mainColor h-12 w-3/5 mx-auto text-white p-3 rounded-md hover:bg-orange-600 transition duration-300"
                            >
                              Submit
                            </button>
                          </DrawerClose>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  )}
                </div>
              </div>
            </li>
          </ol>
        </div>

        {/* Chat box is created here */}
        <div className="hidden sm:flex flex-col  w-[35%] h-full my-3 shadow-xl px-4 py-2  rounded-lg">
          <div className="w-full h-full border px-2 rounded-lg border-slate-300">
            {messages.length > 0 &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className="w-full h-12 flex gap-3 justify-start items-center"
                >
                  <div className="h-6 w-6 rounded-full bg-black flex justify-center items-center">
                    <span className="text-white">{msg.email[0]}</span>
                  </div>
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            {messages.length === 0 && (
              <div className="w-full h-12 flex justify-start items-center">
                <p className="text-sm">No messages yet</p>
              </div>
            )}
          </div>
          <form ref={form} onSubmit={sendMessage}>
            <input type="text" name="message" placeholder="Type your message" />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Mainbuy;
