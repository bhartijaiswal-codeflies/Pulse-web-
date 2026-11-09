import React, { useState } from 'react';
import { Check, X, Eye, Calendar, Inbox as InboxIcon, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/NotificationContext';

export const InboxCard = ({ requests, onApprove, onReject }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { addToast } = useToast();

  const pendingRequests = requests.filter((r) => r.status === 'Pending');

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
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[175px]">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <h3 className="font-bold text-[#172033] tracking-wide text-sm flex items-center gap-1.5">
          <InboxIcon className="w-4 h-4 text-[#2563EB]" />
          <span>Inbox</span>
        </h3>
        {pendingRequests.length > 0 ? (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            {pendingRequests.length} action items
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All caught up
          </span>
        )}
      </div>

      {/* Content */}
      <div className="my-2">
        {pendingRequests.length > 0 ? (
          <div className="space-y-2">
            {pendingRequests.slice(0, 2).map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={req.avatar}
                    alt={req.employeeName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E5EAF2]"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-[#172033] truncate">{req.employeeName}</p>
                    <p className="text-[10px] text-[#8292AD] truncate">{req.leaveType} • {req.days}d</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleReject(req)}
                    className="p-1 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => handleApprove(req)}
                    className="p-1 rounded-lg text-white bg-[#10B981] hover:bg-emerald-600 shadow-xs"
                    title="Approve"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state matching Reference Image 4 ("Good job! You have no pending actions") */
          <div className="py-3 flex items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#172033]">Good job!</p>
              <p className="text-[11px] text-[#8292AD]">You have no pending actions</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">
          {pendingRequests.length} leave requests pending
        </span>
        <button
          onClick={() => {
            if (pendingRequests.length > 0) setSelectedRequest(pendingRequests[0]);
          }}
          disabled={pendingRequests.length === 0}
          className="text-[#2563EB] hover:underline font-semibold disabled:opacity-40 disabled:hover:no-underline"
        >
          View Details
        </button>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Leave Request Details"
          subtitle={`ID: ${selectedRequest.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-xl border border-[#E5EAF2]">
              <img src={selectedRequest.avatar} alt={selectedRequest.employeeName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="font-bold text-[#172033] text-sm">{selectedRequest.employeeName}</p>
                <p className="text-[11px] text-[#8292AD]">{selectedRequest.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg border border-[#E5EAF2]">
                <span className="text-[#8292AD] block">Type</span>
                <span className="font-bold text-[#172033]">{selectedRequest.leaveType}</span>
              </div>
              <div className="p-2.5 rounded-lg border border-[#E5EAF2]">
                <span className="text-[#8292AD] block">Duration</span>
                <span className="font-bold text-[#172033]">{selectedRequest.days} Business Days</span>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-[#E5EAF2] bg-[#FCFDFE]">
              <span className="text-[#8292AD] block font-semibold mb-1">Reason:</span>
              <p className="italic text-[#172033]">"{selectedRequest.reason || 'Personal emergency leave'}"</p>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                onClick={() => handleReject(selectedRequest)}
                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 font-semibold border border-rose-200"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedRequest)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold shadow-xs"
              >
                Approve
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
