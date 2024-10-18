"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useLoggedIn } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Authbody = ({ loginpage, signuppage }) => {
  const { loggedIn, setLoggedIn, email, setEmail } = useLoggedIn();
  const { data: session } = useSession();
  const router = useRouter();
  const form = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State to prevent double save
  const [isOAuthLogin, setIsOAuthLogin] = useState(false); // State to differentiate OAuth and form logins
  const { toast } = useToast();
  useEffect(() => {
    if (session && !isSaving && isOAuthLogin) {
      const saveUser = async (email) => {
        try {
          setIsSaving(true); // Mark as saving to prevent duplicate saves
          let body;
          if (loginpage) {
            body = JSON.stringify({ email, login: true });
          }
          if (signuppage) {
            body = JSON.stringify({ email, login: false });
          }

          const res = await fetch("http://localhost:8080/api/auth/register", {
            method: "POST",
            body: body,
            headers: {
              "Content-Type": "application/json",
            },
          });
          const response = await res.json();
          if (res.status === 400) {
            console.log(response.message);
          }
          console.log(response);
          if (res.status === 200) {

            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Failed to save user", error);
        }
      };
      // Only save user if it's an OAuth login
      if (session.user?.email) {
        saveUser(session.user.email);
      }
    }
  }, [session, isSaving, isOAuthLogin, loginpage, router, signuppage]);

  //Login and signup request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    //Catching form data
    const formData = new FormData(form.current);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    //Logic for manual signup
    if (signuppage) {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      if (res.status === 400) {
        toast({
          title: response.message,
        });
      }
      if (res.status === 200) {
        toast({
          title: "Account created successfully",
        });
        setLoggedIn(true);
        setEmail(data.email);
        router.push("/dashboard");
      }
    }

    //Logic for manual Login
    if (loginpage) {

      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await res.json();
      alert(response.message);
      if (res.status === 400) {
        toast({
          title: response.message,
        });
      }
      if (res.status === 200) {
        toast({
          title: "Login successful",
        });
        setLoggedIn(true);
        setEmail(data.email);
        router.push("/dashboard");
      }
    }
  };

  useEffect(() => {
    if (session && session.user) {
      setIsOAuthLogin(true); // Set this flag to true to indicate an OAuth login
    }
  }, [session]);

  return (
    <div className="h-[80%] w-[90%] md:w-[70%] mx-auto flex justify-start md:justify-center items-center flex-col md:flex-row gap-2 md:gap-8 ">
      <div className="h-[80%] md:h-full flex-col  justify-start items-center w-full md:w-2/5 px-6 md:pt-6 rounded-xl hidden md:flex ">
        <Image
          draggable={false}
          src={`${loginpage ? "/login.png" : signuppage && "/signup.png"}`}
          alt="homeIcon"
          priority
          width={400}
          height={400}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="h-[75%] w-full md:w-[45%] flex flex-col justify-start items-center gap-8 p-6  rounded-xl">
        <div className="h-12 w-full border-b border-white flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold">
            {loginpage && "Login to continue"}
            {signuppage && "Create Account"}
          </h1>
          <button className="flex justify-center items-center gap-1 text-mainColor font-semibold">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.1405 10.6667L9.94526 12.8619C9.68491 13.1223 9.68491 13.5444 9.94526 13.8047C10.2056 14.0651 10.6277 14.0651 10.8881 13.8047L14.2214 10.4714C14.2061 10.4651 14.191 10.4588 14.1761 10.4527C14.3254 10.3338 14.4167 10.1748 14.4167 10C14.4167 9.63181 14.0116 9.33333 13.5119 9.33333L2.65476 9.33333C2.15508 9.33333 1.75 9.63181 1.75 10C1.75 10.3682 2.15508 10.6667 2.65476 10.6667L12.1405 10.6667ZM6.2214 3.13807L4.02614 5.33333L13.5119 5.33333C14.0116 5.33333 14.4167 5.63181 14.4167 6C14.4167 6.36819 14.0116 6.66667 13.5119 6.66667L2.65476 6.66667C2.15508 6.66667 1.75 6.36819 1.75 6C1.75 5.82524 1.84126 5.66619 1.99058 5.5473L1.94526 5.52859L5.2786 2.19526C5.53894 1.93491 5.96105 1.93491 6.2214 2.19526C6.48175 2.45561 6.48175 2.87772 6.2214 3.13807Z"
                fill="currentColor"
              ></path>
            </svg>
            {loginpage && <Link href={"/auth/signup"}>Sign up</Link>}
            {signuppage && <Link href={"/auth/login"}>Log in</Link>}
          </button>
        </div>

        <form
          ref={form}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 justify-center w-full"
        >
          <div className="flex flex-col gap-4">
            <input
              type="email"
              id="email"
              required
              placeholder="Email"
              name="email"
              className="border border-slate-300 p-3 rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Password"
                name="password"
                className="border border-slate-300 p-3 pr-10 rounded-lg w-full"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer hover:text-mainColor hover:scale-110 transition ease-in-out duration-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z"
                      clipRule="evenodd"
                    />
                    <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path
                      fillRule="evenodd"
                      d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {signuppage && (
            <div
              className="flex flex-col md:flex-row flex-wrap w-full gap-1 pl-2"
              style={{ fontSize: 13 }}
            >
              <input type="checkbox" required />
              <p className="flex flex-col md:flex-row items-center gap-1 m-0">
                By clicking &quot;Create Account&quot;, you agree to
                <span className="text-mainColor cursor-pointer">
                  Terms of Service
                </span>{" "}
                and
                <span className="text-mainColor ml-4 cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </div>
          )}

          <button className="bg-mainColor hover:scale-105 transition ease-in-out duration-300 w-full text-lg font-bold text-white p-3 rounded-lg">
            {loginpage && "Log in"}
            {signuppage && "Create Account"}
          </button>
        </form>

        {/* Or */}
        <div className="flex items-center w-full">
          <div className="flex-grow border-t border-white"></div>
          <span className="mx-4 text-slate-400">
            {loginpage && "Or Log in with"}
            {signuppage && "Or Sign up with"}
          </span>
          <div className="flex-grow border-t border-white"></div>
        </div>

        {/* 0Auth */}
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center items-center w-full">
          <button
            onClick={() => {
              setIsOAuthLogin(true);
              signIn("google");
            }}
            className="shadow-lg md:shadow-2xl pl-4 pr-6 py-2 rounded-full flex justify-center items-center border border-slate-500 gap-2 hover:scale-105 transition ease-in-out hover:bg-mainColor hover:text-white"
          >
            <Image
              alt="google"
              src="https://www.toobit.com/assets/google.b625bd00.svg"
              height={50}
              width={50}
              className="h-6 md:h-8 w-6 md:w-8"
            />
            <span className="text-base md:text-lg font-semibold md:font-bold">
              Google
            </span>
          </button>
          <button
            onClick={() => {
              alert("Coming Soon ");
            }}
            className="shadow-lg md:shadow-2xl pl-4 pr-6 py-2 rounded-full flex justify-center items-center border border-slate-500 gap-2 hover:scale-105 transition ease-in-out hover:bg-mainColor hover:text-white"
          >
            <Image
              alt="apple"
              src="https://www.toobit.com/assets/apple.2b6e06dd.svg"
              height={50}
              width={50}
              className="h-6 md:h-8 w-6 md:w-8"
            />
            <span className="text-base md:text-lg font-semibold md:font-bold">
              Apple
            </span>
          </button>
          <button
            onClick={() => {
              alert("Coming Soon ");
            }}
            className="shadow-lg md:shadow-2xl pl-4 pr-6 py-2 rounded-full flex justify-center items-center border border-slate-500 gap-2 hover:scale-105 transition ease-in-out hover:bg-mainColor hover:text-white"
          >
            <Image
              alt="telegram"
              src="https://www.toobit.com/assets/telegram.2192b0dc.svg"
              height={50}
              width={50}
              className="h-6 md:h-8 w-6 md:w-8"
            />
            <span className="text-base md:text-lg font-semibold md:font-bold">
              Telegram
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Authbody;
