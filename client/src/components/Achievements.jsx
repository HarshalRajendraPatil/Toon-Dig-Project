import { useSelector } from "react-redux";
import Slider from "react-slick"; // Install react-slick and slick-carousel for the slider

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Achievements = () => {
  const user = useSelector((state) => state.user.user);

  // Badge data
  const badges = [
    {
      id: 1,
      name: "Anime Fanatic",
      description: "50+ Anime Watched",
      requirement: user?.stats?.animeWatched >= 50,
      colors: {
        active: "bg-gradient-to-r from-purple-500 via-pink-600 to-red-500",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 2,
      name: "Super Fan 🌟",
      description: "10+ Favorites",
      requirement: user?.stats?.favoritesCount >= 10,
      colors: {
        active: "bg-gradient-to-r from-blue-500 to-green-500",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 3,
      name: "Otaku Pro",
      description: "100+ Anime Watched",
      requirement: user?.stats?.animeWatched >= 100,
      colors: {
        active: "bg-gradient-to-r from-yellow-400 to-orange-500",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 4,
      name: "Anime Legend 👑",
      description: "200+ Anime Watched",
      requirement: user?.stats?.animeWatched >= 200,
      colors: {
        active: "bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-600",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 5,
      name: "Top Critic 🎥",
      description: "50+ Favorites",
      requirement: user?.stats?.favoritesCount >= 50,
      colors: {
        active: "bg-gradient-to-r from-red-400 via-purple-600 to-black",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 6,
      name: "Marathon Master 🕒",
      description: "1000+ Episodes Watched",
      requirement: user?.stats?.episodesWatched >= 1000,
      colors: {
        active: "bg-gradient-to-r from-gray-800 via-black to-indigo-900",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 7,
      name: "Community Voice 🎤",
      description: "50+ Comments",
      requirement: user?.stats?.commentsPosted >= 50,
      colors: {
        active: "bg-gradient-to-r from-green-500 to-blue-500",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 8,
      name: "Review Master 📝",
      description: "20+ Reviews",
      requirement: user?.stats?.reviewsPosted >= 20,
      colors: {
        active: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400",
        inactive: "bg-gray-300",
      },
    },
    {
      id: 9,
      name: "Collector 📚",
      description: "100+ Anime on Watchlist",
      requirement: user?.stats?.animeAddedToWatchlist >= 100,
      colors: {
        active: "bg-gradient-to-r from-blue-500 to-purple-700",
        inactive: "bg-gray-300",
      },
    },
  ];

  // Slider settings
  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="mt-10">
      <h3 className="text-3xl font-bold font-anime text-shadow-lg text-yellow-400 mb-6">
        🎉 Achievements 🎉
      </h3>
      <Slider {...sliderSettings}>
        {badges.map((badge) => (
          <div key={badge.id} className="p-4">
            <div
              className={`${
                badge.requirement ? badge.colors.active : badge.colors.inactive
              } text-white p-4 rounded-xl shadow-lg anime-card`}
            >
              <h4 className="text-xl font-anime">{badge.name}</h4>
              <p className="text-sm mt-1">{badge.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Achievements;
