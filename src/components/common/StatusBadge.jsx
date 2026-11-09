import React from 'react';

export const StatusBadge = ({ status, size = 'sm', icon }) => {
  const normalized = (status || '').toLowerCase().trim();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (['active', 'approved', 'present', 'on time', 'paid', 'hired', 'available'].includes(normalized)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (['pending', 'in review', 'under review', 'casual leave', 'processing'].includes(normalized)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (['rejected', 'inactive', 'absent', 'terminated', 'high', 'urgent'].includes(normalized)) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (['late', 'shortlisted', 'offer extended', 'interview scheduled', 'assigned'].includes(normalized)) {
    styles = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (['on leave', 'maintenance', 'sick leave', 'privilege leave'].includes(normalized)) {
    styles = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColor = 'bg-purple-500';
  } else if (['cold', 'returned (ready)'].includes(normalized)) {
    styles = 'bg-cyan-50 text-cyan-700 border-cyan-200';
    dotColor = 'bg-cyan-500';
  }

  const sizeClasses = size === 'xs' 
    ? 'text-[11px] px-2 py-0.5' 
    : size === 'md' 
    ? 'text-xs px-3 py-1' 
    : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${styles} ${sizeClasses} whitespace-nowrap transition-colors`}
    >
      {icon ? (
        <span className="text-[12px]">{icon}</span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      <span>{status}</span>
    </span>
  );
};

