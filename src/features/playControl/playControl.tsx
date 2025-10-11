"use client";

import { usePlayer } from "@/contexts/playerContext";
import { PlayMode } from "@/common/type";
import './playcontrol.scss';
import Icon from "@/components/icon/icon";
import TrackActionButtons from "@/components/trackActionButtons/trackActionButtons";

interface Props {
  handleShowPlayList: () => void,
}



export default function PlayControl({
  handleShowPlayList
}: Props) {

  const {
    tracks,
    currentTrack,
    isPlaying,
    playMode,
    volume,
    setPlayMode,
    setVolume,
    handlePlay,
    handlePause,
    handleNext,
    handlePrev,
  } = usePlayer();

  
  const nextPlayMode = (): PlayMode => {
    if (playMode === "repeat-one") return "repeat";
    if (playMode === "repeat") return "shuffle";
    return "repeat-one";
  };

  const renderAuthor = () => {
    if (!tracks || currentTrack == null) return null;
    const track = tracks[currentTrack];
    const authorStr = track.authors?.join(", ");
    if (!track || !track.authors || track.authors.length === 0) return null;

    return (
      <p>{authorStr}</p>
    );
  };

  return (
  <div className="playcontrol-container container-bg">

    <div className="playcontrol-info-container">
      <div className="playcontrol-info-container--title">
        <h2>
          {tracks?.[currentTrack ?? 0]?.name ?? "Loading..."}
        </h2>
        {tracks?.[currentTrack ?? 0]?.source &&
        <>
          <TrackActionButtons track={tracks?.[currentTrack ?? 0]} />
        </>
        }
      </div>
      <div className="playcontrol-info-container--author">
        {renderAuthor()}
      </div>
    </div>

    <div className="playcontrol-buttons">
        <div className="left">
          <Icon size="sm" src="img/icons/left.png" alt="prev" onClick={handlePrev} />
          {isPlaying ?
            <Icon size="sm" src="img/icons/pause.png" alt="pause" onClick={handlePause} /> :
            <Icon size="sm" src="img/icons/play.png" alt="play" onClick={handlePlay} />
          }
          <Icon size="sm" src="img/icons/right.png" alt="next" onClick={handleNext} />
        </div>

        <div className="right">
          <Icon size="sm" src={`img/icons/${playMode}.png`} alt={playMode} onClick={() => setPlayMode(nextPlayMode())} />
          <Icon size="sm" src="img/icons/music-list.png" alt="music-list" onClick={handleShowPlayList} />
        </div>
      </div>

          
    <input
      className="slider"
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={volume}
      onChange={(e) => setVolume(Number(e.target.value))}
      style={{
        background: `linear-gradient(to right, white ${volume * 100}%, grey ${
          volume * 100
        }%)`,
      }}
      aria-label="BGM Volume"
    />



  </div>
  );
}