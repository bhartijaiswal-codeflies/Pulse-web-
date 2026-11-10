import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 left-0 md:left-[76px] right-0 bottom-0 z-30 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative bg-white rounded-2xl shadow-dropdown border border-[#E5EAF2] w-full ${maxWidth} z-10 overflow-hidden transform transition-all animate-fade-in my-8`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#E5EAF2] bg-[#FCFDFE]">
          <div>
            <h3 className="text-base font-bold text-[#172033]">{title}</h3>
            {subtitle && <p className="text-xs text-[#8292AD] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[calc(85vh-130px)] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 p-4 border-t border-[#E5EAF2] bg-[#FBFDFE]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

