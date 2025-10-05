import { useState, useEffect } from "react";
import { trackInterface } from "@/common/type";

export const useTrackList = (key: "customTracks" | "ignoredTracks") => {
  const [tracks, setTracks] = useState<trackInterface[] | null>(null);

  // init
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setTracks(JSON.parse(saved));
  }, [key]);

  // toggle track
  const toggleTrack = (track: trackInterface) => {
    setTracks(prev => {
      const safePrev = prev ?? [];
      const exists = safePrev.some(t => t.name === track.name);
      const updated = exists ? safePrev.filter(t => t.name !== track.name) : [...safePrev, track];
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  return { tracks, toggleTrack };
};
