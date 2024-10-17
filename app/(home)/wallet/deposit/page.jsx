"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "@/components/AuthContext";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import Loading from "@/app/loading";

const Deposit = () => {
  const [network, setNetwork] = useState("bsc");
  const [showAddress, setShowAddress] = useState(true);
  const [loading, setLoading] = useState(true);
  const [depositAddress, setDepositAddress] = useState({
    qrurl: "",
    address: "",
  });
  const router = useRouter();
  const { loggedIn, email } = useLoggedIn();
  const { data: session, status } = useSession();

  //Creating deposit address for new users
  useEffect(() => {
    const createAddress = async () => {
      if (!session && !loggedIn) return;

      let userEmail;

      if (session) {
        userEmail = session.user.email;
      }

      if (loggedIn) {
        userEmail = email;
      }

      if (!userEmail) return;

      const res = await fetch("http://localhost:8080/api/wallet/createBscWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setLoading(false);
        const { address, qrCodeUrl } = data.data;
        setDepositAddress({ address, qrurl: qrCodeUrl });
        return;
      }
    };
    if (session || loggedIn) {
      createAddress();
    }
  }, [session, loggedIn, email]);

  //Fetching new Address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        if (!session && !loggedIn) return;

        const userEmail = session ? session.user.email : email;

        const res = await fetch("http://localhost:8080/api/wallet/getBscWallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await res.json();

        if (res.ok && res.status === 200) {
          setDepositAddress({
            qrurl: data.data.qrCodeUrl,
            address: data.data.address,
          });
        } else {
          console.error("Error fetching wallet:", data);
        }
      } catch (error) {
        console.error("Error in fetchAddress:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session || loggedIn) {
      fetchAddress();
    }
  }, [session, loggedIn, email, depositAddress.address]);

  //auth check
  useEffect(() => {
    if (status === "loading") return; // Avoids redirection during initial loading
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login first");
      router.push("/auth/login");
    }
  }, [status, loggedIn, router]);

  if (status === "loading" || loading) {
    return (
        <Loading />
    );
  }

  function handleNetworkChange(event) {
    setNetwork(event.target.value);
    setShowAddress(event.target.value === "bsc");
  }

  function copyAddress() {
    navigator.clipboard.writeText(depositAddress.address);
  }

  return (
    <div className="mt-12 sm:mt-0 h-full w-full sm:w-4/5 mx-auto p-4 flex flex-col gap-8 justify-start items-start">
      <h1 className="text-2xl font-bold">Deposit Crypto</h1>

      <div className="flex-col gap-8 sm:gap-0 sm:flex-row flex w-full justify-between items-start">
        {/* Deposit section */}
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          {/* First item*/}
          <li className="mb-3 sm:mb-10 ms-4 flex flex-col gap-3">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
              1
            </div>
            <time className="mb-1 text-md sm:text-lg font-bold leading-none text-black">
              Select Crypto
            </time>
            <select
              className="border rounded-xl w-40 h-12 text-md sm:text-lg px-2"
              name="crypto"
              id="crypto"
            >
              <option value="usdt">USDT</option>
              <option value="btc">BTC</option>
              <option value="eth">ETH</option>
            </select>
          </li>

          {/* Second item */}
          <li className="mb-3 sm:mb-10 ms-4 flex flex-col gap-3">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-md sm:text-lg font-bold leading-none text-black">
              Choose Network
            </time>
            <select
              className="border rounded-xl w-40 h-12 text-md sm:text-lg px-2"
              name="network"
              id="network"
              onChange={handleNetworkChange}
              value={network}
            >
              <option value="bsc">BEP-20</option>
              <option value="trc">TRC-20</option>
              <option value="erc">ERC-20</option>
            </select>
          </li>

          {/* Third item */}
          <li className="ms-4 flex flex-col gap-3">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-md sm:text-lg font-bold leading-none text-black">
              Deposit Address
            </time>
            {showAddress ? (
              depositAddress.address && depositAddress.qrurl ? (
                <div className="flex flex-col gap-4 justify-center items-center p-3 border rounded-xl">
                  <div className="flex flex-col justify-center items-center gap-2">
                    <img src={depositAddress.qrurl} alt="qr" className="h-48" />
                    <div className="flex flex-col justify-between items-center sm:items-start">
                      <h1 className="text-md sm:text-xl">USDT Address</h1>
                      <p className="text-xs sm:text-sm text-slate-400">
                        {depositAddress.address}
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={copyAddress}
                    className="w-full h-12 rounded-xl bg-mainColor text-white text-md sm:text-lg flex justify-center items-center cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5v-3.379a3 3 0 0 0-.879-2.121l-3.12-3.121a3 3 0 0 0-1.402-.791 2.252 2.252 0 0 1 1.913-1.576A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z"
                        clipRule="evenodd"
                      />
                      <path d="M3.5 6A1.5 1.5 0 0 0 2 7.5v9A1.5 1.5 0 0 0 3.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L8.44 6.439A1.5 1.5 0 0 0 7.378 6H3.5Z" />
                    </svg>
                    <span>Copy Address</span>
                  </div>
                </div>
              ) : (
                <div className="flex w-52 flex-col gap-4">
                  <div className="skeleton h-32 w-full"></div>
                  <div className="skeleton h-4 w-28"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              )
            ) : (
              <div>Coming Soon</div>
            )}
          </li>
        </ol>

        {/* Tips section */}
        <div className="p-4 bg-white w-full sm:w-2/5 rounded-lg shadow-md">
          <h2 className="text-md sm:text-xl font-semibold mb-2">Tips</h2>
          <ul className="list-disc pl-5 text-sm sm:text-md">
            <li className="mb-2">
              <p>
                Do not deposit assets other than USDT, as doing so may result in
                the irretrievability of the deposited assets.
              </p>
            </li>
            <li className="mb-2">
              <p>
                Ensure to select the correct network while depositing to avoid
                any potential issues.
              </p>
            </li>
            <li>
              <p>For any issues or assistance, contact support immediately.</p>
            </li>
          </ul>
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
};

export default Deposit;
