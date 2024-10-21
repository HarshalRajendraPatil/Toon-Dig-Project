import ReviewsAndRatings from "../models/ReviewsAndRatingsModel.js";
import catchAsync from "../Utils/catchAsync.js";
import CustomError from "../Utils/CustomError.js";

export const createReview = catchAsync(async (req, res, next) => {
  const { animeId } = req.params;
  const { rating, reviewText } = req.body;
  const userId = req.user._id; // Assuming the user is authenticated

  if (rating === 0 || rating > 5)
    return next(new CustomError("Please provide a valid rating", 400));

  const newReview = await ReviewsAndRatings.create({
    animeId,
    userId,
    rating,
    reviewText,
  });

  req.user.reviewsAndRatings.push(newReview);
  req.user.stats.totalReviews += 1;
  await req.user.save();

  res.status(201).json({
    success: true,
    data: newReview,
  });
});

export const updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { rating, reviewText } = req.body;
  const userId = req.user._id; // Assuming the user is authenticated

  const review = await ReviewsAndRatings.findOne({
    _id: reviewId,
    userId,
  });

  if (!review)
    return next(
      new CustomError(
        "Review not found or you're not authorized to update this review",
        404
      )
    );

  // Update the review fields
  review.rating = rating || review.rating;
  review.reviewText = reviewText || review.reviewText;
  review.updatedAt = Date.now();

  await review.save();

  res.status(200).json({
    success: true,
    data: review,
  });
};

export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const userId = req.user._id; // Assuming the user is authenticated

  const review = await ReviewsAndRatings.findOneAndDelete({
    _id: reviewId,
    userId,
  });

  if (!review)
    return next(
      new CustomError(
        "Review not found or you're not authorized to update this review",
        404
      )
    );

  req.user.reviewsAndRatings = req.user.reviewsAndRatings.filter(
    (id) => id.toString() !== review._id.toString()
  );
  if (!(req.user.stats.totalReviews === 0)) req.user.stats.totalReviews -= 1;
  await req.user.save();

  res.status(204).json({
    success: true,
    data: "",
  });
};
export const getReviewsByAnime = async (req, res, next) => {
  const { animeId } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 reviews per page

  const skip = (page - 1) * limit; // Calculate how many documents to skip

  const totalReviews = await ReviewsAndRatings.countDocuments({ animeId });
  const reviews = await ReviewsAndRatings.find({ animeId })
    .populate("userId", "username profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit)); // Ensure limit is an integer

  res.status(200).json({
    success: true,
    totalReviews, // Total number of reviews
    currentPage: Number(page),
    totalPages: Math.ceil(totalReviews / limit),
    data: reviews,
  });
};

export const getReviewByUserForAnime = async (req, res, next) => {
  const { animeId } = req.params;
  const userId = req.user._id;

  try {
    const review = await ReviewsAndRatings.findOne({ animeId, userId });

    if (!review)
      return next(new CustomError("No reviews posted by the user.", 404));

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    return next(new CustomError("Error fetching user review.", 500));
  }
};

export const getReviewsByUser = async (req, res, next) => {
  const userId = req.user._id; // Assuming the user is authenticated
  const { page = 1, limit = 10 } = req.query; // Default to page 1, 10 reviews per page

  const skip = (page - 1) * limit; // Calculate how many documents to skip

  const totalReviews = await ReviewsAndRatings.countDocuments({ userId });
  const reviews = await ReviewsAndRatings.find({ userId })
    .populate("animeId", "title coverImage")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit)); // Ensure limit is an integer

  if (!reviews.length)
    return next(new CustomError("No reviews found for this user.", 404));

  res.status(200).json({
    success: true,
    totalReviews, // Total number of reviews
    currentPage: Number(page),
    totalPages: Math.ceil(totalReviews / limit),
    data: reviews,
  });
};
