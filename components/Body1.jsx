import Image from "next/image";
import Link from "next/link";
import Cards from "./Cards";
import { useSession } from "next-auth/react";
import { useLoggedIn } from "./AuthContext";
import { IconCloudDemo } from "./Iconcloud";

const Body1 = () => {
  const { data: session } = useSession();
  const { loggedIn, setLoggedIn } = useLoggedIn();

  return (
    <div className="w-screen mt-4 sm:mt-0 flex flex-col">
      {/* This is the first part */}
      <div className=" md:h-[28rem] pb-4 md:pb-0 w-full flex flex-col sm:flex-row md:gap-28 justify-center sm:border-b border-slate-200 items-center">
        <div className="w-[70%] mx-auto sm:mx-0 md:w-2/5 max-h-full flex flex-col gap-3 md:gap-12">
          {/* Iconcloud for small screen */}
          <div className="flex  sm:hidden justify-center items-center opacity-60">
            <IconCloudDemo />
          </div>

          {/* This is the top text */}
          <div className="flex flex-col w-full text-center sm:items-start items-center gap-3">
            <h1 className=" text-2xl md:text-5xl font-extrabold">
              <span className="text-mainColor md:hover:scale-110 transition ease-in-out duration-300">
                P2P
              </span>{" "}
              Smarter
            </h1>
            <h1 className=" text-xl md:text-5xl font-extrabold">
              P2P{" "}
              <span className="text-mainColor md:hover:scale-110 transition ease-in-out duration-300">
                Without KYC
              </span>
            </h1>
          </div>

          {/* This is the bottom text and buttons */}
          <div className="flex flex-col gap-3 w-full items-center sm:items-start">
            {/* This is the text above the button */}
            <div className="pl-4 w-full flex justify-center sm:justify-start items-center gap-2">
              <Image
                unoptimized
                src="/homeGift.gif"
                alt="homeGift"
                width={50}
                height={50}
                className="h-5 w-5 sm:h-8 sm:w-8"
              />
              <span className="text-sm sm:text-xl text-start font-bold">
                {session || loggedIn
                  ? "Buy USDT in your currency"
                  : "Sign up to receive bonuses"}
              </span>
            </div>

            {/* This is the button */}
            <Link
              href={session || loggedIn ? "/buy" : "/auth/signup"}
              className={`flex justify-center items-center gap-1 sm:gap-3 md:hover:scale-110 transition ease-in-out duration-300 bg-mainColor ${
                session || loggedIn
                  ? "ml-6 sm:ml-0 w-[55%] sm:w-[50%]"
                  : "sm:w-[72%]"
              } rounded-xl sm:rounded-full px-3 sm:px-5 py-1 sm:py-2 text-black text-sm sm:text-lg font-bold`}
            >
              <Image
                unoptimized
                src="/homeProfile.gif"
                alt="homeProfile"
                width={50}
                height={50}
                className="h-5 w-4 sm:h-8 sm:w-7"
              />
              <p className="hidden md:flex">
                {session || loggedIn
                  ? "Start P2P trade now !"
                  : "Sign up via Email/Phone number"}
              </p>
              <p className="text-sm flex md:hidden">
                {session || loggedIn ? "Trade now" : "Sign up "}
              </p>
            </Link>

            {/* If user is not logged  IN */}
            {!session && !loggedIn && (
              <>
                <div className="flex items-center max-w-[25rem] pl-12">
                  <div className="flex-grow border-t border-slate-300"></div>
                  <span className="mx-4 text-slate-300">or</span>
                  <div className="flex-grow border-t border-slate-300"></div>
                </div>

                <div className="flex gap-4 md:max-w-[72%]">
                  <button className="sm:pl-4 px-4 sm:pr-6 py-2 rounded-full flex justify-center items-center border border-slate-500 gap-2 md:hover:scale-105 transition ease-in-out md:hover:bg-mainColor md:hover:text-white">
                    <Image
                      src="https://www.toobit.com/assets/google.b625bd00.svg"
                      alt="image"
                      height={50}
                      width={50}
                      className="h-5 w-5 sm:h-8 sm:w-8"
                    />
                    <span className="text-sm sm:text-lg font-bold">Google</span>
                  </button>
                  <button className="sm:pl-4 px-4 sm:pr-6 py-2 rounded-full flex justify-center items-center border border-slate-500 gap-2 md:hover:scale-105 transition ease-in-out md:hover:bg-mainColor md:hover:text-white">
                    <Image
                      src="https://www.toobit.com/assets/apple.2b6e06dd.svg"
                      alt="image"
                      height={50}
                      width={50}
                      className="h-5 w-5 sm:h-8 sm:w-8"
                    />
                    <span className="text-sm sm:text-lg font-bold">Apple</span>
                  </button>
                  <button className="sm:pl-4 px-4 sm:pr-6 py-2 rounded-full flex justify-center items-center border border-slate-500 gap-2 md:hover:scale-105 transition ease-in-out md:hover:bg-mainColor md:hover:text-white">
                    <Image
                      src="https://www.toobit.com/assets/telegram.2192b0dc.svg"
                      alt="image"
                      height={50}
                      width={50}
                      className="h-5 w-5 sm:h-8 sm:w-8"
                    />
                    <span className="text-sm sm:text-lg font-bold">Telegram</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Iconcloud for large screen */}
        <div className="hidden sm:flex">
          <IconCloudDemo />
        </div>
      </div>

      {/* Here are the cards for larger screen */}
      <div className="hidden h-[15rem] w-full sm:flex justify-center gap-8 items-center">
        <Cards
          heading="P2P Hiring Program"
          text="Be long term merchant and earn cash bonuses and benefits"
        />
        <Cards
          heading="Start Today"
          text="P2P is available in NPR, INR and AED"
        />
        <Cards
          heading="No KYC, No VPN"
          text="Trade without KYC and VPN with full security of user funds"
        />
      </div>

    </div>
  );
};

export default Body1;
