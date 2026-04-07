import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  // Initialize state based on the 'dark' class presence or local storage
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('electrum-theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default to dark mode
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('electrum-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('electrum-theme', 'light');
    }
  }, [dark]);

  return (
    <button 
      onClick={() => setDark(!dark)} 
      className="p-2 rounded-md hover:bg-secondary transition text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
};

export default ThemeToggle;