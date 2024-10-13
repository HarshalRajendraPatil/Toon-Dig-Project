import React, { useState, useEffect, useCallback } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import AnimeDisplay from "../components/AnimeDisplay";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

const AnimeSearchPage = () => {
  // State for storing fetched animes, loading, and pagination data
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  // State for filters and search
  const [search, setSearch] = useState(""); // Search field value
  const [searchQuery, setSearchQuery] = useState(""); // Actual query that triggers the search request
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch animes based on page load, search, or filters
  const fetchAnimes = useCallback(
    async (reset = false) => {
      setIsFetching(true);
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/api/admin/anime?search=${searchQuery}&genre=${genre}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}`
        );

        // Reset anime list when filters/search change
        if (reset) {
          setAnime(response.data.data);
        } else {
          // Append the new data to the existing anime array
          setAnime((prevAnime) => [...prevAnime, ...response.data.data]);
        }

        setTotalPages(response.data.totalPages);
      } catch (error) {
        toast.error(error?.response?.data?.data || "Error fetching anime");
      } finally {
        setIsFetching(false);
        setLoading(false);
      }
    },
    [searchQuery, genre, status, sortBy, sortOrder, page]
  );

  // Fetch animes when the component loads or filters/search change
  useEffect(() => {
    setPage(1); // Reset the page to 1 when filters/search change
    fetchAnimes(true); // Reset the anime list when filters/search change
  }, [searchQuery, genre, status, sortBy, sortOrder, fetchAnimes]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetching ||
      page >= totalPages
    )
      return;

    setPage((prevPage) => prevPage + 1);
  }, [isFetching, page, totalPages]);

  // Fetch new page of animes on scroll (for infinite loading)
  useEffect(() => {
    if (page > 1) {
      fetchAnimes();
    }
  }, [page, fetchAnimes]);

  // Attach scroll event listener for infinite loading
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Search bar and filters
  const handleSearch = (e) => setSearch(e.target.value);
  const handleGenreChange = (e) => setGenre(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const handleSortOrderChange = (e) => setSortOrder(e.target.value);

  // Trigger the search request when the search button is clicked
  const handleSearchSubmit = () => {
    setSearchQuery(search); // Set searchQuery state, which triggers the fetch
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl mb-6 text-purple-600 font-bold">Search Anime</h1>
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Sidebar */}
        <aside className="md:w-1/4 w-full bg-gray-800 p-6 rounded-lg mb-8 md:mb-0">
          <h2 className="text-2xl text-white mb-4">Filter By</h2>
          <div className="space-y-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-gray-200 mb-2">Genre</label>
              <select
                value={genre}
                onChange={handleGenreChange}
                className="w-full p-2 bg-gray-700 text-gray-200 border-none rounded-md"
              >
                <option value="">All Genres</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Romance">Romance</option>
                <option value="Supernatural">Supernatural</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-gray-200 mb-2">Status</label>
              <select
                value={status}
                onChange={handleStatusChange}
                className="w-full p-2 bg-gray-700 text-gray-200 border-none rounded-md"
              >
                <option value="">All Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-gray-200 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={handleSortByChange}
                className="w-full p-2 bg-gray-700 text-gray-200 border-none rounded-md"
              >
                <option value="title">Title</option>
                <option value="releaseDate">Release Date</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-gray-200 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="w-full p-2 bg-gray-700 text-gray-200 border-none rounded-md"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:w-3/4 w-full">
          {/* Search Bar */}
          <div className="mb-6 flex items-center gap-2 justify-center flex-wrap">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search Anime..."
              className="w-full p-4 text-lg border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSearchSubmit}
              className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Search
            </button>
          </div>

          {/* Anime List */}
          {anime.length === 0 ? (
            <div className="flex flex-col justify-center items-center text-center py-10">
              <h1 className="text-3xl font-semibold text-purple-400 mb-2">
                No Anime Found
              </h1>
              <p className="text-gray-300 max-w-lg">
                We currently don't have any anime with the provided search
                keyword or filters.
              </p>
            </div>
          ) : loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-6">
              {anime.map((animeInfo) => (
                <AnimeDisplay
                  key={animeInfo._id}
                  showRank={false}
                  anime={animeInfo}
                />
              ))}
            </div>
          )}

          {/* Loading Spinner
          {loading || isFetching ? <LoadingSpinner /> : null} */}

          {/* No more animes to load */}
          {page >= totalPages && !loading && !isFetching && anime.length && (
            <p className="text-center mt-8 text-white text-xl">
              No more animes to load.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimeSearchPage;
