import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gray-900 text-white py-24 lg:py-32">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: "url('HeorSection.jpg')", // Replace with your anime-related background image
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900 opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-purple-400 mb-6 leading-tight">
          Explore Your World of Anime!
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Stream thousands of anime series, connect with the community, and dive
          deep into the world of your favorite shows. All in one place.
        </p>

        {/* Call to Action (CTA) Button */}
        <div className="space-x-4 flex items-center justify-center flex-wrap gap-5">
          <Link
            to="/anime"
            className="inline-block px-8 py-3 text-lg font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md transition duration-300 ease-in-out"
          >
            Start Watching
          </Link>
          <Link
            to="/register"
            className="inline-block px-8 py-3 text-lg font-medium bg-transparent border-2 border-purple-500 hover:bg-purple-500 hover:text-white text-purple-400 rounded-full shadow-md transition duration-300 ease-in-out"
          >
            Join the Community
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
