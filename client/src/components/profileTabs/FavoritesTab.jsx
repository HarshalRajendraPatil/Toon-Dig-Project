import React from "react";
import ListSection from "./ListSection";
import { FaHeart } from "react-icons/fa";

const FavoritesTab = () => {
  return (
    <ListSection
      title="Favorites"
      icon={<FaHeart />}
      emptyMessage="No favorites added yet."
    />
  );
};

export default FavoritesTab;
