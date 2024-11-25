import React, { useState } from "react";
import axiosInstance from "../config/axiosConfig"; // Make sure your axios config is imported
import { useNavigate } from "react-router-dom"; // Assuming you'll redirect after the form submission
import { toast } from "react-toastify";
import RestrictedFeature from "../RestrictedFeature";

const AddAnimeForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("genres", genres);
    formData.append("releaseDate", releaseDate);
    formData.append("status", status);
    formData.append("imageUrl", imageFile); // Sending the file

    try {
      const response = await axiosInstance.post("/api/admin/anime", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Anime added successfully!");
      navigate("/admin/anime-management"); // Redirect to anime management page after submission
    } catch (error) {
      console.error("Error adding anime:", error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RestrictedFeature>
      <div className="container mx-auto">
        <div className="bg-gray-800 mx-4 p-4">
          <h1 className="text-2xl font-bold text-purple-500 mb-6">
            Add New Anime
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div>
              <label
                className="block text-white font-medium mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter anime title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                className="block text-white font-medium mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter anime description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Genre Field */}
            <div>
              <label
                className="block text-white font-medium mb-2"
                htmlFor="genres"
              >
                Genres (Comma Separated)
              </label>
              <input
                type="text"
                id="genres"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="e.g. Action, Adventure, Fantasy"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                required
              />
            </div>

            {/* Release Date Field */}
            <div>
              <label
                className="block text-white font-medium mb-2"
                htmlFor="releaseDate"
              >
                Release Date
              </label>
              <input
                type="date"
                id="releaseDate"
                className="w-full px-4 py-2 border rounded-md"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
              />
            </div>

            {/* Status Field */}
            <div>
              <label
                className="block text-white font-medium mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full px-4 py-2 border rounded-md"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Image URL (File Input) */}
            <div>
              <label
                className="block text-white font-medium mb-2"
                htmlFor="image"
              >
                Image Upload
              </label>
              <input
                type="file"
                id="image"
                name="imageUrl"
                className="w-full px-4 py-2 border rounded-md"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Adding Anime..." : "Add Anime"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </RestrictedFeature>
  );
};

export default AddAnimeForm;
