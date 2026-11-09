import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  showShortcut = false,
  onClear,
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3.5 w-4 h-4 text-[#8292AD] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-14 py-2 bg-white text-sm text-[#172033] placeholder-[#8292AD] border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all shadow-sm"
      />
      <div className="absolute right-2.5 flex items-center gap-1">
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 text-[#8292AD] hover:text-[#172033] rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {showShortcut && (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-[#8292AD] bg-[#F7F9FC] border border-[#E5EAF2] rounded">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  );
};

