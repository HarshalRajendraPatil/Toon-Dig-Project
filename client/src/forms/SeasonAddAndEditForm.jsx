import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../config/axiosConfig.js";
import RestrictedFeature from "../RestrictedFeature.jsx";

const SeasonAddAndEditForm = ({ id, season, closeModal, fetchSeasons }) => {
  const [number, setNumber] = useState(season ? season.number : "");
  const [releaseDate, setReleaseDate] = useState(
    season ? season.releaseDate.split("T")[0] : ""
  );
  const [title, setTitle] = useState(season ? season.title : "");
  const [description, setDescription] = useState(
    season ? season.description : ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    season ? season.coverImage?.url : null
  );
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("releaseDate", releaseDate);
      formData.append("number", number);

      if (imageFile) {
        formData.append("coverImage", imageFile);
      }

      if (season) {
        await axiosInstance.put(
          `/api/admin/anime/${id}/season/${season._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Season updated successfully.");
      } else {
        await axiosInstance.post(`/api/admin/anime/${id}/season`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Season added successfully.");
      }

      fetchSeasons();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RestrictedFeature>
      <div
        className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50"
        style={{ maxHeight: "100vh" }} // Ensure the modal does not exceed screen height
      >
        <div className="w-full max-w-lg mx-auto">
          <div className="p-6 mx-4 bg-white rounded-lg shadow-lg">
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "80vh" }} // Limit form height and enable scrolling
            >
              <form onSubmit={handleSubmit}>
                {/* Season Title Input */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="title"
                  >
                    Season Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter season title"
                    className="border px-4 py-2 w-full rounded-md"
                    required
                  />
                </div>

                {/* Season Number Input */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="number"
                  >
                    Season Number
                  </label>
                  <input
                    type="number"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Enter season number"
                    className="border px-4 py-2 w-full rounded-md"
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="w-full px-4 py-2 border rounded-md"
                    placeholder="Enter season description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Release Date Input */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="date"
                  >
                    Release Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="border px-4 py-2 w-full rounded-md"
                    required
                  />
                </div>

                {/* Image Upload Input */}
                <div>
                  <label
                    className="block text-gray-700 font-bold mb-2"
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
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Season Cover"
                        className="h-40 w-40 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Form Submission Buttons */}
                <div className="flex justify-end flex-wrap gap-2 mt-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-50"
                  >
                    Save Season
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RestrictedFeature>
  );
};

export default SeasonAddAndEditForm;
