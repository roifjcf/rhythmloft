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

export default function Navbar() {
  const { isOpen: isSfxMenuOpen, openModal: openConfigModal, closeModal: closeConfigModal } = useModal();
  const { isOpen: isHelpOpen, openModal: openHelpModal, closeModal: closeHelpModal } = useModal();

  const { translate } = useLanguage();
  const { resetIgnoredTracks, resetCustomTracks } = usePlayer();

  const [preferredName, setPreferredName] = useState("");
  
  return (
    <div className="navbar-container">
      <Icon src="img/icons/mix.png" alt="Config" size="sm" onClick={openConfigModal} />
      <Icon src="img/icons/help.png" alt="about" size="sm" onClick={openHelpModal} />

      <LanguageDropdown />

      <Modal isOpen={isSfxMenuOpen} onClose={closeConfigModal}>
        <h3>Ambient sfx</h3>
        <AmbientSound />
        <hr />
        <h3>Settings</h3>
        <div className="navbar-settings-buttons">
          <button onClick={resetCustomTracks}>Reset loved tracks</button>
          <button onClick={resetIgnoredTracks}>Reset ignored tracks</button>
        </div>
        <hr />
        <h3>Preferences</h3>
        <label htmlFor="preferred-user-name">Preferred name</label>
        <TextInputWithSound
          id="preferred-user-name"
          placeholder="What do you want to be called?"
          value={preferredName}
          onChange={(e) => setPreferredName(e.target.value)}
        />
      </Modal>

      <Modal isOpen={isHelpOpen} onClose={closeHelpModal}>
        <h2>{translate("about-title")}</h2>
        <p>{translate("about-content")[0]}</p>
        <p>{translate("about-content")[1]} <a href="https://ko-fi.com/fcjfior" target="_blank">{translate("about-content")[2]}</a></p>
        <p><a href="https://github.com/roifjcf/rhythmloft" target="_blank">{translate("about-content")[3]}</a></p>
      </Modal>
    </div>
  );
}
