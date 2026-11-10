import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Sun,
  Snowflake,
  Sparkles,
  ChevronDown,
  XCircle,
  Laptop,
  Check,
} from 'lucide-react';

export const StatusBadge = ({
  status,
  size = 'sm',
  icon,
  showChevron = true,
  className = '',
}) => {
  const normalized = (status || '').toLowerCase().trim();

  let styles = 'bg-slate-50 text-slate-700 border-slate-200';
  let defaultIcon = null;

  if (['handled', 'active', 'approved', 'present', 'on time', 'paid', 'hired', 'available'].includes(normalized)) {
    // Green (like "Handled" in reference)
    styles = 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
    defaultIcon = <Check className="w-3 h-3 text-[#059669] stroke-[2.5]" />;
  } else if (['fresh lead', 'fresh', 'in office', 'shortlisted', 'offer extended', 'interview scheduled', 'assigned'].includes(normalized)) {
    // Blue (like "Fresh Lead" in reference)
    styles = 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
    defaultIcon = <span className="w-2 h-2 rounded-full bg-[#2563EB]" />;
  } else if (['warm', 'pending', 'in review', 'under review', 'processing', 'in follow-up'].includes(normalized)) {
    // Amber/Yellow (like "Warm" in reference)
    styles = 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]';
    defaultIcon = <Sun className="w-3 h-3 text-[#D97706] stroke-[2.2]" />;
  } else if (['hot', 'late', 'rejected', 'absent', 'terminated', 'high', 'urgent', 'overdue', 'dead leads'].includes(normalized)) {
    // Rose/Red (like "Hot" in reference)
    styles = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
    defaultIcon = <Flame className="w-3 h-3 text-[#DC2626] stroke-[2.2]" />;
  } else if (['price ghost', 'on leave', 'maintenance', 'sick leave', 'privilege leave', 'casual leave'].includes(normalized)) {
    // Purple/Violet (like "Price Ghost" in reference)
    styles = 'bg-[#FAF5FF] text-[#7C3AED] border-[#E9D5FF]';
    defaultIcon = <Sparkles className="w-3 h-3 text-[#7C3AED] stroke-[2.2]" />;
  } else if (['cold', 'remote', 'checked out', 'returned (ready)'].includes(normalized)) {
    // Cyan/Ice (like "Cold" in reference)
    styles = 'bg-[#ECFEFF] text-[#0891B2] border-[#A5F3FC]';
    defaultIcon = <Snowflake className="w-3 h-3 text-[#0891B2] stroke-[2.2]" />;
  }

  const sizeClasses =
    size === 'xs'
      ? 'text-[10px] px-2 py-0.5 gap-1'
      : size === 'md'
      ? 'text-xs px-3.5 py-1.5 gap-1.5'
      : 'text-[11px] px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${styles} ${sizeClasses} whitespace-nowrap transition-all shadow-2xs select-none ${className}`}
    >
      {icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : (
        defaultIcon && <span className="flex-shrink-0">{defaultIcon}</span>
      )}

      <span>{status}</span>

      {showChevron && (
        <ChevronDown className="w-3 h-3 text-current opacity-60 ml-0.5 flex-shrink-0" />
      )}
    </span>
  );
};
