'use client';

import { useState } from "react";
import Icon from "../icon/icon";
import Modal from "../modal/modal";
import LanguageDropdown from "./components/languageDropdown";
import AmbientSound from "./components/ambientSound";
import TextInputWithSound from "../textInputWithSound";
import { useModal } from "@/hooks/useModal";
import { useLanguage } from "@/contexts/languageContext";
import { usePlayer } from "@/contexts/playerContext";
import "./navbar.scss";
import { useEffect } from "react";

interface Props {
  isMobile: boolean;
  toggleChat: () => void;
}

export default function Navbar({ isMobile, toggleChat }: Props) {
  const { translate } = useLanguage();
  const { resetIgnoredTracks, resetCustomTracks } = usePlayer();
  const [preferredName, setPreferredName] = useState("");

  const [customPomodoro, setCustomPomodoro] = useState<{ work: number; break: number }>({
    work: Number(localStorage.getItem("customPomodoroWork")) || 25,
    break: Number(localStorage.getItem("customPomodoroBreak")) || 5,
  });

  // save changes
  useEffect(() => {
    localStorage.setItem("customPomodoroWork", String(customPomodoro.work));
    localStorage.setItem("customPomodoroBreak", String(customPomodoro.break));
    window.dispatchEvent(
      new CustomEvent("pomodoroChange", { detail: { ...customPomodoro } })
    );
  }, [customPomodoro]);

  const resetCustomPomodoro = () => {
    setCustomPomodoro({ work: 25, break: 5 });
  };

  // modals
  const sfxModal = useModal();
  const helpModal = useModal();

  // clear chat messages
  const handleClearChat = () => {
    localStorage.removeItem("characterChatMessages");
    window.dispatchEvent(new StorageEvent("storage", { key: "characterChatMessages" }));
  };

  return (
    <div className="navbar-container">
      {isMobile && (
        <Icon
          src="img/icons/sms.png"
          alt="toggle chat"
          size="sm"
          onClick={toggleChat}
        />
      )}

      <Icon src="img/icons/mix.png" alt="Config" size="sm" onClick={sfxModal.openModal} />
      <Icon src="img/icons/help.png" alt="Help" size="sm" onClick={helpModal.openModal} />

      <LanguageDropdown />

      {/* Settings Modal */}
      <Modal isOpen={sfxModal.isOpen} onClose={sfxModal.closeModal}>
        <section>
          <h3>{translate("setting-menu.ambient-sfx")}</h3>
          <AmbientSound />
        </section>
        <hr />

        <section>
          <h3>{translate("setting-menu.settings")}</h3>
          <div className="navbar-settings-buttons">
            <button onClick={resetCustomTracks}>
              {translate("setting-menu.settings-items.reset-loved-tracks")}
            </button>
            <button onClick={resetIgnoredTracks}>
              {translate("setting-menu.settings-items.reset-ignored-tracks")}
            </button>
            <button onClick={handleClearChat}>
              {translate("setting-menu.settings-items.clear-chat-messages")}
            </button>
          </div>
        </section>
        <hr />

        <section>
          <h3>{translate("setting-menu.preferences")}</h3>
          <label htmlFor="preferred-user-name">
            <p>{translate("setting-menu.preferences-items.preferred-name")}</p>
          </label>
          <TextInputWithSound
            id="preferred-user-name"
            placeholder={translate("setting-menu.preferences-items.preferred-name-placeholder")}
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
          />

          <p>{translate("setting-menu.preferences-items.custom-pomodoro-time")}</p>
          <div className="navbar-pomodoro-container">
            <label htmlFor="custom-pomodoro-work">
              {translate("pomodoro-status.work")}
            </label>
            <input
              className="user-input user-input--sm"
              id="custom-pomodoro-work"
              type="number"
              min={1}
              value={customPomodoro.work}
              onChange={(e) =>
                setCustomPomodoro((prev) => ({ ...prev, work: Number(e.target.value) }))
              }
            />
            <label htmlFor="custom-pomodoro-break">
              {translate("pomodoro-status.break")}
            </label>
            <input
              className="user-input user-input--sm"
              id="custom-pomodoro-break"
              type="number"
              min={1}
              value={customPomodoro.break}
              onChange={(e) =>
                setCustomPomodoro((prev) => ({ ...prev, break: Number(e.target.value) }))
              }
            />
            <button onClick={resetCustomPomodoro}>
              {translate("setting-menu.preferences-items.reset")}
            </button>
          </div>
        </section>
      </Modal>

      {/* Help Modal */}
      <Modal isOpen={helpModal.isOpen} onClose={helpModal.closeModal}>
        <h2>{translate("about-title")}</h2>
        <p>{translate("about-content.0")}</p>
        <p>
          {translate("about-content.1")}{" "}
          <a href="https://ko-fi.com/fcjfior" target="_blank">{translate("about-content.2")}</a>
        </p>
        <p>
          <a href="https://github.com/roifjcf/rhythmloft" target="_blank">{translate("about-content.3")}</a>
        </p>
      </Modal>
    </div>
  );
}
