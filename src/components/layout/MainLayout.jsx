import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileDrawer } from './MobileDrawer';
import { employeesData, candidatesData } from '../../data/mockData';
import { User, Briefcase, ChevronRight, X } from 'lucide-react';

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Compute live search matches across employees and candidates
  const matchingEmployees = globalSearch.trim()
    ? employeesData.filter(
        (emp) =>
          emp.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          emp.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
          emp.designation.toLowerCase().includes(globalSearch.toLowerCase()) ||
          emp.email.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  const matchingCandidates = globalSearch.trim()
    ? candidatesData.filter(
        (c) =>
          c.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          c.role.toLowerCase().includes(globalSearch.toLowerCase()) ||
          c.department.toLowerCase().includes(globalSearch.toLowerCase())
      )
    : [];

  return (
    <div className="flex h-screen w-full bg-[#F7F9FC] overflow-hidden text-[#172033] font-sans">
      {/* Desktop Navy Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />

      {/* Mobile Slide-out Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />

        {/* Global Search Results Overlay (if active) */}
        {globalSearch.trim() && (
          <div className="bg-white border-b border-[#E5EAF2] px-6 py-4 shadow-subtle z-10 max-h-72 overflow-y-auto animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">
                  Search Results for "{globalSearch}"
                </span>
                <button
                  onClick={() => setGlobalSearch('')}
                  className="text-xs text-[#8292AD] hover:text-[#172033] flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear Search
                </button>
              </div>

              {matchingEmployees.length === 0 && matchingCandidates.length === 0 ? (
                <p className="text-xs text-[#8292AD] py-3">No matching employees or candidates found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Employees Results */}
                  {matchingEmployees.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#8292AD] uppercase flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#2563EB]" /> Employees ({matchingEmployees.length})
                      </div>
                      {matchingEmployees.slice(0, 3).map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => {
                            setGlobalSearch('');
                            navigate('/users');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F9FC] cursor-pointer border border-transparent hover:border-[#E5EAF2] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-semibold text-[#172033]">{emp.name}</p>
                              <p className="text-[10px] text-[#8292AD]">{emp.designation} • {emp.department}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#8292AD]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Candidates Results */}
                  {matchingCandidates.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-[#8292AD] uppercase flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Candidates ({matchingCandidates.length})
                      </div>
                      {matchingCandidates.slice(0, 3).map((cand) => (
                        <div
                          key={cand.id}
                          onClick={() => {
                            setGlobalSearch('');
                            navigate('/candidates');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F7F9FC] cursor-pointer border border-transparent hover:border-[#E5EAF2] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={cand.avatar} alt={cand.name} className="w-7 h-7 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-semibold text-[#172033]">{cand.name}</p>
                              <p className="text-[10px] text-[#8292AD]">{cand.role} • {cand.stage}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#8292AD]" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
