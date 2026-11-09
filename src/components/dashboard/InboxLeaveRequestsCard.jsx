import React, { useState } from 'react';
import { Inbox, Check, X, Eye, Calendar, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/NotificationContext';

export const InboxLeaveRequestsCard = ({ requests, onApprove, onReject }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { addToast } = useToast();

  const pending = requests.filter((r) => r.status === 'Pending');

  const handleApprove = (req) => {
    onApprove(req.id);
    addToast({
      title: 'Leave Approved',
      message: `${req.employeeName}'s ${req.leaveType} (${req.days}d) approved.`,
      type: 'success',
    });
    if (selectedRequest?.id === req.id) setSelectedRequest(null);
  };

  const handleReject = (req) => {
    onReject(req.id);
    addToast({
      title: 'Leave Declined',
      message: `${req.employeeName}'s ${req.leaveType} declined.`,
      type: 'error',
    });
    if (selectedRequest?.id === req.id) setSelectedRequest(null);
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Inbox className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Inbox leave requests</h3>
            <p className="text-[11px] text-[#8292AD]">Pending Admin Approvals</p>
          </div>
        </div>
        {pending.length > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            {pending.length} Action Needed
          </span>
        )}
      </div>

      {/* Content list */}
      <div className="my-2.5 space-y-2">
        {pending.length > 0 ? (
          pending.slice(0, 3).map((req) => (
            <div
              key={req.id}
              className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between gap-3 text-xs hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={req.avatar}
                  alt={req.employeeName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5EAF2] flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-[#172033] truncate">{req.employeeName}</p>
                  <p className="text-[10px] text-[#8292AD] truncate">
                    {req.leaveType} • {req.days} {req.days === 1 ? 'day' : 'days'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="p-1 rounded-lg text-[#8292AD] hover:text-[#172033] hover:bg-white border border-transparent hover:border-[#E5EAF2]"
                  title="View details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleReject(req)}
                  className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  title="Reject"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => handleApprove(req)}
                  className="p-1.5 rounded-lg text-white bg-[#10B981] hover:bg-emerald-600 shadow-xs transition-colors"
                  title="Approve"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-[#8292AD]">
            <p className="text-xs font-semibold text-[#172033]">All caught up!</p>
            <p className="text-[11px] text-[#8292AD]">No pending leave requests to review.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">{pending.length} total pending</span>
        <button
          onClick={() => {
            if (pending.length > 0) setSelectedRequest(pending[0]);
          }}
          disabled={pending.length === 0}
          className="text-[#2563EB] hover:underline font-semibold text-xs disabled:opacity-40 disabled:hover:no-underline"
        >
          Review All
        </button>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Review Leave Application"
          subtitle={`Reference: ${selectedRequest.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-xl border border-[#E5EAF2]">
              <img src={selectedRequest.avatar} alt={selectedRequest.employeeName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-sm text-[#172033]">{selectedRequest.employeeName}</p>
                <p className="text-[11px] text-[#8292AD]">{selectedRequest.department} • {selectedRequest.employeeId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg border border-[#E5EAF2]">
                <span className="text-[#8292AD] block">Leave Type</span>
                <span className="font-bold text-[#172033]">{selectedRequest.leaveType}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[#E5EAF2]">
                <span className="text-[#8292AD] block">Duration</span>
                <span className="font-bold text-[#172033]">{selectedRequest.days} Days ({selectedRequest.startDate})</span>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-[#E5EAF2] bg-[#FCFDFE]">
              <span className="text-[#8292AD] block font-semibold mb-1">Reason:</span>
              <p className="italic text-[#172033]">"{selectedRequest.reason || 'Personal time-off request'}"</p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                onClick={() => handleReject(selectedRequest)}
                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-semibold border border-rose-200"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleApprove(selectedRequest)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold shadow-xs"
              >
                Approve Request
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

