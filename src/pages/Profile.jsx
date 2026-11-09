import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
  Key,
  Bell,
  Lock,
  Edit2,
  Check,
  Building,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { currentUser as initialUser } from '../data/mockData';
import { useToast } from '../context/NotificationContext';

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'settings' ? 'settings' : 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState(initialUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const { addToast } = useToast();

  // Edit form states
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editLocation, setEditLocation] = useState(user.location);
  const [editDesignation, setEditDesignation] = useState(user.designation);

  // Settings states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);

  useEffect(() => {
    if (searchParams.get('tab') === 'settings') {
      setActiveTab('settings');
    }
  }, [searchParams]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: editName,
      phone: editPhone,
      location: editLocation,
      designation: editDesignation,
    }));

    addToast({
      title: 'Profile Updated',
      message: 'Your personal employee details have been saved.',
      type: 'success',
    });

    setShowEditModal(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    addToast({
      title: 'Security Password Updated',
      message: 'Your portal login password has been changed successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        title="My Profile"
        badgeText="Account Verified"
        subtitle="View and edit your employee profile, organizational records, and portal credentials."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Profile' }]}
        actions={
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20"
          >
            <Edit2 className="w-4 h-4 stroke-[2.2]" />
            <span>Edit Profile</span>
          </button>
        }
      />

      {/* Profile Header Hero Card matching Reference Image 3 visual style */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#F7F9FC] shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-[#172033]">{user.name}</h2>
                <StatusBadge status={user.status} size="sm" />
              </div>
              <p className="text-xs font-semibold text-[#2563EB] mt-0.5">{user.designation}</p>
              <div className="flex items-center gap-4 text-xs text-[#8292AD] mt-2 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> {user.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {user.location}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  ID: {user.employeeId}
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E5EAF2]">
            <span className="text-[11px] text-[#8292AD]">Tenure at Pulse</span>
            <span className="text-sm font-bold text-[#172033]">Joined {user.joiningDate}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EAF2] pb-3 overflow-x-auto">
        {[
          { id: 'overview', label: 'Personal Information' },
          { id: 'employment', label: 'Employment & Role' },
          { id: 'settings', label: 'Account & Security Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#8292AD] hover:text-[#172033] hover:bg-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Personal Info */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E5EAF2]">
              Contact Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD]">Email Address</span>
                <span className="font-semibold text-[#172033]">{user.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD]">Phone Number</span>
                <span className="font-semibold text-[#172033]">{user.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD]">Emergency Contact</span>
                <span className="font-semibold text-[#172033]">+1 (555) 991-0022 (Spouse)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8292AD]">Work Address</span>
                <span className="font-semibold text-[#172033]">{user.location}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E5EAF2]">
              Demographics & Identity
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD]">Date of Birth</span>
                <span className="font-semibold text-[#172033]">18 August, 1992</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD]">Citizenship</span>
                <span className="font-semibold text-[#172033]">United States (Citizen)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD]">Government ID / SSN</span>
                <span className="font-semibold text-[#172033]">•••-••-4029 (Verified)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8292AD]">Languages</span>
                <span className="font-semibold text-[#172033]">English (Native), Spanish</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Employment */}
      {activeTab === 'employment' && (
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-card">
          <h3 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E5EAF2] mb-4">
            Organizational Placement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
              <span className="text-[#8292AD] block mb-1">Assigned Department</span>
              <span className="text-sm font-bold text-[#172033]">{user.department}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
              <span className="text-[#8292AD] block mb-1">Corporate Title</span>
              <span className="text-sm font-bold text-[#172033]">{user.designation}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
              <span className="text-[#8292AD] block mb-1">Access Role Tier</span>
              <span className="text-sm font-bold text-[#2563EB]">{user.role}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
              <span className="text-[#8292AD] block mb-1">Reporting Manager</span>
              <span className="text-sm font-bold text-[#172033]">Sarah Connor (VP HR)</span>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
              <span className="text-[#8292AD] block mb-1">Employment Type</span>
              <span className="text-sm font-bold text-[#172033]">Full-Time Permanent (W-2)</span>
            </div>
            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
              <span className="text-[#8292AD] block mb-1">Probation Status</span>
              <span className="text-sm font-bold text-emerald-600">Confirmed (Completed)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Account & Security */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Change password */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card">
            <h3 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E5EAF2] mb-4 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#2563EB]" />
              <span>Change Portal Password</span>
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Min 8 characters, 1 number"
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Preferences & 2FA */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-[#172033] pb-3 border-b border-[#E5EAF2] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#10B981]" />
              <span>Security & Alerts Preferences</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
                <div>
                  <span className="font-bold text-[#172033] block">Two-Factor Authentication (2FA)</span>
                  <span className="text-[#8292AD] text-[11px]">Require authenticator code on sign in</span>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => {
                    setTwoFactorEnabled(e.target.checked);
                    addToast({ title: '2FA Updated', message: `2FA is now ${e.target.checked ? 'Enabled' : 'Disabled'}.`, type: 'info' });
                  }}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
                <div>
                  <span className="font-bold text-[#172033] block">Email Leave & Approval Notifications</span>
                  <span className="text-[#8292AD] text-[11px]">Receive email on leave updates</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
                <div>
                  <span className="font-bold text-[#172033] block">Browser Desktop Notifications</span>
                  <span className="text-[#8292AD] text-[11px]">Show pop-ups for critical events</span>
                </div>
                <input
                  type="checkbox"
                  checked={desktopNotifs}
                  onChange={(e) => setDesktopNotifs(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] rounded focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile Information"
          subtitle="Update your employee contact details and assigned designation"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Designation Title
              </label>
              <input
                type="text"
                value={editDesignation}
                onChange={(e) => setEditDesignation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Office Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

