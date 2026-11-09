import React from 'react';

export const StatsCard = ({
  title,
  value,
  subtext,
  badgeText,
  badgeType = 'default',
  icon: Icon,
  iconBg = 'bg-blue-50 text-[#2563EB]',
}) => {
  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle hover:border-blue-200 transition-all group flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8292AD]">
            {title}
          </span>
          {badgeText && (
            <span
              className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                badgeType === 'danger'
                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                  : badgeType === 'success'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-blue-50 text-[#2563EB] border border-blue-100'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0 ${iconBg}`}
        >
          {Icon && <Icon className="w-5 h-5 stroke-[2]" />}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172033]">
            {value}
          </span>
        </div>
        {subtext && (
          <p className="text-xs text-[#8292AD] mt-1 flex items-center gap-1">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

