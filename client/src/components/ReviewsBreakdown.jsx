import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

const ReviewsBreakdown = () => {
  const anime = useSelector((state) => state.anime.anime);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [ratingStats, setRatingStats] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);

  const calculateRatingStats = (reviewsArray) => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviewsArray.forEach((review) => {
      stats[review.rating] = (stats[review.rating] || 0) + 1;
    });

    return stats;
  };

  useEffect(() => {
    const fetchInitialReviews = async () => {
      try {
        const result = await axiosInstance.get(
          `/api/reviews/anime/${anime._id}?page=1`
        );
        const initialReviews = result.data.data;
        setReviews(initialReviews);
        setFilteredReviews(initialReviews);

        const calculatedStats = calculateRatingStats(initialReviews);
        setRatingStats(calculatedStats);

        if (initialReviews.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching reviews", error);
        toast.error("Failed to load the reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialReviews();
  }, [anime]);

  const fetchMoreReviews = async () => {
    try {
      const result = await axiosInstance.get(
        `/api/reviews/anime/${anime._id}?page=${page + 1}`
      );
      const newReviews = result.data.data;

      setReviews((prevReviews) => [...prevReviews, ...newReviews]);

      if (selectedRating) {
        const filtered = newReviews.filter(
          (review) => review.rating === selectedRating
        );
        setFilteredReviews((prev) => [...prev, ...filtered]);
      } else {
        setFilteredReviews((prev) => [...prev, ...newReviews]);
      }

      const updatedStats = calculateRatingStats([...reviews, ...newReviews]);
      setRatingStats(updatedStats);

      setPage(page + 1);

      if (newReviews.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more reviews", error);
      toast.error("Failed to load more reviews.");
    }
  };

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
    const filtered = reviews.filter((review) => review.rating === rating);
    setFilteredReviews(filtered);
  };

  if (isLoading) return <LoadingSpinner />;

  const totalReviews = reviews.length;

  return (
    <div className="bg-gray-900 p-4 md:p-8 rounded-xl shadow-lg text-white">
      {/* Ratings Breakdown */}
      <div className="text-white mb-10">
        <h2 className="text-3xl font-bold text-white mb-6">User Reviews</h2>
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-4xl font-semibold text-yellow-400">
            {(
              (5 * ratingStats[5] +
                4 * ratingStats[4] +
                3 * ratingStats[3] +
                2 * ratingStats[2] +
                1 * ratingStats[1]) /
              totalReviews
            ).toFixed(1) || 0}
          </h3>
          <FaStar className="text-yellow-400" />
          <span className="text-gray-300 text-lg">
            out of 5 ({totalReviews} reviews)
          </span>
        </div>

        {/* Breakdown per star */}
        {[5, 4, 3, 2, 1].map((rating) => (
          <div
            key={rating}
            className="flex items-center space-x-3 mb-2 cursor-pointer"
            onClick={() => handleRatingFilter(rating)}
          >
            <span className="font-semibold justify-center items-center gap-3 flex text-gray-300">
              {rating} <FaStar className="text-yellow-400" />
            </span>
            <div className="relative w-3/4 h-4 rounded-lg bg-gray-700 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-yellow-400 rounded-lg"
                style={{
                  width: `${(ratingStats[rating] / totalReviews) * 100 || 0}%`,
                }}
              />
            </div>
            <span className="text-gray-300">
              {((ratingStats[rating] / totalReviews) * 100 || 0).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
        <InfiniteScroll
          dataLength={filteredReviews.length}
          next={fetchMoreReviews}
          hasMore={hasMore}
          loader={<LoadingSpinner />}
          endMessage={
            <p className="text-gray-400 text-center mt-4">
              No more reviews to show.
            </p>
          }
        >
          <ul className="space-y-6">
            {filteredReviews.map((review) => (
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
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ReviewsBreakdown;
