// seasonSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";

// Async Thunk to fetch season details
export const fetchSeasonInfo = createAsyncThunk(
  "season/fetchSeasonInfo",
  async ({ animeId, seasonId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/anime/${animeId}/season/${seasonId}`
      );
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      return rejectWithValue(error.message);
    }
  }
);

const seasonSlice = createSlice({
  name: "season",
  initialState: {
    seasonInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSeason(state) {
      state.seasonInfo = null;
    },
    addSeason(state, action) {
      state.seasonInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeasonInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeasonInfo.fulfilled, (state, action) => {
        state.seasonInfo = action.payload;
        state.loading = false;
      })
      .addCase(fetchSeasonInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSeason, addSeason } = seasonSlice.actions;

export default seasonSlice.reducer;
