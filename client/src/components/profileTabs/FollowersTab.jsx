import React from "react";
import { FaUsers } from "react-icons/fa";

const FollowersTab = ({ followers }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-lg text-gray-400 mb-4 flex items-center space-x-2">
        <FaUsers /> <span>Followers</span>
      </h3>

      {followers.length === 0 ? (
        <p className="text-gray-500">You have no followers yet.</p>
      ) : (
        <ul className="space-y-4">
          {followers.map((follower, index) => (
            <li
              key={index}
              className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center space-x-4"
            >
              <img
                src={follower.avatar}
                alt={follower.username}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {follower.username}
                </h4>
                <p className="text-gray-400">{follower.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default FollowersTab;
