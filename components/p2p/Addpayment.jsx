"use client";
import React, { useEffect, useState } from "react";
import paymentCategory from "@/components/Paymentinp";
import { useLoggedIn } from "../AuthContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AddPayment = ({ isAddPayment, setIsAddPayment }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [tempPaymentDetails, setTempPaymentDetails] = useState({});
  const { loggedIn, email } = useLoggedIn();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  const handleBackgroundClick = (e) => {
    if (e.target.id === "modalBackground") {
      setIsAddPayment(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTempPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
    }
  
    const input = { ...tempPaymentDetails, method: selectedPaymentMethod };

    let userEmail;
    if (session) {
      userEmail = session.user.email;
    }
    if (loggedIn) {
      userEmail = email;
    }

    try {
      const res = await fetch("https://binaryp2p.sytes.net/api/usercenter/payment/addPaymentMethod", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({ input, email: userEmail }),
      });

      const data = await res.json();
      if (res.status === 200) {
        setSelectedPaymentMethod("");
        setTempPaymentDetails({});
        setIsAddPayment(false);
        setIsAddPayment(false);
      }

    } catch (error) {
      console.log(error);
    }
  };

  //Checking if user is logged in
  useEffect(() => {
    if (status === "loading" || loading) return;

    if (status === "unauthenticated" && !loggedIn) {
      alert("Please login First");
      router.push("/auth/login");
    }

    if (status === "authenticated" && loggedIn) {
      setLoading(false);
    }
  }, [status, loggedIn, router, loading]);

  return (
    <>
      {isAddPayment && (
        <div
          id="modalBackground"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleBackgroundClick}
        >
          <div
            id="addPaymentForm"
            className="bg-white p-6 rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl mb-4">Add Payment Method</h2>
            <form onSubmit={handleSubmit}>
              <select
                className="block w-full mb-3 p-2 border border-gray-300 rounded"
                value={selectedPaymentMethod}
                onChange={(e) => {
                  setSelectedPaymentMethod(e.target.value);
                  setTempPaymentDetails({});
                }}
              >
                <option value="">Select Payment Method</option>
                {Object.keys(paymentCategory).map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>

              {selectedPaymentMethod &&
                Object.keys(paymentCategory[selectedPaymentMethod]).map(
                  (field) => (
                    <input
                      key={field}
                      type={
                        paymentCategory[selectedPaymentMethod][field].type ===
                        "Number"
                          ? "number"
                          : "text"
                      }
                      value={tempPaymentDetails[field] || ""}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      className="block w-full mb-3 p-2 border border-gray-300 rounded"
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      required={
                        paymentCategory[selectedPaymentMethod][field].required
                      }
                    />
                  )
                )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPayment(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-mainColor text-white rounded hover:bg-orange-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!isAddPayment && (
        <button
          onClick={() => setIsAddPayment(true)}
          className="h-10 sm:h-12 px-4 rounded-xl bg-mainColor flex justify-center items-center text-sm md:text-lg hover:bg-orange-300"
        >
          Add Payment Method
        </button>
      )}
    </>
  );
};

export default AddPayment;
