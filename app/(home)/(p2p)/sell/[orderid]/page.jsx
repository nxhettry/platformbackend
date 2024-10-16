"use client";
import UtilitybarDash from "@/components/dashboard/UtilitybarDash";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "@/components/AuthContext";
import { DrawerDemo } from "@/components/mobileView/p2p/P2pchat";
import ReleaseCrypto from "@/components/p2p/ConfirmRelase";
import { useToast } from "@/hooks/use-toast";

const Mainsell = ({ params }) => {
  const { toast } = useToast();
  const { loggedIn, email } = useLoggedIn();
  const [messages, setMessages] = useState([]);
  const { orderid } = params;
  const { data: session } = useSession();
  const [createdTime, setCreatedTime] = useState();
  const [orderTime, setOrderTime] = useState();
  const [timer, setTimer] = useState(3600);
  const [orderDetails, setOrderDetails] = useState({});
  const [isBuyer, setIsBuyer] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [allMethods, setAllMethods] = useState([]);
  const router = useRouter();

  // To get the order details
  useEffect(() => {
    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }

    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) return;

    const fetchDetails = async (orderid) => {
      try {
        const res = await fetch(
          "https://binaryp2p.sytes.net/api/p2p/order/getThisOrder",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderid, email: userEmail }),
          }
        );

        const data = await res.json();

        if (res.status === 200) {
          setOrderDetails(data.data[0]);
          setIsBuyer(data.isBuyer);
          setIsSeller(!data.isBuyer);
          setOrderTime(data.data[0].timer * 60);
          setCreatedTime(new Date(data.data[0].createdAt));
          setIsPaid(data.data[0].isPaid);
          setIsComplete(data.data[0].isComplete);
          setIsCancelled(data.data[0].isCancelled);
          setCancelReason(data.data[0].cancelReason);
          setAllMethods(
            data.data[0].orderdetails.paymentDetails[0].paymentMethod
          );
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching order details:", error);
      }
    };

    const interval = setInterval(() => {
      if (!isComplete) {
        fetchDetails(orderid);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    fetchDetails(orderid);

    return () => clearInterval(interval);
  }, [orderid, session, email, loggedIn, isComplete]);

  // This sets the timer countdown
  useEffect(() => {
    if (!createdTime || !orderTime) return; // Ensure both are defined

    const countdown = setInterval(() => {
      const currentTime = new Date();
      const timeDiff = Math.floor((currentTime - createdTime) / 1000);
      const newTimer = orderTime - timeDiff;

      if (newTimer <= 0) {
        clearInterval(countdown);
        setTimer(0);
        toast({ title: "Order has expired" });
      } else {
        setTimer(newTimer);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [orderTime, createdTime]);

  // Function to handle the mark paid button
  const handleMarkpaid = async () => {
    const confirmation = confirm("Are you sure you want to mark as paid ?");
    if (!confirmation) return;

    if (confirmation) {
      const res = await fetch("/api/p2p/orderStatus", {
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

      if (data.status === 200) {
        alert("Order marked as paid");
        console.log(data);
      } else {
        alert("Failed to mark order as paid: " + data.message);
        console.error(data);
      }
    }
  };

  // Function to handle the release crypto button
  const releaseCrypto = async () => {
    const res = await fetch("/api/p2p/releaseCrypto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderid: orderDetails.orderid,
        status: "isComplete",
      }),
    });

    const data = await res.json();

    if (data.status === 200) {
      toast({
        title: "Crypto released successfully",
        description: "Thank you for trading !",
      });
      console.log(data);
      router.push("/buy");
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

  return (
    <div className="flex pb-12 sm:pb-0 mt-12 sm:mt-0 flex-col gap-4 justify-start items-start w-[90%]">
      <div className="text-xl sm:px-16 py-3 w-full flex justify-start sm:justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="text-sm pl-4 sm:pl-0 flex flex-col sm:flex-row sm:gap-4 sm:text-xl">
            <span className="font-bold text-xl w-full">
              {isPaid ? "Confirming payment" : "Order created"}
            </span>
            <div className="sm:hidden fixed left-[70%] top-16">
              <DrawerDemo />
            </div>
            <p className="flex w-full sm:justify-center items-center sm:text-sm">
              {" "}
              {isPaid ? (
                `${isBuyer ? "You'll receive" : "Please release"} ${
                  orderDetails?.orderdetails?.asset
                } in ${formatTime(timer)}`
              ) : (
                <>
                  {" "}
                  <span> Payment time</span>
                  <span className="text-md pl-3 font-bold">
                    {formatTime(timer)}
                  </span>
                </>
              )}
            </p>
          </div>
          <p className="text-sm hidden sm:flex text-slate-400">
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

            {/* No second item in the seller side */}

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
                      } ${orderDetails?.orderdetails?.totalAsset.toFixed(2)} ${
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
                      <button
                        onClick={handleMarkpaid}
                        className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer"
                      >
                        I&apos;ve Transferred the amount
                      </button>
                    ))}
                  {isSeller &&
                    !isComplete &&
                    !isCancelled &&
                    (isPaid ? (
                      <ReleaseCrypto releaseCrypto={releaseCrypto} />
                    ) : (
                      <button className="w-full h-10 sm:h-12 rounded-lg px-2 bg-mainColor text-black  text-sm sm:text-lg flex justify-center items-center cursor-pointer">
                        Waiting for buyer to transfer
                      </button>
                    ))}
                </div>
              </div>
            </li>
          </ol>
        </div>

        {/* Chat box is created here */}
        <div className="hidden sm:flex flex-col  w-[35%] h-full my-3 shadow-xl px-4 py-2  rounded-lg">
          <div className="w-full h-full border rounded-lg border-slate-300">
            {messages.length > 0 &&
              messages.map((msg, index) => (
                <div
                  key={index}
                  className="w-full h-12 flex justify-start items-center"
                >
                  <p className="text-sm">{msg}</p>
                </div>
              ))}
            {messages.length === 0 && (
              <div className="w-full h-12 flex justify-start items-center">
                <p className="text-sm">No messages yet</p>
              </div>
            )}
          </div>
          <form>
            <input type="text" name="message" placeholder="Type your message" />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Mainsell;
