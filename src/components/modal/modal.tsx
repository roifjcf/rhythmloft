import { useRef } from "react";
import "./modal.scss"
import { useClickOutside } from "@/hooks/useClickOutside";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, () => {
    if (isOpen) onClose();
  });

  if (!isOpen) return null;

  return (
    <div className="container-bg modal-container" ref={modalRef}>
      {children}
    </div>
  );
}