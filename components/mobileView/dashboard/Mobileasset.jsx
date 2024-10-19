"use client";
import React, { useEffect, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Link from "next/link";
import { useLoggedIn } from "@/components/AuthContext";
import { getTransactions } from "@/lib/getTransactions";

const Mobileassets = ({ assets, frozenAssets }) => {
  const { loggedIn, email } = useLoggedIn();
  const [transactions, setTransactions] = useState([]);
  const [UID, setUID] = useState("");

  useEffect(() => {
    if (!loggedIn) return;

    const fetchData = async () => {
      const result = await getTransactions(email);

      if (result.transactions.length > 0) {
        setTransactions(result.transactions);
        setUID(result.UID);
      } else {
        setTransactions([]);
      }
    };

    setInterval(() => {
      fetchData();
    }, 10000);
  }, [loggedIn, email]);

  return (
    <div className="w-full pb-20 flex flex-col gap-4 items-start bg-white rounded-lg">
      <table className="w-full border-collapse text-left">
        <thead className="">
          <tr className="text-md bg-slate-100 w-full flex justify-between items-center px-6 text-gray-500">
            <th className="p-1">Coin</th>
            <th className="p-1">Balance</th>
          </tr>
        </thead>
        <tbody className="">
          {assets?.length > 0 ? (
            assets.map((asset, index) => (
              <React.Fragment key={index}>
                {/* Drawer for viewing additional info on a selected asset */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <tr className="text-base text-gray-900 flex  justify-between items-start">
                      <td className="flex gap-2 font-bold text-lg justify-start items-center py-2 px-3">
                        {/* Assets icon */}
                        <div className="flex font-bold gap-3 justify-center items-center">
                          {asset.icon}
                        </div>

                        {/* Assest details */}
                        <div className="flex-col">
                          <span className="text-sm">{asset.coin}</span>
                          <div className="flex justify-center text-xs items-center gap-4">
                            <span className="text-slate-400">
                              {asset.price?.toFixed(0)}
                            </span>
                            <span
                              className={
                                asset.change.startsWith("+")
                                  ? "text-red-500"
                                  : " text-green-500"
                              }
                            >
                              {asset.change}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="flex flex-col font-bold pt-2 justify-start items-center pr-3">
                        <span className="text-lg">
                          {asset.amount?.toFixed(2)}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {asset.value?.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  </DrawerTrigger>
                  <DrawerContent
                    style={{ width: "98%", height: "80%", margin: "0 auto" }}
                  >
                    <div className="h-full flex flex-col items-center">
                      {/* Header */}
                      <div className="w-full overflow-y-scroll max-w-md bg-white rounded-xl px-6 pt-2">
                        <div className="flex flex-col items-center">
                          {asset.icon}
                          <h1 className="text-lg font-semibold">
                            {asset.coin}
                          </h1>
                        </div>

                        {/* Balance Section */}
                        <div className="mt-4 text-center">
                          <h2 className="text-3xl font-bold">
                            {asset.amount?.toFixed(2)}
                          </h2>
                          <p className="text-sm text-gray-500">
                            ≈${asset.value?.toFixed(2)}
                          </p>
                        </div>

                        {/* Available and Frozen Balance */}
                        <div className="flex justify-between mt-4 text-center text-gray-500">
                          <div>
                            <p>Available</p>
                            <h3 className="text-lg font-bold">
                              {asset.amount?.toFixed(2)}
                            </h3>
                            <p className="text-sm">
                              ≈${asset.value?.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p>Frozen</p>
                            <h3 className="text-lg font-bold">
                              {frozenAssets
                                .find((item) => item.asset === asset.coin)
                                ?.amount.toFixed(2)}
                            </h3>
                            <p className="text-sm">
                              ≈$
                              {frozenAssets
                                .find((item) => item.asset === asset.coin)
                                ?.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* History Section */}
                        <div className="mt-6 overflow-y-scroll">
                          <h3 className="text-lg font-semibold">History</h3>
                          <div className="mt-2">
                            {transactions.length > 0 ? (
                              transactions.map((transaction, index) => {
                                return (
                                  <Link
                                    href={`/${
                                      UID.toLowerCase() ===
                                      transaction.buyer.toLowerCase()
                                        ? "buy"
                                        : "sell"
                                    }/${transaction.orderid}`}
                                    key={index}
                                    className="font-bold border-b border-slate-100 pb-1 text-sm w-full flex justify-between items-center"
                                  >
                                    <div>
                                      <p
                                        className={`font-semibold ${
                                          UID.toLowerCase() ===
                                          transaction.buyer.toLowerCase()
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }`}
                                      >
                                        {UID.toLowerCase() ===
                                        transaction.buyer.toLowerCase()
                                          ? "buy"
                                          : "sell"}
                                      </p>
                                      <p className="text-gray-500">
                                        {new Date(
                                          transaction.createdAt
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">
                                        {UID.toLowerCase() ===
                                        transaction.buyer.toLowerCase()
                                          ? `+${transaction.orderdetails.totalAsset.toFixed(
                                              2
                                            )}`
                                          : `-${transaction.orderdetails.totalAsset.toFixed(
                                              2
                                            )}`}{" "}
                                        {transaction.orderdetails.asset}
                                      </p>
                                      <p className="text-green-500">Sucess</p>
                                    </div>
                                  </Link>
                                );
                              })
                            ) : (
                              <div>No transactions found</div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Buttons */}
                        <div className="flex justify-around mt-6">
                          <Link
                            href="/wallet/deposit"
                            className="bg-gray-200 w-32 text-center rounded-lg py-2 text-black font-semibold hover:bg-gray-300"
                          >
                            Deposit
                          </Link>
                          <Link
                            href="/wallet/withdraw"
                            className="bg-mainColor w-32 text-center rounded-lg py-2 text-white font-semibold hover:bg-mainColor-dark"
                          >
                            Withdraw
                          </Link>
                        </div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">
                No assets available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Mobileassets;
