"use client";
import React, { useState, useEffect } from "react";
import Idverification from "@/components/dashboard/account/identityverification/page";
import IDUploadForm from "@/components/dashboard/account/identityverification/plus/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLoggedIn } from "@/components/AuthContext";

const Identification = () => {
  const router = useRouter();
  const { loggedIn } = useLoggedIn();
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }
  }, [session, loggedIn, router, status]);

  const handleVerifyClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const handleVerifyClick2 = () => {
    setIsModal2Open(true); // Open the modal
  };

  const handleCloseModal2 = () => {
    setIsModal2Open(false); // Close the modal
  };

  return (
    <div className="mt-12 sm:mt-0 h-full w-full flex flex-col justify-normal items-start gap-8 relative">
      {/* Main content */}
      <div className="flex flex-col gap-3 w-full">
        <h1 className="text-3xl font-bold">Identity Verification</h1>
        <p className="text-base p-2 bg-red-100 text-red-400 w-full rounded-xl">
          User can only verify once with a valid ID card or passport and a
          selfie. If multiple attempts are made, the account will be restricted.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <h1 className="text-2xl font-bold">Personal Verification</h1>
        <div className="flex flex-col sm:flex-row w-full justify-start gap-12 px-3">
          {/* Left box */}
          <div className="flex w-full sm:w-[45%] flex-col py-5 px-7 gap-6 bg-slate-100 rounded-xl">
            <h2 className="text-xl font-extrabold border-b border-slate-400 pb-5">
              Basic Verification
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-lg text-slate-400">P2P Limit</p>
              <p className="text-lg text-slate-800">5000 USDT daily</p>
            </div>
            <div className="flex flex-col gap-2 border-b border-slate-400 pb-5">
              <p className="text-lg text-slate-400">Others</p>
              <p className="text-lg text-slate-800">
                Selected events and activities
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex">
                <div className="border-l border-green-800"></div>
                <p className="text-lg text-slate-800">Requirements</p>
              </div>
              <div className="flex justify-start gap-3 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 text-slate-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm4 1.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2 3a4 4 0 0 0-3.665 2.395.75.75 0 0 0 .416 1A8.98 8.98 0 0 0 7 14.5a8.98 8.98 0 0 0 3.249-.604.75.75 0 0 0 .416-1.001A4.001 4.001 0 0 0 7 10.5Zm5-3.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 6.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75-4a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-lg text-slate-400">Personal Information</p>
              </div>
            </div>
            <button
              onClick={handleVerifyClick}
              className="w-full rounded-xl bg-mainColor text-xl font-bold p-3 hover:scale-110 transition ease-in-out duration-300"
            >
              Verify
            </button>
          </div>

          {/* Right box */}

          <div className="flex pb-16 sm:pb-0  w-full sm:w-[45%] flex-col py-5 px-7 gap-6 bg-slate-100 rounded-xl">
            <h2 className="text-xl font-extrabold border-b border-slate-400 pb-5">
              Advanced Verification
            </h2>
            <div className="flex flex-col gap-2">
              <p className="text-lg text-slate-400">P2P Limit</p>
              <p className="text-lg text-slate-800">Unlimited </p>
            </div>
            <div className="flex flex-col gap-2 border-b border-slate-400 pb-5">
              <p className="text-lg text-slate-400">Others</p>
              <p className="text-lg text-slate-800">
                Selected events and activities
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex">
                <div className="border-l border-green-800"></div>
                <p className="text-lg text-slate-800">Requirements</p>
              </div>
              <div className="flex justify-start items-center gap-6">
                <div className="flex justify-start gap-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5 text-slate-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm4 1.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2 3a4 4 0 0 0-3.665 2.395.75.75 0 0 0 .416 1A8.98 8.98 0 0 0 7 14.5a8.98 8.98 0 0 0 3.249-.604.75.75 0 0 0 .416-1.001A4.001 4.001 0 0 0 7 10.5Zm5-3.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 6.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75-4a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-lg text-slate-400">ID</p>
                </div>
                <div className="flex justify-start gap-3 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5 text-slate-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V6Zm4 1.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm2 3a4 4 0 0 0-3.665 2.395.75.75 0 0 0 .416 1A8.98 8.98 0 0 0 7 14.5a8.98 8.98 0 0 0 3.249-.604.75.75 0 0 0 .416-1.001A4.001 4.001 0 0 0 7 10.5Zm5-3.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm0 6.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75-4a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-lg text-slate-400">Selfie</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleVerifyClick2()}
              className="w-full rounded-xl bg-orange-400 text-xl font-bold p-3 hover:scale-110 transition ease-in-out duration-300"
            >
              Verify Plus
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <Idverification handleCloseModal={handleCloseModal} />}
      {isModal2Open && <IDUploadForm handleCloseModal2={handleCloseModal2} />}
    </div>
  );
};

export default Identification;
