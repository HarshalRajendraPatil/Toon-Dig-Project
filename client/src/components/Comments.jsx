import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice.js";
import { toast } from "react-toastify";
import axiosInstance from "../config/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";

const Comments = ({ episodeId }) => {
  const authenticated = useSelector((state) => state.user.isAuthenticated);
  const userId = useSelector((state) => state.user.user._id); // Get current user's ID
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);
  const COMMENTS_PER_PAGE = 5; // Number of comments to fetch per page

  // Store comment edit states
  const [editingCommentId, setEditingCommentId] = useState(null); // ID of the comment being edited
  const [editCommentText, setEditCommentText] = useState(""); // Edited comment text

  useEffect(() => {
    fetchComments();
  }, [episodeId]);

  // Fetch initial comments
  const fetchComments = async (initialLoad = true) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/comments/${episodeId}?page=${page}&limit=${COMMENTS_PER_PAGE}`
      );
      const newComments = res.data.data;

      if (initialLoad) {
        setComments(newComments);
      } else {
        setComments((prevComments) => [...prevComments, ...newComments]);
      }

      setHasMore(newComments.length === COMMENTS_PER_PAGE);
    } catch (error) {
      if (authenticated)
        toast.error(error.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  // Handle "Load More Comments"
  const handleLoadMoreClick = () => {
    setInfiniteScrollEnabled(true);
    setPage(page + 1);
    fetchComments(false);
  };

  const fetchMoreComments = async () => {
    setPage(page + 1);
    fetchComments(false);
  };

  // Handle comment submission
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    try {
      const res = await axiosInstance.post(`/api/comments/${episodeId}`, {
        commentText: newComment,
      });
      const postedComment = res.data.data;

      setComments((comments) => [postedComment, ...comments]);
      setNewComment("");

      toast.success("Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/comments/${commentId}`);

      // Directly update comments state
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );

      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  // Handle comment edit
  const handleEditComment = async (commentId) => {
    if (!editCommentText.trim()) return toast.error("Comment cannot be empty");

    try {
      const res = await axiosInstance.put(`/api/comments/${commentId}`, {
        commentText: editCommentText,
      });

      const updatedComment = res.data.data;

      setComments((comments) =>
        comments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );

      // Exit edit mode
      setEditingCommentId(null);
      setEditCommentText("");

      toast.success("Comment updated");
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  return (
    <div className="comments-section mt-8">
      {/* Comment Form */}
      {authenticated && (
        <div className="comment-form bg-gradient-to-r from-indigo-900 via-purple-900 to-gray-900 p-6 rounded-lg shadow-xl mb-6">
          <h3 className="text-3xl font-bold mb-6 text-white">
            Leave a Comment
          </h3>
          <form onSubmit={handlePostComment} className="flex flex-col gap-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-800 text-white p-4 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 text-lg"
              rows="4"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-500 hover:to-purple-600 text-white py-3 px-6 rounded-xl shadow-md transform transition duration-300 hover:scale-105 text-lg font-semibold"
              disabled={!newComment.trim() || loading}
            >
              Post Comment
            </button>
          </form>
        </div>
      )}

      {/* Display Comments */}
      <div className="comments-list bg-gray-900 p-6 rounded-lg shadow-xl">
        <h3 className="text-3xl font-bold mb-6 text-white">Comments</h3>
        {comments.length > 0 ? (
          <div>
            {comments.map((comment, index) => (
              <div
                key={index}
                className="comment-item mb-6 p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="comment-author flex items-center gap-3 mb-3">
                  <img
                    src={
                      comment?.userId?.profilePicture?.url ||
                      "/default-avatar.png"
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full shadow-lg"
                  />
                  <p className="font-bold text-lg text-white">
                    {comment.userId.username}
                  </p>
                </div>

                {/* Inline Comment Edit Mode */}
                {editingCommentId === comment._id ? (
                  <div className="comment-edit-body">
                    <textarea
                      value={editCommentText}
                      onChange={(e) => setEditCommentText(e.target.value)}
                      className="w-full bg-gray-800 text-white p-4 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 text-lg"
                      rows="3"
                    />
                    <div className="mt-3 flex gap-4">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditCommentText("");
                        }}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="comment-body">
                    <p className="text-gray-300 text-lg">
                      {comment.commentText}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>

                    {/* Edit and Delete Buttons (Visible only to the comment author) */}
                    {comment.userId._id === userId && (
                      <div className="mt-2 flex gap-4">
                        {/* Edit Comment Button */}
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditCommentText(comment.commentText); // Load existing comment text into state
                          }}
                          className="text-blue-500 hover:underline font-semibold text-lg"
                        >
                          Edit
                        </button>

                        {/* Delete Comment Button */}
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:underline font-semibold text-lg"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Load More Button */}
            {!infiniteScrollEnabled && hasMore && (
              <button
                onClick={handleLoadMoreClick}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-500 hover:to-purple-600 text-white py-3 px-6 rounded-xl shadow-md w-full font-semibold text-lg transform transition duration-300 hover:scale-105 mt-6"
              >
                Load More Comments
              </button>
            )}

            {/* Infinite Scroll */}
            {infiniteScrollEnabled && (
              <InfiniteScroll
                dataLength={comments.length}
                next={fetchMoreComments}
                hasMore={hasMore}
                loader={<h4 className="text-center text-white">Loading...</h4>}
                endMessage={
                  <p className="text-center text-gray-500">No more comments</p>
                }
              />
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
