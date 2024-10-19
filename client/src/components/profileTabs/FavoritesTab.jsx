import React from "react";
import ListSection from "./ListSection";
import { FaHeart } from "react-icons/fa";

const FavoritesTab = ({ user }) => {
  return (
    <ListSection
      title="Favorites"
      icon={<FaHeart />}
      emptyMessage="You haven't added any favorites yet."
    />
  );
};

export default FavoritesTab;
