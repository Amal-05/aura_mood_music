import React from 'react';
import { NavLink } from 'react-router-dom';
import { Smile, Sparkles, Activity, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Smile, label: 'Mood' },
    { to: '/explore', icon: Sparkles, label: 'Explore' },
    { to: '/journey', icon: Activity, label: 'Journey' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl backdrop-blur-3xl bg-surface-container/30 border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] px-6 pt-3 pb-8 flex justify-around items-center">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 transition-all duration-300 ease-out active:scale-90",
              isActive ? "text-secondary drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]" : "text-on-surface-variant/60 hover:text-secondary/80"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
