import React, { useEffect, useState } from "react";
import axiosInstance from "./../config/axiosConfig.js";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditAnime = () => {
  const { id } = useParams(); // Get the anime ID from URL
  const navigate = useNavigate();

  const [animeData, setAnimeData] = useState({
    title: "",
    description: "",
    genres: "",
    releaseDate: "",
    status: "",
    imageUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the current anime data
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/anime/${id}`);
        const { title, description, genres, releaseDate, status, imageUrl } =
          response.data.data;
        setAnimeData({
          title,
          description,
          genres: genres.join(", "), // Join genres with commas
          releaseDate: new Date(releaseDate).toISOString().slice(0, 10),
          status,
          imageUrl: imageUrl.url,
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong.");
      }
    };

    fetchAnime();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setAnimeData({
      ...animeData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection for the image
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", animeData.title);
      formData.append("description", animeData.description);
      formData.append("genres", animeData.genres);
      formData.append("releaseDate", animeData.releaseDate);
      formData.append("status", animeData.status);

      // If a new image file is selected, add it to the formData
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      formData.forEach((data) => console.log(data));
      // Send PUT request to update the anime
      const response = await axiosInstance.put(
        `/api/admin/anime/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Anime updated successfully.");
      // Navigate to another page or show success
      navigate("/admin/anime-management"); // Redirect back to anime management page after successful update
    } catch (err) {
      toast.error("Failed to update anime.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-white rounded-lg shadow-lg">
      <div className="mx-4 bg-gray-800 p-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Edit Anime</h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          <div>
            <label htmlFor="title" className="block text-lg font-medium">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={animeData.title}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-medium">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={animeData.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label htmlFor="genres" className="block text-lg font-medium">
              Genres (comma separated):
            </label>
            <input
              type="text"
              id="genres"
              name="genres"
              value={animeData.genres}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-lg font-medium">
              Release Date:
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={animeData.releaseDate}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-lg font-medium">
              Status:
            </label>
            <select
              id="status"
              name="status"
              value={animeData.status}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-lg font-medium">
              Anime Poster Image:
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
            {animeData.imageUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-400">Current Image:</p>
                <img
                  src={animeData.imageUrl}
                  alt="Current Anime"
                  className="mt-2 w-32 h-48 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Anime"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnime;
