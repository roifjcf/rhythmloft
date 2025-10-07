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
  const typingSoundRef = useRef<HTMLAudioElement>(new Audio("sfx/single-key-press-393908.mp3"));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    const audio = typingSoundRef.current.cloneNode() as HTMLAudioElement;
    audio.volume = 0.2;
    audio.play().catch(() => {});
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
