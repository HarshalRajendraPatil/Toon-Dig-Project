// userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";

const initialState = {
  user: null, // Stores user information
  token: "",
  isAuthenticated: false, // Tracks if the user is logged in
  isLoading: false, // Tracks loading state for authentication actions
  error: null, // Stores error message if login fails
};

// Async Thunk to add anime to favorites
export const addToFavorites = createAsyncThunk(
  "user/addToFavorites",
  async (animeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/users/favorites`, {
        animeId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to add anime to watchlist
export const addToWatchlist = createAsyncThunk(
  "user/addToWatchlist",
  async (animeId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/users/watchlist`, {
        animeId,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to add or update a review
export const addReview = createAsyncThunk(
  "user/addReview",
  async ({ animeId, reviewId, reviewText, rating }, { rejectWithValue }) => {
    try {
      let response;

      if (reviewId) {
        // PUT request to update an existing review
        response = await axiosInstance.put(`/api/reviews/${reviewId}`, {
          reviewText,
          rating,
        });
      } else {
        // POST request to create a new review
        response = await axiosInstance.post(`/api/reviews/anime/${animeId}`, {
          reviewText,
          rating,
        });
      }

      return response.data.data; // The updated user data or success response
    } catch (error) {
      return rejectWithValue(error.response.data || "Something went wrong");
    }
  }
);

// Async Thunk to delete a review
export const deleteReview = createAsyncThunk(
  "user/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/reviews/${reviewId}`);
      return response.data.data; // The updated user data or success response
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk to delete a comment
export const deleteComment = createAsyncThunk(
  "user/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api/comments/${commentId}`);
      return response.data.data; // Return the success response
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to delete the comment"
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "user/checkAuthStatus",
  async (_, { dispatch }) => {
    if (!isCookieValid()) {
      dispatch(clearUser());
    }
  }
);

export const followUser = createAsyncThunk(
  "user/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/users/${userId}/follow`);
      return response.data.data; // Assume the backend sends the updated user data
    } catch (error) {
      return rejectWithValue(
        error.response.data || "Failed to follow the user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = "";
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addToWatchlist.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Update user data after the comment is deleted
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Update user data with the response
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;

const isCookieValid = () => {
  const token = localStorage.getItem("token");

  return Boolean(token); // Replace 'authToken' with your cookie name
};
