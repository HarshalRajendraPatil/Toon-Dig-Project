import React from "react";
import { FaCog } from "react-icons/fa";

const SettingsTab = ({
  settings,
  handleSettingChange,
  saveSettings,
  toggleDarkMode,
  handleLanguageChange,
  linkedAccounts,
  linkAccount,
  unlinkAccount,
  enableTwoFactorAuth,
  deleteAccount,
  exportData,
}) => {
  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg mt-10 space-y-8">
      <h3 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
        <FaCog /> <span>Settings</span>
      </h3>

      {/* Theme Toggle Section */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Theme Settings</h4>
        <div className="flex items-center space-x-4">
          <label className="text-gray-400">Dark Mode</label>
          <input
            type="checkbox"
            checked={settings?.isDarkMode}
            onChange={toggleDarkMode}
            className="ml-2"
          />
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Language Settings</h4>
        <select
          className="w-full p-3 bg-gray-800 text-white rounded-lg mt-2"
          value={settings?.language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="jp">Japanese</option>
          <option value="fr">French</option>
          {/* Add more languages here */}
        </select>
      </div>

      {/* Linked Accounts Section */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Connected Accounts</h4>
        <ul className="space-y-4">
          {linkedAccounts?.map((account) => (
            <li key={account?.id} className="flex justify-between items-center">
              <span>{account?.provider}</span>
              <button
                onClick={() => unlinkAccount(account?.provider)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md"
              >
                Unlink
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={linkAccount}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md"
        >
          Link New Account
        </button>
      </div>

      {/* Notifications Settings */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          <label className="text-gray-400 flex items-center">
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings?.emailNotifications}
              onChange={handleSettingChange}
              className="mr-2"
            />
            Email Notifications
          </label>
          <label className="text-gray-400 flex items-center">
            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings?.smsNotifications}
              onChange={handleSettingChange}
              className="mr-2"
            />
            SMS Notifications
          </label>
          <label className="text-gray-400 flex items-center">
            <input
              type="checkbox"
              name="pushNotifications"
              checked={settings?.pushNotifications}
              onChange={handleSettingChange}
              className="mr-2"
            />
            Push Notifications
          </label>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Privacy & Security</h4>
        <div className="space-y-4">
          <button
            onClick={enableTwoFactorAuth}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
          >
            Enable Two-Factor Authentication
          </button>
        </div>
      </div>

      {/* Export Data */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4">Data Export</h4>
        <button
          onClick={exportData}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md"
        >
          Export Profile Data
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h4>
        <button
          onClick={deleteAccount}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md"
        >
          Delete Account
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition duration-300"
      >
        Save Changes
      </button>
    </div>
  );
};

export default SettingsTab;
