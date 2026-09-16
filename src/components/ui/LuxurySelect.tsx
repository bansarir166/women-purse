"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface LuxurySelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: "left" | "right";
  ariaLabel?: string;
}

export function LuxurySelect<T extends string = string>({
  value,
  onChange,
  options,
  className = "",
  buttonClassName = "",
  menuClassName = "",
  align = "right",
  ariaLabel = "Sort options",
}: LuxurySelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : options[0];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation & accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex].value);
        }
        break;
      default:
        break;
    }
  };

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;
            if (next) setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
            return next;
          });
        }}
        className={`group flex items-center justify-between gap-3 bg-[#FAF8F5] border border-[#D8CEBF] hover:border-[#9A7B4F] focus:border-[#9A7B4F] text-xs font-sans-clean text-[#191411] px-3.5 py-2.5 transition-all duration-150 cursor-pointer outline-none select-none shadow-xs ${buttonClassName}`}
      >
        <span className="font-medium whitespace-nowrap tracking-wide">
          {selectedOption?.label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#7A6F62] group-hover:text-[#9A7B4F] transition-transform duration-200 ease-out shrink-0 ${
            isOpen ? "rotate-180 text-[#9A7B4F]" : ""
          }`}
        />
      </button>

      {/* Floating Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="listbox"
            className={`absolute top-full mt-1.5 z-50 min-w-[210px] w-max bg-[#FAF8F5] border border-[#D8CEBF] shadow-xl shadow-black/10 py-1.5 outline-none ${
              align === "right" ? "right-0" : "left-0"
            } ${menuClassName}`}
          >
            {options.map((option, idx) => {
              const isSelected = option.value === value;
              const isFocused = idx === focusedIndex;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between gap-4 px-4 py-2.5 text-xs font-sans-clean tracking-wider text-left transition-colors cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#EFE8DD] text-[#191411] font-semibold"
                      : isFocused
                      ? "bg-[#F3EDE3] text-[#191411]"
                      : "text-[#4A4036] hover:bg-[#F3EDE3] hover:text-[#191411]"
                  }`}
                >
                  <span className="whitespace-nowrap">{option.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#9A7B4F] shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
