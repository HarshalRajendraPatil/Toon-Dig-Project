const SeasonSelector = ({ seasons = [], selectedSeason, onSeasonChange }) => {
  return (
    <div className="flex gap-4 items-center flex-wrap mb-8 justify-center">
      {seasons.map((season, index) => (
        <button
          key={index}
          onClick={() => onSeasonChange(index + 1)}
          className={`px-6 py-2 rounded-full text-white ${
            selectedSeason === index + 1 ? "bg-purple-500" : "bg-gray-700"
          } hover:bg-purple-600 transition duration-300`}
        >
          Season {index + 1}
        </button>
      ))}
    </div>
  );
};

export default SeasonSelector;
