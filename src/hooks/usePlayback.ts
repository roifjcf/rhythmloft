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
    if (!tracks || !bgmRef.current) return;
    if (playMode === "shuffle") {
      setCurrentTrack(Math.floor(Math.random() * tracks.length));
    } else if (playMode === "repeat") {
      setCurrentTrack((prev) => (prev! + 1) % tracks.length);
    } else if (playMode === "repeat-one") {
      bgmRef.current.currentTime = 0;
    }
    handlePlay();
  };

  const handlePrev = () => {
    if (!tracks || !bgmRef.current) return;
    if (playMode === "shuffle") {
      setCurrentTrack(Math.floor(Math.random() * tracks.length));
    } else if (playMode === "repeat") {
      setCurrentTrack((prev) => (prev! - 1 + tracks.length) % tracks.length);
    } else if (playMode === "repeat-one") {
      bgmRef.current.currentTime = 0;
    }
    handlePlay();
  };

  // volume
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.volume = volume;
    }
  }, [volume]);

  return { currentTrack, setIsPlaying, setCurrentTrack, setPlayMode, isPlaying, playMode, volume, setVolume, bgmRef, handlePlay, handlePause, handleNext, handlePrev };
};