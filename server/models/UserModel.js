import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      sparse: true, // Optional for OAuth users
    },
    password: {
      type: String,
      minLength: [8, "Password must be at least 8 characters long"],
      required: function () {
        return !this.googleId && !this.facebookId; // Required only if no OAuth
      },
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: {
      url: String,
      public_id: String,
    },
    bio: {
      type: String,
    },
    activities: [
      {
        type: String, // Description of the activity
        timestamp: { type: Date, default: Date.now }, // Activity timestamp
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },

    // OAuth Information
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },

    // User roles and permissions
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    // User Activity
    watchHistory: [
      {
        animeId: { type: mongoose.Schema.Types.ObjectId, ref: "Anime" },
        episodeId: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Anime" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Anime" }],

    // New fields for tracking stats
    stats: {
      animeWatched: { type: Number, default: 0 }, // Total anime watched
      totalHoursSpent: { type: Number, default: 0 }, // Total hours spent watching anime
      totalReviews: { type: Number, default: 0 }, // Total reviews written by the user
      totalComments: { type: Number, default: 0 },
    },

    // Notifications
    notifications: [
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      },
    ],

    // Comments and Reviews
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reviewsAndRatings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ReviewsAndRatings" },
    ],

    // Follow System
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Subscriptions and Purchases
    subscriptions: [
      {
        type: { type: String, enum: ["premium", "basic"], required: true },
        startedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
      },
    ],
    purchases: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Merchandise" },
        purchasedAt: { type: Date, default: Date.now },
        price: { type: Number, required: true },
      },
    ],

    // Community and Interaction
    fanArt: [{ type: mongoose.Schema.Types.ObjectId, ref: "FanArt" }],
    blogPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],

    // Preferences and Settings
    darkMode: { type: Boolean, default: false },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      inAppNotifications: { type: Boolean, default: true },
      // Added these based on your settings page
      language: { type: String, default: "en" }, // User's preferred language
      smsNotifications: { type: Boolean, default: false }, // SMS notifications
      twoFactorAuthEnabled: { type: Boolean, default: false }, // Two-factor authentication
    },
  },
  { timestamps: true }
);

// Middleware to update the `updatedAt` field
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save hook to hash the password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
