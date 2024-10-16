"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "@/components/AuthContext";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/app/loading";

const Withdraw = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { loggedIn, email } = useLoggedIn();
  const { data: session, status } = useSession();
  const [inputAddress, setInputAddress] = useState("");
  const [inputAmount, setInputAmount] = useState("");

  // State to track the selected cryptocurrency
  const [selectedCrypto, setSelectedCrypto] = useState("usdt");
  const [selectedNetwork, setSelectedNetwork] = useState("bsc");

  // Handle change in the crypto selection
  const handleCryptoChange = (event) => {
    setSelectedCrypto(event.target.value);
  };

  // Handle change in the network selection
  const handleNetworkChange = (event) => {
    setSelectedNetwork(event.target.value);
  };

  // Function for handling the withdrawal
  const handleWithdraw = async () => {
    if (inputAddress === "" || inputAmount === "") {
      toast({ title: "Please fill in all fields" });
      return;
    }

    if (selectedCrypto === "usdt" && inputAmount < 1) {
      toast({ title: "Minimum withdrawal amount is 10" });
      return;
    } else if (selectedCrypto !== "usdt" && inputAmount < 0.0001) {
      toast({ title: "Minimum withdrawal amount is 0.0001" });
      return;
    }

    if (
      selectedCrypto !== "usdt" && selectedCrypto !== "bnb" ||
      selectedNetwork === "trc" ||
      selectedNetwork === "erc"
    ) {
      toast({ title: "This feature is coming soon" });
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
      alert("Please login first");
      router.push("/auth/login");
    }

    const data = {
      email: userEmail,
      withdrawAmount: inputAmount,
      withdrawAsset: selectedCrypto.toUpperCase(),
      withdrawAddress: inputAddress,
    };

    const validWithdrawal = await validateBalance(inputAmount);

    if (validWithdrawal) {

      toast({ title: "Withdrawal request submitted" });



      const res = await fetch("http://localhost:8080/api/wallet/createWithdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      setInputAddress("");
      setInputAmount("");

      return;
    } else {
      toast({ title: validWithdrawal.result });
    }
  };

  //Validating the withdrawal Amount
  const validateBalance = async (amount) => {
    let userEmail;

    if (session) {
      userEmail = session.user.email;
    }

    if (loggedIn) {
      userEmail = email;
    }

    // Fetch the user balance
    try {
      const res = await fetch("http://localhost:8080/api/wallet/validateWithdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          withdrawAmount: amount,
          withdrawAsset: selectedCrypto,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Checking auth
  useEffect(() => {
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }
  }, [status, loggedIn, router]);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="mt-12 sm:mt-0 h-full w-full sm:w-4/5 mx-auto p-4 flex flex-col gap-8 justify-start items-start">
      <h1 className="text-2xl font-bold">Withdraw Crypto</h1>

      {/* Middle section */}
      <div className="flex-col gap-8 sm:gap-0 sm:flex-row flex w-full justify-between items-start">
        <div className="flex flex-col gap-4 w-full">
          <ol className="relative max-w-full border-s border-gray-200 dark:border-gray-700">
            {/* Crypto coin dropdown */}
            <li className="mb-10 ms-4 flex flex-col gap-3">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
                1
              </div>
              <time className="mb-1 text-lg font-bold leading-none text-black ">
                Select Crypto
              </time>
              <select
                className="border rounded-xl w-40 h-12 text-lg px-2"
                name="crypto"
                id="crypto"
                onChange={handleCryptoChange} // Add onChange handler
                value={selectedCrypto}
              >
                <option value="usdt">USDT</option>
                <option value="btc">BTC</option>
                <option value="eth">ETH</option>
                <option value="bnb">BNB</option>
              </select>
            </li>

            {/* Network dropdown */}
            <li className="mb-10 ms-4 flex flex-col gap-3">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-lg font-bold leading-none text-black ">
                Choose Network
              </time>
              <select
                className="border rounded-xl w-40 h-12 text-lg px-2"
                name="network"
                id="network"
                onChange={handleNetworkChange} // Add onChange handler
              >
                <option value="bsc">BSC</option>
                <option value="trc">TRC-20</option>
                <option value="erc">ERC-20</option>
              </select>
            </li>

            {/* Withdrawal Address */}
            <li className="ms-4 flex flex-col gap-3">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-lg font-bold leading-none text-black ">
                Withdraw Address
              </time>
              {selectedCrypto !== "usdt" && selectedCrypto !== "bnb" ||
                selectedNetwork === "trc" ||
                selectedNetwork === "erc" ? (
                <p className="text-red-500 text-lg">Coming Soon</p>
              ) : (
                <>
                  <input
                    type="text"
                    required
                    placeholder="Please input withdraw Address"
                    name="withdrawaddress"
                    onChange={(e) => setInputAddress(e.target.value)}
                    value={inputAddress}
                    className="border rounded-xl h-12 px-3 py-2 w-full text-lg text-slate-400"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Please input withdraw amount"
                    name="withdrawamount"
                    onChange={(e) => setInputAmount(e.target.value)}
                    min={10}
                    value={inputAmount}
                    className="border rounded-xl h-12 px-3 py-2 w-full text-lg text-slate-400"
                  />
                </>
              )}
            </li>
          </ol>
          <button
            onClick={handleWithdraw}
            className="h-12 w-2/5 border rounded-full text-white bg-mainColor text-xl font-bold"
          >
            Withdraw
          </button>
        </div>

        {/* Tips */}
        <div className="p-4 bg-white w-[50%s] rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Tips</h2>
          <ul className="list-disc pl-5">
            <li className="mb-2">
              <p>
                Do not Withdraw assets other than USDT, as doing so may result
                in the irretrievability of the Withdrawed assets.
              </p>
            </li>
            <li className="mb-2">
              <p>
                Withdraws below the minimum amount will not be credited and
                cannot be refunded.
              </p>
            </li>
            <li>
              <p>
                Ensure the security of your computer and browser to prevent
                information from being tampered with or leaked.
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Recent Withdraw */}
      <RecentTransactions />
    </div>
  );
};

export default Withdraw;
