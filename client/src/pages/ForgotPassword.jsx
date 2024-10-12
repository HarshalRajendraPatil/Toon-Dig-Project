import React, { useState } from "react";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData?.email?.trim()) {
      setLoading(false);
      return toast.error("Please provide the registered email.");
    }

    try {
      const response = await axiosInstance.post(
        "/api/auth/forgot-password",
        formData
      );
      setFormData({ email: "" });
      toast.success("Email sent successfully.");
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-purple-400 mb-6">
          Forgot Password
        </h2>
        <p className="text-center text-gray-400 mb-4">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
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

          {/* Submit Button */}
          <div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded transition duration-300 disabled:opacity-50"
            >
              Send Reset Link
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-6 text-gray-300">
            <a href="/login" className="text-purple-400 hover:text-purple-500">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
