"use client";
import React, {useState} from "react";
import Select from 'react-select';
import countries from "./Countrylist";

const CountryDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);


  return (
    <Select
      options={countries}
      value={selectedCountry}
      onChange={setSelectedCountry}
      placeholder="Select your country"
      isSearchable
      className="border p-2 rounded"
    />
  );
};

const Idverification = ({ handleCloseModal }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleCloseModal}
    >
      <div
        className="bg-white p-5 rounded-xl shadow-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Verification Form</h2>
        <form>
          <div className="flex flex-col gap-4">
            {CountryDropdown()}
            <input
              required
              type="text"
              placeholder="Surname"
              className="border p-2 rounded"
            />
            <input
              required
              type="text"
              placeholder="First name"
              className="border p-2 rounded"
            />
            {/* Dropdown */}

            <div className="relative">
              <label
                htmlFor="idType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select ID Type
              </label>
              <select
                id="idType"
                name="idType"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-mainColor"
              >
                <option value="passport">Passport</option>
                <option value="driving-license">Driving License</option>
                <option value="national-id">National ID</option>
                <option value="residence-permit">Residence Permit</option>
              </select>
            </div>
            <input
              required
              type="text"
              placeholder="ID Number"
              className="border p-2 rounded"
            />
            <input
              required
              type="date"
              placeholder="Date of Birth"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleCloseModal}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Idverification;
