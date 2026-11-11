import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
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
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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
    <div className="min-h-screen w-full bg-white flex flex-col justify-between overflow-x-hidden font-sans">
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Login Form */}
        <div className="w-full lg:w-[48%] xl:w-[44%] 2xl:w-[40%] min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 xl:px-20 2xl:px-24 py-8 lg:py-10 bg-white z-20 flex-shrink-0">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 select-none">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center p-2 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30"
              style={{ outline: '1px solid #fff', outlineOffset: '-2px' }}
            >
              <img
                src="/logo.png"
                alt="Pulse Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <div>
              <div className="text-[19px] font-black text-[#0F172A] leading-tight tracking-tight flex items-center gap-1">
                <span>Pulse</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              </div>
              <div className="text-[9.5px] font-extrabold text-[#8292AD] tracking-[0.18em] uppercase">
                BY CODEFLIES
              </div>
            </div>
          </div>

          {/* Main Form Container */}
          <div className="my-auto py-8 max-w-[420px] w-full mx-auto lg:mx-0">
            {/* Heading & Subtitle */}
            <div className="mb-7">
              <h1 className="text-[26px] sm:text-[30px] font-black text-[#0F172A] tracking-tight leading-tight">
                Sign In to your Account
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-2 font-normal leading-relaxed">
                Welcome back! Please enter your credentials to access your dashboard.
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-[#1E293B] flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.99] cursor-pointer disabled:opacity-60 mb-6"
            >
              {/* Google colored G icon */}
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
              <span>Sign in with Google</span>
            </button>

            {/* Divider with text */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-[#EEF2F6] w-full" />
              <span className="bg-white px-3 text-[11px] font-medium text-[#94A3B8] absolute">
                or sign in with Email
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-[#1E293B] mb-1.5">
                  Email
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email or Username"
                  className="w-full px-4 h-12 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 transition-all font-medium"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#1E293B]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-[#4F46E5] hover:text-[#4338CA] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full pl-4 pr-11 h-12 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] p-1 cursor-pointer transition-colors"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-md border-slate-300 text-[#4F46E5] focus:ring-[#4F46E5]/20 cursor-pointer accent-[#4F46E5]"
                  />
                  <span className="text-xs text-[#64748B] font-medium">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>SIGN IN</span>
                  )}
                </button>
              </div>

              {/* Not Registered Link */}
              <div className="text-center pt-2">
                <p className="text-xs text-[#64748B]">
                  Not registered yet?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom Copyright */}
          <div className="text-[11px] text-[#94A3B8] pt-4">
            © 2026 Pulse by Codeflies. All rights reserved.
          </div>
        </div>

        {/* Right Side: Circular 3D Portal Illustration & Abstract Waves */}
        <div className="hidden lg:flex flex-1 h-screen bg-gradient-to-br from-[#FAFCFF] via-[#F4F6FB] to-[#EAEFF7] relative overflow-hidden items-center justify-center lg:justify-end pr-4 sm:pr-8 xl:pr-12 2xl:pr-16 select-none">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-500/12 blur-3xl pointer-events-none top-1/2 right-12 -translate-y-1/2" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none bottom-0 right-0" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-400/10 blur-3xl pointer-events-none top-0 right-20" />

          {/* The Hero Circular Portal Illustration - Properly constrained so entire circle, character & all 6 icons are 100% visible */}
          <div className="relative z-10 flex items-center justify-center">
            {/* The Outer Circular Crop with Premium Soft Drop Shadows */}
            <div className="w-[min(88vh,92%)] h-[min(88vh,92%)] aspect-square max-w-[820px] max-h-[820px] rounded-full p-2 bg-gradient-to-tr from-blue-500/25 via-indigo-500/15 to-cyan-400/30 shadow-[0_25px_80px_rgba(15,23,42,0.22)] backdrop-blur-xs flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-white/80 shadow-[0_20px_60px_rgba(37,99,235,0.25)] relative group bg-[#0A102A]">
                <img
                  src="/login-hero.jpg"
                  alt="Pulse by Codeflies Portal"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Abstract Layered Curved Wave Ribbons in Bottom Right Corner (Matching Reference Image) */}
          <div className="absolute -bottom-8 -right-8 w-[380px] h-[380px] xl:w-[460px] xl:h-[460px] pointer-events-none z-0">
            <svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M400 120 C280 120 180 220 180 340 C180 365 185 385 195 400 L400 400 Z"
                fill="#CBD5E1"
                fillOpacity="0.30"
              />
              <path
                d="M400 190 C310 190 240 260 240 350 C240 370 245 388 255 400 L400 400 Z"
                fill="#94A3B8"
                fillOpacity="0.22"
              />
              <path
                d="M400 260 C340 260 295 305 295 365 C295 380 300 392 308 400 L400 400 Z"
                fill="#64748B"
                fillOpacity="0.16"
              />
              <path
                d="M400 50 C240 70 110 200 110 360 C110 375 112 388 116 400 L155 400 C150 388 148 375 148 360 C148 220 255 105 400 85 Z"
                fill="#94A3B8"
                fillOpacity="0.14"
              />
            </svg>
          </div>

          {/* Abstract Subtle Soft Wave in Top Right Corner */}
          <div className="absolute -top-12 -right-12 w-[300px] h-[300px] xl:w-[380px] xl:h-[380px] pointer-events-none z-0">
            <svg
              viewBox="0 0 300 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M300 0 L300 220 C220 220 160 160 160 80 C160 40 175 10 190 0 Z"
                fill="#CBD5E1"
                fillOpacity="0.20"
              />
              <path
                d="M300 0 L300 140 C250 140 210 100 210 50 C210 20 220 5 230 0 Z"
                fill="#94A3B8"
                fillOpacity="0.15"
              />
            </svg>
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
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@pulsehr.com"
                className="w-full px-4 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 bg-white"
              />
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
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-sm cursor-pointer"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Register Account Modal */}
      {showRegisterModal && (
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Enterprise Account Provisioning"
          subtitle="Pulse by Codeflies is an enterprise management platform."
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-[#475569]">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Managed Workforce Access</p>
                <p className="mt-0.5 text-blue-700">
                  New employee accounts are provisioned directly by the Codeflies HR and Operations department.
                </p>
              </div>
            </div>
            <p>
              If you are a new team member and have not received your login credentials, please contact:
            </p>
            <div className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-medium text-slate-800 space-y-1">
              <div>Email: <span className="font-bold text-[#2563EB]">hr@codeflies.com</span></div>
              <div>IT Support: <span className="font-bold text-slate-900">ext. 10024</span></div>
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
