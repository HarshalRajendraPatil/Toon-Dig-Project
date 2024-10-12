import mongoose from "mongoose";
const { Schema } = mongoose;

const seasonSchema = new Schema({
  animeId: {
    type: Schema.Types.ObjectId,
    ref: "Anime",
    required: true, // Link the season to an anime
  },
  number: {
    type: Number,
    required: true, // Each season has a unique number (e.g., Season 1, Season 2)
  },
  title: {
    type: String,
    required: true, // Title for the season (e.g., "Winter Arc", "Final Season")
  },
  description: {
    type: String,
    required: true, // Description of the season
  },
  episodes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Episode", // References to the Episode model
    },
  ],
  releaseDate: {
    type: Date,
    required: true, // The release date of the season
  },
  coverImage: {
    url: String,
    public_id: String, // Cover image URL for the season (hosted on Cloudinary)
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of when the season was created
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Timestamp of when the season was last updated
  },
});

// Auto-update `updatedAt` field on save
seasonSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Season = mongoose.model("Season", seasonSchema);
export default Season;
