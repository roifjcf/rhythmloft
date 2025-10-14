'use client';
import { useState, useEffect, useRef } from "react";
import "./pomodoro.scss";
import Icon from "@/components/icon/icon";
import { useLanguage } from "@/contexts/languageContext";

type Mode = "work" | "break";

interface Props {
  workMinutes?: number;
  breakMinutes?: number;
}

export default function Pomodoro({
  workMinutes = 25, breakMinutes = 5
}: Props) {
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSoundRef = useRef<HTMLAudioElement | null>(null);
  const endSoundRef = useRef<HTMLAudioElement | null>(null);

  const toggleStartPause = () => {
    if (!isRunning && startSoundRef.current && timeLeft === workMinutes * 60) {
      startSoundRef.current.play();
    }
    setIsRunning(prev => !prev);
  }

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(workMinutes * 60);
  };

  // countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // play sfx
            if (endSoundRef.current) {
              endSoundRef.current.play();
            }

            // change mode
            const nextMode = mode === "work" ? "break" : "work";
            setMode(nextMode);
            return nextMode === "work" ? workMinutes * 60 : breakMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    
  }, [isRunning, mode, workMinutes, breakMinutes]);
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };


  const { translate } = useLanguage();
  

  return (
    <div className={`pomodoro-container container-bg ${mode}`}>
      <p className="pomodoro-mode">
        {mode === "work" 
          ? translate("pomodoro-status.work") 
          : translate("pomodoro-status.break")}
      </p>
      <p className="pomodoro-timer">{formatTime(timeLeft)}</p>
      <div className="pomodoro-controls">
        {isRunning ?
        <Icon size="sm" src="img/icons/pause.png" alt="pause button" onClick={toggleStartPause} /> :
        <Icon size="sm" src="img/icons/play.png" alt="start button" onClick={toggleStartPause} />
        }
        <Icon size="sm" src="img/icons/replay.png" alt="reset button" onClick={resetTimer}/>
      </div>
      <audio ref={startSoundRef} src="sfx/winner-bell-game-show-91932.mp3" preload="auto" />
      <audio ref={endSoundRef} src="sfx/bell-notification-337658.mp3" preload="auto" />
    </div>
  );

}

