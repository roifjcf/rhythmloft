import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handleClose: (event: MouseEvent | TouchEvent) => void
) {
  
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handleClose(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };

  }, [ref, handleClose]);
}