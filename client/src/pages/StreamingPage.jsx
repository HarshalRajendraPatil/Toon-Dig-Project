import React, { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import EpisodeList from "../components/EpisodeList";
import { useSelector } from "react-redux";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

const StreamingPage = () => {
  const [isTheaterMode, setTheaterMode] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState({});
  const seasonId = useSelector((state) => state.season.seasonInfo._id);
  const animeDetails = useSelector((state) => state.anime.anime);
  const { episodes } = useSelector((state) => state.episode);
  const [loading, setLoading] = useState(false);
  const episodeId = useSelector((state) => state?.episode?.currentEpisodeId);
  console.log(activeEpisode.videoUrl);

  useEffect(() => {
    setLoading(true);
    try {
      const fetchEpisode = async () => {
        const episode = await axiosInstance.get(
          `/api/admin/season/${seasonId}/episode/${episodeId}`
        );
        setActiveEpisode(episode.data.data);
      };
      fetchEpisode();
    } catch (error) {
      console.log(error);
      toast.error("Failed to load the episode.");
    } finally {
      setLoading(false);
    }
  }, [episodeId]);

  const toggleTheaterMode = () => {
    setTheaterMode(!isTheaterMode);
    document.body.style.overflow = isTheaterMode ? "auto" : "hidden"; // Prevent scrolling in theater mode
  };

  return (
    <div
      className={`relative overflow-hidden bg-black ${
        isTheaterMode ? "relative overflow-hidden bg-black" : ""
      }`}
    >
      {/* Anime Details Header */}
      <header className="anime-header bg-gradient-to-br from-purple-900 to-indigo-900 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="anime-info flex items-center">
          <img
            src={animeDetails?.imageUrl?.url}
            alt="cover"
            className="w-24 h-24 md:w-32 md:h-32 rounded-lg shadow-lg"
          />
          <div className="ml-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {animeDetails?.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-2 max-w-md">
              {animeDetails?.description}
            </p>
          </div>
        </div>
        <div className="rating-add flex items-center mt-4 md:mt-0 space-x-4">
          <div className="rating text-yellow-400 text-xl">
            ⭐ {animeDetails?.rating || 0}/5
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full text-white shadow-md transition duration-300">
            Add to Watchlist
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`content-wrapper flex flex-col md:flex-row md:space-x-4 p-4 md:p-8 bg-gray-900 ${
          isTheaterMode ? "hidden" : "block"
        }`}
      >
        {/* Video Player Section */}
        <div className="video-section flex-grow">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer episode={activeEpisode} />
          </div>
          <div className="video-controls flex justify-between mt-4 p-3 bg-gray-800 text-white rounded-lg shadow-md">
            <button
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-300"
              onClick={() => console.log("Previous Episode")}
            >
              ◄ Previous Episode
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-300"
              onClick={() => console.log("Next Episode")}
            >
              Next Episode ►
            </button>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="sidebar mt-6 md:mt-0 w-full md:w-72 bg-gray-800 rounded-lg p-4 shadow-md">
          <h3 className="text-xl font-semibold text-white mb-4">Episodes</h3>
          <EpisodeList
            episodes={episodes}
            setActiveEpisode={setActiveEpisode}
          />
        </div>
      </div>

      {/* Theater Mode Player */}
      {isTheaterMode && (
        <div className="fixed inset-0 bg-black z-50 flex justify-center items-center">
          <div className="w-full h-full bg-black flex justify-center items-center p-4 md:p-8">
            <VideoPlayer episode={activeEpisode} />
          </div>
        </div>
      )}

      {/* Theater Mode Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleTheaterMode}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg focus:outline-none transition duration-300"
          title={isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
        >
          {isTheaterMode ? "Exit Theater Mode" : "Theater Mode"}
        </button>
      </div>
    </div>
  );
};

export default StreamingPage;
