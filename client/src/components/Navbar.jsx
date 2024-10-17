import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clearUser, setError } from "../store/slices/userSlice.js";
import axiosInstance from "../config/axiosConfig.js";
import { toast } from "react-toastify";

const Navbar = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logoutUser = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/logout");
      if (response.status === 200) {
        dispatch(clearUser());
        toast.success("Logged out successfully.");
      }
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.message || "Logout failed."));
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  const toggleAdminDropdown = () => {
    setAdminDropdown(!adminDropdown);
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-purple-400">
              ToonDig
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Navbar Links */}
          <div
            className={`absolute md:relative md:w-auto md:flex items-center justify-between w-full bg-gray-900 md:bg-transparent ${
              isOpen ? "block top-16 left-0 right-0 py-4" : "hidden"
            }`}
          >
            <div className="flex flex-col md:flex-row md:space-x-0 space-y-2 md:space-y-0 md:px-0">
              <Link
                to="/anime"
                className="px-2 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Anime
              </Link>
              <Link
                to="/community"
                className="px-2 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Community
              </Link>
              <Link
                to="/merchandise"
                className="px-2 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Merchandise
              </Link>
              <Link
                to="/notifications"
                className="px-2 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Notifications
              </Link>
              <Link
                to="/blog"
                className="px-2 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            </div>

            {/* Admin Dropdown */}
            {userRole === "admin" && (
              <div className="relative mt-2 md:mt-0">
                <button
                  className="py-2 pl-2 flex items-center rounded-md text-sm font-medium hover:bg-gray-800"
                  onClick={toggleAdminDropdown}
                >
                  Admin <FaCaretDown className="ml-1" />
                </button>
                {adminDropdown && (
                  <div className="absolute bg-gray-800 rounded-md shadow-lg py-2 mt-1 w-48">
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={() => {
                        setAdminDropdown(false);
                        setIsOpen(false);
                      }}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/anime-management"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={() => {
                        setAdminDropdown(false);
                        setIsOpen(false);
                      }}
                    >
                      Anime Management
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={() => {
                        setAdminDropdown(false);
                        setIsOpen(false);
                      }}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/admin/merchandise-management"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                      onClick={() => {
                        setAdminDropdown(false);
                        setIsOpen(false);
                      }}
                    >
                      Merchandise Management
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Auth Links */}
            <div className="flex flex-col md:flex-row md:space-x-0 space-y-2 md:space-y-0 mt-4 md:mt-0">
              {!userRole ? (
                <>
                  <Link
                    to="/login"
                    className="px-2 py-2 rounded-md text-sm font-medium text-blue-400 hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-2 py-2 rounded-md text-sm font-medium text-purple-400 hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="px-2 py-2 rounded-md text-sm font-medium hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="px-2 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-gray-800"
                    onClick={() => logoutUser()}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
