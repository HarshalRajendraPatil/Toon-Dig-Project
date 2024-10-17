import React, { useState } from "react";
import WatchlistTab from "../components/profileTabs/WatchlistTab";
import OverviewTab from "../components/profileTabs/OverviewTab";
import WatchHistoryTab from "../components/profileTabs/WatchHistoryTab";
import FavoritesTab from "../components/profileTabs/FavoritesTab";
import FollowingsTab from "../components/profileTabs/FollowingsTab";
import FollowersTab from "../components/profileTabs/FollowersTab";
import SettingsTab from "../components/profileTabs/SettingsTab";
import { setUser } from "../store/slices/userSlice";
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

const ProfilePage = () => {
  const { user, token } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user }); // Clone user object
  const [profilePicture, setProfilePicture] = useState(null); // For handling new profile picture
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

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
      formData.append("username", updatedUser.username);
      formData.append("email", updatedUser.email);
      formData.append("bio", updatedUser.bio || "");

      if (profilePicture) {
        formData.append("profilePicture", profilePicture); // Add profile picture if available
      }

      // Send PUT request to update profile
      const response = await axiosInstance.put(`/api/users`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUserData = response.data.data;

      // Update local state and Redux store with updated user data
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
      const response = await axiosInstance.put(`/api/users/changePassword`, {
        currentPassword,
        newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
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
        return <WatchlistTab user={user} />;
      case "history":
        return <WatchHistoryTab history={user.watchHistory} />;
      case "favorites":
        return <FavoritesTab user={user} />;
      case "followers":
        return <FollowersTab followers={user.followers} />;
      case "followings":
        return <FollowingsTab following={user.following} />;
      case "settings":
        return <SettingsTab settings={user.settings} />;
      default:
        return <OverviewTab user={updatedUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-900 p-6 sm:p-8 shadow-lg rounded-b-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            {/* Profile Picture */}
            <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img
                src={user?.profilePicture?.url || "./profile.jpeg"}
                alt={`${user?.username}'s profile`}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Editable User Info */}
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

          {/* Edit Profile Button */}
          <div className="flex justify-center md:justify-end w-full sm:w-auto mt-4 md:mt-0">
            <button
              onClick={toggleEdit}
              className="px-4 py-2 sm:px-5 sm:py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-md flex items-center space-x-2 sm:space-x-3 transition duration-300"
            >
              <FiEdit size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 mt-6 px-6">
        <div className="max-w-7xl mx-auto flex space-x-6 overflow-x-auto border-b border-gray-700">
          {[
            { id: "overview", label: "Overview", icon: <FiUser /> },
            { id: "watchlist", label: "Watchlist", icon: <FiBookmark /> },
            { id: "history", label: "Watch History", icon: <FiFilm /> },
            { id: "favorites", label: "Favorites", icon: <FiHeart /> },
            { id: "followers", label: "Followers", icon: <FiUsers /> },
            { id: "followings", label: "Followings", icon: <FiUsers /> },
            { id: "settings", label: "Settings", icon: <FiSettings /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 text-lg font-semibold flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "text-blue-400 border-blue-400"
                  : "text-gray-400"
              } border-b-2 hover:text-blue-300 transition duration-300`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto py-10 px-4">{renderTabContent()}</div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onRequestClose={toggleEdit}
        contentLabel="Edit Profile Modal"
        className="bg-gray-800 p-6 sm:p-8 md:p-10 rounded-lg shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-[50vw] mx-auto mt-16 sm:mt-20 max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6">
          Edit Profile
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <input
            type="text"
            name="username"
            value={updatedUser?.username}
            onChange={handleInputChange}
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={updatedUser?.email}
            onChange={handleInputChange}
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Email"
          />
          <textarea
            name="bio"
            value={updatedUser?.bio}
            onChange={handleInputChange}
            className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            placeholder="Bio"
          />

          {/* Profile picture input */}
          <input
            type="file"
            onChange={handleProfilePictureChange}
            className="w-full text-white bg-gray-700 rounded-lg"
          />
        </div>

        <div className="mt-6 sm:mt-8 flex justify-end space-x-3">
          <button
            onClick={toggleEdit}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={saveProfile}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
