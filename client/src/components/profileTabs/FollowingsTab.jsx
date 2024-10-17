import React from "react";
import { FaUserFriends } from "react-icons/fa";

const FollowingsTab = ({ following }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-lg text-gray-400 mb-4 flex items-center space-x-2">
        <FaUserFriends /> <span>Following</span>
      </h3>

      {following.length === 0 ? (
        <p className="text-gray-500">You are not following anyone yet.</p>
      ) : (
        <ul className="space-y-4">
          {following.map((user, index) => (
            <li
              key={index}
              className="bg-gray-700 p-4 rounded-lg shadow-md flex items-center space-x-4"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {user.username}
                </h4>
                <p className="text-gray-400">{user.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default FollowingsTab;
