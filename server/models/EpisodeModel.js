import mongoose from "mongoose";
const { Schema } = mongoose;

const episodeSchema = new Schema({
  seasonId: {
    type: Schema.Types.ObjectId,
    ref: "Season",
    required: true, // Each episode is linked to a specific season
  },
  number: {
    type: Number,
    required: true, // Unique episode number within a season
  },
  title: {
    type: String,
    required: true, // Title of the episode
  },
  description: {
    type: String,
    required: true, // Short description of the episode
  },
  videoUrl: {
    type: String,
    required: true, // URL for the episode video (YouTube link for embedding)
  },
  thumbnailUrl: {
    type: String,
    required: true, // Thumbnail image for the episode (hosted on Cloudinary)
  },
  duration: {
    type: Number,
    required: true, // Duration of the episode in minutes
  },
  airDate: {
    type: Date,
    required: true, // Original air date of the episode
  },
  createdAt: {
    type: Date,
    default: Date.now, // Creation timestamp
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Last updated timestamp
  },
});

// Auto-update `updatedAt` field on save
episodeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Episode = mongoose.model("Episode", episodeSchema);

export default Episode;
