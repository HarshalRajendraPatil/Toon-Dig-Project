import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../config/axiosConfig";

const EpisodeList = ({ id }) => {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/admin/season/${id}/episode`
        );
        setEpisodes(response.data.data);
      } catch (error) {
        console.log(error);
        console.error("Error fetching episodes", error);
        toast.error(error?.response?.data?.message || "Something went wrong.");
      }
    };
    if (id) fetchEpisodes();
  }, [id]);

  return episodes?.length === 0 ? (
    <h1 className="text-white text-center text-3xl">
      The Episodes for this season will be uploaded soon.
    </h1>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {episodes.map((episode) => (
        <div
          key={episode?.number}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105"
        >
          {/* Episode Image */}
          <div className="relative">
            <img
              src={episode?.thumbnailUrl || "/default-episode-image.jpg"}
              alt={`Episode ${episode?.number}`}
              className="w-full h-48 object-cover"
            />

            {/* Episode Length Overlay */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-lg">
              {`${episode?.duration} min` || "Unknown length"}
            </div>
          </div>

          {/* Episode Info */}
          <div className="p-4">
            <h3 className="text-xl text-purple-400 mb-2">
              Episode {episode?.number}: {episode?.title}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-2">
              {episode?.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
