// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Stores user information
  token: "",
  isAuthenticated: false, // Tracks if the user is logged in
  isLoading: false, // Tracks loading state for authentication actions
  error: null, // Stores error message if login fails
};

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
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
