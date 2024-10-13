import React, { useState, useEffect } from "react";
import AnimeDetail from "../components/AnimeDetail";
import SeasonSelector from "../components/SeasonSelector";
import EpisodeList from "../components/EpisodeList";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnimeDetails } from "../store/slices/animeSlice";
import { addSeason, clearSeason } from "../store/slices/seasonSlice";
import { fetchEpisodes, clearEpisodes } from "../store/slices/episodeSlice";

const AnimePage = () => {
  const dispatch = useDispatch();
  const { animeName } = useParams();

  // Local state for the selected season
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true); // Manage overall loading state

  const { anime, loading: animeLoading } = useSelector((state) => state.anime);
  const { seasonInfo, loading: seasonLoading } = useSelector(
    (state) => state.season
  );
  const { episodes, loading: episodeLoading } = useSelector(
    (state) => state.episode
  );

  // Fetch anime details when the animeName changes
  useEffect(() => {
    setIsLoadingData(true); // Start loading when animeName changes
    dispatch(clearSeason());
    dispatch(clearEpisodes()); // Clear episodes when anime changes
    dispatch(fetchAnimeDetails(animeName)).finally(() => {
      setIsLoadingData(false); // End loading once anime details are fetched
    });
  }, [animeName, dispatch]);

  // Update the selected season's info when anime is loaded
  useEffect(() => {
    if (!animeLoading && anime) {
      setIsLoadingData(true); // Start loading for new season data
      const seasonId = anime.seasons?.[selectedSeason - 1]?._id || null;
      if (seasonId) {
        dispatch(clearEpisodes()); // Ensure episodes are cleared when new season is selected
        dispatch(addSeason(anime.seasons[selectedSeason - 1]));
        dispatch(fetchEpisodes(seasonId)).finally(() => {
          setIsLoadingData(false); // End loading after fetching episodes
        });
      } else {
        setIsLoadingData(false); // End loading if there's no seasonId
      }
    }
  }, [anime, animeLoading, selectedSeason, dispatch, animeName]);

  // Handle season change
  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    dispatch(clearSeason());
    dispatch(clearEpisodes()); // Clear episodes when a new season is selected
    setIsLoadingData(true); // Start loading new season
    const seasonId = anime.seasons?.[seasonNumber - 1]?._id;
    if (seasonId) {
      dispatch(addSeason(anime.seasons[seasonNumber - 1]));
      dispatch(fetchEpisodes(seasonId)).finally(() => {
        setIsLoadingData(false); // End loading after fetching new episodes
      });
    } else {
      setIsLoadingData(false); // End loading if there's no seasonId
    }
  };

  if (animeLoading || isLoadingData) return <LoadingSpinner />;

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

        {anime.seasons?.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-center py-10">
            <h1 className="text-3xl font-semibold text-purple-400 mb-2">
              No Seasons Available
            </h1>
            <p className="text-gray-300 max-w-lg">
              We currently don't have any seasons listed for{" "}
              <span className="font-bold">{anime?.title}</span>. Please check
              back soon for updates or new content!
            </p>
          </div>
        ) : seasonLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Season Details */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
              <div className="flex flex-col md:flex-row">
                <img
                  src={seasonInfo?.coverImage?.url}
                  alt={`Season ${selectedSeason}`}
                  className="w-full md:w-1/3 h-64 object-cover rounded-lg mb-4 md:mb-0 shadow-md"
                />
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
                      {seasonInfo?.releaseDate?.toString()?.slice(0, 10) ||
                        "TBA"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Episodes or No Episodes */}
            {seasonInfo?.episodes?.length === 0 ? (
              <div className="flex flex-col justify-center items-center text-center py-10">
                <h1 className="text-3xl font-semibold text-purple-400 mb-2">
                  No Episodes Available
                </h1>
                <p className="text-gray-300 max-w-lg">
                  It looks like there are no episodes for{" "}
                  <span className="font-bold">Season {selectedSeason}</span> at
                  the moment. Stay tuned for updates or upcoming episodes!
                </p>
              </div>
            ) : episodeLoading ? (
              <LoadingSpinner />
            ) : (
              <EpisodeList episodes={episodes} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnimePage;
