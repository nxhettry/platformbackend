import React from "react";

const Buyform = ({ wannaBuy }, setWannaBuy) => {
  return (
    <div
      className={`${
        wannaBuy ? "flex" : "hidden"
      } absolute inset-0 h-screen w-screen justify-center items-center bg-gray-500 bg-opacity-50`}
    >
      <div className="border bg-slate-100 text-black h-3/5 w-[70%] rounded-xl pl-4 flex justify-between items-center">
        <div className="flex flex-col h-full w-[53%] ">
          <div className="flex h-full gap-1">
            <div className="h-full">
              <div className="relative mt-1 bg-black rounded-lg flex justify-center items-center text-white h-6 w-6">
                <span className="text-xs">A</span>
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full h-2 w-2"></div>
              </div>
            </div>
            <div className="h-full flex flex-col gap-2 items-start justify-start ">
              <div className="font-semibold w-full p-1 flex justify-start items-center gap-2">
                <span>{ad.email}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4 text-mainColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex gap-2 px-1 justify-start items-center text-sm text-slate-600">
                <span>{`${ad.orders} orders`}</span>
                <span className="text-slate-300">|</span>
                <span>{`${ad.completionRate} completion`}</span>
              </div>
              <div className="flex w-full gap-4 items-center justify-start px-1">
                <span className="text-sm text-green-500 ">{ad.status}</span>
                <div className="flex justify-center items-center gap-1 text-xs text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{`${ad.timeLimit} mins`}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div className="flex flex-col h-full w-[43%] bg-white pr-4"></div>
      </div>
    </div>
  );
};

export default Buyform;
