import React, { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Sun,
  Snowflake,
  Sparkles,
  ChevronDown,
  ChevronUp,
  XCircle,
  Laptop,
  Check,
  Star,
  Briefcase,
  PauseCircle,
  RotateCcw,
  LogOut,
  UserCheck,
  Skull,
  ExternalLink,
  Ghost,
  Hand,
} from 'lucide-react';

export const getStatusIcon = (statusName) => {
  const normalized = (statusName || '').toLowerCase().trim();

  // Fresh Lead: Blue Star
  if (['fresh lead', 'fresh', 'in office', 'assigned'].includes(normalized)) {
    return <Star className="w-3.5 h-3.5 text-[#2563EB] fill-[#2563EB]" />;
  }
  // Handled: ArrowUpRight / ExternalLink icon matching reference image 2
  if (normalized === 'handled') {
    return <ExternalLink className="w-3.5 h-3.5 text-[#059669] stroke-[2]" />;
  }
  // Warm: Sun
  if (['warm', 'pending', 'in review', 'under review', 'processing', 'in follow-up'].includes(normalized)) {
    return <Sun className="w-3.5 h-3.5 text-[#D97706] stroke-[2.2]" />;
  }
  // Hot: Flame
  if (['hot', 'urgent', 'overdue'].includes(normalized)) {
    return <Flame className="w-3.5 h-3.5 text-[#DC2626] stroke-[2.2]" />;
  }
  // Cold: Snowflake
  if (['cold', 'remote', 'checked out', 'returned (ready)'].includes(normalized)) {
    return <Snowflake className="w-3.5 h-3.5 text-[#0891B2] stroke-[2.2]" />;
  }
  // Price Ghost: Ghost / Skull
  if (normalized === 'price ghost') {
    return <Ghost className="w-3.5 h-3.5 text-[#7C3AED] stroke-[2]" />;
  }
  // Lost – Competitor: Briefcase
  if (['lost – competitor', 'lost - competitor', 'lost'].includes(normalized)) {
    return <Briefcase className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />;
  }
  // Plan Hold: Hand
  if (['plan hold', 'hold'].includes(normalized)) {
    return <Hand className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />;
  }
  // Re Open: RotateCcw
  if (['re open', 're-opened', 're-open'].includes(normalized)) {
    return <RotateCcw className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />;
  }
  // Dead Leads / Dead
  if (['dead leads', 'dead'].includes(normalized)) {
    return <Skull className="w-3.5 h-3.5 text-[#DC2626] stroke-[2]" />;
  }
  // General status helpers
  if (['active', 'approved', 'present', 'on time', 'paid', 'hired', 'available'].includes(normalized)) {
    return <Check className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />;
  }
  if (['late', 'rejected', 'absent', 'terminated'].includes(normalized)) {
    return <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] stroke-[2]" />;
  }
  if (['shortlisted', 'offer extended', 'interview scheduled'].includes(normalized)) {
    return <Clock className="w-3.5 h-3.5 text-[#2563EB] stroke-[2]" />;
  }
  if (['on leave', 'maintenance', 'sick leave', 'privilege leave', 'casual leave'].includes(normalized)) {
    return <Sparkles className="w-3.5 h-3.5 text-[#7C3AED] stroke-[2]" />;
  }

  return <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />;
};

export const getStatusColorClasses = (statusName) => {
  const normalized = (statusName || '').toLowerCase().trim();

  if (['handled', 'active', 'approved', 'present', 'on time', 'paid', 'hired', 'available'].includes(normalized)) {
    return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
  }
  if (['fresh lead', 'fresh', 'in office', 'shortlisted', 'offer extended', 'interview scheduled', 'assigned'].includes(normalized)) {
    return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
  }
  if (['warm', 'pending', 'in review', 'under review', 'processing', 'in follow-up'].includes(normalized)) {
    return 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
  }
  if (['hot', 'late', 'rejected', 'absent', 'terminated', 'high', 'urgent', 'overdue', 'dead leads', 'dead'].includes(normalized)) {
    return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
  }
  if (['price ghost', 'on leave', 'maintenance', 'sick leave', 'privilege leave', 'casual leave'].includes(normalized)) {
    return 'bg-[#FAF5FF] text-[#7C3AED] border-[#E9D5FF]';
  }
  if (['cold', 'remote', 'checked out', 'returned (ready)'].includes(normalized)) {
    return 'bg-[#ECFEFF] text-[#0891B2] border-[#A5F3FC]';
  }
  if (['lost – competitor', 'lost - competitor', 'plan hold', 're open', 're-opened'].includes(normalized)) {
    return 'bg-slate-50 text-slate-600 border-slate-200';
  }

  return 'bg-slate-50 text-slate-700 border-slate-200';
};

