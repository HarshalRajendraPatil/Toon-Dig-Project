import React, { useState, useEffect } from "react";
import AnimeDetail from "../components/AnimeDetail";
import SeasonSelector from "../components/SeasonSelector";
import EpisodeList from "../components/EpisodeList";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchAnimeDetails } from "../store/slices/animeSlice";
import { addSeason, clearSeason } from "../store/slices/seasonSlice";
import { fetchEpisodes, clearEpisodes } from "../store/slices/episodeSlice";
import { addToFavorites, addToWatchlist } from "../store/slices/userSlice"; // Import actions for favorites and watchlist
import RatingReviews from "../components/RatingReviews";

const AnimePage = () => {
  const dispatch = useDispatch();
  const { animeName } = useParams();

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { anime, loading: animeLoading } = useSelector((state) => state.anime);
  const { seasonInfo, loading: seasonLoading } = useSelector(
    (state) => state.season
  );
  const { episodes, loading: episodeLoading } = useSelector(
    (state) => state.episode
  );
  const { user } = useSelector((state) => state.user); // Get the current user from the store
  // Add two states to track if the anime is in favorites or watchlist
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    setIsLoadingData(true);
    dispatch(clearSeason());
    dispatch(clearEpisodes());
    dispatch(fetchAnimeDetails(animeName)).finally(() => {
      setIsLoadingData(false);
    });
    setIsFavorite(user?.favorites?.includes(anime?._id));
    setIsInWatchlist(user?.watchlist?.includes(anime?._id));
  }, [animeName, dispatch]);

  useEffect(() => {
    if (!animeLoading && anime) {
      setIsLoadingData(true);
      const seasonId = anime.seasons?.[selectedSeason - 1]?._id || null;
      if (seasonId) {
        dispatch(clearEpisodes());
        dispatch(addSeason(anime.seasons[selectedSeason - 1]));
        dispatch(fetchEpisodes(seasonId)).finally(() => {
          setIsLoadingData(false);
        });
      } else {
        setIsLoadingData(false);
      }
    }

    setIsFavorite(user?.favorites?.includes(anime?._id));
    setIsInWatchlist(user?.watchlist?.includes(anime?._id));
  }, [anime, animeLoading, selectedSeason, dispatch]);

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    dispatch(clearSeason());
    dispatch(clearEpisodes());
    setIsLoadingData(true);
    const seasonId = anime.seasons?.[seasonNumber - 1]?._id;
    if (seasonId) {
      dispatch(addSeason(anime.seasons[seasonNumber - 1]));
      dispatch(fetchEpisodes(seasonId)).finally(() => {
        setIsLoadingData(false);
      });
    } else {
      setIsLoadingData(false);
    }
  };

  // Handle adding to favorites
  const handleAddToFavorites = () => {
    dispatch(addToFavorites(anime._id)).then(() => {
      setIsFavorite((e) => !e); // Update UI to reflect that the anime is added to favorites
    });
  };

  // Handle adding to watchlist
  const handleAddToWatchlist = () => {
    dispatch(addToWatchlist(anime._id)).then(() => {
      setIsInWatchlist((e) => !e); // Update UI to reflect that the anime is added to watchlist
    });
  };

  if (animeLoading || isLoadingData) return <LoadingSpinner />;

  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-gray-100">
      <div
        className="relative w-full  overflow-hidden bg-cover bg-center px-3 py-10"
        style={{
          backgroundImage: `url(${anime?.imageUrl?.url})`,
          backgroundPosition: "center",
        }}
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

        {/* Buttons for Favorites and Watchlist */}
        {user && (
          <div className="flex gap-4 justify-center items-center flex-wrap mb-6">
            <button
              className={`${
                isFavorite ? "bg-gray-500" : "bg-purple-500"
              } text-white py-2 px-4 rounded-lg font-semibold shadow-md`}
              onClick={handleAddToFavorites}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>

            <button
              className={`${
                isInWatchlist ? "bg-gray-500" : "bg-blue-500"
              } text-white py-2 px-4 rounded-lg font-semibold shadow-md`}
              onClick={handleAddToWatchlist}
            >
              {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </button>
          </div>
        )}

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
        {anime?.seasons?.length === 0 && seasonInfo?.episodes?.length === 0 && (
          <RatingReviews animeId={anime._id} />
        )}
      </div>
    </div>
  );
};

export default AnimePage;
