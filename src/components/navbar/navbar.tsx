import { useModal } from "@/hooks/useModal";
import Icon from "../icon/icon";
import "./navbar.scss";
import Modal from "../modal/modal";
import LanguageDropdown from "./components/languageDropdown";
import { useLanguage } from "@/contexts/languageContext";
import AmbientSound from "./components/ambientSound";

interface Props {
  sfxList: string[] | null,
}

export default function Navbar({
  sfxList
}: Props) {
  const { isOpen: isSfxMenuOpen, openModal: openWandModal, closeModal: closeSfxMenu } = useModal();
  const { isOpen: isHelpOpen, openModal: openHelpModal, closeModal: closeHelpModal } = useModal();

  const { translate } = useLanguage();


  
  return (
    <div className="navbar-container">
      {/* Wand Icon */}
      <Icon
        src="img/icons/wand.png"
        alt={"Ambient sound"}
        size="sm"
        onClick={openWandModal}
      />

      {/* Help Icon */}
      <Icon
        src="img/icons/help.png"
        alt={"about"}
        size="sm"
        onClick={openHelpModal}
      />

      <LanguageDropdown />

      {/* Wand Modal */}
      <Modal isOpen={isSfxMenuOpen} onClose={closeSfxMenu}>
        <div className="navbar-modal-close-btn" onClick={closeSfxMenu}>
          <Icon src="img/icons/cancel.png" alt={"close"} size="sm" />
        </div>
        <AmbientSound sfxList={sfxList} />
      </Modal>

      {/* Help Modal */}
      <Modal isOpen={isHelpOpen} onClose={closeHelpModal}>
        <div className="navbar-modal-close-btn" onClick={closeHelpModal}>
          <Icon src="img/icons/cancel.png" alt={"close"} size="sm" />
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
