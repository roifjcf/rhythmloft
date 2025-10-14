import { useModal } from "@/hooks/useModal";
import Icon from "../icon/icon";
import "./navbar.scss";
import Modal from "../modal/modal";
import LanguageDropdown from "./components/languageDropdown";
import { useLanguage } from "@/contexts/languageContext";
import AmbientSound from "./components/ambientSound";
import { usePlayer } from "@/contexts/playerContext";
import TextInputWithSound from "../textInputWithSound";
import { useState } from "react";

interface Props {
  isMobile: boolean;
  toggleChat: () => void;
}


export default function Navbar({ isMobile, toggleChat }: Props) {

  const { isOpen: isSfxMenuOpen, openModal: openConfigModal, closeModal: closeConfigModal } = useModal();
  const { isOpen: isHelpOpen, openModal: openHelpModal, closeModal: closeHelpModal } = useModal();

  const { translate } = useLanguage();
  const { resetIgnoredTracks, resetCustomTracks } = usePlayer();

  const [preferredName, setPreferredName] = useState("");
  
  return (
    <div className="navbar-container">
      {isMobile && (
        <Icon
          src="img/icons/sms.png"
          alt="totgle chat"
          size="sm"
          onClick={toggleChat}
        />
      )}
      <Icon src="img/icons/mix.png" alt="Config" size="sm" onClick={openConfigModal} />
      <Icon src="img/icons/help.png" alt="about" size="sm" onClick={openHelpModal} />

      <LanguageDropdown />

      <Modal isOpen={isSfxMenuOpen} onClose={closeConfigModal}>
        <h3>{translate("setting-menu.ambient-sfx")}</h3>
        <AmbientSound />
        <hr />
        <h3>{translate("setting-menu.settings")}</h3>
        <div className="navbar-settings-buttons">
          
          <button onClick={resetCustomTracks}>
            {translate("setting-menu.settings-items.reset-loved-tracks")}
          </button>
          <button onClick={resetIgnoredTracks}>
            {translate("setting-menu.settings-items.reset-ignored-tracks")}
          </button>
          <button onClick={()=>{localStorage.removeItem("characterChatMessages");}}>
            {translate("setting-menu.settings-items.clear-chat-messages")}
          </button>
        </div>
        <hr />
        <h3>{translate("setting-menu.preferences")}</h3>
        <label htmlFor="preferred-user-name">
          {translate("setting-menu.preferences-items.preferred-name")}
        </label>
        <TextInputWithSound
          id="preferred-user-name"
          placeholder={translate("setting-menu.preferences-items.preferred-name-placeholder")}
          value={preferredName}
          onChange={(e) => setPreferredName(e.target.value)}
        />
      </Modal>

      <Modal isOpen={isHelpOpen} onClose={closeHelpModal}>
        <h2>{translate("about-title")}</h2>
        <p>{translate("about-content.0")}</p>
        <p>{translate("about-content.1")} <a href="https://ko-fi.com/fcjfior" target="_blank">{translate("about-content.2")}</a></p>
        <p><a href="https://github.com/roifjcf/rhythmloft" target="_blank">{translate("about-content.3")}</a></p>
      </Modal>
    </div>
  );
}
