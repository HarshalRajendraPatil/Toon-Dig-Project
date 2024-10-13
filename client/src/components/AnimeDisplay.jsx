import React from "react";
import { Link } from "react-router-dom";

const AnimeDisplay = ({ index, showRank, anime }) => {
  const t = anime.title.replaceAll(" ", "-");

  return (
    <Link
      to={`/anime/${t}`}
      key={anime._id}
      className="relative group flex-shrink-0"
    >
      {/* Anime Poster */}
      <div className="relative">
        <img
          src={anime?.imageUrl?.url}
          alt={anime?.title.slice(0, 22) + "..."}
          className="rounded-lg shadow-lg w-[200px] h-[300px] object-cover group-hover:opacity-80 transition duration-300 ease-in-out"
        />

        {/* Hover Effect: Watch Now */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out flex items-center justify-center">
          <span className="text-lg font-bold text-white">Watch Now</span>
        </div>

        {/* Anime Rank (conditionally displayed) */}
        {showRank && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
            {index ? index + 1 : ""}
          </div>
        )}
      </div>

      {/* Anime Title */}
      <h3 className="text-lg font-semibold text-center text-white mt-2 w-[200px]">
        {anime?.title.length > 21
          ? `${anime?.title.slice(0, 22)}...`
          : anime?.title}
      </h3>
    </Link>
  );
};

export default AnimeDisplay;
