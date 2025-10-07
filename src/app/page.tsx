"use client";

import { useEffect, useRef, useState } from "react";
import Playlist from "@/features/playlist/playlist";
import PlayControl from "@/features/playControl/playControl";
import Loading from "@/components/loading/loading";
import Clock from "@/features/clock/clock";
import { usePlayer } from "@/contexts/playerContext";
import "./page.scss";
import Navbar from "@/components/navbar/navbar";
import Pomodoro from "@/features/pomodoro/pomodoro";
import CharacterChat from "@/components/characterChat/characterChat";

export default function Home() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    handlePlay,
    handlePause,
    handleNext,
    bgmRef,
  } = usePlayer();

  const [showPlayList, setShowPlaylist] = useState(false);
  const playlistElement = useRef<HTMLDivElement>(null);

  const handleShowPlayList = () => {
    setShowPlaylist(!showPlayList);
    if (playlistElement.current) {
      playlistElement.current.style.width = showPlayList ? "0%" : "100%";
    }
  };

  // keyboard control
  useEffect(() => {
    const handlePlayByKey = (e: KeyboardEvent) => {
      if (e.key === " " && bgmRef.current) {
        if (isPlaying) handlePause();
        else handlePlay();
      }
      if (e.key === "Escape") {
        setShowPlaylist(false);
        if (playlistElement.current) playlistElement.current.style.width = "0%";
      }
    };
    window.addEventListener("keydown", handlePlayByKey);
    return () => window.removeEventListener("keydown", handlePlayByKey);
  }, [isPlaying, handlePlay, handlePause]);

  return (
    <>
    <div className="page retro-screen">
      <h1 className="hidden-text">rhythmloft Lo-fi Music Player</h1>

      <div className="content">
        <div className="left">
          <Playlist
            playlistElement={playlistElement}
            handleShowPlayList={handleShowPlayList}
          />
        </div>

        <div className="mid">
          <CharacterChat />
          <Pomodoro />
          <PlayControl handleShowPlayList={handleShowPlayList} />
        </div>

        <div className="right"></div>

        <Clock />
        <Navbar />
      </div>

      <audio
        ref={bgmRef}
        src={
          tracks && currentTrack !== null && tracks[currentTrack]
            ? tracks[currentTrack].url
            : undefined
        }
        autoPlay
        preload="none"
        onEnded={handleNext}
      />
    </div>

    <div className="vaporwave-overlay"></div>

    {/* <div className="particles-overlay">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDuration: `${3 + Math.random() * 5}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
          }}
        />
      ))}
    </div> */}
    {/* <div className="rain-overlay">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
            opacity: 0.2 + Math.random() * 0.3,
            height: `${10 + Math.random() * 10}px`,
          }}
        />
      ))}
    </div> */}
    </>
  );
}