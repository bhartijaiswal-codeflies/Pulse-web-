import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export const DataTable = ({
  columns,
  data,
  pageSize = 8,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your search or filters.',
  actions,
  rowKey = 'id',
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

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
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5EAF2] bg-[#FBFDFE]">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 text-[11px] font-semibold text-[#8292AD] uppercase tracking-wider ${
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
                <th className="py-3.5 px-4 text-[11px] font-semibold text-[#8292AD] uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAF2] text-sm text-[#172033]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row[rowKey] || rowIdx}
                  className="hover:bg-[#F8FAFC] transition-colors group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={`py-3.5 px-4 align-middle ${
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
                    <td className="py-3.5 px-4 align-middle text-right whitespace-nowrap">
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

      {/* Pagination Footer */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 border-t border-[#E5EAF2] bg-[#FCFDFE] gap-3 text-xs text-[#8292AD]">
          <div>
            Showing{' '}
            <span className="font-semibold text-[#172033]">
              {data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-[#172033]">
              {Math.min(currentPage * pageSize, data.length)}
            </span>{' '}
            of <span className="font-semibold text-[#172033]">{data.length}</span> records
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F7F9FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
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
                      className={`min-w-[28px] h-7 px-2 text-xs font-medium rounded-lg transition-all ${
                        currentPage === page
                          ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                          : 'border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F7F9FC]'
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
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F7F9FC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
