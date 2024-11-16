import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUser } from "react-icons/fa";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl duration-300">
      <div className="relative h-48">
        <img
          src={blog?.thumbnailImage.url}
          alt={blog?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-40 hover:opacity-20 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-2 truncate">
          {blog.title}
        </h2>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {blog?.content?.slice(0, 100)}...
        </p>
        <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt />
            <span>{new Date(blog.createdAt).toDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaUser />
            <span>{blog?.author?.username}</span>
          </div>
        </div>
        <Link
          to={`/blogs/${blog?._id}`}
          className="block text-center text-purple-500 font-semibold hover:underline"
        >
          Read more
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
