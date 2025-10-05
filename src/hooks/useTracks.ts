import { useState, useEffect } from "react";
import { trackInterface } from "@/common/type";

export const useTracks = () => {
  const [tracks, setTracks] = useState<trackInterface[] | null>(null);
  const [tracksLofi, setTracksLofi] = useState<trackInterface[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // load tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("api/trackinit");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setTracks(data["tracks-lofi"]);
        setTracksLofi(data["tracks-lofi"]);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch tracks:", err);
        setError(err.message || "Unknown error");
        setTracks([]);
        setTracksLofi([]);
      }
    };
    fetchTracks();
  }, []);

  return {
    tracks,
    setTracks,
    tracksLofi,
    error
  };
};
