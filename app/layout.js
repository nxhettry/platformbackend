"use client";
import { Ubuntu } from "next/font/google";
import React from "react";
import { DarkModeProvider, useDarkMode } from "@/components/DarkmodeContext";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { LoggedInProvider } from "@/components/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
});

function MainContent({ children }) {
  const { darkMode } = useDarkMode();
  return (
    <div
      className={`absolute top-0 z-[-2] h-screen w-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      } bg-[radial-gradient(100%_50%_at_50%_0%,rgba(255,165,0,0.13)_0,rgba(255,165,0,0)_50%,rgba(255,165,0,0)_100%)]`}
    >
      <LoggedInProvider>
        <SessionWrapper>{children}</SessionWrapper>
      </LoggedInProvider>
      <Toaster />
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="mainLogo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={ubuntu.className}>
        <DarkModeProvider>
          <MainContent>{children}</MainContent>
        </DarkModeProvider>
        <Toaster />
      </body>
    </html>
  );
}
