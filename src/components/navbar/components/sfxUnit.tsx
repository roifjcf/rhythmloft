import { AiOutlineSound, AiFillSound } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import "./sfxunit.scss";
import Icon from "@/components/icon/icon";
interface Props {
  name: string,
  key: number,
};


export default function sfxUnit({
  name,
  key
}: Props) {
  const sfx = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState(1);

  // const sfxShadow = useRef<HTMLAudioElement>(null); // to achieve seamless effect
  const [timeoutInfo, setTimeoutInfo] = useState<ReturnType<typeof setTimeout> | null>(null); // for sfxShadow

  useEffect(()=> {
    if (sfx.current) {
      sfx.current.volume = volume;
    }
  }, []);

  const handleVolumeChange = (event:any) => {
    if (sfx.current) {
      const newVolume = event.target.value;
      setVolume(newVolume);
      sfx.current.volume = newVolume;
    }
  }

  const handleEndSfx = () => {
    if (sfx.current) {
      sfx.current.currentTime = 0;
      sfx.current.play();
      setIsPlaying(true);
    }
  }

  const togglePlay = () => {
    if (timeoutInfo) {
      clearTimeout(timeoutInfo);
      setTimeoutInfo(null);
    }

    if (sfx.current) {
      if (isPlaying) { // pause
        sfx.current.pause();
        sfx.current.currentTime = 0;
        setIsPlaying(false);
      } else { // play
        // setVolume(0.5);
        // sfx.current.volume = 0.5;
        sfx.current.play();
        setIsPlaying(true);
      }
    }
  }
    
  return(
    <div className="sfxunit-container">
      <Icon
        src={`img/sfxicons/${name.slice(0, -4)}.png`}
        alt={`${name}.png`}
        onClick={togglePlay}
        className={`icon-button${isPlaying ? ' playing' : ''}`}
      />

      <input
        className="slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        style={{
          background: `linear-gradient(to right, white ${volume * 100}%, grey ${volume * 100}%)`,
        }}
        aria-label="sfx Volume"
      />

      
      <audio
        ref={sfx}
        src={`sfx/${name}`}
        onEnded={handleEndSfx}
        preload="none"
      />

    </div>
  )
  
}
