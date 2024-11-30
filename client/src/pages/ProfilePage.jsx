import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import WatchlistTab from "../components/profileTabs/WatchlistTab";
import OverviewTab from "../components/profileTabs/OverviewTab";
import WatchHistoryTab from "../components/profileTabs/WatchHistoryTab";
import FavoritesTab from "../components/profileTabs/FavoritesTab";
import FollowingsTab from "../components/profileTabs/FollowingsTab";
import FollowersTab from "../components/profileTabs/FollowersTab";
import SettingsTab from "../components/profileTabs/SettingsTab";
import { setUser } from "../store/slices/userSlice";
import { followUser } from "../store/slices/userSlice"; // Import followUser action
import {
  FiEdit,
  FiUser,
  FiBookmark,
  FiFilm,
  FiHeart,
  FiUsers,
  FiSettings,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axiosInstance from "../config/axiosConfig";
import RestrictedFeature from "../RestrictedFeature";

const ProfilePage = () => {
  const { user, token } = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [profilePicture, setProfilePicture] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [isFollowing, setIsFollowing] = useState(false); // State for follow status

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  const fetchUserDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/api/users/${id}`);
      setUpdatedUser(response.data.data);

      // Check follow status
      const alreadyFollowing = response.data.data.followers.includes(user._id);
      setIsFollowing(alreadyFollowing);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    } else {
      setUpdatedUser(user); // Use the logged-in user's details
    }
  }, [userId, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("username", updatedUser?.username);
      formData.append("email", updatedUser?.email);
      formData.append("bio", updatedUser?.bio || "");

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await axiosInstance.put(`/api/users`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUserData = response.data.data;
      setUpdatedUser(updatedUserData);
      dispatch(setUser({ user: updatedUserData, token }));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const changePassword = async () => {
    try {
      const { currentPassword, newPassword } = passwords;
      await axiosInstance.put(`/api/users/change-password`, {
        currentPassword,
        password: newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    }
  };

  const handleFollowToggle = async () => {
    try {
      const resultAction = await dispatch(followUser(userId));
      if (followUser.fulfilled.match(resultAction)) {
        toast.success(
          isFollowing ? "Unfollowed successfully!" : "Followed successfully!"
        );
        setIsFollowing(!isFollowing);
      } else {
        throw new Error(resultAction.payload || "Follow/Unfollow failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update follow status.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            user={updatedUser}
            passwords={passwords}
            handlePasswordChange={handlePasswordChange}
            changePassword={changePassword}
          />
        );
      case "watchlist":
        return <WatchlistTab />;
      case "history":
        return <WatchHistoryTab history={updatedUser.watchHistory} />;
      case "favorites":
        return <FavoritesTab />;
      case "followers":
        return <FollowersTab />;
      case "followings":
        return <FollowingsTab />;
      case "settings":
        return <SettingsTab settings={updatedUser.settings} />;
      default:
        return <OverviewTab user={updatedUser} />;
    }
  };

  if (!updatedUser)
    return (
      <h1 className="text-2xl text-center text-white min-w-full my-20">
        Please login to view this page ☹️
      </h1>
    );

  return (
    <RestrictedFeature>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-700 to-purple-900 p-6 sm:p-8 shadow-lg rounded-b-lg">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
              <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md">
                <img
                  src={updatedUser?.profilePicture?.url || "./profile.jpeg"}
                  alt={`${updatedUser?.username}'s profile`}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-5xl font-semibold text-white">
                  {updatedUser?.username}
                </h1>
                <p className="text-gray-300 text-sm sm:text-lg">
                  {updatedUser?.email}
                </p>
                <p className="mt-2 text-sm sm:text-lg text-white">
                  {updatedUser?.bio || "Anime enthusiast"}
                </p>
              </div>
            </div>

            {!userId && (
              <div className="flex justify-center md:justify-end w-full sm:w-auto mt-4 md:mt-0">
                <button
                  onClick={toggleEdit}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-md flex items-center space-x-2 sm:space-x-3 transition duration-300"
                >
                  <FiEdit size={18} />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}

            {userId && userId !== user._id && (
              <div className="flex justify-center md:justify-end w-full sm:w-auto mt-4 md:mt-0">
                <button
                  onClick={handleFollowToggle}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-md transition duration-300 ${
                    isFollowing
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 mt-6 px-6">
          <div className="max-w-7xl mx-auto flex space-x-6 overflow-x-auto border-b border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: <FiUser /> },
              { id: "watchlist", label: "Watchlist", icon: <FiBookmark /> },
              { id: "history", label: "History", icon: <FiFilm /> },
              { id: "favorites", label: "Favorites", icon: <FiHeart /> },
              { id: "followers", label: "Followers", icon: <FiUsers /> },
              { id: "followings", label: "Followings", icon: <FiUsers /> },
              { id: "settings", label: "Settings", icon: <FiSettings /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-t-lg flex items-center space-x-2 text-sm sm:text-base font-medium ${
                  activeTab === id
                    ? "text-indigo-500 bg-gray-900"
                    : "text-gray-400 hover:text-indigo-400"
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8 px-6">{renderTabContent()}</div>

        {/* Profile Edit Modal */}
        <Modal
          isOpen={isEditing}
          onRequestClose={() => setIsEditing(false)}
          className="bg-gray-900 text-white rounded-lg shadow-md max-w-lg w-full p-6 mx-auto outline-none relative"
          overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center"
          ariaHideApp={false}
        >
          <button
            onClick={() => setIsEditing(false)}
            className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="profilePicture" className="text-sm font-medium">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                className="block w-full mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </div>
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="block w-full mt-2 p-2 rounded-md bg-gray-800 border-gray-700 text-white text-sm"
                value={updatedUser?.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full mt-2 p-2 rounded-md bg-gray-800 border-gray-700 text-white text-sm"
                value={updatedUser?.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="bio" className="text-sm font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                className="block w-full mt-2 p-2 rounded-md bg-gray-800 border-gray-700 text-white text-sm"
                value={updatedUser?.bio}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
        </Modal>
      </div>
    </RestrictedFeature>
  );
};

export default ProfilePage;
