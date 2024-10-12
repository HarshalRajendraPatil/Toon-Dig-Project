import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../config/axiosConfig.js";

const EpisodeAddAndEditForm = ({
  seasonId,
  episode,
  closeModal,
  fetchEpisodes,
}) => {
  const [number, setNumber] = useState(episode ? episode.number : "");
  const [airDate, setAirDate] = useState(
    episode ? episode.airDate.split("T")[0] : ""
  );
  const [title, setTitle] = useState(episode ? episode.title : "");
  const [description, setDescription] = useState(
    episode ? episode.description : ""
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    episode ? episode.thumbnailUrl : ""
  );
  const [duration, setDuration] = useState(episode ? episode.duration : 0);
  const [videoUrl, setVideoUrl] = useState(episode ? episode.videoUrl : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = {
        title,
        description,
        airDate,
        number,
        duration,
        thumbnailUrl,
        videoUrl,
      };

      if (episode) {
        await axiosInstance.put(
          `/api/admin//season/${seasonId}/episode/${episode._id}`,
          formData
        );
        toast.success("Episode updated successfully.");
        setLoading(false);
      } else {
        await axiosInstance.post(
          `/api/admin//season/${seasonId}/episode`,
          formData
        );
        toast.success("Episode added successfully.");
        setLoading(false);
      }

      fetchEpisodes();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save the episode.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50"
      style={{ maxHeight: "100vh" }} // Ensure the modal does not exceed screen height
    >
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white p-6 mx-4 rounded-lg shadow-lg">
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "80vh" }} // Limit form height and enable scrolling
          >
            <form onSubmit={handleSubmit}>
              {/* Episode Title Input */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="title"
                >
                  Episode Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter episode title"
                  className="border px-4 py-2 w-full rounded-md"
                  required
                />
              </div>

              {/* Episode Number Input */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="number"
                >
                  Episode Number
                </label>
                <input
                  type="number"
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Enter episode number"
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
                  placeholder="Enter episode description"
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
                  value={airDate}
                  onChange={(e) => setAirDate(e.target.value)}
                  className="border px-4 py-2 w-full rounded-md"
                  required
                />
              </div>

              {/* Episode duration Input */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="duration"
                >
                  Episode Duration
                </label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter episode duration"
                  className="border px-4 py-2 w-full rounded-md"
                  required
                />
              </div>

              {/* Thumbnail URL Input */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="thumbnailUrl"
                >
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  id="thumbnailUrl"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Enter thumbnail URL"
                  className="border px-4 py-2 w-full rounded-md"
                  required
                />
                {thumbnailUrl && (
                  <div className="mt-4">
                    <img
                      src={thumbnailUrl}
                      alt="Episode Thumbnail"
                      className="h-40 w-40 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Video URL Input */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-bold mb-2"
                  htmlFor="videoUrl"
                >
                  Video URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter video URL"
                  className="border px-4 py-2 w-full rounded-md"
                  required
                />
              </div>

              {/* Form Submission Buttons */}
              <div className="flex justify-end flex-wrap mt-5">
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
                  Save Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeAddAndEditForm;
