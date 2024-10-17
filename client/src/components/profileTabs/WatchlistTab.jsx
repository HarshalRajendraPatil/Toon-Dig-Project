import React from "react";
import { FaListAlt } from "react-icons/fa";
import ListSection from "./ListSection";

const WatchlistTab = ({ user }) => {
  return (
    <ListSection
      title="Watchlist"
      icon={<FaListAlt />}
      items={user?.watchlist || []}
      emptyMessage="Your watchlist is currently empty."
    />
  );
};

export default WatchlistTab;
