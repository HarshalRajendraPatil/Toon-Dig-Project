import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner"; // Assuming you have a loading spinner component
import axiosInstance from "../config/axiosConfig"; // Your axios instance with pre-configured settings
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const RatingReviews = ({ animeId }) => {
  const [reviews, setReviews] = useState([]);
  const anime = useSelector((state) => state?.anime?.anime);
  const user = useSelector((state) => state?.user?.user);
  const [ratingStats, setRatingStats] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for editing
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState([]);
  let title = anime?.title?.split(" ")?.join("-");

  // Fetch reviews and rating stats
  useEffect(() => {
    const fetchRatingAndReviews = async () => {
      setIsLoading(true);
      try {
        // Fetching both reviews and rating stats from the same API
        const result = await axiosInstance.get(`/api/reviews/anime/${animeId}`);

        // Assuming the API returns an object with 'ratingStats' and 'reviews'
        setRatingStats(result?.data?.data?.rating);
        setReviews(result?.data?.data);

        // Check if the logged-in user has already reviewed this anime
        const userReview = result?.data?.data?.find(
          (review) => review?.userId?._id === user?._id
        );
        setUserHasReviewed(Boolean(userReview));

        // Set initial reviews to show (3 by default)
        setVisibleReviews(result?.data?.data?.slice(0, 3));
      } catch (error) {
        console.error("Error fetching rating and reviews", error);
        toast.error("Failed to fetch the reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatingAndReviews();
  }, [animeId, user?._id]);

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userRating || !reviewText) return; // Ensure rating and review are provided
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Editing an existing review
        await axiosInstance.put(`/api/reviews/${editingReviewId}`, {
          rating: userRating,
          reviewText,
        });
        toast.success("Review updated successfully.");
      } else {
        // Submitting a new review
        await axiosInstance.post(`/api/reviews/anime/${animeId}`, {
          rating: userRating,
          reviewText,
        });
        toast.success("Review posted successfully.");
      }

      // Fetch the updated reviews after submission or edit
      const result = await axiosInstance.get(`/api/reviews/anime/${animeId}`);
      setReviews(result?.data?.data);
      setVisibleReviews(result?.data?.data?.slice(0, 3)); // Show only 3 reviews initially
      setUserRating(0); // Clear the form after submission
      setReviewText("");
      setIsEditing(false); // Reset editing state
      setEditingReviewId(null);
      setUserHasReviewed(true); // Mark that the user has reviewed
    } catch (error) {
      console.error("Error submitting review", error);
      toast.error("Failed to post your review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/api/reviews/${reviewId}`);
      toast.success("Review deleted successfully.");

      // Fetch the updated reviews after deletion
      const result = await axiosInstance.get(`/api/reviews/anime/${animeId}`);
      setReviews(result?.data?.data);
      setVisibleReviews(result?.data?.data?.slice(0, 3)); // Show only 3 reviews initially
      setUserHasReviewed(false); // Allow user to submit another review
    } catch (error) {
      console.error("Error deleting review", error);
      toast.error("Failed to delete review");
    }
  };

  // Handle editing a review
  const handleEditReview = (review) => {
    setIsEditing(true);
    setEditingReviewId(review?._id);
    setUserRating(review?.rating);
    setReviewText(review?.reviewText);
  };

  // Handle showing all reviews
  const handleShowAllReviews = () => {};

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-800 p-3 md:p-8 rounded-lg shadow-lg">
      {/* Rating Stats Section */}
      <div className="flex justify-between items-center flex-wrap">
        <div className="text-white">
          <h2 className="text-4xl font-semibold text-purple-500">
            Rating & Reviews
          </h2>
          <p className="text-gray-300 text-lg mt-2">
            {reviews?.length || 0} Reviews
          </p>
        </div>
        <div className="flex items-center space-x-1">
          <h3 className="text-2xl font-bold text-yellow-400">
            {anime?.averageRating?.toFixed(1) || "0.0"}
          </h3>
          <FaStar className="h-5 w-5 text-yellow-400" />
          <p className="text-gray-300 text-lg">/ 5</p>
        </div>
      </div>

      {/* Review Submission Form */}
      {user && (!userHasReviewed || isEditing) && (
        <form
          onSubmit={handleReviewSubmit}
          className="mt-6 bg-gray-900 p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold text-white mb-3">
            {isEditing ? "Edit Your Review" : "Submit Your Review"}
          </h3>
          <div className="flex items-center justify-start flex-wrap gap-3 mb-4">
            <label className="text-gray-400 mr-4">Your Rating:</label>
            <div className="flex flex-wrap">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-8 w-8 cursor-pointer ${
                    userRating >= i + 1 ? "text-yellow-400" : "text-gray-600"
                  }`}
                  onClick={() => setUserRating(i + 1)}
                />
              ))}
            </div>
          </div>
          <textarea
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 mb-4"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            maxLength="2000"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : isEditing
              ? "Update Review"
              : "Submit Review"}
          </button>
        </form>
      )}

      {userHasReviewed && !isEditing && (
        <p className="text-gray-300 mt-6">
          You have already reviewed this anime.
        </p>
      )}

      {/* Reviews List */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-purple-400 mb-4">
          User Reviews
        </h3>
        {visibleReviews?.length === 0 ? (
          <p className="text-gray-400">
            No reviews yet. Be the first to review this anime!
          </p>
        ) : (
          <ul className="space-y-6">
            {visibleReviews.map((review) => (
              <li
                key={review?._id}
                className="bg-gray-900 p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between flex-wrap items-center mb-4 gap-2">
                  <div className="flex items-center justify-start flex-wrap gap-2">
                    <img
                      src={
                        review.userId?.profilePicture?.url || "../profile.jpeg"
                      }
                      alt={review?.userId?.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <p className="text-white font-semibold text-lg">
                      {review?.userId?.username}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <h4 className="text-2xl font-bold text-yellow-400">
                      {review?.rating}
                    </h4>
                    <FaStar className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-gray-300 text-xl">{review?.reviewText}</p>
                <p className="text-gray-500 text-md mt-2">
                  Reviewed on {new Date(review?.createdAt).toLocaleString()}
                </p>

                {/* Show Edit and Delete buttons for the user's review */}
                {user?._id === review?.userId?._id && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review?._id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <Link
          to={`/${title}/all-reviews`}
          className="text-purple-400 hover:underline mt-6 block"
        >
          Show all reviews
        </Link>
      </div>
    </div>
  );
};

export default RatingReviews;
