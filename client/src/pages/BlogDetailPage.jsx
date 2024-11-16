import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaEye,
  FaTag,
  FaCommentAlt,
  FaArrowLeft,
} from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/blogs/${id}`);
        setBlog(response.data.data);
        setLikeCount(response.data.data.likes.length);
        setDislikeCount(response.data.data.disLikes.length);
      } catch (error) {
        console.error("Error fetching blog details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (!blog)
    return <p className="text-center text-gray-400">Blog not found.</p>;

  const handleLike = async () => {
    try {
      const response = await axiosInstance.post(`/api/blogs/${blog._id}/like`);
      setLikeCount(response.data.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/blogs/${blog._id}/dislike`
      );
      setDislikeCount(response.data.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/blogs/${blog._id}/comment`,
        { commentText }
      );
      const newComment = response.data.data;

      // Update blog comments by appending the new comment
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: [{ ...newComment, commentText }, ...prevBlog.comments],
      }));

      setCommentText(""); // Clear the input
      toast.success("Comment posted");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to post comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-5xl font-bold mb-2">{blog.title}</h1>
        <p className="text-gray-400">
          By {blog.author.username} on{" "}
          {new Date(blog.createdAt).toLocaleDateString()}
        </p>

        {blog.bannerImage && (
          <img
            src={blog.bannerImage.url}
            alt={`${blog.title} banner`}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
        )}

        <div className="prose prose-lg max-w-none text-gray-300 space-y-6 mb-8">
          {blog.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="flex flex-wrap items-center space-x-4 text-lg">
          <div className="flex items-center space-x-2 text-green-500">
            <FaThumbsUp className="cursor-pointer" onClick={handleLike} />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center space-x-2 text-red-500">
            <FaThumbsDown className="cursor-pointer" onClick={handleDislike} />
            <span>{dislikeCount}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <FaEye /> <span>{blog.views} Views</span>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <h3 className="text-2xl font-semibold">Details</h3>
          <div className="flex flex-col md:flex-row justify-between">
            <p>
              Featured Status:{" "}
              <span className="font-semibold">
                {blog.isFeatured ? "Featured" : "Not Featured"}
              </span>
            </p>
            <p>
              Publication Status:{" "}
              <span className="font-semibold">
                {blog.isPublished ? "Published" : "Unpublished"}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FaTag />
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {blog.relatedAnime.length > 0 && (
          <div className="space-y-6 mb-8">
            <h3 className="text-2xl font-semibold">Related Anime</h3>
            <ul className="list-disc ml-4">
              {blog.relatedAnime.map((anime) => (
                <li key={anime._id} className="text-purple-400 hover:underline">
                  {anime.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Comments</h3>
          <ul className="space-y-4">
            {blog.comments.map((comment, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">
                  <FaCommentAlt className="mr-1" />{" "}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
                <p>{comment.commentText}</p>
              </li>
            ))}
          </ul>

          <div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="4"
              placeholder="Leave a comment..."
              className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleCommentSubmit}
              className="mt-4 px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Submit Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
