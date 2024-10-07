export default function Transactions() {
    return (
        <div className="flex flex-col h-full w-screen justify-start items-center md:mt-0 mt-12 pb-16 md:pb-0">
            <div className="w-full px-3 md:px-0 md:w-3/5 border border-black rounded-lg py-3">
                <p className="text-2xl underline font-bold text-center w-full">Transaction table</p>
                <div className="w-full mt-4 px-3 flex flex-col gap-3 justify-start">
                    <div className="font-bold border-b border-slate-300 pb-2 text-xl text-start w-full flex justify-between items-center">
                        <p>Details</p>
                        <p>Status</p>
                    </div>

                    <div className="font-bold border-b border-slate-100 pb-1 text-sm w-full flex justify-between items-center">
                        <div className="flex flex-col justify-start">
                            <p className="font-bold">USDT Deposit</p>
                            <p className="font-bold">TxnHash: 3274782368237468723y423</p>
                            <p className="font-bold">date and time</p>
                        </div>
                        <div className="flex  flex-col justify-start items-end">
                            <p className={` font-bold ${"text-green-500"}`}>+10</p>
                            <p className={` font-bold ${"text-green-500"}`}>Completed</p>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
}