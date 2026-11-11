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
} from 'lucide-react';
import { useToast } from '../context/NotificationContext';
import { Modal } from '../components/common/Modal';

export const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

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
    <div className="min-h-screen w-full bg-[#060913] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans relative selection:bg-blue-600 selection:text-white">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="flex-1 flex flex-col lg:flex-row min-h-screen relative z-10">
        {/* ========================================================================= */}
        {/* Left Side: Modern Executive Login Form                                    */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-[48%] xl:w-[45%] 2xl:w-[42%] min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 xl:px-20 py-8 lg:py-10 bg-[#070B18]/90 backdrop-blur-2xl border-r border-white/5 z-20 flex-shrink-0">
          {/* Top Brand Logo & Status */}
          <div className="flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-[#3B82F6] to-[#60A5FA] flex items-center justify-center p-2 shadow-lg shadow-blue-500/30 ring-1 ring-white/30">
                  <img
                    src="/logo.png"
                    alt="Pulse Logo"
                    className="w-full h-full object-contain brightness-0 invert"
                  />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#070B18] animate-pulse" />
              </div>
              <div>
                <div className="text-[20px] font-black text-white leading-tight tracking-tight flex items-center gap-1.5">
                  <span>Pulse</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                </div>
                <div className="text-[10px] font-extrabold text-[#60A5FA] tracking-[0.2em] uppercase">
                  BY CODEFLIES
                </div>
              </div>
            </div>

            {/* Enterprise Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-medium text-slate-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise SSO</span>
            </div>
          </div>

          {/* Main Form Center Box */}
          <div className="my-auto py-8 max-w-[430px] w-full mx-auto">
            {/* Heading & Subtitle */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-[#60A5FA] text-[11px] font-semibold mb-3">
                <Sparkles className="w-3 h-3" />
                <span>Workforce Operating System</span>
              </div>
              <h1 className="text-[28px] sm:text-[32px] font-black text-white tracking-tight leading-tight">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal leading-relaxed">
                Enter your credentials to access your organization dashboard.
              </p>
            </div>

            {/* 1-Click Demo Account Quick Fill */}
            <div className="mb-6 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-[#60A5FA]" />
                  <span>1-Click Demo Login</span>
                </span>
                <span className="text-[10px] text-slate-500">Auto-fill credentials</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((acc) => {
                  const isActive = selectedRole === acc.role;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleSelectDemoAccount(acc)}
                      className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-500/60 text-white shadow-xs ring-1 ring-blue-500/30'
                          : 'bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                      }`}
                    >
                      <div className="text-[11px] font-bold truncate flex items-center gap-1">
                        <span>{acc.role}</span>
                        {isActive && <CheckCircle2 className="w-3 h-3 text-blue-400 ml-auto flex-shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{acc.name}</div>
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
              className="w-full h-12 rounded-xl border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-60 mb-5"
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
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#070B18] px-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider absolute">
                or sign in with email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@codeflies.com"
                    className="w-full pl-10 pr-4 h-12 text-xs sm:text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-[#0E1528] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-[#60A5FA] hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-11 h-12 text-xs sm:text-sm bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:bg-[#0E1528] focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
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
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-white/20 bg-white/5 text-[#2563EB] focus:ring-blue-500/20 cursor-pointer accent-[#2563EB]"
                  />
                  <span className="text-xs text-slate-400 font-medium">
                    Keep me logged in for 30 days
                  </span>
                </label>
              </div>

              {/* Sign In Primary Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN TO DASHBOARD</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Register Notice */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400">
                  New team member without an account?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="font-bold text-[#60A5FA] hover:text-blue-300 hover:underline cursor-pointer"
                  >
                    Request Provisioning
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom Trust & Copyright */}
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <div>© 2026 Pulse by Codeflies. All rights reserved.</div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Side: Futuristic 3D Portal Showcase with Floating Live Badges       */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex flex-1 min-h-screen bg-gradient-to-br from-[#060913] via-[#0A1024] to-[#040711] relative overflow-hidden items-center justify-center p-8 select-none">
          {/* Ambient Radial Colored Nebulas */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none top-1/4 right-1/4" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-400/15 blur-[120px] pointer-events-none bottom-10 left-10" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none -top-10 left-1/3" />

          {/* Centerpiece Showcase Container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Main Circular Portal with Multi-layered Glowing Ring */}
            <div className="relative w-[460px] h-[460px] xl:w-[540px] xl:h-[540px] 2xl:w-[600px] 2xl:h-[600px] flex items-center justify-center">
              {/* Outer Pulse Rings */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-25" />
              <div className="absolute -inset-4 rounded-full border border-cyan-400/20 animate-pulse" />

              {/* Portal Framing Circle with Ambient Shadow */}
              <div className="w-full h-full rounded-full p-2.5 bg-gradient-to-tr from-cyan-400/40 via-blue-600/30 to-indigo-500/40 shadow-[0_0_90px_rgba(37,99,235,0.35)] ring-1 ring-white/20">
                <div className="w-full h-full rounded-full overflow-hidden relative group bg-[#0A102A]">
                  <img
                    src="/login-hero.jpg"
                    alt="Pulse Portal"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                  />
                  {/* Subtle inner vignette */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_60px_rgba(5,8,22,0.6)] pointer-events-none" />
                </div>
              </div>

              {/* Floating Live Badge 1: Active Workforce (Top-Left) */}
              <div className="absolute -top-3 -left-6 z-20 bg-[#0A1128]/85 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-2xl shadow-blue-950/60 flex items-center gap-3 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-[#60A5FA]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>224 Active Today</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">99.2% Attendance Recorded</div>
                </div>
              </div>

              {/* Floating Live Badge 2: Hardware Assets (Bottom-Right) */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-[#0A1128]/85 backdrop-blur-xl border border-white/15 rounded-2xl p-3.5 shadow-2xl shadow-blue-950/60 flex items-center gap-3 transition-transform hover:scale-105">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">234 Hardware Assets</div>
                  <div className="text-[10px] text-slate-400 font-medium">Inventory Synced & Active</div>
                </div>
              </div>

              {/* Floating Live Badge 3: Corporate Security (Top-Right) */}
              <div className="absolute top-10 -right-6 z-20 bg-[#0A1128]/85 backdrop-blur-xl border border-white/15 rounded-2xl px-3.5 py-2.5 shadow-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-bold text-white">SOC-2 Type II Verified</span>
              </div>
            </div>

            {/* Bottom Caption Pill */}
            <div className="mt-8 flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 text-xs text-slate-300 shadow-lg">
              <Building2 className="w-4 h-4 text-[#60A5FA]" />
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
