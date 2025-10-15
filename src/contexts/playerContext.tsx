'use client';
import { createContext, ReactNode, useContext } from "react";
import { PlayMode, trackInterface } from "@/common/type";
import { useTracks } from "@/hooks/useTracks";
import { usePlayback } from "@/hooks/usePlayback";
import { useTrackList } from "@/hooks/useTrackList";

type PlayerContextType = {
  // states
  tracks: trackInterface[] | null;
  customTracks: trackInterface[] | null;
  ignoredTracks: trackInterface[] | null;
  currentTrack: number | null;
  isPlaying: boolean;
  playMode: PlayMode;
  volume: number;
  // ref
  bgmRef: React.RefObject<HTMLAudioElement>;
  // actions
  handlePlay: () => void;
  handlePause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handlePlaylistSongClick: (i: number) => void;
  setPlayMode: (mode: PlayMode) => void;
  setVolume: (v: number) => void;
  handlePlayLofi: () => void;
  handlePlaySynthwave: () => void;
  handlePlayFantasy: () => void;
  handlePlayAcoustic: () => void;
  handlePlayCustomTracks: () => void;
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

  const {
    tracks,
    setTracks,
    tracksLofi,
    tracksSynthwave,
    tracksAcoustic,
    tracksFantasy
  } = useTracks();

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
  } = usePlayback(tracks, ignoredTracks?.map(t => t.url) || []);




  const handlePlaylistSongClick = (i: number) => {
    setCurrentTrack(i);
    setIsPlaying(true);
  };


  const handlePlayLofi = () => {
    if (!tracksLofi) return;
    setTracks(tracksLofi);
    setCurrentTrack(0);
  }

  const handlePlaySynthwave = () => {
    if (!tracksSynthwave) return;
    setTracks(tracksSynthwave);
    setCurrentTrack(0);
  }

  const handlePlayFantasy = () => {
    if (!tracksFantasy) return;
    setTracks(tracksFantasy);
    setCurrentTrack(0);
  }

  const handlePlayAcoustic = () => {
    if (!tracksAcoustic) return;
    setTracks(tracksAcoustic);
    setCurrentTrack(0);
  }

  const handlePlayCustomTracks = () => {
    if (!customTracks) return;
    setTracks(customTracks);
    setCurrentTrack(0);
  }

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
        handlePlayLofi,
        handlePlaySynthwave,
        handlePlayFantasy,
        handlePlayAcoustic,
        handlePlayCustomTracks,
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