import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
  Sparkles,
  Users,
  Laptop,
  ArrowRight,
  CheckCircle2,
  Building2,
  KeyRound,
  Shield,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import { useToast } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';

export const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Mode toggle (defaulting to Light Mode as requested by user)
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [email, setEmail] = useState('saurabh.h@pulsehr.com');
  const [password, setPassword] = useState('PulseAdmin@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('HR Admin');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Quick 1-click demo role accounts for instant testing
  const demoAccounts = [
    {
      role: 'HR Admin',
      name: 'Saurabh H.',
      email: 'saurabh.h@pulsehr.com',
      password: 'PulseAdmin@2026',
    },
    {
      role: 'Team Lead',
      name: 'Elena Rostova',
      email: 'elena.rostova@pulsehr.com',
      password: 'LeadPulse@2026',
    },
    {
      role: 'Employee',
      name: 'Marcus Vance',
      email: 'marcus.vance@pulsehr.com',
      password: 'UserPulse@2026',
    },
  ];

  const handleSelectDemoAccount = (acc) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setPassword(acc.password);
    addToast({
      title: `${acc.role} Selected`,
      message: `Loaded credentials for ${acc.name}.`,
      type: 'info',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast({
        title: 'Missing Credentials',
        message: 'Please enter your email and password.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      addToast({
        title: 'Welcome back!',
        message: 'Signed in successfully to Pulse by Codeflies.',
        type: 'success',
      });
      navigate('/');
    }, 700);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        title: 'Google Authentication',
        message: 'Signed in with your verified Google Workspace account.',
        type: 'success',
      });
      navigate('/');
    }, 600);
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    addToast({
      title: 'Password Reset Sent',
      message: `A recovery link has been sent to ${forgotEmail}.`,
      type: 'info',
    });
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 flex flex-col justify-between overflow-x-hidden font-sans relative selection:bg-blue-600 selection:text-white ${
        isDarkMode ? 'bg-[#060913] text-slate-100' : 'bg-[#F8FAFC] text-slate-800'
      }`}
    >
      {/* Background Ambient Glows & Grid */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isDarkMode
            ? 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))]'
            : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.08),rgba(255,255,255,0))]'
        }`}
      />
      <div
        className={`absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] ${
          isDarkMode
            ? 'bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]'
            : 'bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]'
        }`}
      />

      <div className="flex-1 flex flex-col lg:flex-row min-h-screen relative z-10">
        {/* ========================================================================= */}
        {/* Left Side: Modern Executive Login Form                                    */}
        {/* ========================================================================= */}
        <div
          className={`w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] min-h-screen flex flex-col justify-between px-7 sm:px-12 md:px-14 xl:px-18 py-7 lg:py-9 z-20 flex-shrink-0 transition-colors duration-300 ${
            isDarkMode
              ? 'bg-[#070B18]/95 backdrop-blur-2xl border-r border-white/5'
              : 'bg-white/95 backdrop-blur-xl border-r border-[#E2E8F0] shadow-2xl shadow-slate-200/50'
          }`}
        >
          {/* Top Brand Logo & Controls */}
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] flex items-center justify-center p-2 shadow-lg shadow-blue-500/25 ring-2 ring-white">
                  <img
                    src="/logo.png"
                    alt="Pulse Logo"
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[20px] font-black leading-tight tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-[#0F172A]'
                    }`}
                  >
                    Pulse
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                      isDarkMode
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        : 'bg-blue-50 border-blue-200 text-[#2563EB]'
                    }`}
                  >
                    v2.6 Enterprise
                  </span>
                </div>
                <div className="text-[10px] font-extrabold text-[#2563EB] tracking-[0.2em] uppercase">
                  BY CODEFLIES
                </div>
              </div>
            </div>

            {/* Top Right: Segmented Theme Switcher & Enterprise Badge */}
            <div className="flex items-center gap-2">
              <div
                className={`p-1 rounded-xl flex items-center border transition-all ${
                  isDarkMode
                    ? 'bg-white/5 border-white/10'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsDarkMode(false)}
                  title="Switch to Light Mode"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    !isDarkMode
                      ? 'bg-white text-slate-800 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDarkMode(true)}
                  title="Switch to Dark Mode"
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#1E293B] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark</span>
                </button>
              </div>

              <div
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold ${
                  isDarkMode
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-2xs'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Enterprise SSO</span>
              </div>
            </div>
          </div>

          {/* Main Form Center Box */}
          <div className="my-auto py-6 max-w-[440px] w-full mx-auto">
            {/* Heading & Subtitle */}
            <div className="mb-5">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold mb-2.5 border ${
                  isDarkMode
                    ? 'bg-blue-500/10 border-blue-500/25 text-[#60A5FA]'
                    : 'bg-blue-50 border-blue-200 text-[#2563EB] shadow-2xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Centralized Workforce Operating System</span>
              </div>
              <h1
                className={`text-3xl sm:text-[32px] font-black tracking-tight leading-tight ${
                  isDarkMode ? 'text-white' : 'text-[#0F172A]'
                }`}
              >
                Sign In to your Account
              </h1>
              <p
                className={`text-xs sm:text-sm mt-1.5 font-normal leading-relaxed ${
                  isDarkMode ? 'text-slate-400' : 'text-[#64748B]'
                }`}
              >
                Welcome back! Access your enterprise workforce, payroll, and asset workspace.
              </p>
            </div>

            {/* 1-Click Demo Account Quick Fill */}
            <div
              className={`mb-5 p-3.5 rounded-2xl border transition-all ${
                isDarkMode
                  ? 'bg-white/[0.03] border-white/10'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>1-Click Demo Login</span>
                </span>
                <span
                  className={`text-[10px] ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Auto-fill role
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((acc) => {
                  const isActive = selectedRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectDemoAccount(acc)}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative ${
                        isActive
                          ? isDarkMode
                            ? 'bg-blue-600/25 border-blue-400/80 text-white ring-1 ring-blue-400/30 shadow-xs'
                            : 'bg-blue-50/90 border-[#2563EB] text-[#1E3A8A] ring-2 ring-blue-500/20 shadow-xs'
                          : isDarkMode
                          ? 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] font-extrabold truncate ${
                            isActive
                              ? isDarkMode
                                ? 'text-blue-300'
                                : 'text-[#1D4ED8]'
                              : isDarkMode
                              ? 'text-slate-300'
                              : 'text-slate-800'
                          }`}
                        >
                          {acc.role}
                        </span>
                        {isActive && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 ml-1" />
                        )}
                      </div>
                      <div
                        className={`text-[10px] truncate mt-0.5 font-medium ${
                          isActive ? 'text-[#2563EB]' : 'text-slate-400'
                        }`}
                      >
                        {acc.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Google Workspace Sign-In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full h-11 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-60 mb-4 ${
                isDarkMode
                  ? 'border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] text-white'
                  : 'border-[#CBD5E1] hover:border-[#94A3B8] bg-white hover:bg-[#F8FAFC] text-[#1E293B] shadow-2xs'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Workspace</span>
            </button>

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center mb-4">
              <div
                className={`border-t w-full ${
                  isDarkMode ? 'border-white/10' : 'border-[#E2E8F0]'
                }`}
              />
              <span
                className={`px-3 text-[10.5px] font-semibold uppercase tracking-wider absolute ${
                  isDarkMode
                    ? 'bg-[#070B18] text-slate-500'
                    : 'bg-white text-slate-400'
                }`}
              >
                or sign in with email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email Input */}
              <div>
                <label
                  className={`block text-xs font-bold mb-1.5 ${
                    isDarkMode ? 'text-slate-300' : 'text-[#1E293B]'
                  }`}
                >
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDarkMode ? 'text-slate-400' : 'text-[#8292AD]'
                    }`}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@codeflies.com"
                    className={`w-full pl-10 pr-4 h-11 text-xs sm:text-sm rounded-xl transition-all font-medium border focus:outline-none focus:ring-4 ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:bg-[#0E1528] focus:border-[#2563EB] focus:ring-blue-500/20'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] placeholder-slate-400 focus:bg-white focus:border-[#2563EB] focus:ring-blue-500/10 shadow-2xs'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className={`block text-xs font-bold ${
                      isDarkMode ? 'text-slate-300' : 'text-[#1E293B]'
                    }`}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      isDarkMode ? 'text-slate-400' : 'text-[#8292AD]'
                    }`}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className={`w-full pl-10 pr-11 h-11 text-xs sm:text-sm rounded-xl transition-all font-medium border focus:outline-none focus:ring-4 ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/10 text-white placeholder-slate-500 focus:bg-[#0E1528] focus:border-[#2563EB] focus:ring-blue-500/20'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] placeholder-slate-400 focus:bg-white focus:border-[#2563EB] focus:ring-blue-500/10 shadow-2xs'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer transition-colors ${
                      isDarkMode
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-400 hover:text-[#1E293B]'
                    }`}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-[#2563EB] focus:ring-blue-500/20 cursor-pointer accent-[#2563EB]"
                  />
                  <span
                    className={`text-xs font-medium ${
                      isDarkMode ? 'text-slate-400' : 'text-[#64748B]'
                    }`}
                  >
                    Keep me logged in for 30 days
                  </span>
                </label>
              </div>

              {/* Sign In Primary Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] hover:from-[#1D4ED8] hover:to-[#1E3A8A] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Register Notice */}
              <div className="text-center pt-1.5">
                <p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-[#64748B]'
                  }`}
                >
                  New team member without an account?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="font-bold text-[#2563EB] hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Request Provisioning
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom Trust & Copyright */}
          <div
            className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] ${
              isDarkMode
                ? 'border-white/5 text-slate-500'
                : 'border-[#E2E8F0] text-slate-500'
            }`}
          >
            <div>© 2026 Pulse by Codeflies. All rights reserved.</div>
            <div
              className={`flex items-center gap-1.5 font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Side: Futuristic 3D Portal Showcase with Floating Live Badges       */}
        {/* ========================================================================= */}
        <div
          className={`hidden lg:flex flex-1 min-h-screen relative overflow-hidden items-center justify-center p-8 xl:p-12 select-none transition-colors duration-300 ${
            isDarkMode
              ? 'bg-[#040711]'
              : 'bg-gradient-to-br from-[#F1F5F9] via-[#EBF2FA] to-[#E2ECF8]'
          }`}
        >
          {/* Ambient Radial Colored Nebulas */}
          <div
            className={`absolute w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              isDarkMode ? 'bg-blue-600/15' : 'bg-blue-500/12'
            }`}
          />
          <div
            className={`absolute w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none bottom-10 right-10 ${
              isDarkMode ? 'bg-indigo-600/15' : 'bg-indigo-400/10'
            }`}
          />

          {/* Centerpiece Showcase Container: Executive Glass Terminal */}
          <div className="relative z-10 w-full max-w-[560px] xl:max-w-[620px] 2xl:max-w-[680px] flex flex-col items-center">
            <div className="w-full rounded-3xl bg-gradient-to-b from-[#0A1128] via-[#0D183A] to-[#070C1E] border border-blue-500/30 shadow-[0_30px_90px_-20px_rgba(15,23,42,0.45),0_0_50px_rgba(37,99,235,0.15)] text-white p-6 sm:p-7 overflow-hidden backdrop-blur-2xl">
              {/* Top Showcase Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 ml-2">
                    Pulse OS • Enterprise Workforce Hub
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10.5px] font-bold text-emerald-400 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SYSTEM ONLINE</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10.5px] font-semibold text-slate-300">
                    <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                    <span>SOC-2 Type II</span>
                  </span>
                </div>
              </div>

              {/* Portal Showcase Center */}
              <div className="relative my-6 sm:my-8 flex items-center justify-center">
                {/* Outer Decorative Glow Rings */}
                <div className="absolute w-[360px] h-[360px] xl:w-[420px] xl:h-[420px] rounded-full border border-blue-500/20 animate-pulse pointer-events-none" />
                <div className="absolute w-[400px] h-[400px] xl:w-[460px] xl:h-[460px] rounded-full border border-cyan-400/10 pointer-events-none" />

                {/* Glowing Framed Image Container */}
                <div className="relative w-[320px] h-[320px] xl:w-[380px] xl:h-[380px] rounded-full p-2.5 bg-gradient-to-tr from-cyan-400/30 via-blue-600/40 to-indigo-500/30 shadow-[0_0_80px_rgba(37,99,235,0.40)] ring-2 ring-white/10">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-[#070B1A]">
                    <img
                      src="/login-hero.jpg"
                      alt="Pulse Enterprise Portal"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
                    />
                    {/* Inner ambient vignette */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(5,8,22,0.6)] pointer-events-none" />
                  </div>
                </div>

                {/* Floating Live Telemetry Badge 1: Top-Left */}
                <div className="absolute -top-3 -left-2 sm:-left-5 rounded-2xl p-3 bg-[#0B1533]/90 backdrop-blur-xl border border-blue-400/30 shadow-2xl shadow-blue-950/80 flex items-center gap-3 transition-transform hover:scale-105">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-[#60A5FA] shadow-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>224 Active Today</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      99.2% Attendance Recorded
                    </div>
                  </div>
                </div>

                {/* Floating Live Telemetry Badge 2: Bottom-Right */}
                <div className="absolute -bottom-3 -right-2 sm:-right-5 rounded-2xl p-3 bg-[#0B1533]/90 backdrop-blur-xl border border-emerald-400/30 shadow-2xl shadow-blue-950/80 flex items-center gap-3 transition-transform hover:scale-105">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-xs">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      234 Hardware Assets
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Inventory Synced & Active
                    </div>
                  </div>
                </div>

                {/* Floating Security Badge 3: Top-Right */}
                <div className="absolute top-6 -right-2 sm:-right-4 rounded-xl px-3 py-1.5 bg-[#0B1533]/90 backdrop-blur-xl border border-white/20 shadow-lg flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span className="text-[10.5px] font-bold text-slate-200">ISO 27001 & SOC-2</span>
                </div>
              </div>

              {/* Bottom Showcase Feature Pills */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-center sm:justify-between gap-2 text-xs">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                    ✨ Smart Payroll
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                    📊 Live Attendance
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                    💻 Asset Management
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300">
                    👥 Candidate Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Caption Pill */}
            <div
              className={`mt-6 flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-semibold shadow-xs ${
                isDarkMode
                  ? 'bg-white/[0.04] backdrop-blur-md border-white/10 text-slate-300'
                  : 'bg-white/85 backdrop-blur-md border-slate-200 text-slate-700 shadow-slate-200/50'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              <span>Unified HR, Payroll, Attendance & Asset Infrastructure for Codeflies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <Modal
          isOpen={showForgotModal}
          onClose={() => setShowForgotModal(false)}
          title="Reset Your Password"
          subtitle="Enter your work email address and we'll send you a password recovery link."
          maxWidth="max-w-md"
        >
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                Work Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@codeflies.com"
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Enterprise Account Provisioning Modal */}
      {showRegisterModal && (
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Enterprise Account Provisioning"
          subtitle="Pulse by Codeflies is an enterprise management platform."
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-[#475569]">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Managed Workforce Access</p>
                <p className="mt-0.5 text-blue-700 leading-relaxed">
                  New employee accounts are provisioned directly by the Codeflies HR and Operations department.
                </p>
              </div>
            </div>
            <p>
              If you are a new team member and have not received your login credentials, please contact:
            </p>
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-medium text-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[#8292AD]">HR Desk:</span>
                <span className="font-bold text-[#2563EB]">hr@codeflies.com</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8292AD]">IT Infrastructure:</span>
                <span className="font-bold text-slate-900">ext. 10024</span>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
