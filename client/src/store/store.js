import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js"; // Import the user slice reducer
import animeReducer from "./slices/animeSlice.js";
import seasonReducer from "./slices/seasonSlice.js";
import episodeReducer from "./slices/episodeSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer, // Add other slices when created
  anime: animeReducer,
  season: seasonReducer,
  episode: episodeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store and add the user slice
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["REGISTER", "REHYDRATE"], // Ignore for specific actions
        ignoredActionPaths: ["meta.arg", "register", "rehydrate"], // Ignore specific paths
        ignoredPaths: ["items.dates"], // Ignore specific state paths
      },
    }),
});

export default store;
