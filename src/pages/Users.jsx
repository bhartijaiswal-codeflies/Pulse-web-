import React, { useState, useEffect } from 'react';
import {
  Users as UsersIcon,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Star,
  Check,
  X,
  Eye,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/NotificationContext';

export const Users = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { addToast } = useToast();

  // Add form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('Employee');
  const [location, setLocation] = useState('San Francisco, CA');

  const loadEmployees = () => {
    setEmployees(employeeService.getEmployees());
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast({
        title: 'Validation error',
        message: 'Name and email are required fields.',
        type: 'warning',
      });
      return;
    }

    const created = employeeService.addEmployee({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+1 (555) 000-0000',
      department,
      designation: designation.trim() || 'Software Engineer',
      role,
      location,
      status: 'Active',
      joiningDate: 'Today',
    });

    addToast({
      title: 'Employee Added',
      message: `${created.name} (${created.id}) has been added to the directory.`,
      type: 'success',
    });

    loadEmployees();
    setShowAddModal(false);
    resetForm();
  };

  const handleToggleStatus = (employee) => {
    const newStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
    employeeService.updateEmployee(employee.id, { status: newStatus });
    addToast({
      title: 'Employee Status Updated',
      message: `${employee.name} is now marked as ${newStatus}.`,
      type: 'info',
    });
    loadEmployees();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDesignation('');
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === 'All' || emp.department.toLowerCase() === departmentFilter.toLowerCase();

    return matchesSearch && matchesDept;
  });

  const [starredUsers, setStarredUsers] = useState(['EMP-001', 'EMP-003']);

  const toggleStar = (id) => {
    setStarredUsers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const departments = ['All', 'Engineering', 'Product Design', 'Marketing', 'Data & Analytics', 'Security Operations', 'Customer Success', 'People Operations'];

  const departmentTabs = departments.map((d) => ({
    id: d,
    label: d === 'All' ? 'All Staff' : d,
    count: d === 'All' ? employees.length : employees.filter((e) => e.department.toLowerCase() === d.toLowerCase()).length,
  }));

  const columns = [
    {
      header: 'USER / ROLE',
      accessor: 'role',
      render: (row) => {
        const isStarred = starredUsers.includes(row.id);
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStar(row.id)}
              className="focus:outline-none transition-transform hover:scale-110"
              title="Toggle Bookmark"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isStarred
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              />
            </button>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 hover:bg-blue-100/60 transition-colors">
              <span>{row.role}</span>
              <span className="text-[9px] opacity-60">▾</span>
            </span>
          </div>
        );
      },
    },
    {
      header: 'EMPLOYEE & CONTACT',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0"
          />
          <div className="min-w-0">
            <div
              className="font-bold text-[#172033] text-xs hover:text-[#2563EB] cursor-pointer truncate"
              onClick={() => setSelectedUser(row)}
            >
              {row.name}
            </div>
            <div className="text-[10px] text-[#8292AD] font-medium truncate">
              {row.id} • {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'DESIGNATION & DEPT',
      accessor: 'designation',
      render: (row) => (
        <div>
          <div className="text-xs font-bold text-[#172033]">{row.designation}</div>
          <div className="text-[10px] text-[#8292AD] font-medium">{row.department}</div>
        </div>
      ),
    },
    {
      header: 'LOCATION',
      accessor: 'location',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4E5D78] bg-[#F7F9FC] px-2 py-0.5 rounded-full border border-[#E5EAF2]">
          {row.location}
        </span>
      ),
    },
    {
      header: 'OPTIONS',
      accessor: 'status',
      align: 'center',
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row)}
          title="Click to toggle active state"
          className="focus:outline-none"
        >
          <StatusBadge status={row.status} size="xs" showChevron={true} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        title="User Management"
        badgeText="Employee Directory"
        subtitle="Manage active company workforce, permission tiers, departments and designations."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Users' }]}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Employee</span>
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Workforce"
          value={employees.length}
          subtext="Configured user accounts"
          badgeText="Active"
          badgeType="success"
          icon={UsersIcon}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="Active Headcount"
          value={employees.filter((e) => e.status === 'Active').length}
          subtext="Full system access"
          badgeText="98% Active"
          badgeType="success"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="On Leave / Inactive"
          value={employees.filter((e) => e.status !== 'Active').length}
          subtext="Temporarily off duty"
          badgeText="Notice"
          badgeType="default"
          icon={XCircle}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="Admin & Managers"
          value={employees.filter((e) => ['HR Admin', 'Manager', 'Director'].includes(e.role)).length}
          subtext="Privileged permissions"
          badgeText="Tier 1-2"
          badgeType="default"
          icon={ShieldCheck}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Search Header */}
      <div className="flex justify-end">
        <div className="w-full sm:w-72">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by name, ID, title..."
          />
        </div>
      </div>

      {/* Table with Tab Pills & Circular Action Buttons matching Reference Image */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        pageSize={6}
        tabs={departmentTabs}
        activeTab={departmentFilter}
        onTabChange={setDepartmentFilter}
        filterInfo={`Filtered: ${filteredEmployees.length} Shown of ${employees.length}`}
        emptyMessage="No employees found"
        emptySubtext="Try selecting another department or clearing search query."
        actions={(row) => (
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              onClick={() => handleToggleStatus(row)}
              title={row.status === 'Active' ? 'Deactivate User' : 'Activate User'}
              className={`w-6 h-6 rounded-full border flex items-center justify-center hover:scale-105 transition-all shadow-2xs ${
                row.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100'
              }`}
            >
              {row.status === 'Active' ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>
            <button
              onClick={() => setSelectedUser(row)}
              title="View Profile Details"
              className="w-6 h-6 rounded-full bg-slate-50 text-slate-500 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:scale-105 transition-all shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Add Employee Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Onboard New Employee"
          subtitle="Provision new employee profile, department allocation and access level"
        >
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rachel.a@pulsehr.com"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Security Operations">Security Operations</option>
                  <option value="People Operations">People Operations</option>
                  <option value="Customer Success">Customer Success</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Designation / Title
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Role / Access Tier
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Employee">Employee (Standard)</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="HR Admin">HR Admin (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Work Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Provision Employee
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View User Profile Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="Employee Profile Card"
          subtitle={`Employee Code: ${selectedUser.id}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#F7F9FC] rounded-2xl border border-[#E5EAF2]">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#172033]">{selectedUser.name}</h4>
                  <StatusBadge status={selectedUser.status} size="sm" />
                </div>
                <p className="text-xs font-semibold text-[#2563EB] mt-0.5">{selectedUser.designation}</p>
                <p className="text-xs text-[#8292AD]">{selectedUser.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Email</span>
                <span className="font-semibold text-[#172033] break-all">{selectedUser.email}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Phone</span>
                <span className="font-semibold text-[#172033]">{selectedUser.phone}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Role Tier</span>
                <span className="font-semibold text-[#172033]">{selectedUser.role}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Joined Date</span>
                <span className="font-semibold text-[#172033]">{selectedUser.joiningDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE] text-xs">
              <span className="text-[#8292AD] block mb-0.5">Assigned Office Location</span>
              <span className="font-semibold text-[#172033]">{selectedUser.location}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
