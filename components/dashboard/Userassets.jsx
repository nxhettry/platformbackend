import React from "react";

const Userassets = ({ assets }) => {
  
  return (
    <div className="w-full pl-8 min-h-64 flex flex-col gap-4 justify-start items-start border border-gray-300 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">Assets</h1>
      <table className="w-full border-collapse text-left">
        <thead className="border-b">
          <tr className="text-md text-gray-500">
            <th className="p-3">Coin</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Value</th>
            <th className="p-3">Price</th>
            <th className="p-3">Change</th>
          </tr>
        </thead>
        <tbody>
          {assets?.length > 0 ? (
            assets.map((asset, index) => (
              <tr
                key={index}
                className="h-16 hover:bg-gray-50 text-base text-gray-900 border-b last:border-none"
              >
                <td className="flex font-bold text-lg items-center gap-2 p-3">
                  <span className="text-xl text-yellow-500">
                    {asset?.icon}
                  </span>
                  {asset?.coin}
                </td>
                <td className="p-3">{asset?.amount?.toFixed(2) }</td>
                <td className="p-3">{asset?.value?.toFixed(0) }</td>
                <td className="p-3">{asset?.price}</td>
                <td
                  className={`p-3 ${
                    asset.change.includes("+")
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}
                >
                  {asset?.change}
                </td>
              </tr>
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

export default Userassets;
