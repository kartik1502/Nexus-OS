"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onChange?.(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs]
  );

  const handleClear = useCallback(() => {
    setInternalValue("");
    onChange?.("");
    inputRef.current?.focus();
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
        strokeWidth={2}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-9 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary",
          "pl-9 pr-8 text-sm text-text-primary placeholder:text-text-muted",
          "transition-colors duration-[var(--transition-fast)]",
          "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30",
          "hover:border-border-hover"
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5",
            "text-text-muted transition-colors hover:text-text-secondary"
          )}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
