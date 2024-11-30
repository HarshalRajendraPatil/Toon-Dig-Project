import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { followUser } from "../store/slices/userSlice.js"; // Adjust path to your userSlice

const UserProfiles = ({ users, followedUserIds = [] }) => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user.user._id);
  const [followStates, setFollowStates] = useState({});

  // Initialize follow states based on followedUserIds
  useEffect(() => {
    const initialFollowStates = users.reduce((acc, user) => {
      acc[user._id] = followedUserIds.includes(user._id);
      return acc;
    }, {});
    setFollowStates(initialFollowStates);
  }, [users, followedUserIds]);

  const handleFollowToggle = async (userId) => {
    try {
      let resultAction;

      if (followStates[userId]) {
        // Dispatch unfollow action
        resultAction = dispatch(followUser(userId));
        if (followUser.fulfilled.match(resultAction)) {
          toast.success("Unfollowed successfully");
        }
      } else {
        // Dispatch follow action
        resultAction = dispatch(followUser(userId));
        if (followUser.fulfilled.match(resultAction)) {
          toast.success("Followed successfully");
        }
      }

      // Toggle follow state immediately after a successful request
      setFollowStates((prevState) => ({
        ...prevState,
        [userId]: !prevState[userId],
      }));
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  return (
    <div>
      <ul className="space-y-3">
        {users.map((user, index) => (
          <li key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between flex-col md:flex-row gap-3">
              <Link
                to={`/profile?id=${user._id}`}
                className="flex items-center justify-center gap-1 flex-col md:flex-row md:gap-3"
              >
                <img
                  src={user.profilePicture?.url || "../../profile.jpeg"} // Default avatar fallback
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg font-semibold text-white text-center md:text-left">
                    {user.username}
                  </h4>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </Link>
              {user._id !== loggedInUserId && ( // Hide follow/unfollow button for self
                <button
                  onClick={() => handleFollowToggle(user._id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    followStates[user._id]
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {followStates[user._id] ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfiles;
