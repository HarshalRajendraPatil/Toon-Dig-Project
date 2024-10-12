import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import AnimeDetail from "../components/AnimeDetail";
import SeasonSelector from "../components/SeasonSelector";
import EpisodeList from "../components/EpisodeList";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const AnimePage = () => {
  const { animeId } = useParams();
  const [anime, setAnime] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonId, setSeasonId] = useState(anime ? anime.seasons[0] : null);
  const [seasonInfo, setSeasonInfo] = useState({});

  useEffect(() => {
    // Fetch anime details
    const fetchAnimeDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/anime/${animeId}`);
        setAnime(response.data.data);
        setSeasonId(response.data.data.seasons[selectedSeason - 1]);
      } catch (error) {
        console.error("Error fetching anime details", error);
        toast.error(error.message);
      }
    };
    fetchAnimeDetails();
    const fetchSeasonInfo = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/admin/anime/${animeId}/season/${seasonId}`
        );
        setSeasonInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching anime details", error);
        toast.error(error.message);
      }
    };
    fetchSeasonInfo();
  }, [animeId, seasonId]);

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setSeasonId(anime.seasons[seasonNumber - 1]);
  };

  if (!anime) return <LoadingSpinner />;

  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div
        className="relative w-full h-[60vh] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${anime?.imageUrl?.url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <h1 className="text-5xl font-bold text-white shadow-md drop-shadow-lg">
            {anime?.title}
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl text-center leading-relaxed">
            {anime?.description}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 px-6 py-12 max-w-7xl mx-auto space-y-8">
        {/* Anime Info */}
        <AnimeDetail anime={anime} />

        {/* Season Selector */}
        <SeasonSelector
          seasons={anime.seasons}
          selectedSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
        />

        {/* Season Hero Section */}
        {seasonInfo && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 transition-transform transform hover:scale-[1.01]">
            <div className="flex flex-col md:flex-row">
              {/* Season Image */}
              <img
                src={seasonInfo?.coverImage?.url}
                alt={`Season ${selectedSeason}`}
                className="w-full md:w-1/3 h-64 object-cover rounded-lg mb-4 md:mb-0 shadow-md"
              />

              {/* Season Info */}
              <div className="md:ml-6 flex flex-col justify-center">
                <h2 className="text-3xl font-semibold text-purple-400 mb-2">
                  Season {selectedSeason}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {seasonInfo?.description}
                </p>
                <div className="mt-4 space-y-1 text-sm text-gray-400">
                  <p>Number of Episodes: {seasonInfo?.episodes?.length}</p>
                  <p>
                    Release Date:{" "}
                    {seasonInfo?.releaseDate?.toString()?.slice(0, 10) || "TBA"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Episode List */}
        <EpisodeList
          id={seasonId}
          episodes={anime?.seasons?.[selectedSeason - 1]?.episodes}
        />
      </div>
    </div>
  );
};

export default AnimePage;
