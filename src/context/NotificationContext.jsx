import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'success', duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Container: centered safe bounds on mobile, bottom-right on desktop */}
      <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:bottom-5 sm:right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm sm:w-full mx-auto sm:mx-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-xl shadow-xl sm:shadow-lg border transition-all transform duration-300 animate-fade-in w-full ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-[#172033]'
                : toast.type === 'error'
                ? 'bg-white border-red-200 text-[#172033]'
                : toast.type === 'info'
                ? 'bg-white border-blue-200 text-[#172033]'
                : 'bg-white border-amber-200 text-[#172033]'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-500'
                  : toast.type === 'error'
                  ? 'bg-rose-500'
                  : toast.type === 'info'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate">{toast.title}</h4>
              {toast.message && <p className="text-xs text-[#8292AD] mt-0.5 line-clamp-2">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8292AD] hover:text-[#172033] text-sm leading-none p-1 cursor-pointer flex-shrink-0"
              aria-label="Dismiss toast"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useToast must be used within a NotificationProvider');
  }
  return context;
};

