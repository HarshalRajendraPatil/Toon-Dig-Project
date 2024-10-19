import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiMaximize,
  FiMinimize,
  FiFastForward,
  FiRewind,
} from "react-icons/fi";
import screenfull from "screenfull";

const VideoPlayer = ({ episode }) => {
  const playerRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [quality, setQuality] = useState("default");

  useEffect(() => {
    stopVideo(); // Stop the current video
    setProgress(0);
    setCurrentTime(0);

    if (playerRef.current) {
      const videoDuration = playerRef.current?.getDuration();
      setDuration(videoDuration);
    }
  }, [episode.videoUrl]); // Reset player state when a new video URL is loaded

  const fetchAvailableQualities = () => {
    const internalPlayer = playerRef.current?.getInternalPlayer();
    if (internalPlayer && internalPlayer.getAvailableQualityLevels) {
      const qualities = internalPlayer.getAvailableQualityLevels();
      setAvailableQualities(qualities);
    }
  };

  const handleReady = () => {
    fetchAvailableQualities(); // Fetch qualities when the player is ready
  };

  const stopVideo = () => {
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0, "seconds"); // Reset to the start of the video
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(playerRef.current.wrapper);
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleProgressClick = (e) => {
    const videoDuration = playerRef.current?.getDuration();
    if (videoDuration && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const clickRatio = clickPosition / rect.width;
      const newTime = clickRatio * videoDuration;
      playerRef.current.seekTo(newTime, "seconds");
      setCurrentTime(newTime);
    }
  };

  const handleSkipForward = () => {
    const newTime = currentTime + 10;
    playerRef.current.seekTo(newTime, "seconds");
  };

  const handleSkipBackward = () => {
    const newTime = currentTime - 10;
    playerRef.current.seekTo(newTime < 0 ? 0 : newTime, "seconds");
  };

  const handleProgress = (state) => {
    if (!state.seeking) {
      setCurrentTime(state.playedSeconds);
      setProgress(state.played * 100);
    }
  };

  const handleSpeedChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleQualityChange = (e) => {
    const newQuality = e.target.value;
    setQuality(newQuality);

    const internalPlayer = playerRef.current.getInternalPlayer();
    if (internalPlayer && internalPlayer.setPlaybackQuality) {
      internalPlayer.setPlaybackQuality(newQuality);
    }
  };

  return (
    <div className="video-player relative w-full bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <ReactPlayer
        key={episode.videoUrl} // Ensure re-render on videoUrl change
        ref={playerRef}
        className="react-player"
        url={episode.videoUrl} // Updated YouTube video URL
        playing={isPlaying}
        volume={volume}
        onProgress={handleProgress}
        onReady={handleReady} // Fetch available qualities when player is ready
        playbackRate={playbackRate}
        controls={false}
        width="100%"
        height="80vh"
      />

      {/* Custom Controls */}
      <div className="controls absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-gray-900 to-transparent flex flex-col space-y-3">
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="progress-bar w-full h-3 bg-gray-600 rounded-lg cursor-pointer overflow-hidden"
          onClick={handleProgressClick}
        >
          <div
            className="progress-fill h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-white">
          {/* Left Controls: Play/Pause, Skip Backward */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="hover:text-blue-400 transition duration-300"
            >
              {isPlaying ? <FiPause size={28} /> : <FiPlay size={28} />}
            </button>

            <button
              onClick={handleSkipBackward}
              className="hover:text-blue-400 transition duration-300"
            >
              <FiRewind size={28} />
            </button>

            <button
              onClick={handleSkipForward}
              className="hover:text-blue-400 transition duration-300"
            >
              <FiFastForward size={28} />
            </button>
          </div>

          {/* Center Controls: Volume, Current Time / Duration */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <FiVolume2 className="text-white" size={22} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="ml-2 w-28 cursor-pointer"
              />
            </div>

            <div className="text-sm font-mono">
              {new Date(currentTime * 1000).toISOString().substr(11, 8)} /{" "}
              {new Date(duration * 1000).toISOString().substr(11, 8)}
            </div>
          </div>

          {/* Right Controls: Fullscreen, Playback Speed, Quality */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleFullscreen}
              className="hover:text-blue-400 transition duration-300"
            >
              {isFullscreen ? (
                <FiMinimize size={28} />
              ) : (
                <FiMaximize size={28} />
              )}
            </button>

            <select
              value={playbackRate}
              onChange={handleSpeedChange}
              className="bg-gray-700 text-white rounded px-2 py-1"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            <select
              value={quality}
              onChange={handleQualityChange}
              className="bg-gray-700 text-white rounded px-2 py-1"
            >
              {availableQualities.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
