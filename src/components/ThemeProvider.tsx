'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to check if it's night time (6 PM - 6 AM)
    const checkTimeAndSetTheme = () => {
      const hour = new Date().getHours();
      const isNightTime = hour >= 18 || hour < 6; // 6 PM (18:00) to 6 AM
      
      // Update document class
      if (isNightTime) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Check immediately
    checkTimeAndSetTheme();

    // Check every minute to update theme if time changes
    const interval = setInterval(checkTimeAndSetTheme, 60000);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
