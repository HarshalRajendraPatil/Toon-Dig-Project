import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { addReview, deleteReview } from "../store/slices/userSlice.js";
import { fetchAnimeDetails } from "../store/slices/animeSlice";
import axiosInstance from "../config/axiosConfig";

const RatingReviews = ({ animeId, animeName = "" }) => {
  const dispatch = useDispatch();

  const [reviews, setReveiws] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState([]);

  const title = reviews?.anime?.title?.split(" ")?.join("-");

  useEffect(() => {
    setIsLoading(true);
    async function fetchReviews() {
      try {
        const reviews = await axiosInstance.get(
          `/api/reviews/anime/${animeId}`
        );
        setReveiws(reviews.data.data);
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.error || "Failed to fetch the reveiws"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, []);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const userReview = reviews.find(
        (review) => review.userId._id.toString() === user._id.toString()
      );

      const otherReviews = reviews
        .filter(
          (review) => review.userId._id.toString() !== user._id.toString()
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      // If the logged-in user has reviewed, place their review at the top
      if (userReview) {
        setVisibleReviews([userReview, ...otherReviews.slice(0, 2)]);
      } else {
        setVisibleReviews(otherReviews.slice(0, 3));
      }

      setUserHasReviewed(Boolean(userReview));
    }
  }, [user, reviews]);

  console.log(visibleReviews);

  const handleEditReview = (review) => {
    setIsEditing(true);
    setEditingReviewId(review._id);
    setUserRating(review.rating); // Pre-fill the rating
    setReviewText(review.reviewText); // Pre-fill the review text
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userRating || !reviewText) return; // Ensure both fields are filled

    setIsSubmitting(true);

    try {
      if (isEditing) {
        // Dispatch update action
        await dispatch(
          addReview({
            animeId,
            reviewId: editingReviewId,
            reviewText,
            rating: userRating,
          })
        ).unwrap();
        toast.success("Review updated successfully.");
      } else {
        // Dispatch create action
        await dispatch(
          addReview({ animeId, reviewText, rating: userRating })
        ).unwrap();
        toast.success("Review posted successfully.");
      }

      // Reset form state
      setUserRating(0);
      setReviewText("");
      setIsEditing(false);
      setEditingReviewId(null);
      setUserHasReviewed(true); // Prevent further submissions
    } catch (error) {
      toast.error(error.message || "Failed to post your review.");
    } finally {
      dispatch(fetchAnimeDetails(animeName)); // Update anime details
      setIsSubmitting(false);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    setIsLoading(true);
    try {
      await dispatch(deleteReview(reviewId)).unwrap();
      toast.success("Review deleted successfully.");
      setUserHasReviewed(false); // Allow the user to submit another review
    } catch (error) {
      toast.error(error.message || "Failed to delete the review.");
    } finally {
      dispatch(fetchAnimeDetails(animeName));
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-gray-800 p-3 md:p-8 rounded-lg shadow-lg">
      {/* Rating Stats Section */}
      <div className="flex justify-between items-center flex-wrap">
        <div className="text-white">
          <h2 className="text-4xl font-semibold text-purple-500">
            Rating & Reviews
          </h2>
          <p className="text-gray-300 text-lg mt-2">{reviews.length} Reviews</p>
        </div>
        <div className="flex items-center space-x-1">
          <h3 className="text-2xl font-bold text-yellow-400">
            {reviews?.reduce((acc, r) => acc + r.rating, 0) / reviews.length ||
              "0.0"}
          </h3>
          <FaStar className="h-5 w-5 text-yellow-400" />
          <p className="text-gray-300 text-lg">/ 5</p>
        </div>
      </div>

      {/* Review Submission Form */}
      {user && (isEditing || !userHasReviewed) && (
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
        {visibleReviews.length === 0 ? (
          <p className="text-gray-400">
            No reviews yet. Be the first to review this anime!
          </p>
        ) : (
          <ul className="space-y-6">
            {visibleReviews?.map((review) => (
              <li
                key={review._id}
                className="bg-gray-900 p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between flex-wrap items-center mb-4 gap-2">
                  <div className="flex items-center justify-start flex-wrap gap-2">
                    <img
                      src={
                        review.userId?.profilePicture?.url || "../profile.jpeg"
                      }
                      alt={review.userId?.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <p className="text-white font-semibold text-lg">
                      {review.userId?.username}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <h4 className="text-2xl font-bold text-yellow-400">
                      {review.rating}
                    </h4>
                    <FaStar className="h-6 w-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-gray-300 text-xl">{review.reviewText}</p>
                <p className="text-gray-500 text-md mt-2">
                  Reviewed on {new Date(review.createdAt).toLocaleString()}
                </p>
                {review?.userId?._id?.toString() === user?._id?.toString() && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
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
