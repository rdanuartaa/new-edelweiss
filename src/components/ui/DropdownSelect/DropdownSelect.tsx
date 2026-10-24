'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './DropdownSelect.module.scss';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownSelectProps {
  options: (string | DropdownOption)[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  options,
  selectedValue,
  onChange,
  placeholder = 'Pilih opsi...',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const currentOption = normalizedOptions.find((opt) => opt.value === selectedValue);
  const displayLabel = currentOption ? currentOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value: string) => {
    if (disabled) return;
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.dropdownContainer} ${isOpen ? styles.open : ''} ${className}`}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className={styles.selectedText}>{displayLabel}</span>
        <ChevronDown size={18} className={styles.chevronIcon} />
      </button>

      {isOpen && (
        <ul className={styles.menuList} role="listbox">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === selectedValue;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`${styles.menuItem} ${isSelected ? styles.selectedItem : ''}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={16} className={styles.checkIcon} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
