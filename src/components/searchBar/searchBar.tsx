"use client";

import { ChangeEvent } from "react";

interface Props {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchBar({ value, placeholder = "", onChange, className }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={className}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="user-input"
      />
    </div>
  );
}
