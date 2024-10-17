import React from "react";
import { FaHistory } from "react-icons/fa";
import ListSection from "./ListSection";

const WatchHistoryTab = ({ user }) => {
  return (
    <ListSection
      title="Watch History"
      icon={<FaHistory />}
      items={user?.watchHistory || []}
      emptyMessage="No watch history available."
    />
  );
};

export default WatchHistoryTab;
