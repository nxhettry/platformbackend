"use client";
import React, { useState } from "react";

const Cards = ({ heading, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`w-[25rem] h-[11rem] pl-4 py-3 border border-slate-300 ${
        isHovered ? "bg-mainColor text-white" : "bg-white text-black"
      } rounded-2xl shadow-2xl hover:scale-110 transition duration-500 ease-in-out`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className={`w-6 h-6 mb-2 ${
          isHovered ? "text-white" : "text-mainColor"
        } hover:scale-125 transition duration-300 ease-in-out`}
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z" />
      </svg>
      <a href="#">
        <h5
          className={`mb-1 text-lg font-bold tracking-tight transition-colors duration-300 ease-in-out ${
            isHovered ? "text-white" : "text-black"
          }`}
        >
          {heading}
        </h5>
      </a>
      <p
        className={`mb-2 text-sm pr-3 font-medium transition-colors duration-300 ease-in-out ${
          isHovered ? "text-gray-200" : "text-slate-900"
        }`}
      >
        {text}
      </p>
      <a
        href="#"
        className={`flex items-center h-10 w-10 pt-2 pr-1 justify-center rounded-full ${
          isHovered ? "bg-white text-mainColor" : "bg-mainColor text-black"
        } text-lg font-semibold hover:scale-110 transition duration-300 ease-in-out`}
      >
        <svg
          className={`w-4 h-5 ml-2 transition-colors duration-300 ease-in-out ${
            isHovered ? "text-mainColor" : "text-white"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0L8.59 1.41 13.17 6H0v2h13.17l-4.58 4.59L10 14l6-6-6-6z" />
        </svg>
      </a>
    </div>
  );
};

export default Cards;
