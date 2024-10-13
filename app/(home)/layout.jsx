"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { DarkModeProvider } from "@/components/DarkmodeContext";
import Bottomnav from "@/components/mobileView/dashboard/Bottomnav";

export default function Layout({ children }) {
  return (
    <div className="h-full w-full flex flex-col justify-start gap-3 items-center">
      <DarkModeProvider>
        <Navbar />
        {children}
        <Bottomnav />
      </DarkModeProvider>
    </div>
  );
}
