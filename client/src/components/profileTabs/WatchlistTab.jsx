import React from "react";
import { FaListAlt } from "react-icons/fa";
import ListSection from "./ListSection";

const WatchlistTab = () => {
  return (
    <ListSection
      title="Watchlist"
      icon={<FaListAlt />}
      emptyMessage="The watchlist is currently empty."
    />
  );
};

export default WatchlistTab;
