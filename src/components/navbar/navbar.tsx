import { useModal } from "@/hooks/useModal";
import Icon from "../icon/icon";
import "./navbar.scss";
import Modal from "../modal/modal";
import LanguageDropdown from "./components/languageDropdown";
import { useState } from "react";
import { useLanguage } from "@/contexts/languageContext";

export default function Navbar() {
  const { isOpen, openModal, closeModal, toggleModal } = useModal();
  const [language, setLanguage] = useState("EN");
  const { translate } = useLanguage();

  return (
    <div className="navbar-container">
      <Icon
        src="img/icons/help.png"
        alt={"about"}
        size="sm"
        onClick={toggleModal}
      />
      <LanguageDropdown />
      
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="navbar-modal-close-btn" onClick={closeModal}>
          <Icon
            src="img/icons/cancel.png"
            alt={"close"}
            size="sm"
          />
        </div>
        <div className="navbar-modal-content">
          <h2>{translate("about-title")}</h2>
          <p>{translate("about-content")[0]}</p>
          <p>{translate("about-content")[1]} <a href="https://ko-fi.com/fcjfior" target="_blank">{translate("about-content")[2]}</a></p>
          <p><a href="https://github.com/roifjcf/rhythmloft" target="_blank">{translate("about-content")[3]}</a></p>
        </div>

      </Modal>
    </div>
  );
}