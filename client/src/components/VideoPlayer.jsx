import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";

const VideoPlayer = ({ episode }) => {
  const playerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    stopVideo(); // Stop the current video
    if (playerRef.current) {
      const videoDuration = playerRef.current?.getDuration();
    }
  }, [episode.videoUrl]); // Reset player state when a new video URL is loaded

  const stopVideo = () => {
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0, "seconds"); // Reset to the start of the video
    }
  };

  return (
    <div className="video-player relative w-full bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <ReactPlayer
        key={episode.videoUrl} // Ensure re-render on videoUrl change
        ref={playerRef}
        className="react-player"
        url={episode.videoUrl} // YouTube video URL
        playing={isPlaying}
        volume={volume}
        playbackRate={playbackRate}
        controls={true} // Enable YouTube's default controls
        width="100%"
        height="auto"
        style={{ aspectRatio: "16/9" }} // Keeps the aspect ratio
      />
    </div>
  );
};

export default VideoPlayer;
