import React, { useState } from 'react';
import { CheckSquare, Square, Plus, CheckCircle, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/NotificationContext';

export const EmployeeChecklist = ({ tasks, onToggleTask, onAddTask }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newTag, setNewTag] = useState('Operations');
  const { addToast } = useToast();

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      dueDate: newDueDate || '15 Nov, 2026',
      priority: newPriority,
      tag: newTag,
    });

    addToast({
      title: 'Task Created',
      message: `"${newTitle.trim()}" added to checklist.`,
      type: 'success',
    });

    setNewTitle('');
    setNewDueDate('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#E5EAF2] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#172033]">Employee Checklist</h2>
          <p className="text-xs text-[#8292AD] mt-0.5">HR Onboarding & Compliance Tasks</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-[#2563EB] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-5 py-3.5 bg-[#FBFDFE] border-b border-[#E5EAF2]">
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-[#8292AD]">Overall Completion</span>
          <span className="text-[#172033] font-bold">
            {completedCount} of {tasks.length} ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-[#E5EAF2] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#10B981] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="divide-y divide-[#E5EAF2]">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-start gap-3 cursor-pointer select-none group ${
              task.completed ? 'opacity-70 bg-[#FCFDFE]' : ''
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-[#2563EB] flex-shrink-0 focus:outline-none"
            >
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-[#10B981] fill-emerald-50" />
              ) : (
                <Square className="w-5 h-5 text-[#8292AD] group-hover:text-[#2563EB] transition-colors" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p
                className={`text-xs sm:text-sm font-medium ${
                  task.completed
                    ? 'line-through text-[#8292AD]'
                    : 'text-[#172033] group-hover:text-[#2563EB] transition-colors'
                }`}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] text-[#8292AD] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due {task.dueDate}
                </span>
                {task.tag && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F7F9FC] border border-[#E5EAF2] text-[#4E5D78] font-medium">
                    {task.tag}
                  </span>
                )}
                {task.priority && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      task.priority === 'Urgent'
                        ? 'bg-rose-50 text-rose-600'
                        : task.priority === 'High'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New HR Task"
          subtitle="Assign actionable item to the employee checklist"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Task Description *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Schedule 90-day review for junior designer"
                className="w-full px-3.5 py-2 text-sm border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Category Tag
              </label>
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
              >
                <option value="Compliance">Compliance</option>
                <option value="Benefits">Benefits</option>
                <option value="Hiring">Hiring</option>
                <option value="Assets">Assets</option>
                <option value="Payroll">Payroll</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-1.5 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Save Task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
