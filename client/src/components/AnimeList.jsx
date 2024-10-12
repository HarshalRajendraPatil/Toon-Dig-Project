// AnimeList.js
import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa"; // Icons for actions

const AnimeList = ({
  animeList,
  onDelete,
  onEdit,
  onFeatureToggle,
  isGridView,
}) => {
  return (
    <div className="anime-list-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-400">Anime Management</h2>
        <Link
          to="/admin/anime/add"
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Add New Anime
        </Link>
      </div>

      {isGridView ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {animeList.map((anime) => (
            <div key={anime.id} className="bg-gray-800 rounded-lg p-4 relative">
              <img
                src={anime.posterUrl}
                alt={anime.title}
                className="w-full h-60 object-cover rounded-md"
              />
              <div className="mt-3 text-white">
                <h3 className="text-lg font-bold">{anime.title}</h3>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => onEdit(anime.id)}
                    className="text-green-400 hover:text-green-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onFeatureToggle(anime.id)}
                    className="text-yellow-400 hover:text-yellow-600"
                  >
                    <FaStar />
                  </button>
                  <button
                    onClick={() => onDelete(anime.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Poster</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {animeList.map((anime) => (
              <tr key={anime.id} className="border-b border-gray-700">
                <td className="px-4 py-2">
                  <img
                    src={anime.posterUrl}
                    alt={anime.title}
                    className="w-20 h-28 object-cover rounded-md"
                  />
                </td>
                <td className="px-4 py-2">{anime.title}</td>
                <td className="px-4 py-2 flex space-x-3">
                  <button
                    onClick={() => onEdit(anime.id)}
                    className="text-green-400 hover:text-green-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onFeatureToggle(anime.id)}
                    className="text-yellow-400 hover:text-yellow-600"
                  >
                    <FaStar />
                  </button>
                  <button
                    onClick={() => onDelete(anime.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AnimeList;
