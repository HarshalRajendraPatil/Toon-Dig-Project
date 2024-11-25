import React, { useState } from "react";
import axiosInstance from "../config/axiosConfig";
import RestrictedFeature from "../RestrictedFeature";
// import { useHistory } from "react-router-dom";

const CreateOrEditBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [relatedAnime, setRelatedAnime] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  // const history = useHistory();

  const categories = ["News", "Reviews", "Features", "Updates", "Opinion"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags));
      formData.append("relatedAnime", JSON.stringify(relatedAnime));
      formData.append("isFeatured", isFeatured);
      formData.append("isPublished", isPublished);
      if (thumbnailImage) formData.append("thumbnailImage", thumbnailImage);
      if (bannerImage) formData.append("bannerImage", bannerImage);

      await axiosInstance.post("/api/blogs", formData);
      // history.push("/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <RestrictedFeature>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Create New Blog
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-400 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                maxLength={150}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-gray-400 mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the content here..."
                required
                rows="8"
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-purple-500"
              ></textarea>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-gray-400 mb-1">Tags</label>
              <input
                type="text"
                value={tags.join(", ")}
                onChange={(e) =>
                  setTags(e.target.value.split(",").map((tag) => tag.trim()))
                }
                placeholder="Add tags separated by commas"
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Related Anime */}
            <div>
              <label className="block text-gray-400 mb-1">Related Anime</label>
              <input
                type="text"
                value={relatedAnime.join(", ")}
                onChange={(e) =>
                  setRelatedAnime(
                    e.target.value.split(",").map((id) => id.trim())
                  )
                }
                placeholder="Add related anime IDs separated by commas"
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Thumbnail Image */}
            <div>
              <label className="block text-gray-400 mb-1">
                Thumbnail Image
              </label>
              <input
                type="file"
                onChange={(e) => setThumbnailImage(e.target.files[0])}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-gray-400 mb-1">Banner Image</label>
              <input
                type="file"
                onChange={(e) => setBannerImage(e.target.files[0])}
                className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Featured & Published Status */}
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-400">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="mr-2"
                />
                Featured
              </label>
              <label className="flex items-center text-gray-400">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="mr-2"
                />
                Published
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-center font-semibold transition duration-200"
            >
              Publish Blog
            </button>
          </form>
        </div>
      </div>
    </RestrictedFeature>
  );
};

export default CreateOrEditBlog;
