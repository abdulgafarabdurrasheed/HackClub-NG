"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

interface LocationResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocomplete({ value, onChange, onSelect, placeholder, className }: Props) {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debouncedValue] = useDebounce(value, 500);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 3) {
      setResults([]);
      return;
    }

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedValue
          )}&countrycodes=ng&limit=5`
        );
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [debouncedValue]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      
      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-4 text-sm text-zinc-400 text-center">Searching locations...</div>
          ) : (
            <ul className="max-h-60 overflow-y-auto">
              {results.map((result) => (
                <li
                  key={result.place_id}
                  className="px-4 py-3 hover:bg-zinc-800 cursor-pointer text-sm text-zinc-200 border-b border-zinc-800/50 last:border-0 transition-colors"
                  onClick={() => {
                    onChange(result.display_name);
                    setIsOpen(false);
                    if (onSelect) {
                      onSelect(parseFloat(result.lat), parseFloat(result.lon));
                    }
                  }}
                >
                  <div className="flex items-start">
                    <span className="mt-0.5 mr-2 text-zinc-500">📍</span>
                    <span>{result.display_name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
