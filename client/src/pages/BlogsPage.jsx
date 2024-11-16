import React, { useState, useEffect } from "react";
import axiosInstance from "../config/axiosConfig";
import { FaSearch } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import BlogCard from "../components/BlogCard";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user.user);

  const categories = ["", "Anime", "Tech", "Lifestyle", "Health"];
  const authors = ["", "AdminUser1", "AdminUser2", "AdminUser3"];
  const tags = ["", "Anime History", "Technology", "Music", "Storytelling"];
  const sortOptions = ["", "Latest", "Most Liked", "Most Commented"];

  const fetchBlogs = async (isNewSearch = false) => {
    setIsLoading(true);
    if (isNewSearch) {
      setBlogs([]);
      setPage(1);
      setHasMore(true);
    }

    try {
      const response = await axiosInstance.get(
        `/api/blogs?page=${
          isNewSearch ? 1 : page
        }&search=${searchQuery}&category=${categoryFilter}&author=${authorFilter}&tag=${tagFilter}&sort=${sortBy}`
      );

      const fetchedBlogs = response.data.data;

      if (isNewSearch) {
        setBlogs(fetchedBlogs);
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...fetchedBlogs]);
      }

      // Update hasMore based on whether the response contains fewer than expected items (e.g., 10 per page)
      setHasMore(fetchedBlogs.length >= 10);

      if (!isNewSearch) setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching blogs", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial blogs when component mounts or when any filter/search query changes
  useEffect(() => {
    fetchBlogs(true);
  }, [searchQuery, categoryFilter, authorFilter, tagFilter, sortBy]);

  const handleSearchClick = () => {
    fetchBlogs(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="lg:w-1/4 p-6 bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Filters</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-400">Search Title</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 pl-10 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-400">Category</label>
          <select
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category || "All Categories"}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-400">Author</label>
          <select
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          >
            {authors.map((author, index) => (
              <option key={index} value={author}>
                {author || "All Authors"}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-400">Tags</label>
          <select
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            {tags.map((tag, index) => (
              <option key={index} value={tag}>
                {tag || "All Tags"}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-gray-400">Sort By</label>
          <select
            className="w-full p-3 rounded-lg bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option, index) => (
              <option key={index} value={option}>
                {option || "Sort By"}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSearchClick}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-center font-semibold transition duration-200"
        >
          Search
        </button>

        {user?.role === "admin" && (
          <Link
            to={"/create-blog"}
            className="w-full block py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-center font-semibold transition duration-200 mt-4"
          >
            Create Blog
          </Link>
        )}
      </div>

      {/* Blog Section */}
      <div className="lg:w-3/4 p-6">
        <h1 className="text-4xl font-bold text-center mb-6">Blog</h1>

        {isLoading && blogs.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <InfiniteScroll
            dataLength={blogs.length}
            next={() => fetchBlogs()}
            hasMore={hasMore}
            loader={<LoadingSpinner />}
            endMessage={
              <p className="text-center mt-4 text-gray-400">
                No more blogs to show.
              </p>
            }
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
