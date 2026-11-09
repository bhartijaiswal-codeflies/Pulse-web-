import React, { useState } from 'react';
import { Check, X, Eye, Calendar, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/NotificationContext';

export const LeaveRequests = ({ requests, onApprove, onReject }) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { addToast } = useToast();

  const handleApprove = (req) => {
    onApprove(req.id);
    addToast({
      title: 'Leave Request Approved',
      message: `${req.employeeName}'s ${req.leaveType} (${req.days} days) has been approved.`,
      type: 'success',
    });
    if (selectedRequest?.id === req.id) {
      setSelectedRequest(null);
    }
  };

  const handleReject = (req) => {
    onReject(req.id);
    addToast({
      title: 'Leave Request Rejected',
      message: `${req.employeeName}'s ${req.leaveType} has been declined.`,
      type: 'error',
    });
    if (selectedRequest?.id === req.id) {
      setSelectedRequest(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#E5EAF2] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-[#172033]">Leave Requests Inbox</h2>
          {pendingRequests.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-50 text-rose-600 border border-rose-100">
              {pendingRequests.length} Pending
            </span>
          )}
        </div>
        <span className="text-xs text-[#8292AD] font-medium">Requires Review</span>
      </div>

      {/* List */}
      <div className="divide-y divide-[#E5EAF2]">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Employee info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={req.avatar}
                  alt={req.employeeName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#172033] hover:text-[#2563EB] cursor-pointer" onClick={() => setSelectedRequest(req)}>
                      {req.employeeName}
                    </span>
                    <span className="text-[11px] text-[#8292AD]">({req.department})</span>
                    <StatusBadge status={req.leaveType} size="xs" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8292AD] mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8292AD]" />
                      {req.startDate} {req.startDate !== req.endDate ? `– ${req.endDate}` : ''}
                    </span>
                    <span className="font-semibold text-[#172033]">
                      {req.days} {req.days === 1 ? 'day' : 'days'}
                    </span>
                    <span className="hidden sm:inline text-[11px]">
                      Applied: {req.requestDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="p-1.5 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-lg border border-transparent hover:border-[#E5EAF2] transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleReject(req)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleApprove(req)}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white bg-[#10B981] hover:bg-emerald-600 shadow-xs transition-colors"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-[#8292AD]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto mb-2 flex items-center justify-center">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <p className="text-sm font-semibold text-[#172033]">All caught up!</p>
            <p className="text-xs text-[#8292AD] mt-0.5">There are no pending leave requests to review.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Leave Request Details"
          subtitle={`Reference ID: ${selectedRequest.id}`}
          footer={
            <>
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E5EAF2] text-[#172033] hover:bg-[#F7F9FC]"
              >
                Close
              </button>
              {selectedRequest.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-[#10B981] hover:bg-emerald-600 shadow-sm"
                  >
                    Approve Request
                  </button>
                </>
              )}
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3.5 bg-[#F7F9FC] rounded-xl border border-[#E5EAF2]">
              <img
                src={selectedRequest.avatar}
                alt={selectedRequest.employeeName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-[#172033]">{selectedRequest.employeeName}</h4>
                <p className="text-xs text-[#8292AD]">{selectedRequest.employeeId} • {selectedRequest.department}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedRequest.status} size="xs" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Leave Type</span>
                <span className="font-semibold text-[#172033]">{selectedRequest.leaveType}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Duration</span>
                <span className="font-semibold text-[#172033]">{selectedRequest.days} Business Days</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Start Date</span>
                <span className="font-semibold text-[#172033]">{selectedRequest.startDate}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">End Date</span>
                <span className="font-semibold text-[#172033]">{selectedRequest.endDate}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
              <span className="text-xs font-semibold text-[#8292AD] block mb-1">Reason Provided:</span>
              <p className="text-xs text-[#172033] leading-relaxed italic">
                "{selectedRequest.reason || 'No specific reason provided.'}"
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

