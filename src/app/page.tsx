"use client";

import { useEffect, useRef, useState } from "react";
import Playlist from "@/features/playlist/playlist";
import PlayControl from "@/features/playControl/playControl";
import Clock from "@/features/clock/clock";
import { usePlayer } from "@/contexts/playerContext";
import "./page.scss";
import Navbar from "@/components/navbar/navbar";
import Pomodoro from "@/features/pomodoro/pomodoro";
import CharacterChat from "@/features/characterChat/characterChat";

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
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPlayList &&
        playlistElement.current &&
        !playlistElement.current.contains(event.target as Node)
      ) {
        setShowPlaylist(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPlayList]);

  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  // keyboard control
  useEffect(() => {
    const handlePlayByKey = (e: KeyboardEvent) => {
      if (e.key === " " && bgmRef.current) {
        if (isPlaying) handlePause();
        else handlePlay();
      }
      if (e.key === "Escape") {
        setShowPlaylist(false);
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
          
          {(!isMobile || showChat) && <CharacterChat />}
        </div>

        <div className="right">
          <Clock />
          
          <Pomodoro />
          <PlayControl handleShowPlayList={handleShowPlayList} />
        </div>

      </div>


      <Navbar
        isMobile={isMobile}
        toggleChat={() => setShowChat((prev) => !prev)}
      />


      {showPlayList &&
        <div className="page-playlist">
          <Playlist
            playlistElement={playlistElement}
            handleShowPlayList={handleShowPlayList}
          />
          <div className="blur-overlay"></div>
        </div>
      }

      <audio
        ref={bgmRef}
        src={
          tracks && currentTrack !== null && tracks[currentTrack]
            ? tracks[currentTrack].url
            : undefined
        }
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