export const getDefaultOptionsForStatus = (statusName) => {
  const normalized = (statusName || '').toLowerCase().trim();

  // CRM / Leads (Matches Reference Image 2 exactly!)
  if (['cold', 'warm', 'hot', 'fresh lead', 'fresh', 'handled', 'price ghost', 'plan hold', 're open', 'lost – competitor', 'lost - competitor', 'dead'].includes(normalized)) {
    return [
      'Fresh Lead',
      'Handled',
      'Warm',
      'Hot',
      'Cold',
      'Price Ghost',
      'Lost – Competitor',
      'Plan Hold',
      'Re Open',
    ];
  }
  // Attendance / Punches
  if (['on time', 'present', 'late', 'on leave', 'remote', 'checked out', 'half day'].includes(normalized)) {
    return ['On Time', 'Present', 'Late', 'Remote', 'On Leave', 'Checked Out'];
  }
  // Candidates
  if (['under review', 'interview scheduled', 'shortlisted', 'offer extended', 'hired', 'rejected'].includes(normalized)) {
    return ['Under Review', 'Interview Scheduled', 'Shortlisted', 'Offer Extended', 'Hired', 'Rejected'];
  }
  // Employee Directory
  if (['active', 'inactive', 'pending', 'on leave'].includes(normalized)) {
    return ['Active', 'Inactive', 'On Leave', 'Pending'];
  }
  // Hardware Assets
  if (['available', 'assigned', 'maintenance', 'returned (ready)'].includes(normalized)) {
    return ['Available', 'Assigned', 'Maintenance', 'Returned (Ready)'];
  }

  return ['Active', 'Pending', 'Completed', 'Cancelled'];
};

export const StatusBadge = ({
  status: initialStatus,
  size = 'sm',
  icon,
  showChevron = true,
  className = '',
  options,
  onStatusChange,
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef(null);

  // Sync internal state when prop changes
  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const availableOptions = options || getDefaultOptionsForStatus(currentStatus);

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

  const styles = getStatusColorClasses(currentStatus);
  const defaultIcon = getStatusIcon(currentStatus);

  const sizeClasses =
    size === 'xs'
      ? 'text-[11px] px-2.5 py-1 gap-1.5'
      : size === 'md'
      ? 'text-xs px-3.5 py-1.5 gap-1.5'
      : 'text-[11px] px-2.5 py-1 gap-1.5';

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 280);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelectOption = (opt) => {
    setCurrentStatus(opt);
    if (onStatusChange) {
      onStatusChange(opt);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center font-semibold rounded-full border ${styles} ${sizeClasses} whitespace-nowrap transition-all shadow-2xs select-none focus:outline-none hover:opacity-95 active:scale-95 cursor-pointer ${
          isOpen ? 'ring-2 ring-blue-400/50 shadow-sm' : ''
        } ${className}`}
      >
        {icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : (
          defaultIcon && <span className="flex-shrink-0">{defaultIcon}</span>
        )}

        <span className="leading-tight">{currentStatus}</span>

        {showChevron && (
          isOpen ? (
            <ChevronUp className="w-3 h-3 text-current opacity-70 ml-0.5 flex-shrink-0 stroke-[2.5]" />
          ) : (
            <ChevronDown className="w-3 h-3 text-current opacity-70 ml-0.5 flex-shrink-0 stroke-[2.5]" />
          )
        )}
      </button>

      {/* Interactive Options Dropdown Menu (matching Reference Image 2) */}
      {isOpen && (
        <div
          className={`absolute right-0 ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } z-[999] bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] p-1.5 min-w-[200px] animate-fade-in text-left select-none`}
        >
          <div className="max-h-72 overflow-y-auto no-scrollbar space-y-0.5">
            {availableOptions.map((opt) => {
              const isSelected = opt.toLowerCase() === (currentStatus || '').toLowerCase();
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectOption(opt);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 text-[#172033]'
                      : 'text-[#172033] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="flex-shrink-0">{getStatusIcon(opt)}</span>
                    <span className="truncate">{opt}</span>
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
