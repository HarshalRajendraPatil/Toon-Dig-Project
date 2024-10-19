// episodeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import { toast } from "react-toastify";

// Async Thunk to fetch episodes for a season
export const fetchEpisodes = createAsyncThunk(
  "episode/fetchEpisodes",
  async (seasonId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/admin/season/${seasonId}/episode`
      );
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      return rejectWithValue(error.message);
    }
  }
);

const episodeSlice = createSlice({
  name: "episode",
  initialState: {
    episodes: [],
    currentEpisodeId: "",
    loading: false,
    error: null,
  },
  reducers: {
    clearEpisodes(state) {
      state.episodes = [];
    },
    addEpisodes(state, action) {
      state.episodes = action.payload;
    },
    setCurrentEpisode(state, action) {
      state.currentEpisodeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.episodes = action.payload;
        state.loading = false;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEpisodes, addEpisodes, setCurrentEpisode } =
  episodeSlice.actions;

export default episodeSlice.reducer;
