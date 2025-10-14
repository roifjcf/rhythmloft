'use client';
import { useLanguage } from "@/contexts/languageContext";
import Icon from "@/components/icon/icon";
import { usePomodoro } from "@/hooks/usePomodoro";
import "./pomodoro.scss";

interface Props {
  workMinutes?: number;
  breakMinutes?: number;
}

export default function Pomodoro({ workMinutes = 25, breakMinutes = 5 }: Props) {
  const { translate } = useLanguage();

  const { mode, timeLeft, isRunning, toggleStartPause, resetTimer, startSoundRef, endSoundRef } =
    usePomodoro({
      workMinutes,
      breakMinutes,
      startSoundUrl: "sfx/winner-bell-game-show-91932.mp3",
      endSoundUrl: "sfx/bell-notification-337658.mp3",
    });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
