import React from "react";
const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      {" "}
      {/* Spinner Animation */}{" "}
      <div className="relative">
        {" "}
        <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>{" "}
      </div>{" "}
      {/* Loading Text Animation */}{" "}
      <div className="mt-4 text-center">
        {" "}
        <h1 className="text-lg font-semibold text-gray-700 animate-pulse">
          {" "}
          Loading...{" "}
        </h1>{" "}
        <p className="mt-2 text-gray-500">
          Please wait while we set things up for you!
        </p>{" "}
      </div>{" "}
    </div>
  );
};
export default Loading;
