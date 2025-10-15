'use client';
import { useLanguage } from "@/contexts/languageContext";
import Icon from "@/components/icon/icon";
import { usePomodoro } from "@/hooks/usePomodoro";
import "./pomodoro.scss";
import { useEffect, useState } from "react";

export default function Pomodoro() {

  const { translate } = useLanguage();

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);

  const { mode, timeLeft, isRunning, toggleStartPause, resetTimer, startSoundRef, endSoundRef } =
    usePomodoro({ workMinutes, breakMinutes });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const storedWork = localStorage.getItem("customPomodoroWork");
    const storedBreak = localStorage.getItem("customPomodoroBreak");

    if (storedWork) setWorkMinutes(Number(storedWork));
    if (storedBreak) setBreakMinutes(Number(storedBreak));
  }, []);

  useEffect(() => {
    const handlePomodoroChange = (e: Event) => {
      const { work, break: brk } = (e as CustomEvent).detail;
      setWorkMinutes(work);
      setBreakMinutes(brk);
    };

    window.addEventListener("pomodoroChange", handlePomodoroChange);
    return () => window.removeEventListener("pomodoroChange", handlePomodoroChange);
  }, []);

  return (
    <div className={`pomodoro-container container-bg ${mode}`}>
      <p className="pomodoro-mode">
        {mode === "work" ? translate("pomodoro-status.work") : translate("pomodoro-status.break")}
      </p>
      <p className="pomodoro-timer">{formatTime(timeLeft)}</p>
      <div className="pomodoro-controls">
        {isRunning ? (
          <Icon size="sm" src="img/icons/pause.png" alt="pause button" onClick={toggleStartPause} />
        ) : (
          <Icon size="sm" src="img/icons/play.png" alt="start button" onClick={toggleStartPause} />
        )}
        <Icon size="sm" src="img/icons/replay.png" alt="reset button" onClick={resetTimer} />
      </div>

      <audio ref={startSoundRef} src="sfx/winner-bell-game-show-91932.mp3" preload="auto" />
      <audio ref={endSoundRef} src="sfx/bell-notification-337658.mp3" preload="auto" />
    </div>
  );
}
