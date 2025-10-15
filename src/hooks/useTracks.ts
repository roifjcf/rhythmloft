import { useState, useEffect } from "react";
import { trackInterface } from "@/common/type";
import { TRACK_CATEGORIES } from "@/utils/constant";

type TracksByCategory = Record<string, trackInterface[] | null>;

export const useTracks = () => {
  const [tracksByCategory, setTracksByCategory] = useState<TracksByCategory>(() =>
    TRACK_CATEGORIES.reduce((acc, category) => {
      acc[category] = null;
      return acc;
    }, {} as TracksByCategory)
  );
  const [error, setError] = useState<string | null>(null);

  // load tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("api/trackinit");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const newTracks: TracksByCategory = {};
        TRACK_CATEGORIES.forEach((category) => {
          newTracks[category] = data[`tracks-${category}`] ?? [];
        });

        setTracksByCategory(newTracks);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch tracks:", err);
        setError(err.message || "Unknown error");

        const emptyTracks: TracksByCategory = {};
        TRACK_CATEGORIES.forEach((category) => {
          emptyTracks[category] = [];
        });
        setTracksByCategory(emptyTracks);
      }
    };
    fetchTracks();
  }, []);

  return {
    tracksByCategory,
    setTracksByCategory,
    error,
  };
};
