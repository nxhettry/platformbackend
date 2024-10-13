"use client";
import Card from "@/components/dashboard/security/Card";
import Image from "next/image";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "@/components/AuthContext";
import Loading from "@/app/loading";

const Security = () => {
  const router = useRouter();
  const { loggedIn } = useLoggedIn();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }
  }, [status, loggedIn, router]); // useEffect for redirection based on session status

  if (status === "loading") {
    return (
        <Loading />
    );
  }

  return (
    <div className="flex justify-center gap-8 pt-20 items-center w-full px-2">
      <Card
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-10 text-slate-400"
          >
            <path
              fillRule="evenodd"
              d="M1 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm4 1.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2 3a4 4 0 0 0-3.665 2.395.75.75 0 0 0 .416 1A8.98 8.98 0 0 0 7 14.5a8.98 8.98 0 0 0 3.249-.604.75.75 0 0 0 .416-1.001A4.001 4.001 0 0 0 7 10.5Zm5-3.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 6.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75-4a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
              clipRule="evenodd"
            />
          </svg>
        }
        text="Change Password"
        buttontext="Change"
      />

      <Card
        svg={
          <Image
            alt="googleAuth"
            src="/googleAuth.svg"
            height={100}
            width={100}
            className="h-10 w-10 text-slate-400"
          />
        }
        text="Google Authenticator"
        buttontext="Bind"
      />

      <Card
        svg={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-10 text-slate-400"
          >
            <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
            <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
          </svg>
        }
        text="Mail"
        buttontext="Change"
      />
    </div>
  );
};

export default Security;
