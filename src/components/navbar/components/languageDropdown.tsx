"use client";

import { useState, useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import Icon from "@/components/icon/icon";
import { useLanguage } from "@/contexts/languageContext";
import "./languagedropdown.scss";

export default function LanguageDropdown() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const handleSelect = (selected: string) => {
    setLang(selected as "EN" | "JP" | "ID");
    setIsOpen(false);
  };

  const options = ["EN", "JP", "ID"];

  return (
    <div className="languagedropdown-container" ref={dropdownRef}>
      <Icon
        src="img/icons/language.png"
        alt={"language"}
        size="sm"
        onClick={toggleDropdown}
      />

      {isOpen && (
        <ul className="container-bg">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className={option === lang ? "selected" : ""}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

}