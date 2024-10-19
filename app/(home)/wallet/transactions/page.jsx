"use client";
import { useState, useEffect } from "react";
import { useLoggedIn } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { getTransactions } from "@/lib/getTransactions";


export default function Transactions() {
    const { toast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [UID, setUID] = useState("");
    const { loggedIn, email } = useLoggedIn();

    useEffect(() => {
        if (!loggedIn) return;

        const fetchTransactions = async () => {
            const result = await getTransactions(email);

            if (result.transactions.length > 0) {
                setTransactions(result.transactions);
                setUID(result.UID);
            } else {
                setTransactions([]);
            }
        }

        fetchTransactions();

    }, []);

    return (
        <div className="flex flex-col h-full w-screen justify-start items-center md:mt-0 mt-12 pb-16 md:pb-0">
            <div className="w-full px-3 md:px-0 md:w-3/5 rounded-lg py-3">
                <p className="text-2xl font-bold text-center w-full">P2P History</p>
                <div className="w-full mt-4 px-3 flex flex-col gap-3 justify-start">
                    <div className="font-bold border-b border-slate-300 pb-2 text-xl text-start w-full flex justify-between items-center">
                        <p>Details</p>
                        <p>Status</p>
                    </div>

                    {
                        transactions.length > 0 ? (
                            transactions.map((transaction, index) => {
                                return (
                                    
                                    <Link href={`/${UID.toLowerCase() === transaction.buyer.toLowerCase() ? "buy" : "sell"}/${transaction.orderid}`} key={index} className="font-bold border-b border-slate-100 pb-1 text-sm w-full flex justify-between items-center">
                                        <div className="flex flex-col justify-start">
                                            <p className="font-bold">{
                                                UID.toLowerCase() === transaction.buyer.toLowerCase() ? "Bought" : "Sold"
                                            } {transaction.orderdetails.asset}</p>
                                            <p className="font-bold">{new Date(transaction.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="flex  flex-col justify-start items-end">
                                            <p className={` font-bold ${ UID.toLowerCase() === transaction.buyer.toLowerCase() ? "text-green-500" : "text-red-500"}`}>
                                                {
                                                    UID.toLowerCase() === transaction.buyer.toLowerCase() ? `+${transaction.orderdetails.totalAsset.toFixed(2)}` : `-${transaction.orderdetails.totalAsset.toFixed(2)}`
                                                }
                                            </p>
                                            <p className={` font-bold`}>Completed</p>
                                        </div>
                                    </Link>
                                )
                            })
                        ) : (
                            <p>No transactions found</p>
                        )
                    }


                </div>
            </div>
        </div>
    );
}