import React from 'react';
import { ChevronRight } from 'lucide-react';

export const PageHeader = ({
  title,
  subtitle,
  badgeText,
  breadcrumbs = [],
  actions,
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1.5 text-xs text-[#8292AD] mb-1.5 font-medium">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#8292AD]" />}
                {crumb.link ? (
                  <a href={crumb.link} className="hover:text-[#2563EB] transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-[#172033] font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-center flex-wrap gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172033]">
            {title}
          </h1>
          {badgeText && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-1.5 animate-pulse" />
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs sm:text-sm text-[#8292AD] mt-1">{subtitle}</p>}
      </div>

      {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
    </div>
  );
};

