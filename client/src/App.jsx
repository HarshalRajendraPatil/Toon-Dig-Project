import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "./AppLayout";
import AnimeManagement from "./pages/AnimeManagement";
import AddAnimeForm from "./forms/AddAnimeForm";
import EditAnimeForm from "./forms/EditAnimeForm";
import SeasonManagement from "./pages/SeasonManagement";
import EpisodeManagement from "./pages/EpisodeManagement";
import AnimePage from "./pages/AnimePage";
import AnimeSearchPage from "./pages/AnimeSearchPage";
import ProfileApp from "./pages/ProfilePage";
import StreamingPage from "./pages/StreamingPage";
import ReviewsBreakdown from "./components/ReviewsBreakdown";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin/anime-management" element={<AnimeManagement />} />
          <Route
            path="/admin/anime-management/add-anime"
            element={<AddAnimeForm />}
          />
          <Route
            path="/admin/anime-management/edit-anime/:id"
            element={<EditAnimeForm />}
          />
          <Route
            path="/admin/anime-management/seasons/:id"
            element={<SeasonManagement />}
          />
          <Route
            path="/admin/anime-management/:animeId/episodes/:id"
            element={<EpisodeManagement />}
          />
          <Route path="/anime" element={<AnimeSearchPage />} />
          <Route path="/anime/:animeName" element={<AnimePage />} />
          <Route path="/profile" element={<ProfileApp />} />
          <Route path="/:animeName/stream" element={<StreamingPage />} />
          <Route
            path="/:animeName/all-reviews"
            element={<ReviewsBreakdown />}
          />
        </Route>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
