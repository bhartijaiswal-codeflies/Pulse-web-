import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  XCircle,
  Skull,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const getActionIcon = (actionId) => {
  const normalized = (actionId || '').toLowerCase().trim();

  if (['qualified', 'approve', 'verify', 'hired', 'active'].includes(normalized)) {
    return <CheckCircle2 className="w-4 h-4 text-[#059669] stroke-[2]" />;
  }
  if (['dead', 'flag', 'issue', 'terminate'].includes(normalized)) {
    return <Skull className="w-4 h-4 text-[#172033] stroke-[1.8]" />;
  }
  if (['not qualified', 'not-qualified', 'reject', 'rejected', 'absent'].includes(normalized)) {
    return <XCircle className="w-4 h-4 text-[#DC2626] stroke-[2]" />;
  }

  return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
};

export const getActionTriggerStyle = (actionId) => {
  const normalized = (actionId || '').toLowerCase().trim();

  if (['qualified', 'approve', 'verify', 'hired', 'active'].includes(normalized)) {
    return 'border-emerald-200 bg-emerald-50/50 text-[#059669] hover:bg-emerald-100/60';
  }
  if (['dead', 'flag', 'issue', 'terminate'].includes(normalized)) {
    return 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100';
  }
  if (['not qualified', 'not-qualified', 'reject', 'rejected', 'absent'].includes(normalized)) {
    return 'border-rose-200 bg-rose-50/50 text-[#DC2626] hover:bg-rose-100/60';
  }

  return 'border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC]';
};

export const ActionDropdown = ({
  actions,
  currentAction: initialAction = 'dead',
  onActionChange,
  triggerIcon,
  triggerText,
  title = 'ACTIONS',
  className = '',
  buttonVariant = 'circle', // 'circle' or 'pill'
}) => {
  const [currentAction, setCurrentAction] = useState(initialAction);
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef(null);

  // Sync internal state with prop
  useEffect(() => {
    if (initialAction) {
      setCurrentAction(initialAction);
    }
  }, [initialAction]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const defaultActions = [
    {
      id: 'qualified',
      label: 'Qualified',
      icon: <CheckCircle2 className="w-4 h-4 text-[#059669] stroke-[2]" />,
    },
    {
      id: 'dead',
      label: 'Dead',
      icon: <Skull className="w-4 h-4 text-[#172033] stroke-[1.8]" />,
    },
    {
      id: 'not-qualified',
      label: 'Not Qualified',
      icon: <XCircle className="w-4 h-4 text-[#DC2626] stroke-[2]" />,
    },
  ];

  const actionList = actions || defaultActions;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 220);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelectAction = (item) => {
    const newId = item.id || item.label;
    setCurrentAction(newId);
    if (onActionChange) {
      onActionChange(newId, item);
    }
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const activeTriggerIcon = triggerIcon || getActionIcon(currentAction);
  const activeTriggerStyle = getActionTriggerStyle(currentAction);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button matching Reference Image 1 & 3 */}
      {buttonVariant === 'circle' ? (
        <button
          type="button"
          onClick={handleToggle}
          className={`h-7 px-2 rounded-full border flex items-center justify-center gap-1 transition-all shadow-2xs focus:outline-none active:scale-95 cursor-pointer ${
            isOpen
              ? 'ring-2 ring-blue-400/50 border-[#3B82F6] bg-blue-50/60 shadow-sm'
              : activeTriggerStyle
          } ${className}`}
        >
          <span className="flex-shrink-0">{activeTriggerIcon}</span>
          {isOpen ? (
            <ChevronUp className="w-3 h-3 text-current opacity-70 stroke-[2.5]" />
          ) : (
            <ChevronDown className="w-3 h-3 text-current opacity-70 stroke-[2.5]" />
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          className={`px-3 py-1 rounded-full text-xs font-semibold border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] flex items-center gap-1.5 shadow-2xs focus:outline-none cursor-pointer ${
            isOpen ? 'ring-2 ring-blue-400/50 border-[#3B82F6]' : ''
          } ${className}`}
        >
          {activeTriggerIcon}
          {triggerText && <span>{triggerText}</span>}
          {isOpen ? (
            <ChevronUp className="w-3 h-3 text-current opacity-70 stroke-[2.5]" />
          ) : (
            <ChevronDown className="w-3 h-3 text-current opacity-70 stroke-[2.5]" />
          )}
        </button>
      )}

      {/* Floating Action Menu (matching Reference Image 1 & 3) */}
      {isOpen && (
        <div
          className={`absolute right-0 ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } z-[999] bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] p-1.5 min-w-[195px] animate-fade-in text-left select-none`}
        >
          {/* Header */}
          <div className="px-3 pt-2 pb-1.5 border-b border-[#F1F5F9] mb-1">
            <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">
              {title}
            </span>
          </div>

          {/* Action Items List */}
          <div className="space-y-0.5">
            {actionList.map((item) => {
              const itemId = (item.id || item.label || '').toLowerCase();
              const isSelected =
                (currentAction || '').toLowerCase() === itemId ||
                (currentAction || '').toLowerCase() === (item.label || '').toLowerCase();

              return (
                <button
                  key={item.id || item.label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAction(item);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 text-[#172033]'
                      : 'text-[#172033] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#2563EB] ml-2 flex-shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
