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
        // You can add logic to update the user's favorites here if needed
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
        // You can add logic to update the user's watchlist here if needed
        state.user = action.payload;
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
