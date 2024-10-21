import express from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByAnime,
  getReviewByUserForAnime,
  getReviewsByUser,
} from "../Controllers/reviewsAndRatingsController.js"; // Adjust the path to your controller location
import isLoggedIn from "../Middlewares/isLoggedInMiddleware.js"; // Assuming you have an auth middleware to protect routes

const router = express.Router();

// Route for creating a review (Protected, user must be authenticated)
router.post("/anime/:animeId", isLoggedIn, createReview);

// Route for updating a review (Protected)
router.put("/:reviewId", isLoggedIn, updateReview);

// Route for deleting a review (Protected)
router.delete("/:reviewId", isLoggedIn, deleteReview);

// Route for getting all reviews for a specific anime (Public)
router.get("/anime/:animeId", getReviewsByAnime);

// Route for getting a user's review for a specific anime (Protected)
router.get("/anime/user/:animeId", isLoggedIn, getReviewByUserForAnime);

// Route for getting all reviews from a specific user (Protected)
router.get("/user", isLoggedIn, getReviewsByUser);

export default router;
