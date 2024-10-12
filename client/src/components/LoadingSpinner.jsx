import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="w-32 h-32 border-8 border-gray-300 border-t-8 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
