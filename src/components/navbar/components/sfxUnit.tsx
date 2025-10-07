import { useState } from "react";
import "./sfxunit.scss";
import Icon from "@/components/icon/icon";

interface Props {
  name: string;
  toggleSfx: (name: string) => void;
  volume: number;
  setVolume: (name: string, volume: number) => void;
  isPlaying: boolean;
}

export default function SfxUnit({ name, toggleSfx, volume, setVolume, isPlaying }: Props) {
    
  return(
    <div className="sfxunit-container">
      
      <Icon
        src={`img/sfxicons/${name.slice(0, -4)}.png`}
        alt={`${name}.png`}
        onClick={() => toggleSfx(name)}
        className={`icon-button${isPlaying ? " playing" : ""}`}
      />

      <input
        className="slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(name, Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, white ${volume * 100}%, grey ${volume * 100}%)`,
        }}
        aria-label="sfx Volume"
      />
    </div>
  )
  
}
