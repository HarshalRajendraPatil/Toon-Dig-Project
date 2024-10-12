import React, { useState } from "react";
import axiosInstance from "../config/axiosConfig.js";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice.js";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form data
    if (
      !formData?.confirmPassword?.trim() ||
      !formData?.password?.trim() ||
      !formData?.username?.trim() ||
      !formData?.email?.trim()
    ) {
      setLoading(false);
      return toast.error(
        error?.response?.data?.message || "Something went wrong."
      );
    }

    if (formData?.password !== formData?.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match.");
    }

    // Perform API call to register the user
    try {
      const response = await axiosInstance.post("/api/auth/register", formData);

      // Assuming response.data contains the registered user details
      dispatch(setUser(response.data.data)); // Update global state with the registered user

      toast.success("Registration Successful.");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error.message);
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-purple-400 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-2 w-full p-2 bg-gray-700 border border-gray-600 text-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full p-2 bg-gray-700 border border-gray-600 text-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full p-2 bg-gray-700 border border-gray-600 text-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-2 w-full p-2 bg-gray-700 border border-gray-600 text-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Confirm your password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded transition duration-300 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Create Account"}
            </button>
          </div>

          {/* Divider */}
          <div className="text-center text-gray-400 mt-4">or</div>

          {/* OAuth Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-300">
              Sign up with Google
            </button>
            <button className="w-full py-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded transition duration-300">
              Sign up with Facebook
            </button>
          </div>

          {/* Already have an account */}
          <div className="text-center mt-6 text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-500">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
