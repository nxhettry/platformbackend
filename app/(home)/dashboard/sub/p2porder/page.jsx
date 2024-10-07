"use client";
import Utilitybar from "@/components/p2p/UtilitybarUser";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Loading from "@/app/loading";

const Orders = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const { loggedIn, email } = useLoggedIn();
  const { data: session, status } = useSession();
  const [mainData, setMainData] = useState([]); //This is to store the orders during initial load for default view
  const [p2porders, setP2porders] = useState([]); //This is to modify the data based on the user's selection
  const timeoutRef = React.useRef();
  const [isOngoing, setIsOngoing] = useState(false);
  const [isFulfilled, setIsFulfilled] = useState(false);
  const [isAll, setIsAll] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const moreRef = React.useRef();
  const [showDropdown, setShowDropdown] = useState(false); //More Dropdown

  // Filter functions for each button
  const handleOngoing = () => {
    setIsOngoing(true);
    setIsFulfilled(false);
    setIsCompleted(false);
    setIsCancelled(false);
    setIsAll(false);
    // Make sure mainData is an array before filtering
    if (Array.isArray(mainData)) {
      const ongoingOrders = mainData.filter(
        (item) => !item.isComplete && !item.isCancelled
      );
      setP2porders(ongoingOrders);
    }
  };

  const handleFulfilled = () => {
    setIsOngoing(false);
    setIsFulfilled(true);
    setIsCompleted(false);
    setIsCancelled(false);
    setIsAll(false);
    if (Array.isArray(mainData)) {
      const fulfilledOrders = mainData.filter(
        (item) => item.isComplete && !item.isCancelled
      );
      setP2porders(fulfilledOrders);
    }
  };

  const handleAll = () => {
    setIsOngoing(false);
    setIsFulfilled(false);
    setIsCompleted(false);
    setIsCancelled(false);
    setIsAll(true);
    if (Array.isArray(mainData)) {
      setP2porders(mainData); // Show all orders
    }
  };

  const handleComplete = () => {
    setIsOngoing(false);
    setIsFulfilled(false);
    setIsCompleted(true);
    setIsCancelled(false);
    setIsAll(false);
    if (Array.isArray(mainData)) {
      const completedOrders = mainData.filter((item) => item.isComplete);
      setP2porders(completedOrders);
    }
  };

  const handleCancelled = () => {
    setIsOngoing(false);
    setIsFulfilled(false);
    setIsCompleted(false);
    setIsCancelled(true);
    setIsAll(false);
    if (Array.isArray(mainData)) {
      const cancelledOrders = mainData.filter((item) => item.isCancelled);
      setP2porders(cancelledOrders);
    }
  };

  const handleMouseEnterMore = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeaveMore = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(false), 2000);
  };
  const handleDropdownClick = () => {
    setShowDropdown(true);
  };
  const handleDropdownItemClick = () => {
    setShowDropdown(false);
  };

  //Getting live Orders from the server
  useEffect(() => {
    let userEmail;

    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }
    if (!userEmail) return;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/p2p/getOrders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await res.json();

        if (data.status === 200) {
          setMainData(data.data);
          setP2porders(data.data);
          setUserId(data.userId);
        } else {
          console.log("Cannot get orders at the moment");
        }
      } catch (error) {
        console.log("Cannot get orders at the moment");
      }
    };

    fetchData();
  }, [session, loggedIn, email]);

  //Checking User Authentication
  if (!loggedIn && status === "unauthenticated")
    return (
      <div className="flex justify-center items-center h-full w-full text-2xl font-bold gap-3">
        Please{" "}
        <Link href="/auth/login" className="text-mainColor cursor-pointer">
          login
        </Link>{" "}
        or{" "}
        <Link href="/auth/signup" className="text-mainColor cursor-pointer">
          Signup
        </Link>{" "}
        to view this page
      </div>
    );
  if (status === "loading"){
    return (
        <Loading />
    );
  }

  const handleClick = (order) => () => {
    const orderid = order.orderid;

    if (order.buyer.toString().toLowerCase() === userId.toLowerCase()) {
      router.push(`/buy/${orderid}`);
    }
    if (order.seller.toString().toLowerCase() === userId.toLowerCase()) {
      router.push(`/sell/${orderid}`);
    }
  };

  return (
    <div className="w-full mt-12 pb-16 sm:pb-0 sm:mt-0 sm:w-[90%] mx-auto flex flex-col">
      {/* This is the orders table for mobile screen */}

      {/* Headings */}
      <div className="sm:hidden flex gap-3 pl-4 pr-8 flex-col gap-x-32 w-full justify-start">
        {/* Top section  */}
        <div className="sm:hidden w-full flex justify-between items-center">
          {/* Title */}
          <h1 className="text-lg font-bold text-center">Order History</h1>

          {/* More icon */}
          <div
            className="sm:hidden pt-2 h-8 relative"
            onMouseEnter={handleMouseEnterMore}
            onMouseLeave={handleMouseLeaveMore}
            ref={moreRef}
          >
            {/* The more button */}
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  className="justify-center items-center h-8 text-slate-500 flex hover:text-mainColor"
                  onClick={handleDropdownClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-slate-900 size-4 sm:size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-3-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm7 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="text-sm text-black font-bold sm:text-md">
                    More
                  </span>
                </button>
              </DrawerTrigger>
              <DrawerContent
                style={{ width: "98%", height: "40%", margin: "0 auto" }}
              >
                <div className="mx-auto w-full max-w-sm">
                  {/* Main body part */}
                  <ul className="py-1 pt-8 h-full flex flex-col gap-3 justify-around items-center">
                    <li>
                      <Link
                        href={"/usercenter"}
                        className="sm:hidden h-8 justify-center items-center text-slate-500 flex gap-2 hover:text-mainColor"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="text-slate-900 size-4 sm:size-5"
                        >
                          <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
                        </svg>

                        <span className="text-md font-bold sm:text-md">
                          P2P User Center
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 text-md font-bold text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleDropdownItemClick}
                      >
                        Payment Methods
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/usercenter/ad/postad"
                        className="block px-4 py-2 text-md font-bold text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleDropdownItemClick}
                      >
                        Post new Ad
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/usercenter/ad/myad"
                        className="block px-4 py-2 text-md font-bold text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleDropdownItemClick}
                      >
                        My Ads
                      </Link>
                    </li>
                  </ul>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* second section */}
        <div className="sm:hidden font-bold text-xs w-full flex justify-start gap-4 items-center">
          <button
            onClick={handleOngoing}
            className={`rounded-lg p-1 px-2 ${
              isOngoing ? "bg-gray-400 text-white" : "bg-gray-50"
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={handleFulfilled}
            className={`rounded-lg p-1 px-2 ${
              isFulfilled ? "bg-gray-400 text-white" : "bg-gray-50"
            }`}
          >
            Fulfilled
          </button>
        </div>

        {/* Third section */}
        <div className="sm:hidden font-bold text-xs w-full flex justify-start gap-4 items-center">
          <button
            onClick={handleAll}
            className={`rounded-lg p-1 px-2 ${
              isAll ? "bg-gray-400 text-white" : "bg-gray-50"
            }`}
          >
            All
          </button>
          <button
            onClick={handleComplete}
            className={`rounded-lg p-1 px-2 ${
              isCompleted ? "bg-gray-400 text-white" : "bg-gray-50"
            }`}
          >
            Completed
          </button>
          <button onClick={handleCancelled}>Cancelled</button>
        </div>
      </div>

      {/* Table */}
      <div className="sm:hidden flex flex-col w-full mt-4 gap-2 justify-start">
        {/* One order full */}
        {p2porders?.length > 0 ? (
          p2porders
            .slice() // Create a shallow copy to avoid mutating the original array
            .reverse() // Reverse the order of the array
            .map((order) => (
              <div
                key={order.orderid}
                onClick={handleClick(order)}
                className="px-4 flex border-b pb-3 w-full justify-between items-start"
              >
                {/* leftpart of a order  */}
                <div className="flex flex-col w-full gap-2">
                  {/* Buy or sell */}
                  <h1 className="text-sm font-semibold">
                    <span
                      className={`${
                        order.buyer.toString().toLowerCase() ===
                          userId.toLowerCase() && "text-green-500"
                      }
                            ${
                              order.seller.toString().toLowerCase() ===
                                userId.toLowerCase() && "text-red-500"
                            }`}
                    >
                      {order.buyer.toString().toLowerCase() ===
                        userId.toLowerCase() && "Buy"}
                      {order.seller.toString().toLowerCase() ===
                        userId.toLowerCase() && "Sell"}
                    </span>{" "}
                    USDT
                  </h1>

                  <p className="text-slate-400 text-xs">Amount</p>
                  <p className="text-slate-400 text-xs">Price</p>
                  <p className="text-slate-400 text-xs">Quantity</p>
                  <p className="text-slate-400 text-xs">OrderId</p>
                  <h1 className="text-xs text-slate-400">Created at</h1>
                </div>

                {/* right part of an order */}
                <div className="flex flex-col w-full gap-2 text-end">
                  {/* Order status */}
                  <h1
                    className={`text-sm ${
                      order.isCancelled
                        ? "text-red-500"
                        : order.isComplete
                        ? "text-green-500"
                        : order.isPaid
                        ? "text-orange-400"
                        : "text-slate-500"
                    } font-semibold`}
                  >
                    {order.isCancelled
                      ? "Cancelled"
                      : order.isComplete
                      ? "Completed"
                      : order.isPaid
                      ? "Paid"
                      : "Pending"}
                  </h1>

                  {/* Amount */}
                  <p className="text-slate-400 text-xs">
                    {order?.orderdetails?.currency === "NPR"
                      ? "रु."
                      : order.orderdetails.currency}{" "}
                    <span className="text-black">
                      {order?.orderdetails?.fiatAmount?.toFixed(2)}
                    </span>
                  </p>

                  {/* Price */}
                  <p className="text-black text-xs">
                    {order.orderdetails.price.toFixed(2)}
                  </p>

                  {/* Quantity */}
                  <p className="text-black text-xs">
                    {order?.orderdetails?.totalAsset?.toFixed(2)}
                  </p>

                  {/* OrderId */}
                  <div className="text-slate-400 flex justify-center items-center gap-2 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                    >
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                    </svg>
                    {order.orderid
                      ? `${order.orderid.substring(
                          0,
                          Math.ceil(order.orderid.length / 2)
                        )}...`
                      : ""}
                  </div>

                  {/* Creation */}
                  <h1 className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      }
                    )}
                  </h1>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center">No orders found </div>
        )}
      </div>

      {/* This is the order table for larger screens */}

      {/* Headings */}
      <div className="hidden sm:flex flex-col sm:flex-row w-full justify-between items-center">
        <h1 className="text-lg sm:text-2xl w-32 font-bold text-center">
          Orders
        </h1>
        <Utilitybar />
      </div>

      {/* Table */}
      <div className="hidden w-full sm:flex justify-center items-center">
        <div className="w-full">
          <div className="w-full flex justify-center items-center">
            <div className="bg-slate-100 w-full flex justify-between items-center px-12 py-2 text-xs sm:text-sm text-slate-400">
              <p>
                Ad Number <br />
                Type <br />
                Assets/Fiat
              </p>
              <p className="pl-10">Total Amount</p>
              <p className="pl-16clear">Price</p>
              <p>Payment Methods</p>
              <p>Time Limit</p>
              <p>Status</p>
            </div>
          </div>
          <div>
            {p2porders?.length > 0 ? (
              p2porders
                .slice() // Create a shallow copy to avoid mutating the original array
                .reverse() // Reverse the order of the array
                .map((order) => (
                  <div
                    key={order.orderid}
                    onClick={handleClick(order)}
                    style={{
                      paddingTop: "3px",
                      borderTop: "1px solid #cbd5e1",
                      borderBottom: "1px solid #cbd5e1",
                    }}
                    className="hover:bg-slate-100 w-full py-2 text-xs sm:text-sm text-slate-400 flex justify-between items-center gap-[3rem] px-8"
                  >
                    <div className="flex justify-center items-center gap-4">
                      {/* Order ID */}
                      <div className="py-2">
                        <div className="flex flex-col gap-2">
                          <p className="text-xs font-bold">{order.orderid}</p>
                          <p className="text-sm text-slate-700">
                            {order.buyer.toString().toLowerCase() ===
                              userId.toLowerCase() && "Buy"}
                            {order.seller.toString().toLowerCase() ===
                              userId.toLowerCase() && "Sell"}
                          </p>
                          <p className="text-sm text-slate-700">{`${order.orderdetails.currency} / ${order.orderdetails.asset}`}</p>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="px-4 py-2 h-full flex justify-start items-start">
                        <div className="flex h-full w-20 flex-col gap-2">
                          <p className="text-base font-bold">
                            {order?.orderdetails?.totalAsset?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="pl-28 py-2 h-full text-black flex justify-start items-start">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-bold">
                          {order.orderdetails.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="pl-12 py-2">
                      <div className="h-full flex flex-col justify-start items-start">
                        <div className="flex gap-2 justify-start items-center">
                          {order?.orderdetails?.paymentDetails[0]?.paymentMethod.map(
                            (method, index) => (
                              <>
                                <div className={`h-3 w-1 bg-green-400`}></div>

                                <span
                                  key={index}
                                  className="text-sm text-slate-700"
                                >
                                  {method.method}
                                </span>
                              </>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Time Limit */}
                    <div className="pl-32 py-2 h-full flex justify-start items-start">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-slate-700">
                          {order.timer} minutes
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="px-4 pl-20 py-2 h-full flex justify-start items-start">
                      <div className="flex flex-col gap-2">
                        <p
                          className={`${
                            order.isCancelled
                              ? "text-red-500"
                              : order.isComplete
                              ? "text-green-500"
                              : order.isPaid
                              ? "text-orange-400"
                              : "text-slate-500"
                          }`}
                        >
                          {order.isCancelled
                            ? "Cancelled"
                            : order.isComplete
                            ? "Completed"
                            : order.isPaid
                            ? "Paid"
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center">No orders found </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
