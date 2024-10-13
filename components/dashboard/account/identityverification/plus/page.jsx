"use client";
import React, { useState } from "react";

const IDUploadForm = ({ handleCloseModal2 }) => {
  const [frontId, setFrontId] = useState(null);
  const [backId, setBackId] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  const handleFileChange = (e, setter) => {
    setter(URL.createObjectURL(e.target.files[0]));
  };



  return (
    <div onClick={handleCloseModal2} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Upload Your ID</h2>
        <form className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="front-id" className="font-semibold text-lg mb-2">
              Front of ID
            </label>
            <input
              type="file"
              id="front-id"
              accept="image/*"
              className="border border-gray-300 p-2 rounded"
              onChange={(e) => handleFileChange(e, setFrontId)}
            />
            {frontId && (
              <img
                src={frontId}
                alt="Front of ID"
                className="mt-2 rounded border border-gray-300 w-full h-auto"
              />
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="back-id" className="font-semibold text-lg mb-2">
              Back of ID
            </label>
            <input
              type="file"
              id="back-id"
              accept="image/*"
              className="border border-gray-300 p-2 rounded"
              onChange={(e) => handleFileChange(e, setBackId)}
            />
            {backId && (
              <img
                src={backId}
                alt="Back of ID"
                className="mt-2 rounded border border-gray-300 w-full h-auto"
              />
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="user-photo" className="font-semibold text-lg mb-2">
              Photo of User Holding ID
            </label>
            <input
              type="file"
              id="user-photo"
              accept="image/*"
              className="border border-gray-300 p-2 rounded"
              onChange={(e) => handleFileChange(e, setUserPhoto)}
            />
            {userPhoto && (
              <img
                src={userPhoto}
                alt="User Holding ID"
                className="mt-2 rounded border border-gray-300 w-full h-auto"
              />
            )}
          </div>

          <button
            onClick={() => handleCloseModal2()}
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default IDUploadForm;
