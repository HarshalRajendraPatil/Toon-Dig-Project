import React, { useState } from "react";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token: useParams().token,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match.");
    }

    try {
      const response = await axiosInstance.post(
        "/api/auth/reset-password",
        formData
      );
      toast.success("Password changed successfully.");
      navigate("/login");
    } catch (error) {
      console.error(error.message);
      toast.error(
        error?.response?.data?.message || "Password reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-purple-400 mb-6">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full p-2 bg-gray-700 border border-gray-600 text-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="mt-2 w-full p-2 bg-gray-700 border border-gray-600 text-gray-300 rounded focus:ring-purple-500 focus:border-purple-500"
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded transition duration-300 disabled:opacity-50"
            >
              Reset Password
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

export default ResetPassword;
