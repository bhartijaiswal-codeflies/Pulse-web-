import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  footer,
  zIndex = 'z-30',
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

  return createPortal(
    <div
      className={`fixed top-16 left-0 md:left-[76px] right-0 bottom-0 ${zIndex} flex items-center justify-center p-3 sm:p-5 overflow-hidden`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative bg-white rounded-2xl shadow-dropdown border border-[#E5EAF2] w-full ${maxWidth} max-h-[calc(100vh-5.5rem)] flex flex-col z-10 overflow-hidden transform transition-all animate-fade-in my-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-[#E5EAF2] bg-[#FCFDFE] flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-[#172033]">{title}</h3>
            {subtitle && <p className="text-xs text-[#8292AD] mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body - Single Scrollable Container */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 p-4 border-t border-[#E5EAF2] bg-[#FBFDFE] flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

