const AnimeDetail = ({ anime }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h1 className="text-4xl font-semibold text-purple-400">{anime?.title}</h1>
      <p className="mt-4 text-gray-300">{anime?.description}</p>
      <div className="mt-4">
        <p className="text-sm text-gray-400">
          Genre: {anime?.genres?.join(", ")}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Rating: {anime?.averageRating}
        </p>
      </div>
    </div>
  );
};

export default AnimeDetail;
