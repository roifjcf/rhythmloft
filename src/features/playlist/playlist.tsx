"use client";

import { usePlayer } from "@/contexts/playerContext";
import "./playlist.scss";
import { useState } from "react";
import SearchBar from "@/components/searchBar/searchBar";
import { isTrackIgnored } from "@/utils/trackHelpers";
import TrackActionButtons from "@/components/trackActionButtons/trackActionButtons";
import Icon from "@/components/icon/icon";

interface Props {
  playlistElement: React.RefObject<HTMLDivElement>;
  handleShowPlayList: () => void;
}

export default function Playlist({ playlistElement, handleShowPlayList }: Props) {
  const {
    tracks,
    ignoredTracks,
    currentTrack,
    handlePlaylistSongClick,
    handlePlayLofi,
    handlePlaySynthwave,
    handlePlayCustomTracks
  } = usePlayer();

  const [selectedPlaylist, setSelectedPlaylist] = useState<"lofi" | "synthwave" | "custom">("lofi");
  const [searchTerm, setSearchTerm] = useState("");
  if (!tracks) return <div className="playlist-container">Loading playlist...</div>;

  const handleSelectPlaylist = (type: typeof selectedPlaylist, action?: () => void) => {
    setSelectedPlaylist(type);
    if (action) action();
  };

  const filteredTracks = tracks.filter(track =>
    track.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="playlist-container container-bg" ref={playlistElement}>

      <div className="playlist-topbar">
        <div className="playlist-buttons">
          <Icon
            src="img/icons/left-1.png"
            alt="close playlist"
            containerClassName="playlist-closebutton"
            onClick={handleShowPlayList}
            size="sm"
          />
          <button
            className={selectedPlaylist === "lofi" ? "playlist-buttons--selected" : ""}
            onClick={() => handleSelectPlaylist("lofi", handlePlayLofi)}
          >
            Lofi
          </button>
          <button
            className={selectedPlaylist === "synthwave" ? "playlist-buttons--selected" : ""}
            onClick={() => handleSelectPlaylist("synthwave", handlePlaySynthwave)}
          >
            Synthwave
          </button>
          <button
            className={selectedPlaylist === "custom" ? "playlist-buttons--selected" : ""}
            onClick={() => handleSelectPlaylist("custom", handlePlayCustomTracks)}
          >
            Custom
          </button>
        </div>

        <SearchBar
          value={searchTerm}
          placeholder="Search by track name..."
          onChange={setSearchTerm}
          className="playlist-search"
        />
      </div>

      <div className="playlist-tracks">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, i) => {
            const ignored = isTrackIgnored(track, ignoredTracks);

            return (
              <div
                key={i}
                className={`playlist-track-container ${currentTrack === i ? "playlist-current" : ""}`}
                onClick={() => handlePlaylistSongClick(i)}
              >
                <p
                  className={`playlist-track ${ignored ? "playlist-ignored" : ""}`}
                >
                  {track.name}
                </p>
                <TrackActionButtons track={track} />
              </div>
          )})
        ) : (
          <p className="playlist-no-result">No tracks found.</p>
        )}
      </div>
    </div>
  );
}