"use client";
import React, { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "@/components/AuthContext";

export default function Layout({ children }) {
  const { loggedIn } = useLoggedIn();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && !loggedIn) {
      router.push("/auth/login");
    }
  }, [session, loggedIn, router]);

  if (!session && !loggedIn) {
    return null;
  }

  return (
    <div className="h-full w-screen flex justify-start items-start sm:px-8 sm:mt-3">
      <Sidebar />
      {children}
    </div>
  );
}
