import React, { useState, useEffect } from "react";
import axios from "axios";
import AnimeDisplay from "./AnimeDisplay";
import axiosInstance from "../config/axiosConfig";

const CustomisableAnimeDisplaySection = ({
  heading = "Anime",
  apiUrl, // Dynamic API endpoint
  showRank = false, // Option to display rank
}) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch trending anime from the provided apiUrl
  useEffect(() => {
    const fetchTrendingAnime = async () => {
      try {
        const response = await axiosInstance.get(apiUrl); // Use dynamic API URL
        setTrendingAnime(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending anime:", error);
        setLoading(false);
        toast.error(error?.response?.data?.message || "Something went wrong.");
      }
    };

    fetchTrendingAnime();
  }, [apiUrl]);

  return (
    <section className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-purple-400 mb-8 text-center">
          {heading}
        </h2>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-purple-400"></div>
          </div>
        ) : (
          // Carousel Wrapper
          <div className="relative">
            {/* Carousel Container */}
            <div className="flex overflow-x-scroll scrollbar-hide space-x-4">
              {trendingAnime.map((anime, index) => (
                <AnimeDisplay
                  key={anime._id}
                  index={index}
                  showRank={showRank}
                  anime={anime}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomisableAnimeDisplaySection;
