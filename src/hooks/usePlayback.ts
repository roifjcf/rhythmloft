import { useState, useRef, useEffect } from "react";
import { trackInterface, PlayMode } from "@/common/type";

export const usePlayback = (
  tracks: trackInterface[] | null,
  ignoredTracks: string[] = [] // urls
) => {
  const [currentTrack, setCurrentTrack] = useState<number | null>(
    tracks && tracks.length > 0 ? 0 : null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("shuffle");
  const [volume, setVolume] = useState(1);
  const bgmRef = useRef<HTMLAudioElement>(null);

  const getNextTrackIndex = (direction: 1 | -1 = 1) => {
    if (!tracks || tracks.length === 0) return null;

    const total = tracks.length;
    let next = currentTrack !== null ? currentTrack : 0;

    for (let i = 0; i < total; i++) {
      if (playMode === "shuffle") {
        next = Math.floor(Math.random() * total);
      } else {
        next = (next + direction + total) % total;
      }

      if (!ignoredTracks.includes(tracks[next]?.url || "")) {
        return next;
      }
    }

    return null;
  };

  const handlePlay = () => {
    if (bgmRef.current) bgmRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (bgmRef.current) bgmRef.current.pause();
    setIsPlaying(false);
  };

  const handleNext = () => {
    const next = getNextTrackIndex(1);
    if (next !== null) setCurrentTrack(next);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prev = getNextTrackIndex(-1);
    if (prev !== null) setCurrentTrack(prev);
    setIsPlaying(true);
  };

  // volume
  useEffect(() => {
    if (bgmRef.current) bgmRef.current.volume = volume;
  }, [volume]);

  // auto play on track change or play state
  useEffect(() => {
    if (bgmRef.current && tracks && currentTrack !== null) {
      const track = tracks[currentTrack];
      if (track?.url) {
        bgmRef.current.src = track.url;
        if (isPlaying) {
          bgmRef.current
            .play()
            .catch((err) => {
              if (err.name !== "AbortError") console.error(err);
            });
        }
      }
    }
  }, [currentTrack, isPlaying, tracks]);

  return {
    currentTrack,
    setIsPlaying,
    setCurrentTrack,
    setPlayMode,
    isPlaying,
    playMode,
    volume,
    setVolume,
    bgmRef,
    handlePlay,
    handlePause,
    handleNext,
    handlePrev,
  };
};
