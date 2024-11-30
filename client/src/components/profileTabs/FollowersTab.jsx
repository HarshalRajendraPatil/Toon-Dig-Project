import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import LoadingSpinner from "../LoadingSpinner";
import UserProfiles from "../UserProfiles";

const FollowersTab = () => {
  const loggedInUser = useSelector((state) => state.user.user);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryUserId = queryParams.get("id");

  const userIdToFetch = queryUserId || loggedInUser._id; // Use query parameter or fallback to logged-in user

  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get(
          `/api/users/${userIdToFetch}/followers`
        );
        setFollowers(response.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch followers list."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userIdToFetch]); // Re-fetch if userIdToFetch changes

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-lg text-gray-400 mb-4 flex items-center space-x-2">
        <FaUsers /> <span>Followers</span>
      </h3>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : followers.length === 0 ? (
        <p className="text-gray-500">
          {queryUserId
            ? "This user has no followers yet."
            : "You have no followers yet."}
        </p>
      ) : (
        <UserProfiles
          users={followers}
          followedUserIds={loggedInUser.following}
        />
      )}
    </div>
  );
};

export default FollowersTab;
