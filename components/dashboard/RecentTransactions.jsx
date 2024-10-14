"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";

const RecentTransactions = () => {
  const { loggedIn, email } = useLoggedIn();
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);

  // Fetch wallet address and transactions
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userEmail = session?.user?.email || (loggedIn ? email : null);
      if (!userEmail) return;

      const res = await fetch("http://35.154.71.2/api/wallet/getBscWallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();

      if (res.status === 200) {
        await fetchTransactions(data.data.address);

        const interval = setInterval(() => fetchTransactions(data.data.address), 10000);
        return () => clearInterval(interval);
      }
    };

    fetchUserDetails();
  }, [session, loggedIn, email]);

  // Fetch transactions from the blockchain
  const fetchTransactions = async (address) => {
    if (!address) return;

    try {
      const apiKey = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY;
      const [nativeResponse, tokenResponse] = await Promise.all([
        fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`),
        fetch(`https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`),
      ]);

      const nativeData = await nativeResponse.json();
      const tokenData = await tokenResponse.json();

      let allTransactions = [];
      if (nativeResponse.status === "1") allTransactions.push(...nativeData.result);
      if (tokenResponse.status === "1") allTransactions.push(...tokenData.result);

      allTransactions.sort((a, b) => b.timeStamp - a.timeStamp);

      await saveTransactions(allTransactions, address);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Saves the transactions to the database
  const saveTransactions = async (transactions, address) => {
    const userEmail = session?.user?.email || (loggedIn ? email : null);
    if (!userEmail || !address || !transactions.length) return;

    await fetch("http://35.154.71.2/api/wallet/saveTransactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions, userWallet: address, email: userEmail }),
    });
  };

  // Fetch transactions from the database
  useEffect(() => {
    const fetchUserTransactions = async () => {
      const userEmail = session?.user?.email || (loggedIn ? email : null);
      if (!userEmail) return;

      try {
        const res = await fetch("http://35.154.71.2/api/wallet/getUserTransactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await res.json();
        if (res.status === 200) {
          setTransactions(data.transactions);

        }
      } catch (error) {
        console.error("Error fetching transactions from the database:", error);
      }
    };

    fetchUserTransactions();
    const interval = setInterval(fetchUserTransactions, 10000);
    return () => clearInterval(interval);
  }, [session, loggedIn, email]);

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <div className="sm:w-full pb-16 max-w-full sm:pl-8 h-full flex flex-col gap-2 sm:gap-4 justify-start items-start md:border border-gray-300 p-2 sm:p-6 bg-white rounded-lg md:shadow-md">
      <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Recent Transactions</h1>


      {/* Table for small display */}
      <table className="md:hidden w-full h-full text-left">
        <thead className="border-b">
          <tr className="text-sm sm:text-md text-gray-500">
            <th className="p-2 sm:p-3">Details</th>
            <th className="p-2 sm:p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="h-16 hover:bg-gray-50 text-sm text-gray-900 border-b last:border-none">
              <td className="p-2 sm:p-3">
                <div className="flex flex-col justify-start items-start">
                  <span>
                    {`${transaction.kind[0].toUpperCase()}${transaction.kind.slice(1)} ${transaction.asset}`}
                  </span>

                  <p className="cursor-pointer word-break" onClick={() => copyHash(transaction.transactionHash)}>
                    {`${transaction.transactionHash.slice(0, 15)}...${transaction.transactionHash.slice(16, 22)}`}
                  </p>

                  <span>
                    {new Date(transaction.date).toLocaleString()}
                  </span>
                </div>
              </td>
              <td className="p-2 sm:p-3">
                <div className="flex flex-col gap-1 justify-start items-center">
                  <span>{transaction.amount}</span>
                  <span className="p-2 sm:p-3 text-green-600">{"Success"}</span>
                </div>
              </td>


            </tr>
          ))}
        </tbody>
      </table>

      {/* Table for large display */}
      <table className="hidden md:flex flex-col h-full text-left">
        <thead className="border-b w-full">
          <tr className="text-sm w-full sm:text-md text-gray-500">
            <div className=" justify-between flex items-center">
              <th className="p-2 sm:p-3">Transaction</th>
              <th className="p-2 sm:p-3">Amount</th>
              <th className="p-2 sm:p-3">Date</th>
              <th className="p-2 sm:p-3">Status</th>
            </div>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="h-16 hover:bg-gray-50 text-sm text-gray-900 border-b last:border-none">
              <td className="p-2 sm:p-3">
                <div className="flex flex-col justify-start items-start">
                  <span>
                    {`${transaction.kind[0].toUpperCase()}${transaction.kind.slice(1)} ${transaction.asset}`}
                  </span>

                  <span className="cursor-pointer" onClick={() => copyHash(transaction.transactionHash)}>
                    {transaction.transactionHash}
                  </span>
                </div>
              </td>
              <td className="p-2 sm:p-3">
                {transaction.amount}
              </td>
              <td className="p-2 sm:p-3">
                {new Date(transaction.date).toLocaleString()}
              </td>
              <td className="p-2 sm:p-3 text-green-600">{"Success"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;
