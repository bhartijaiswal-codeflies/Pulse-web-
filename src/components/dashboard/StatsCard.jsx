import React from 'react';

const getValueColorClass = (iconBg, customColor) => {
  if (customColor) return customColor;
  if (!iconBg) return 'text-[#172033]';
  if (iconBg.includes('rose') || iconBg.includes('red')) return 'text-[#DC2626]';
  if (iconBg.includes('emerald') || iconBg.includes('green')) return 'text-[#059669]';
  if (iconBg.includes('amber') || iconBg.includes('orange') || iconBg.includes('yellow')) return 'text-[#D97706]';
  if (iconBg.includes('blue') || iconBg.includes('[#2563EB]')) return 'text-[#2563EB]';
  if (iconBg.includes('purple') || iconBg.includes('violet')) return 'text-[#7C3AED]';
  return 'text-[#172033]';
};

export const StatsCard = ({
  title,
  value,
  subtext,
  badgeText,
  badgeType = 'default',
  icon: Icon,
  iconBg = 'bg-blue-50 text-[#2563EB]',
  valueColor,
  className = '',
}) => {
  const numberColor = getValueColorClass(iconBg, valueColor);

  return (
    <div
      className={`bg-white border border-[#E5EAF2] rounded-2xl p-3.5 sm:p-4 shadow-card hover:border-blue-200 hover:shadow-subtle transition-all group flex flex-col justify-between ${className}`}
    >
      {/* 1st Row: Title on left side, Icon on right side */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8292AD] truncate">
            {title}
          </span>
          {badgeText && (
            <span
              className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md leading-none whitespace-nowrap ${
                badgeType === 'danger'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : badgeType === 'success'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-blue-50 text-[#2563EB] border border-blue-200'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>

        {/* Icon container on right side */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0 shadow-2xs ${iconBg}`}
        >
          {Icon && <Icon className="w-4 h-4 stroke-[2.2]" />}
        </div>
      </div>

      {/* 2nd Row: Below the title - Number in matching color and side the text */}
      <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
        <span
          className={`text-2xl font-black tracking-tight leading-tight ${numberColor}`}
        >
          {value}
        </span>
        {subtext && (
          <span className="text-xs font-medium text-[#8292AD] flex items-center gap-1 leading-tight">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
