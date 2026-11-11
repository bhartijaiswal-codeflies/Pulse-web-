import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './NotificationContext';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Current default is 'dark' as requested: "current is dark, on light mode on the sidebar color will be light"
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('pulse_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('pulse_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (showNotification = true) => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (showNotification) {
        addToast({
          title: next === 'light' ? 'Light Mode Activated ☀️' : 'Dark Mode Activated 🌙',
          message: next === 'light'
            ? 'Sidebar and navigation switched to light theme.'
            : 'Sidebar and navigation switched to dark theme.',
          type: 'info',
        });
      }
      return next;
    });
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isLight: theme === 'light',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
