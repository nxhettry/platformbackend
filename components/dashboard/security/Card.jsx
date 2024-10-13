import React from "react";

const Card = ({svg, text, buttontext}) => {
  return (
    <div className="px-3 py-6 gap-10 bg-slate-100 text-black rounded-xl flex justify-start items-center">
      {svg}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">{text}</h1>
        <button className="bg-mainColor hover:scale-110 transition ease-in-out duration-300 h-12 w-24 rounded-xl p-2 text-white">{buttontext}</button>
      </div>
    </div>
  );
};

export default Card;
