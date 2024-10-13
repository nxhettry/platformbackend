"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaCaretDown } from "react-icons/fa";

const PaymentMethods = ({ paymentOptions, selectedCurrency }) => {
  const[filterPayment, setFilterPayment] = useState([]);

  // Function to handle payment method filter for mobile devices
  const handleFilterPayment = () => {
    console.log("Selected Payment Methods: ", filterPayment);
  };

  return (
    <div className="sm:border rounded-xl">
      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="w-[8rem] flex justify-center items-center sm:w-52 rounded-lg p-1 h-8 sm:h-12 text-xs sm:text-base"
          >
            <span className="font-bold">Payment method</span>
            <FaCaretDown />
          </button>
        </DrawerTrigger>
        <DrawerContent
          style={{ height: "70vh", width: "98vw", margin: "0 auto" }}
        >
          <div className="mx-auto w-full sm:w-2/5 flex flex-col justify-center gap-4 items-center">
            <DrawerHeader>
              <DrawerTitle>Payment Options</DrawerTitle>
              <DrawerDescription>
                Select the methods you want to filter
              </DrawerDescription>
            </DrawerHeader>
            <div className="sm:px-32 px-12 w-full flex flex-col justify-center items-start gap-3">
              {paymentOptions[selectedCurrency]?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={option.code}
                    name={option.code}
                    value={option.code}
                    onChange={(e) => setFilterPayment([...filterPayment, e.target.value])}
                    className="form-checkbox"
                  />
                  <div className="flex gap-2 justify-center items-center">
                    <div className={`h-3 w-[3px] ${option.color}`}></div>
                    <label htmlFor={option.code} className={`rounded`}>
                      {option.code}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <div className="flex justify-center items-center gap-6 w-full">
                  <button onClick={handleFilterPayment} className="h-12 w-40 bg-mainColor px-2 py-1 rounded-xl">
                    Search
                  </button>
                  <button
                    className="text-red-500 hover:bg-gray-100 rounded-lg h-12 w-28"
                  >
                    Cancel
                  </button>
                </div>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default PaymentMethods;
