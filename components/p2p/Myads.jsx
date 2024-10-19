"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "../AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";

const Myads = () => {
  const { toast } = useToast();
  const { loggedIn, email } = useLoggedIn();
  const { data: session, status } = useSession();
  const [myAds, setMyAds] = useState([]);
  const [showAction, setShowAction] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //to fetch ads from the database
  useEffect(() => {
    async function fetchData() {
      try {
        if (!session && !loggedIn) {
          return;
        }
        let userEmail;
        if (session) {
          userEmail = session.user.email;
        }
        if (loggedIn) {
          userEmail = email;
        }
        if (!userEmail) {
          toast({ title: "Could not catch email" });
        }
        const res = await fetch(
          `https://binaryp2psytes.net/api/p2p/ad/getallad/myads?email=${encodeURIComponent(
            userEmail
          )}`
        );
        const data = await res.json();
        setMyAds(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [session, email, loggedIn, toast]);

  const handleDeleteAd = async (adId) => {
    if (!adId) return;

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) return;

    const res = await fetch("https://binaryp2psytes.net/api/p2p/ad/updatead/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adId, email: userEmail }),
    });

    const data = res.json();

    if(res.status === 200) {
      router.refresh();
      toast({ title: "Ad deleted" });
      return;
    }

    toast({title: data.message});
  };

  const handleEditAd = async (adId) => {
    if (!adId) return;

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) return;

    const newPrice = prompt("Enter new price");

    if (!newPrice || isNaN(newPrice) || newPrice < 0) {
      toast({ title: "Invalid price" });
      return;
    }

    const res = await fetch("https://binaryp2psytes.net/api/p2p/ad/updatead/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adId, email: userEmail, newPrice }),
    });

    const data = res.json();

    if(res.status === 200) {
      router.refresh();
      toast({ title: "Ad updated" });
      return;
    }

    toast({title: data.message});

  };

  const changeStatus = async (adId) => {
    if (!adId) return;

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    if (!userEmail) return;

    const res = await fetch ("https://binaryp2psytes.net/api/p2p/ad/updatead/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adId, email: userEmail }),
    });

    const data = res.json();

    if(res.status === 200) {
      router.refresh();
      toast({ title: "Ad status updated" });
      return;
    }

    toast({title: data.message});

  }

  useEffect(() => {
    if (status === "authenticated" || loggedIn) {
      setLoading(false);
    }
    if (status === "loading") return; // Avoids redirection during initial loading
    if (status === "unauthenticated" && !loggedIn) {
      toast({ title: "Please login first" });
      router.push("/auth/login");
    }
  }, [status, loggedIn, router, toast]);

  if (status === "loading" || loading) {
    return <Loading />;
  }

  if (myAds?.data?.length > 0) {
    return (
      <>
        {myAds.data.map((adGroup) =>
          adGroup?.ads?.map((ad, index) => (
            <div
              onMouseEnter={() => setShowAction(true)}
              onMouseLeave={() => setShowAction(false)}
              key={adGroup.id + index}
              style={{
                paddingTop: "3px",
                borderTop: "1px solid #cbd5e1",
                borderBottom: "1px solid #cbd5e1",
              }}
              className="hover:bg-slate-100 w-full py-2 text-sm text-slate-400 flex justify-between items-center  px-8"
            >
              {/* Ad ID */}
              <div className=" py-2">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold">{adGroup.id}</p>
                  <p className="text-sm text-slate-700">{ad.type}</p>
                  <p className="text-sm text-slate-700">{`${ad.currency} / ${ad.asset}`}</p>
                </div>
              </div>

              {/* Amount */}
              <div className="px-2 py-2 h-full w-auto flex justify-start items-start">
                <div className="flex h-full w-20 flex-col gap-2">
                  <p className="text-base font-bold">{ad.amount}</p>
                  <p className="text-sm text-slate-700">{ad.orders}</p>
                  <p className="text-sm text-slate-700">{ad.orderLimit}</p>
                </div>
              </div>
              {/* </div> */}

              {/* Price */}
              <div className="pl-2 py-2 h-full text-black flex justify-start items-start">
                <div className="flex flex-col gap-2">
                  <p className="text-base font-bold">{ad.price}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pl-8 py-2">
                <div className="h-full flex flex-col justify-start items-start">
                  <div className="flex gap-2 justify-center items-center">
                    {ad.paymentMethod.map((item) => {
                      return (
                        <>
                          {" "}
                          <div className={`h-3 w-1 bg-green-400`}></div>
                          <span className="text-sm">{item.method}</span>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Time Limit */}
              <div className="pl-12 py-2 h-full flex justify-start items-start">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-slate-700">
                    {ad.timeLimitinmins} mins
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="px-4 py-2 h-full flex justify-start items-start">
                <div className="flex flex-col gap-2">
                  <p
                    className={`text-lg ${
                      ad.status === "Online" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {ad.status}
                  </p>
                </div>
              </div>

              {/* Action */}

              <div className={`px-4 py-2`}>
                <div className="flex h-full gap-3 justify-start items-center">
                  {/* Publish button */}
                  <button
                    className="hover:scale-125 transition ease-in-out duration-300"
                    onClick={() => changeStatus(ad._id)}
                  >
                    {ad.status === "Online" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`${
                          showAction ? "text-gray-500" : "text-white"
                        } size-5 `}
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z"
                          clipRule="evenodd"
                        />
                        <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`${
                          showAction ? "text-red-500" : "text-white"
                        } size-5 `}
                      >
                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path
                          fillRule="evenodd"
                          d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => handleEditAd(ad._id)}
                    className="hover:scale-125 transition ease-in-out duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`${
                        showAction ? "text-blue-500" : "text-white"
                      } size-5 `}
                    >
                      <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    className="hover:scale-125 transition ease-in-out duration-300"
                    onClick={() => handleDeleteAd(ad._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`${
                        showAction ? "text-red-500" : "text-white"
                      } size-5 `}
                    >
                      <path
                        fillRule="evenodd"
                        d="M17 6.5v9A2.5 2.5 0 0 1 14.5 18h-9A2.5 2.5 0 0 1 3 15.5v-9A.5.5 0 0 1 3.5 6h13a.5.5 0 0 1 .5.5ZM7 8a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 7 8Zm3.75.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5ZM13 8a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5A.75.75 0 0 1 13 8Z"
                        clipRule="evenodd"
                      />
                      <path d="M9 2.75A.75.75 0 0 0 8.25 2h-3a.75.75 0 0 0 0 1.5H9v-1ZM11 2.75V3.5h3.75a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0-.75.75Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </>
    );
  } else {
    return (
      <div>
        <div className=" text-slate-400 py-4">
          <div className="flex w-full justify-center items-center">
            No ads found
          </div>
        </div>
      </div>
    );
  }
};

export default Myads;
