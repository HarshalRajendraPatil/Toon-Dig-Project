import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig.js";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { Link } from "react-router-dom";

const ListSection = ({ title, icon, emptyMessage }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        let response;
        if (title === "Favorites") {
          response = await axiosInstance.get("/api/users/favorites");
        } else if (title === "Watchlist") {
          response = await axiosInstance.get("/api/users/watchlist");
        }
        setItems(response.data.data); // Set the items with the fetched data
      } catch (error) {
        toast.error("Failed to load the data"); // Show error message if fetching fails
      } finally {
        setLoading(false); // Stop loading in both success and failure cases
      }
    };

    fetchData(); // Call the function to fetch data
  }, [title]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-lg text-gray-400 mb-4 flex items-center space-x-2">
        {icon} <span>{title}</span>
      </h3>

      {loading ? (
        <LoadingSpinner /> // Show loading spinner while loading is true
      ) : items.length === 0 ? (
        <p className="text-gray-500">{emptyMessage}</p> // Show empty message if no items
      ) : (
        <ul className="space-y-4">
          {items.map((anime, index) => (
            <li key={index} className="">
              {(anime.title = anime.title.split(" ").join("-"))}
              <Link
                to={`/anime/${anime?.title}`}
                className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-start items-center gap-4 flex-wrap"
              >
                <img
                  src={anime?.imageUrl?.url}
                  alt={anime?.title}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {anime?.title}
                  </h4>
                  <p className="text-gray-400">
                    {anime?.seasons?.length || 0} seasons
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListSection;
