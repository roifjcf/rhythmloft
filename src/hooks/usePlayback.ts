import { useState, useRef, useEffect } from "react";
import { trackInterface, PlayMode } from "@/common/type";

export const usePlayback = (tracks: trackInterface[] | null) => {

  const [currentTrack, setCurrentTrack] = useState<number | null>(0); // track number
  const [isPlaying, setIsPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("shuffle");
  const [volume, setVolume] = useState(1);
  const bgmRef = useRef<HTMLAudioElement>(null);


  const handlePlay = () => { bgmRef.current?.play(); setIsPlaying(true); };

  const handlePause = () => { bgmRef.current?.pause(); setIsPlaying(false); };

  const handleNext = () => {
    if (!tracks) return;

    if (playMode === "shuffle") {
      setCurrentTrack(Math.floor(Math.random() * tracks.length));
    } else if (playMode === "repeat") {
      setCurrentTrack((prev) => (prev! + 1) % tracks.length);
    } else if (playMode === "repeat-one") {
      if (bgmRef.current) bgmRef.current.currentTime = 0;
    }

    setIsPlaying(true); // auto play next track
  };

  const handlePrev = () => {
    if (!tracks) return;

    if (playMode === "shuffle") {
      setCurrentTrack(Math.floor(Math.random() * tracks.length));
    } else if (playMode === "repeat") {
      setCurrentTrack((prev) => (prev! - 1) % tracks.length);
    } else if (playMode === "repeat-one") {
      if (bgmRef.current) bgmRef.current.currentTime = 0;
    }
    setIsPlaying(true); // auto play next track
  };

  // volume
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = volume;
    }
  }, [volume]);

  // auto play next track
  useEffect(() => {
  if (bgmRef.current) {
    if (isPlaying && bgmRef.current.src) {
      bgmRef.current
        .play()
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
    } else {
      bgmRef.current.pause();
    }
  }
}, [isPlaying, currentTrack, tracks]);

  return { currentTrack, setIsPlaying, setCurrentTrack, setPlayMode, isPlaying, playMode, volume, setVolume, bgmRef, handlePlay, handlePause, handleNext, handlePrev };
};