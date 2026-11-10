import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Inbox, RotateCw } from 'lucide-react';

export const DataTable = ({
  columns,
  data,
  pageSize = 8,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your search or filters.',
  actions,
  rowKey = 'id',
  tabs,
  activeTab,
  onTabChange,
  filterInfo,
  searchBar,
  filterBar,
  entityName = 'records',
  onRefresh,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length, activeTab]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs Card (Red Box 1 from Reference Image) */}
      {tabs && tabs.length > 0 && (
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-3.5 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition-all">
          {/* Left: Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-1 lg:pb-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id || activeTab === tab.label;
              return (
                <button
                  key={tab.id || tab.label}
                  onClick={() => onTabChange && onTabChange(tab.id || tab.label)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white text-[#4E5D78] hover:text-[#172033] hover:bg-[#F8FAFC] border border-[#E5EAF2]'
                  }`}
                >
                  {tab.icon && (
                    <span className="flex-shrink-0 text-[12px]">{tab.icon}</span>
                  )}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ml-0.5 ${
                        isActive
                          ? 'bg-[#1D4ED8] text-white'
                          : tab.badgeColor || 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Optional Search + Live Filter Counter */}
          <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0">
            {searchBar && <div className="w-full sm:w-64">{searchBar}</div>}

            <div className="text-xs text-[#8292AD] font-medium flex items-center gap-1.5 whitespace-nowrap select-none">
              <span>
                {filterInfo ||
                  `Filtered: ${paginatedData.length} Shown of ${data.length}`}
              </span>
              <button
                onClick={onRefresh}
                title="Refresh Table Data"
                className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Fixed Filter Card */}
      {filterBar && (
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-3.5 shadow-card transition-all">
          {filterBar}
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card">
        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-white">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`py-3 px-4 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th className="py-3 px-4 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider text-right">
                    ACTIONS
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs text-[#172033]">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={row[rowKey] || rowIdx}
                    className="hover:bg-[#F8FAFC] transition-colors group"
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`py-3 px-4 align-middle ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                    {actions && (
                      <td className="py-3 px-4 align-middle text-right whitespace-nowrap">
                        {actions(row)}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="py-16 text-center text-[#8292AD]"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#F7F9FC] border border-[#E5EAF2] flex items-center justify-center mb-3 text-[#8292AD]">
                        <Inbox className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <p className="font-semibold text-sm text-[#172033]">{emptyMessage}</p>
                      <p className="text-xs text-[#8292AD] mt-1">{emptySubtext}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Red Box 2 from Reference Image) */}
        {data.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 border-t border-[#E5EAF2] bg-white gap-3 text-xs text-[#8292AD]">
            {/* Left: Showing counter */}
            <div>
              Showing{' '}
              <span className="font-bold text-[#172033]">
                {data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-[#172033]">
                {Math.min(currentPage * pageSize, data.length)}
              </span>
            </div>

            {/* Right: Boxed Pagination Controls */}
            <div className="border border-[#E5EAF2] rounded-xl px-2.5 py-1 bg-white inline-flex items-center gap-1.5 shadow-2xs">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-xs font-semibold px-2 py-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 5) return true;
                  if (page === 1 || page === totalPages) return true;
                  return Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, array) => {
                  const prev = array[index - 1];
                  const showEllipsis = prev && page - prev > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className="px-1 text-[#8292AD]">...</span>}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`w-6 h-6 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-[#2563EB] text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-xs font-semibold px-2 py-0.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
