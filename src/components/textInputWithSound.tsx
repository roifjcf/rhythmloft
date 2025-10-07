'use client';

import { useRef } from "react";
import { ChangeEvent } from "react";

interface Props {
  id?: string;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function TextInputWithSound({
  id,
  className,
  placeholder = "Type here...",
  value = "",
  onChange = () => {},
  onKeyDown,
}: Props) {
  const typingSoundRef = useRef<HTMLAudioElement | null>(null);

  if (typeof window !== "undefined" && !typingSoundRef.current) {
    typingSoundRef.current = new Audio("sfx/single-key-press-393908.mp3");
    typingSoundRef.current.volume = 0.2;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) onKeyDown(e);

    if (typingSoundRef.current) {
      typingSoundRef.current.currentTime = 0;
      typingSoundRef.current.play().catch(() => {});
    }
  };

  return (
    <input
      id={id}
      className={`user-input ${className}`}
      type="text"
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      value={value}
      onChange={onChange}
    />
  );
}
