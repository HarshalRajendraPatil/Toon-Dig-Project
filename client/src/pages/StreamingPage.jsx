import React, { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import Comments from "../components/Comments";
import { useSelector } from "react-redux";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

const StreamingPage = () => {
  const [activeEpisode, setActiveEpisode] = useState({});
  const [episodes, setEpisodes] = useState([]); // List of episodes in the selected season
  const [loading, setLoading] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null); // Currently selected season

  const animeDetails = useSelector((state) => state.anime.anime);
  const episodeId = useSelector((state) => state?.episode?.currentEpisodeId);
  console.log(activeEpisode);

  // Fetch episodes for the selected season
  useEffect(() => {
    if (!selectedSeason) return;

    const fetchEpisodes = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/admin/season/${selectedSeason}/episode`
        );
        setEpisodes(response.data.data);
        setActiveEpisode(response.data.data[0]); // Default to the first episode
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
        toast.error("Failed to load episodes.");
      }
    };

    fetchEpisodes();
  }, [selectedSeason]);

  // Fetch the active episode's details
  useEffect(() => {
    if (!episodeId || !selectedSeason) return;

    const fetchEpisode = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/admin/season/${selectedSeason}/episode/${episodeId}`
        );
        setActiveEpisode(response.data.data);
      } catch (error) {
        console.error("Failed to load the episode:", error);
        toast.error("Failed to load the episode.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId, selectedSeason]);

  useEffect(() => {
    // Set default season on component mount
    if (animeDetails?.seasons?.length) {
      setSelectedSeason(animeDetails.seasons[0]._id);
    }
  }, [animeDetails]);

  return (
    <div className="streaming-page bg-gray-900 min-h-screen text-white">
      {/* Anime Header */}
      <header
        className="anime-header relative flex flex-col items-center justify-center md:flex-row md:justify-between bg-cover bg-center bg-no-repeat p-4 md:p-6 rounded-lg shadow-lg"
        style={{
          backgroundImage: `url(${animeDetails?.imageUrl?.url})`,
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <div className="anime-info flex flex-col items-center md:flex-row space-x-0 space-y-4 md:space-x-6 md:space-y-0 p-4 md:p-6">
          <img
            src={animeDetails?.imageUrl?.url}
            alt="cover"
            className="w-32 h-32 md:w-48 md:h-48 rounded-lg shadow-lg"
          />
          <div className="text-info space-y-2 md:space-y-4 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white">
              {animeDetails?.title}
            </h1>
            <p className="text-gray-300 max-w-xl">
              {animeDetails?.description}
            </p>

            <div className="extra-info flex flex-wrap justify-center items-center md:justify-start gap-2 md:gap-4">
              <div className="genre bg-indigo-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-full shadow-md">
                {animeDetails?.genres?.join(", ") || "Unknown Genre"}
              </div>
              <div className="rating text-yellow-400 flex items-center text-sm md:text-lg">
                ⭐ {animeDetails?.averageRating || 0}/5
              </div>
              <div className="year-released text-white text-sm md:text-base">
                Year: {animeDetails?.releaseDate?.split("-")[0] || "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Season Selector */}
      <div className="season-selector p-4 md:p-6">
        <label
          htmlFor="season-select"
          className="text-white text-lg font-bold mb-2"
        >
          Select Season:
        </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="bg-gray-800 text-white rounded-md p-2 shadow-md w-full md:w-auto"
        >
          {animeDetails?.seasons?.map((season) => (
            <option key={season._id} value={season._id}>
              {season.title || `Season ${season.number}`}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="content-container flex flex-col md:flex-row gap-6 p-4 md:p-6">
        {/* Video Player Section */}
        <div className="video-section w-full md:w-3/4 bg-black rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer episode={activeEpisode} />
        </div>

        {/* Episode List Section */}
        <div className="episode-list w-full md:w-1/4 bg-gray-800 rounded-lg p-4 shadow-md overflow-y-auto max-h-[80vh]">
          <h3 className="text-lg font-bold mb-4">Episodes</h3>
          <ul className="space-y-3">
            {episodes.map((episode) => (
              <li
                key={episode._id}
                onClick={() => setActiveEpisode(episode)}
                className={`cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${
                  episode._id === activeEpisode?._id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                Episode {episode.number}: {episode.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Episode Info */}
      <div className="episode-info bg-gray-800 p-4 md:p-6 rounded-lg shadow-md mt-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {activeEpisode?.title}
        </h2>
        <p className="mt-2 text-gray-300">{activeEpisode?.description}</p>
      </div>

      {/* Comments Section */}
      {activeEpisode && <Comments episodeId={activeEpisode?._id} />}
    </div>
  );
};

export default StreamingPage;
