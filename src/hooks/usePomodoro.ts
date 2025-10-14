'use client';
import { useState, useEffect, useRef } from "react";

export type Mode = "work" | "break";

interface UsePomodoroOptions {
  workMinutes?: number;
  breakMinutes?: number;
  onModeChange?: (mode: Mode) => void;
  onTick?: (secondsLeft: number) => void;
  onEnd?: () => void;
  startSoundUrl?: string;
  endSoundUrl?: string;
}

interface UsePomodoroReturn {
  mode: Mode;
  timeLeft: number;
  isRunning: boolean;
  toggleStartPause: () => void;
  resetTimer: () => void;
  startSoundRef: React.RefObject<HTMLAudioElement>;
  endSoundRef: React.RefObject<HTMLAudioElement>;
}

export function usePomodoro({
  workMinutes = 25,
  breakMinutes = 5,
  onModeChange,
  onTick,
  onEnd,
  startSoundUrl,
  endSoundUrl,
}: UsePomodoroOptions): UsePomodoroReturn {
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
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("work");
    setTimeLeft(workMinutes * 60);
  };

  useEffect(() => {
    if (startSoundUrl && startSoundRef.current === null) {
      startSoundRef.current = new Audio(startSoundUrl);
    }
    if (endSoundUrl && endSoundRef.current === null) {
      endSoundRef.current = new Audio(endSoundUrl);
    }
  }, [startSoundUrl, endSoundUrl]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endSoundRef.current?.play();

            const nextMode: Mode = mode === "work" ? "break" : "work";
            setMode(nextMode);
            onModeChange?.(nextMode);
            onEnd?.();

            return nextMode === "work" ? workMinutes * 60 : breakMinutes * 60;
          }
          onTick?.(prev - 1);
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, workMinutes, breakMinutes, onModeChange, onTick, onEnd]);

  return { mode, timeLeft, isRunning, toggleStartPause, resetTimer, startSoundRef, endSoundRef };
}
