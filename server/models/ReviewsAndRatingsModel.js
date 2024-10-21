import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the schema for reviews and ratings
const reviewsAndRatingsSchema = new Schema(
  {
    animeId: {
      type: Schema.Types.ObjectId,
      ref: "Anime",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Calculate average ratings and other statistics
reviewsAndRatingsSchema.statics.calculateRatings = async function (animeId) {
  const stats = await this.aggregate([
    {
      $match: { animeId: new mongoose.Types.ObjectId(animeId) },
    },
    {
      $group: {
        _id: "$animeId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    if (stats.length > 0) {
      await this.model("Anime").findByIdAndUpdate(animeId, {
        averageRating: stats[0].averageRating,
        totalReviews: stats[0].totalReviews,
      });
    } else {
      await this.model("Anime").findByIdAndUpdate(animeId, {
        averageRating: 0,
        totalReviews: 0,
      });
    }
  } catch (err) {
    console.error("Error updating rating stats: ", err);
  }
};

// After saving a review, recalculate the ratings
reviewsAndRatingsSchema.post("save", async function () {
  await this.constructor.calculateRatings(this.animeId);
});

// Hook for handling `findOneAndDelete` or `findByIdAndDelete`
reviewsAndRatingsSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calculateRatings(doc.animeId);
  }
});

// Use `findByIdAndRemove` hook
reviewsAndRatingsSchema.post("findByIdAndRemove", async function (doc) {
  if (doc) {
    await doc.constructor.calculateRatings(doc.animeId);
  }
});

const ReviewsAndRatings = mongoose.model(
  "ReviewsAndRatings",
  reviewsAndRatingsSchema
);

export default ReviewsAndRatings;
