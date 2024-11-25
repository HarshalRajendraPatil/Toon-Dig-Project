import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { IoMdAdd } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import EpisodeAddAndEditForm from "../forms/EpisodeAddAndEditForm";
import LoadingSpinner from "../components/LoadingSpinner";
import RestrictedFeature from "../RestrictedFeature";

const EpisodeManagement = () => {
  const { id, animeId } = useParams(); // Get the season ID from URL params
  const [episodes, setEpisodes] = useState([]);
  const [seasonTitle, setSeasonTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal toggle for episode
  const [episodeToEdit, setEpisodeToEdit] = useState(null); // For editing an episode
  const [viewMode, setViewMode] = useState("table"); // Switch between table and grid view

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    setLoading(true);
    try {
      const seasonResponse = await axiosInstance.get(
        `/api/admin/anime/${animeId}/season/${id}`
      );
      const episodeResponse = await axiosInstance.get(
        `/api/admin/season/${id}/episode`
      );
      setSeasonTitle(seasonResponse.data.data.title);
      setEpisodes(episodeResponse.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEpisode = async (episodeId) => {
    if (window.confirm("Are you sure you want to delete this episode?")) {
      try {
        await axiosInstance.delete(
          `/api/admin/season/${id}/episode/${episodeId}`
        );
        fetchEpisodes();
        toast.success("Episode deleted successfully.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong.");
      }
    }
  };

  const openAddEpisodeModal = () => {
    setEpisodeToEdit(null); // Reset form for new episode
    setIsModalOpen(true);
  };

  const openEditEpisodeModal = (episode) => {
    setEpisodeToEdit(episode); // Populate form with existing episode data
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const switchLayout = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "grid" : "table"));
  };

  return (
    <RestrictedFeature>
      <div className="container mx-auto p-4">
        <div className="flex justify-between gap-5 flex-wrap items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-500">
            Episodes Management for {seasonTitle}
          </h1>
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <button
              onClick={openAddEpisodeModal}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
            >
              <IoMdAdd className="inline-block mr-2" /> Add Episode
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
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Episode Number</th>
                  <th className="border px-4 py-2">Air Date</th>
                  <th className="border px-4 py-2">Duration</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {episodes.map((episode) => (
                  <tr key={episode._id} className="text-white">
                    <td className="border px-4 py-2">
                      <img
                        src={episode.thumbnailUrl}
                        alt={episode.title}
                        className="w-16 h-16 object-cover inline-block mr-2"
                      />
                      {episode.title}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {episode.number}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {new Date(episode.airDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {episode.duration} mins
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => openEditEpisodeModal(episode)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteEpisode(episode._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <div
                key={episode._id}
                className="border p-4 rounded-lg bg-gray-800 text-white"
              >
                <img
                  src={episode.thumbnailUrl}
                  alt={episode.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-lg font-bold mb-2">{episode.title}</h2>
                <p className="text-gray-400 mb-2">Episode {episode.number}</p>
                <p className="text-gray-400 mb-2">
                  Air Date: {new Date(episode.airDate).toLocaleDateString()}
                </p>
                <p className="text-gray-400 mb-2">
                  Duration: {episode.duration} mins
                </p>
                <div className="flex justify-start items-center flex-wrap gap-2">
                  <button
                    onClick={() => openEditEpisodeModal(episode)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEpisode(episode._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add/Edit Episode */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Add/Edit Episode Form */}
            <EpisodeAddAndEditForm
              seasonId={id}
              episode={episodeToEdit}
              closeModal={closeModal}
              fetchEpisodes={fetchEpisodes}
            />
          </div>
        )}
      </div>
    </RestrictedFeature>
  );
};

export default EpisodeManagement;
