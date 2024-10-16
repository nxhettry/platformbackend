"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UtilitybarUser from "@/components/p2p/UtilitybarUser";
import Loading from "@/app/loading";
import Userfeatures from "@/components/p2p/Userfeatures";
import Addpayment from "@/components/p2p/Addpayment";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Usercenter = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { loggedIn, email } = useLoggedIn();
  const [newUserName, setNewUserName] = useState("Mahakaal");
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState("P2P trader");
  const [totalTrade, setTotalTrade] = useState();
  const [totalCompleted, setTotalCompleted] = useState();
  const [rating, setRating] = useState("100%");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isAddPayment, setIsAddPayment] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  //To fetch the payment method and details of a user
  useEffect(() => {
    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    //Checking if the email is caught by the system
    if (!userEmail) {
      return;
    }

    //Fetching the payment methods
    const fetchPaymentMethods = async (userEmail) => {
      try {
        const res = await fetch("http://localhost:8080/api/usercenter/payment/getAll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await res.json();

        if (res.status === 200) {
          setPaymentMethods(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPaymentMethods(userEmail);

    //Fetching the user Info

    const fetchUserInfo = async (userEmail) => {
      try {
        const res = await fetch("http://localhost:8080/api/usercenter/getUserInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await res.json();
        if (res.status === 200) {
          setUserName(data.data.username);
          setTotalTrade(data.data.totalOrders);
          let completeVar =
            (data.data.totalCompletedOrders / data.data.totalOrders) * 100;
          if (isNaN(completeVar)) {
            completeVar = 0;
          }
          setTotalCompleted(completeVar);
          return;
        }

        toast({ title: "Error", description: data.message });
      } catch (error) {
        console.clear();
        console.log(error);
      }
    };
    fetchUserInfo(userEmail);
  }, [session, loggedIn, isAddPayment, email, toast]);

  useEffect(() => {
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }
  }, [session, loggedIn, router, status]);

  //Function to change the username
  const changeUsername = async () => {
    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please refresh the page or Login again",
      });
      return;
    }

    setShowUpdateForm(false);
    toast({ title: newUserName });

    try {
      const res = await fetch("http://localhost:8080/api/usercenter/updateUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          username: newUserName,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setUserName(data.data.username);
        toast({ title: data.message });
        return;
      }

      toast({ title: "Error", description: data.message });
    } catch (error) {
      console.log(error);
    }
  };

  const userFeatures = ({ title, value }) => {
    return (
      <div className="flex flex-col justify-center  sm:gap-4 items-center h-3/5 w-44 hover:bg-slate-100 rounded-xl">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-sm sm:text-xl font-bold">{value}</div>
      </div>
    );
  };

  if (status === "loading"){
    return (
        <Loading />
    );
  }

  return (
    <div className="mt-12 pb-12 sm:pb-0 sm:mt-0 h-screen w-[95%] md:w-4/5 mx-auto">
      <UtilitybarUser />
      <div className="rounded-xl flex flex-col gap-8 w-full sm:h-full">
        <div className="flex flex-col justify-between h-48 md:h-80 p-0 md:p-4 w-full rounded-xl border shadow-xl hover:shadow-2xl transition-shadow ease-in-out duration-300">
          <div className="flex gap-3 sm:gap-0 flex-col md:flex-row h-[35%] md:h-[45%] border-b w-full justify-start md:justify-between items-center pb-2">
            {/* username section */}
            <div className="flex justify-center items-center gap-0 md:gap-4 md:h-full">
              {/* Avatar */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 h-16 sm:h-20 text-slate-400 w-20 rounded-full"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                  clipRule="evenodd"
                />
              </svg>

              {/* Name and features */}
              <div className="flex pt-2 sm:pt-0 flex-col justify-center items-start ml-4">
                {/* Name and avatar */}
                <div className="flex gap-4 justify-center items-center">
                  <h2 className="text-xl font-bold">{userName}</h2>

                  {/* PopUp for changing the username */}

                  <Dialog
                    open={showUpdateForm}
                    onOpenChange={setShowUpdateForm}
                  >
                    <DialogTrigger asChild>
                      <button>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="size-5 hover:text-mainColor"
                        >
                          <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                        </svg>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Username</DialogTitle>
                        <DialogDescription>
                          What would you like to change your username to?
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="flex justify-center items-center">
                          <input
                            id="username"
                            value={newUserName}
                            onChange={(e) => setNewUserName(e.target.value)}
                            className="h-12 w-full border rounded-lg px-4"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <button
                          onClick={changeUsername}
                          className="p-2 rounded-lg bg-mainColor sm:hover:scale-110 transition-transform ease-in-out duration-300"
                        >
                          Update
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Sms, kyc and email veritication status */}
                <div className="flex justify-center items-center gap-3">
                  <Userfeatures text="Email" color="green-500" />
                  <Userfeatures text="SMS" color="green-500" />
                  <Userfeatures text="KYC" color="green-500" />
                </div>
              </div>
            </div>

            {/* main buttons */}
            <div className=" w-full flex gap-4 md:gap-3 justify-center items-center">
              <Link
                className="px-2 md:px-5 py-2 text-sm md:text-lg bg-mainColor hover:bg-orange-300 rounded-xl"
                href="/usercenter/ad/postad"
              >
                Post AD
              </Link>
              <Link
                className="px-2 md:px-5 py-2 text-sm md:text-lg bg-slate-100 hover:bg-slate-200 rounded-xl"
                href="/usercenter/ad/myad"
              >
                My Ads
              </Link>
              <Link
                className="px-2 md:px-5 py-2 text-sm md:text-lg border bg-white hover:bg-slate-200 rounded-xl"
                href="#"
              >
                Become a merchant
              </Link>
            </div>
          </div>

          {/* user features */}
          <div className="flex sm:pb-0 pb-4 h-[30%] md:h-[55%] justify-center md:justify-start gap-0 md:gap-8 items-center w-full">
            {userFeatures({
              title: "Total Trades",
              value: `${totalTrade} Orders`,
            })}
            {userFeatures({
              title: "Completion Rate",
              value: `${totalCompleted}%`,
            })}
            {userFeatures({ title: "Rating", value: rating })}
          </div>
        </div>

        {/* payment methods */}
        <div
          id="paymentmethod"
          className="flex flex-col gap-2 h-full w-full p-4 rounded-xl border shadow-xl hover:shadow-2xl transition-shadow ease-in-out duration-300"
        >
          <div className="flex w-full justify-between items-center sm:px-4">
            <span className="text-sm md:text-xl font-semibold md:font-bold">
              Payment Methods
            </span>
            <Addpayment
              isAddPayment={isAddPayment}
              setIsAddPayment={setIsAddPayment}
            />
          </div>

          <div className="flex flex-col mt-4 gap-3 w-full">
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="mb-2 p-2 border rounded-lg shadow-sm"
                >
                  <h2 className="font-semibold">{method.method}</h2>
                  {Object.keys(method).map((key) =>
                    key !== "method" ? (
                      <div key={key} className="text-sm">
                        <span className="font-medium">{key}:</span>{" "}
                        {method[key]}
                      </div>
                    ) : null
                  )}
                </div>
              ))
            ) : (
              <p className="text-center">No payment methods added.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usercenter;
