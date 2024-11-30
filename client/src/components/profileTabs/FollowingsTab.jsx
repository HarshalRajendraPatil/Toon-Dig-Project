import React, { useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig.js";
import LoadingSpinner from "../LoadingSpinner.jsx";
import UserProfiles from "../UserProfiles.jsx";

const FollowingsTab = () => {
  const loggedInUser = useSelector((state) => state.user.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryUserId = queryParams.get("id");

  const userIdToFetch = queryUserId || loggedInUser._id; // Use query parameter or fallback to logged-in user

  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          `/api/users/${userIdToFetch}/followings`
        );
        setFollowing(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch following list."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFollowings();
  }, [userIdToFetch]); // Re-fetch if userIdToFetch changes

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-lg text-gray-400 mb-4 flex items-center space-x-2">
        <FaUserFriends /> <span>Following</span>
      </h3>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : following?.length === 0 ? (
        <p className="text-gray-500">
          {queryUserId
            ? "This user is not following anyone yet."
            : "You are not following anyone yet."}
        </p>
      ) : (
        <UserProfiles
          users={following}
          followedUserIds={loggedInUser.following}
        />
      )}
    </div>
  );
};

export default FollowingsTab;
