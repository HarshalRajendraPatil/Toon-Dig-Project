import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError } from "../store/slices/userSlice"; // Import actions from the userSlice

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading); // Get the loading state from Redux

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true)); // Set loading to true

    if (!formData?.password?.trim() || !formData?.email?.trim()) {
      dispatch(setLoading(false)); // Set loading to false if validation fails
      return toast.error("Fill out all the fields correctly.");
    }

    try {
      const response = await axiosInstance.post("/api/auth/login", formData);
      dispatch(
        setUser({ user: response.data.data, token: response.data.token })
      ); // Set the user data in Redux store
      toast.success("Login Successful.");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      dispatch(setError(error?.response?.data?.message || "Login failed."));
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      dispatch(setLoading(false)); // Set loading to false after API call completes
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-purple-400 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading} // Disable button when loading
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Divider */}
          <div className="text-center text-gray-400 mt-4">or</div>

          {/* OAuth Buttons */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-300">
              Login with Google
            </button>
            <button className="w-full py-2 bg-blue-800 hover:bg-blue-900 text-white font-semibold rounded transition duration-300">
              Login with Facebook
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-center mt-6 text-gray-300">
            <Link
              to="/forgot-password"
              className="text-purple-400 hover:text-purple-500"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Don't have an account */}
          <div className="text-center mt-6 text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-500"
            >
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
