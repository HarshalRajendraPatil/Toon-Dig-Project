import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import axiosInstance from "../config/axiosConfig";
import UserProfiles from "./UserProfiles";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SearchPage = () => {
  const loggedInUser = useSelector((state) => state.user.user);
  const [query, setQuery] = useState({
    username: "",
    email: "",
    role: "",
    bio: "",
    page: 1,
    limit: 10,
  });
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch users excluding logged-in user
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/users", { params: query });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error fetching users:", error.message);
    }
    setLoading(false);
  };

  // Fetch users on query change
  useEffect(() => {
    fetchUsers();
  }, [query]);

  // Handle input changes
  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    setQuery((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8 flex items-center justify-center space-x-3">
          <FiUsers className="text-purple-500" />
          <span>Find Users</span>
        </h1>

        {/* Search Filters */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold text-gray-300 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <input
              type="text"
              name="username"
              placeholder="Search by Username"
              value={query.username}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="email"
              placeholder="Search by Email"
              value={query.email}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="bio"
              placeholder="Search by Bio"
              value={query.bio}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              name="role"
              value={query.role}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
          <button
            onClick={() => fetchUsers()}
            className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition w-full sm:w-auto"
          >
            <FaSearch className="inline-block mr-2" /> Search
          </button>
        </div>

        {/* User Results */}
        <div className="mt-8">
          {loading ? (
            <p className="text-center text-gray-400">Loading users...</p>
          ) : (
            <div>
              {users.length === 0 ? (
                <p className="text-center text-gray-500">
                  No users found matching your criteria.
                </p>
              ) : (
                <UserProfiles
                  users={users}
                  followedUserIds={loggedInUser?.following}
                />
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-4">
            {Array.from({ length: pagination.totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-5 py-2 rounded-lg ${
                  pagination.page === index + 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-400"
                } hover:bg-purple-700 hover:text-white transition`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
