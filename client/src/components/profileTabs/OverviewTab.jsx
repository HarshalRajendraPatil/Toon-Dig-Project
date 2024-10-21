import React from "react";
import { FiLock, FiCalendar } from "react-icons/fi";
import { FaChartPie } from "react-icons/fa";
import { Line } from "react-chartjs-2"; // For stats chart (Install chart.js)
import Chart from "chart.js/auto";

const OverviewTab = ({
  user,
  passwords,
  handlePasswordChange,
  changePassword,
}) => {
  // Mock data for stats chart (you can pull actual data from user stats)
  const data = {
    labels: ["Watchlist", "Favorites", "Watch History", "Anime Watched"],
    datasets: [
      {
        label: "Profile Stats",
        data: [
          user?.stats?.watchlistCount || 0,
          user?.stats?.favoritesCount || 0,
          user?.stats?.watchHistoryCount || 0,
          user?.stats?.animeWatched || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const renderBadges = () => (
    <div className="mt-10 space-y-4">
      <h3 className="text-2xl font-semibold">Achievements</h3>
      <div className="flex space-x-4">
        {user?.stats?.animeWatched >= 50 && (
          <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md">
            Anime Fanatic (50+ Anime Watched)
          </div>
        )}
        {user?.stats?.favoritesCount >= 10 && (
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
            Super Fan (10+ Favorites)
          </div>
        )}
      </div>
    </div>
  );

  const renderActivityTimeline = () => (
    <div className="mt-10 space-y-4">
      <h3 className="text-2xl font-semibold">Recent Activity</h3>
      <ul className="space-y-3">
        {user?.activities?.length === 0 ? (
          <h1>No recent activities recorded.</h1>
        ) : (
          user?.activities?.map((activity, index) => (
            <li
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4"
            >
              <FiCalendar className="text-purple-500" />
              <span>{activity?.description}</span>
              <span className="text-gray-500 text-sm">
                {activity?.timestamp}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  // New User Contributions Section
  const renderUserContributions = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg text-gray-400 mb-4">User Contributions</h3>
      <div className="space-y-2">
        <p className="text-xl">
          <strong>Total Hours Spent Watching:</strong>{" "}
          {user?.stats?.totalHoursSpent || 0} hours
        </p>
        <p className="text-xl">
          <strong>Total Reviews Written:</strong>{" "}
          {user?.stats?.totalReviews || 0}
        </p>
        <p className="text-xl">
          <strong>Total Comments Posted:</strong>{" "}
          {user?.stats?.totalComments || 0}
        </p>
        <p className="text-xl">
          <strong>Total Ratings Given:</strong> {user?.stats?.totalReviews || 0}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-4xl font-semibold mb-8">Profile Overview</h2>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg text-gray-400 mb-4 flex items-center space-x-2">
            <FaChartPie /> <span>Profile Stats</span>
          </h3>

          {/* Fixed Chart Container */}
          <div className="relative" style={{ height: "250px" }}>
            <Line
              data={data}
              options={{
                maintainAspectRatio: false,
                responsive: true,
              }}
              height={250} // Adjust chart height here
            />
          </div>
        </div>

        {/* User Contributions Section */}
        {renderUserContributions()}
      </div>

      {/* Badges for Milestones */}
      {renderBadges()}

      {/* User Activity Timeline */}
      {renderActivityTimeline()}

      {/* Change Password Section */}
      <div className="mt-10 bg-gray-800 p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
          <FiLock /> <span>Change Password</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwords?.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg mt-2"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="text-gray-400">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords?.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg mt-2"
              placeholder="Enter new password"
            />
            <p className="mt-2 text-sm text-gray-500">
              Password Strength: {/* Add a password strength indicator here */}
              <span className="text-green-400">Strong</span>
            </p>
          </div>
        </div>
        <button
          onClick={changePassword}
          className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition duration-300"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default OverviewTab;
