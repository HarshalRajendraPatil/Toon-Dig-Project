import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <div className="my-10 flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-purple-600">404</h1>
        <h2 className="text-4xl font-semibold mt-4">Page Not Found</h2>
        <p className="mt-4 text-gray-400">
          It looks like the page you're trying to find doesn't exist.
        </p>
        <div className="mt-8">
          <img
            src="../pageNotFound.png"
            alt="Anime 404"
            className="w-64 h-64 mx-auto object-contain"
          />
        </div>
        <Link
          to="/"
          className="mt-8 px-6 py-3 bg-purple-600 rounded-lg text-white flex items-center justify-center gap-2 text-lg font-medium hover:bg-purple-700 transition duration-300"
        >
          <FaHome /> Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
