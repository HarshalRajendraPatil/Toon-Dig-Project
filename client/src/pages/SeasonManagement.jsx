import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { IoMdAdd } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import SeasonAddAndEditForm from "../forms/SeasonAddAndEditForm"; // Assume we have a form for adding episodes
import LoadingSpinner from "../components/LoadingSpinner";

const SeasonManagement = () => {
  const { id } = useParams(); // Get the anime ID from URL params
  const [seasons, setSeasons] = useState([]);
  const [animeTitle, setAnimeTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal toggle for season
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false); // Modal toggle for episode
  const [seasonToEdit, setSeasonToEdit] = useState(null); // For editing a season
  const [viewMode, setViewMode] = useState("table"); // Switch between table and grid view

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    setLoading(true);
    try {
      const animeResponse = await axiosInstance.get(`/api/admin/anime/${id}`);
      const seasonResponse = await axiosInstance.get(
        `/api/admin/anime/${id}/season`
      );
      setAnimeTitle(animeResponse.data.data.title);
      setSeasons(seasonResponse.data.data);
    } catch (error) {
      toast.error("Failed to load seasons.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSeason = async (seasonId) => {
    if (window.confirm("Are you sure you want to delete this season?")) {
      try {
        await axiosInstance.delete(`/api/admin/anime/${id}/season/${seasonId}`);
        fetchSeasons();
        toast.success("Season deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete season.");
      }
    }
  };

  const openAddSeasonModal = () => {
    setSeasonToEdit(null); // Reset form for new season
    setIsModalOpen(true);
  };

  const openEditSeasonModal = (season) => {
    setSeasonToEdit(season); // Populate form with existing season data
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEpisodeModalOpen(false);
  };

  const switchLayout = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "grid" : "table"));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between gap-5 flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-500">
          Seasons Management for {animeTitle}
        </h1>
        <div className="flex justify-center items-center gap-3 flex-wrap">
          <button
            onClick={openAddSeasonModal}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
          >
            <IoMdAdd className="inline-block mr-2" /> Add Season
          </button>
          <button
            onClick={switchLayout}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
          >
            Switch to {viewMode === "table" ? "Grid" : "Table"} View
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <LoadingSpinner />
      ) : viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100 text-gray-800">
                <th className="border px-4 py-2">Cover Image</th>
                <th className="border px-4 py-2">Episodes Count</th>
                <th className="border px-4 py-2">Release Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season) => (
                <tr key={season._id}>
                  <td className="border px-4 py-2 text-white">
                    <img
                      src={season.coverImage.url}
                      alt={season.title}
                      className="w-16 h-16 object-cover inline-block mr-2"
                    />
                    {season.title}
                  </td>
                  <td className="border px-4 py-2 text-white text-center">
                    {season.episodes.length}
                  </td>
                  <td className="border px-4 py-2 text-white text-center">
                    {new Date(season.releaseDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <div
                      className="flex items-center text-center justify-center gap-3
                    flex-wrap"
                    >
                      <button
                        onClick={() => openEditSeasonModal(season)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSeason(season._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                      {/* Add Season Button */}
                      <Link
                        to={`/admin/anime-management/${id}/episodes/${season._id}`}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                      >
                        Manage Episodes
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {seasons.map((season) => (
            <div
              key={season._id}
              className="border p-4 rounded-lg bg-gray-800 text-white"
            >
              <img
                src={season.coverImage.url}
                alt={season.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-bold mb-2">{season.title}</h2>
              <p className="text-gray-400 mb-2">
                Episodes: {season.episodes.length}
              </p>
              <p className="text-gray-400 mb-2">
                Release Date:
                {new Date(season.releaseDate).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap justify-start items-center gap-2">
                <button
                  onClick={() => openEditSeasonModal(season)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSeason(season._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
                {/* Add Season Button */}
                <Link
                  to={`/admin/anime-management/${id}/episodes/${season._id}`}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Manage Episodes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit Season */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          {/* Add/Edit Season Form */}
          <SeasonAddAndEditForm
            id={id}
            season={seasonToEdit}
            closeModal={closeModal}
            fetchSeasons={fetchSeasons}
          />
        </div>
      )}

      {/* Modal for Add Episode */}
      {isEpisodeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add Episode</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonManagement;
