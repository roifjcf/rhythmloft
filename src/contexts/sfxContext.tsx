'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";

interface SfxContextType {
  sfxList: string[] | null;
  sfxVolumes: { [key: string]: number };
  sfxPlaying: { [key: string]: boolean };
  toggleSfx: (name: string) => void;
  setSfxVolume: (name: string, volume: number) => void;
}

const SfxContext = createContext<SfxContextType | undefined>(undefined);

export function SfxProvider({ children }: { children: ReactNode }) {
  const [sfxList, setSfxList] = useState<string[] | null>(null);
  const [sfxVolumes, setSfxVolumes] = useState<{ [key: string]: number }>({});
  const [sfxPlaying, setSfxPlaying] = useState<{ [key: string]: boolean }>({});
  const sfxRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Fetch and setup logic
  useEffect(() => {
    const fetchSfx = async () => {
      try {
        const res = await fetch("/api/sfxinit");
        const data = await res.json();
        setSfxList(data.message);

        data.message.forEach((name: string) => {
          const audio = new Audio(`ambient sfx/${name}`);
          audio.preload = "none";
          audio.volume = 1;
          audio.loop = true; // Loop the SFX
          sfxRefs.current[name] = audio;
          setSfxVolumes(prev => ({ ...prev, [name]: 1 }));
          setSfxPlaying(prev => ({ ...prev, [name]: false }));
        });

      } catch (error) {
        console.error("Failed to fetch SFX list:", error);
      }
    };

    fetchSfx();
  }, []);

  const toggleSfx = (name: string) => {
    const audio = sfxRefs.current[name];
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      setSfxPlaying(prev => ({ ...prev, [name]: false }));
    } else {
      audio.currentTime = 0;
      audio.play();
      setSfxPlaying(prev => ({ ...prev, [name]: true }));
    }
  };

  const setSfxVolume = (name: string, volume: number) => {
    setSfxVolumes(prev => ({ ...prev, [name]: volume }));
    const audio = sfxRefs.current[name];
    if (audio) audio.volume = volume;
  };

  return (
    <SfxContext.Provider value={{ sfxList, sfxVolumes, sfxPlaying, toggleSfx, setSfxVolume }}>
      {children}
    </SfxContext.Provider>
  );
}

export function useSfx() {
  const context = useContext(SfxContext);
  if (!context) throw new Error("useSfx must be used within SfxProvider");
  return context;
}
