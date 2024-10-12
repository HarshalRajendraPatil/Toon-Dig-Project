// AnimeForm.js
import React, { useState } from "react";

const AnimeForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [releaseDate, setReleaseDate] = useState(
    initialData?.releaseDate || ""
  );
  const [genres, setGenres] = useState(initialData?.genres || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { title, description, releaseDate, genres };
    onSubmit(formData); // Pass data to the parent
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        {initialData ? "Edit Anime" : "Add New Anime"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white"
            placeholder="Enter anime title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white"
            placeholder="Enter anime description"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Release Date
          </label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">
            Genres
          </label>
          <input
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white"
            placeholder="Enter genres (comma-separated)"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-md"
        >
          {initialData ? "Update Anime" : "Add Anime"}
        </button>
      </form>
    </div>
  );
};

export default AnimeForm;
