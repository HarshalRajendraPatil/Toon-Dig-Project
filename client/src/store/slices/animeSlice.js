// animeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";

// Async Thunk to fetch anime details
export const fetchAnimeDetails = createAsyncThunk(
  "anime/fetchAnimeDetails",
  async (animeName, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/admin/anime/${animeName}`);
      return response.data.data;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const animeSlice = createSlice({
  name: "anime",
  initialState: {
    anime: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAnime(state) {
      state.anime = null;
    },
    addAnime(state, action) {
      state.anime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnimeDetails.fulfilled, (state, action) => {
        state.anime = action.payload;
        state.loading = false;
      })
      .addCase(fetchAnimeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnime, addAnime } = animeSlice.actions;

export default animeSlice.reducer;
