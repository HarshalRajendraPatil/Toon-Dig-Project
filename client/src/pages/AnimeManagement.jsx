import React, { useState, useEffect } from "react";
import axiosInstace from "../config/axiosConfig.js";
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const AnimeManagement = () => {
  const [animes, setAnimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // Toggle between 'grid' and 'table'

  const navigate = useNavigate();

  useEffect(() => {
    fetchAnimes();
  }, [searchQuery, genreFilter, statusFilter, page]);

  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const response = await axiosInstace.get(
        `/api/admin/anime?page=${page}&search=${searchQuery}&genre=${genreFilter}&status=${statusFilter}`
      );
      setAnimes(response.data.data);
      setTotalPages(response.data.totalPages); // Assume backend sends total pages
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to fetcht the animes."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (animeId) => {
    if (window.confirm("Are you sure you want to delete this anime?")) {
      await axiosInstace.delete(`/api/admin/anime/${animeId}`);
      fetchAnimes();
      toast.success("Anime deleted successfully.");
    }
  };

  const switchLayout = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "grid" : "table"));
  };

  // Disable/Enable pagination buttons based on page and totalPages
  const isPreviousDisabled = page === 1;
  const isNextDisabled = page === totalPages;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center gap-5 flex-wrap mb-4">
        <h1 className="text-2xl font-bold text-purple-500">Anime Management</h1>
        <div className="flex gap-4 flex-wrap justify-center items-center">
          <Link
            to="/admin/anime-management/add-anime"
            className="bg-purple-500 text-white text-center px-4 py-2 rounded-md hover:bg-purple-600 transition"
          >
            <IoMdAdd className="inline-block mr-2" /> Add Anime
          </Link>
          <button
            onClick={switchLayout}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Switch to {viewMode === "table" ? "Grid" : "Table"} View
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          className="border px-4 py-2 rounded-md"
          placeholder="Search Anime"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded-md"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
        </select>
        <select
          className="border px-4 py-2 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Anime List - Toggle between grid and table */}
      {loading ? (
        <LoadingSpinner />
      ) : animes.length === 0 ? (
        <h1 className="text-3xl text-center font-semibold text-purple-400 mb-2">
          No Anime Found
        </h1>
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Genres</th>
                <th className="border px-4 py-2">Seasons</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animes.map((anime) => (
                <tr key={anime._id}>
                  <td className="border px-4 py-2 text-white">
                    <img
                      src={anime.imageUrl.url}
                      alt={anime.title}
                      className="w-16 h-16 object-cover inline-block mr-2"
                    />
                    {anime.title}
                  </td>
                  <td className="border px-4 py-2 text-white text-center">
                    {anime.genres.join(", ")}
                  </td>
                  <td className="border px-4 py-2 text-white text-center">
                    {anime.seasons.length}
                  </td>
                  <td className="border px-4 py-2 text-white text-center">
                    {anime.status}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <div
                      className="flex items-center justify-center gap-3
                    flex-wrap"
                    >
                      <Link
                        to={`/admin/anime-management/edit-anime/${anime._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(anime._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                      {/* Add Season Button */}
                      <Link
                        to={`/admin/anime-management/seasons/${anime._id}`}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                      >
                        Manage Seasons
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {animes.map((anime) => (
            <div key={anime._id} className="border p-4 rounded-md">
              <img
                src={anime.imageUrl.url}
                alt={anime.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-bold text-white mb-2">
                {anime.title}
              </h2>
              <p className="text-gray-400 mb-2">
                Genres: {anime.genres.join(", ")}
              </p>
              <p className="text-gray-400 mb-2">
                Seasons: {anime.seasons.length}
              </p>
              <p className="text-gray-400 mb-2">Status: {anime.status}</p>
              <div className="flex flex-wrap justify-start items-center gap-2">
                <Link
                  to={`/admin/anime-management/edit-anime/${anime._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(anime._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
                {/* Add Season Button */}
                <Link
                  to={`/admin/anime-management/seasons/${anime._id}`}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Manage Seasons
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={isPreviousDisabled}
          className={`px-4 py-2 rounded-md text-white ${
            isPreviousDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          <GrLinkPrevious />
        </button>
        <p className="text-white">
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => setPage(page + 1)}
          disabled={isNextDisabled}
          className={`px-4 py-2 rounded-md text-white ${
            isNextDisabled
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          <GrLinkNext />
        </button>
      </div>
    </div>
  );
};

export default AnimeManagement;
