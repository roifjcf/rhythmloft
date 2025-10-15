'use client';
import { createContext, ReactNode, useContext, useMemo, useState, useEffect } from "react";
import { PlayMode, trackInterface } from "@/common/type";
import { useTracks } from "@/hooks/useTracks";
import { usePlayback } from "@/hooks/usePlayback";
import { useTrackList } from "@/hooks/useTrackList";
import { TRACK_CATEGORIES } from "@/utils/constant";

type PlayerContextType = {
  tracks: trackInterface[] | null;
  customTracks: trackInterface[] | null;
  ignoredTracks: trackInterface[] | null;
  currentTrack: number | null;
  isPlaying: boolean;
  playMode: PlayMode;
  volume: number;
  bgmRef: React.RefObject<HTMLAudioElement>;
  handlePlay: () => void;
  handlePause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handlePlaylistSongClick: (i: number) => void;
  setPlayMode: (mode: PlayMode) => void;
  setVolume: (v: number) => void;
  handlePlayCategory: Record<string, () => void>;
  toggleCustomTrack: (track: trackInterface) => void;
  toggleIgnoredTrack: (track: trackInterface) => void;
  resetIgnoredTracks: () => void;
  resetCustomTracks: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { tracks: customTracks, toggleTrack: toggleCustomTrack, setTracks: setCustomTracks } = useTrackList("customTracks");
  const { tracks: ignoredTracks, toggleTrack: toggleIgnoredTrack, setTracks: setIgnoredTracks } = useTrackList("ignoredTracks");

  const { tracksByCategory } = useTracks();

  const [tracks, setTracks] = useState<trackInterface[] | null>(
    tracksByCategory[TRACK_CATEGORIES[0]] ?? []
  );

  useEffect(() => {
    if (!tracks || tracks.length === 0) {
      setTracks(tracksByCategory[TRACK_CATEGORIES[0]] ?? []);
    }
  }, [tracksByCategory]);

  const {
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
    handlePrev
  } = usePlayback(tracks || [], ignoredTracks?.map(t => t.url) || []);

  const handlePlaylistSongClick = (i: number) => {
    setCurrentTrack(i);
    setIsPlaying(true);
  };

  const handlePlayCategory: Record<string, () => void> = useMemo(() => {
    const handlers: Record<string, () => void> = {};
    TRACK_CATEGORIES.forEach(category => {
      handlers[category] = () => {
        const catTracks = tracksByCategory[category];
        if (!catTracks) return;
        setTracks(catTracks);
        setCurrentTrack(0);
      };
    });
    handlers["customTracks"] = () => {
      if (!customTracks) return;
      setTracks(customTracks);
      setCurrentTrack(0);
    };
    return handlers;
  }, [tracksByCategory, customTracks, setCurrentTrack]);

  const resetIgnoredTracks = () => {
    localStorage.removeItem("ignoredTracks");
    setIgnoredTracks([]);
  };

  const resetCustomTracks = () => {
    localStorage.removeItem("customTracks");
    setCustomTracks([]);
  };

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        customTracks,
        ignoredTracks,
        currentTrack,
        isPlaying,
        playMode,
        volume,
        handlePlay,
        handlePause,
        handleNext,
        handlePrev,
        handlePlaylistSongClick,
        setPlayMode,
        setVolume,
        bgmRef,
        handlePlayCategory,
        toggleCustomTrack,
        toggleIgnoredTrack,
        resetIgnoredTracks,
        resetCustomTracks,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
