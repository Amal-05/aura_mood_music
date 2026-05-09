import React from 'react';
import { Menu, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-surface/10 border-b border-white/20 shadow-[0_0_20px_rgba(208,188,255,0.1)] flex justify-between items-center px-5 h-16">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-display text-2xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          AURA
        </h1>
      </div>
      <button 
        onClick={() => navigate('/profile')}
        className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200"
      >
        <UserCircle size={28} />
      </button>
      </header>
    );
};
