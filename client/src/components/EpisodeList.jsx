import { Link } from "react-router-dom";
import { setCurrentEpisode } from "../store/slices/episodeSlice.js";
import { useSelector, useDispatch } from "react-redux";

const EpisodeList = ({ episodes = [] }) => {
  const { anime } = useSelector((state) => state.anime);
  const dispatch = useDispatch();
  const title = anime.title.split(" ").join("-");

  const setEpisode = (id) => {
    dispatch(setCurrentEpisode(id));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 py-8 max-w-full mx-auto">
      {episodes.map((episode) => (
        <button
          key={episode?.number}
          className="bg-gray-800 hover:bg-gray-700 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
          onClick={() => setEpisode(episode?._id)}
        >
          <Link to={`/${title}/stream`} className="block">
            {/* Episode Image */}
            <div className="relative w-full h-48 flex flex-col items-start justify-start">
              <img
                src={episode?.thumbnailUrl || "/default-episode-image.jpg"}
                alt={`Episode ${episode?.number}`}
                className="w-full h-full object-cover rounded-t-lg"
              />
              {/* Episode Length Overlay */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-lg">
                {episode?.duration
                  ? `${episode?.duration} min`
                  : "Unknown length"}
              </div>
            </div>

            {/* Episode Info */}
            <div className="p-4">
              <h3 className="text-lg md:text-xl text-purple-400 font-semibold mb-2">
                Episode {episode?.number}: {episode?.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">
                {episode?.description || "No description available."}
              </p>
            </div>
          </Link>
        </button>
      ))}
    </div>
  );
};

export default EpisodeList;
