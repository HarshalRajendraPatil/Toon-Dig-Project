import React, { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import Comments from "../components/Comments"; // Import the Comments component
import { useSelector } from "react-redux";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

const StreamingPage = () => {
  const [activeEpisode, setActiveEpisode] = useState({});
  const [loading, setLoading] = useState(false);
  const seasonId = useSelector((state) => state.season.seasonInfo._id);
  const animeDetails = useSelector((state) => state.anime.anime);
  const episodeId = useSelector((state) => state?.episode?.currentEpisodeId);

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
                ⭐ {animeDetails?.rating || 0}/5
              </div>
              <div className="year-released text-white text-sm md:text-base">
                Year: {animeDetails?.releaseDate?.split("-")[0] || "Unknown"}
              </div>
              <div className="episodes-count text-white text-sm md:text-base">
                Seasons: {animeDetails?.seasons?.length || "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Video in Theater Mode */}
      <div className="content-container flex flex-col gap-6 p-4 md:p-6">
        {/* Video Player Section */}
        <div className="video-section w-full bg-black rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer episode={activeEpisode} />
        </div>

        {/* Episode Info */}
        <div className="episode-info bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-bold">
            {activeEpisode?.title}
          </h2>
          <p className="mt-2 text-gray-300">{activeEpisode?.description}</p>
        </div>

        {/* Comments Section */}
        <Comments episodeId={episodeId} />
      </div>
    </div>
  );
};

export default StreamingPage;
