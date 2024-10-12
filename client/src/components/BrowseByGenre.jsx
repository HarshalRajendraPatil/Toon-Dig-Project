import React from "react";
import { Link } from "react-router-dom";

const BrowseByGenre = () => {
  return (
    <div>
      <section className="py-10 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-bold text-purple-400 mb-6">
          Browse by Genre
        </h2>
        <div className="flex flex-wrap gap-4">
          {[
            "Action",
            "Romance",
            "Adventure",
            "Fantasy",
            "Comedy",
            "Horror",
            "Psychology",
            "Thriller",
          ].map((genre, i) => (
            <Link
              to={`/genre/${genre.toLowerCase()}`}
              key={i}
              className="px-4 py-2 bg-gray-800 hover:bg-purple-700 rounded-full text-white text-sm font-semibold"
            >
              {genre}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BrowseByGenre;
