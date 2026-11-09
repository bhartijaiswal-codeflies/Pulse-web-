import React, { useState } from 'react';
import { Check, X, Eye, Calendar, Inbox, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/NotificationContext';

export const SketchInboxLeaveRequests = ({ requests, onApprove, onReject }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { addToast } = useToast();

  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  const handleApprove = (req) => {
    onApprove(req.id);
    addToast({
      title: 'Leave Request Approved',
      message: `${req.employeeName}'s ${req.leaveType} (${req.days} days) approved.`,
      type: 'success',
    });
    if (selectedRequest?.id === req.id) setSelectedRequest(null);
  };

  const handleReject = (req) => {
    onReject(req.id);
    addToast({
      title: 'Leave Request Rejected',
      message: `${req.employeeName}'s ${req.leaveType} has been declined.`,
      type: 'error',
    });
    if (selectedRequest?.id === req.id) setSelectedRequest(null);
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header matching Sketch: "Inbox leave requests" */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Inbox className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Inbox leave requests</h3>
            <p className="text-[11px] text-[#8292AD]">Pending Employee Submissions</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
          {pendingRequests.length} Pending
        </span>
      </div>

      {/* List */}
      <div className="my-3 space-y-2.5">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:bg-slate-100/70 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={req.avatar}
                  alt={req.employeeName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="font-bold text-[#172033] truncate">{req.employeeName}</p>
                    <StatusBadge status={req.leaveType} size="xs" />
                  </div>
                  <p className="text-[10px] text-[#8292AD] mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{req.startDate} – {req.endDate} ({req.days}d)</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="p-1.5 text-[#8292AD] hover:text-[#172033] hover:bg-white rounded-lg border border-transparent hover:border-[#E5EAF2]"
                  title="View details"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleReject(req)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleApprove(req)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg text-white bg-[#10B981] hover:bg-emerald-600 shadow-xs"
                >
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-[#8292AD]">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            <p className="text-xs font-bold text-[#172033]">All caught up!</p>
            <p className="text-[11px] text-[#8292AD]">No pending leave requests at this time.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] text-center text-xs text-[#8292AD]">
        <span>Approvals automatically reflect on employee balances and payroll</span>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Leave Request Details"
          subtitle={`Reference ID: ${selectedRequest.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-[#F7F9FC] rounded-xl border border-[#E5EAF2]">
              <img
                src={selectedRequest.avatar}
                alt={selectedRequest.employeeName}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-[#172033] text-sm">{selectedRequest.employeeName}</p>
                <p className="text-[11px] text-[#8292AD]">{selectedRequest.employeeId} • {selectedRequest.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-2.5 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Leave Type</span>
                <span className="font-bold text-[#172033]">{selectedRequest.leaveType}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Duration</span>
                <span className="font-bold text-[#172033]">{selectedRequest.days} Business Days</span>
              </div>
              <div className="p-2.5 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Start Date</span>
                <span className="font-bold text-[#172033]">{selectedRequest.startDate}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">End Date</span>
                <span className="font-bold text-[#172033]">{selectedRequest.endDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
              <span className="text-[#8292AD] block font-semibold mb-1">Reason:</span>
              <p className="italic text-[#172033]">"{selectedRequest.reason || 'Family emergency / personal travel'}"</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                onClick={() => handleReject(selectedRequest)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-semibold border border-rose-200"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleApprove(selectedRequest)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-xs"
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
