import React from "react";
import HeroSection from "../components/HeroSection";
import CustomisableAnimeDisplaySection from "../components/CustomisableAnimeDisplaySection";
import BrowseByGenre from "../components/BrowseByGenre";

const HomePage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <HeroSection />
      <CustomisableAnimeDisplaySection
        heading="Trending Animes"
        apiUrl="/api/admin/anime"
        showRank={false}
      />
      <CustomisableAnimeDisplaySection
        heading="Recommended Animes"
        apiUrl="/api/admin/anime"
        showRank={true}
      />
      <BrowseByGenre />
    </div>
  );
};

export default HomePage;
