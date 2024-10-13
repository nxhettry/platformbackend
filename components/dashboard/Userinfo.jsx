"use client";
import React from "react";
import UtilitybarDash from "./UtilitybarDash";
import { useToast } from "@/hooks/use-toast";

const Userinfo = ({ uid, username }) => {
  const { toast } = useToast();

  return (
    <div className="h-full flex justify-between items-center w-full pl-8 border border-gray-300 p-6 bg-white rounded-lg shadow-md">
      <div className="flex gap-4 h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-5 h-20 text-slate-400 w-20 rounded-full"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
            clipRule="evenodd"
          />
        </svg>

        <div className="flex flex-col justify-center items-start ml-4">
          <h2 className="text-xl font-bold">{username}</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-lg text-slate-400">UID :</p>
            <span
              className="text-lg text-slate-400 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(uid);
                toast({ title: "UID Copied !" });
              }}
            >
              {uid}
            </span>
          </div>
        </div>
      </div>
      <UtilitybarDash />
    </div>
  );
};

export default Userinfo;
