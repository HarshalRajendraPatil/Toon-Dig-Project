import mongoose from "mongoose";
const { Schema } = mongoose;

const AnimeSchema = new Schema({
  title: {
    type: String,
    required: [true, "Anime title is required"],
    minlength: [1, "Anime title must be at least 1 character long"],
    maxlength: [100, "Anime title must be less than 100 characters"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [1000, "Description must be less than 1000 characters"],
  },
  genres: {
    type: [String],
    required: [true, "At least one genre is required"],
    validate: [genreLimit, "You can add a maximum of 5 genres"],
  },
  releaseDate: {
    type: Date,
    required: [true, "Release date is required"],
  },
  seasons: [{ type: Schema.Types.ObjectId, ref: "Season" }],
  status: {
    type: String,
    required: [true, "Status is required"],
    enum: {
      values: ["ongoing", "completed"],
      message: "{VALUE} is not a valid status",
    },
  },
  imageUrl: {
    url: String,
    public_id: String,
  },
  rank: {
    type: Number,
    default: 0,
    min: [0, "Rank must be at least 0"],
    max: [100, "Rank cannot exceed 100"],
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, "Rating must be at least 0"],
    max: [5, "Rating cannot exceed 5"],
  },
  reviewsAndRating: [
    {
      type: Schema.Types.ObjectId,
      ref: "ReviewAndRatings",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Custom validator for genres limit
function genreLimit(val) {
  return val.length <= 5; // Maximum 5 genres allowed
}

// Middleware to update `updatedAt` field on document update
AnimeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

AnimeSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = Date.now();
  next();
});

const Anime = mongoose.model("Anime", AnimeSchema);

export default Anime;
