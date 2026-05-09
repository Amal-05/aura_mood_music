import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Music, History, Download, HelpCircle, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  const handleNav = (to: string) => {
    navigate(to);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 z-[70] glass-panel border-r border-white/10 shadow-2xl flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                  <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="User" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-primary">{user?.displayName || 'Adventurer'}</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Explorer Level 12</p>
                </div>
              </div>
              <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              <DrawerItem icon={Settings} label="Settings" onClick={() => handleNav('/settings')} />
              <DrawerItem icon={Music} label="Audio Quality" />
              <DrawerItem icon={History} label="Mood History" onClick={() => handleNav('/journey')} />
              <DrawerItem icon={Download} label="Offline Mode" />
              <DrawerItem icon={HelpCircle} label="Help" />
            </nav>

            <button 
              onClick={() => auth.signOut()}
              className="mt-auto flex items-center gap-4 p-4 text-on-surface-variant hover:bg-white/5 rounded-2xl transition-colors w-full"
            >
              <LogOut size={20} className="text-red-400" />
              <span className="font-bold">Log Out</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const DrawerItem: React.FC<{ icon: any; label: string; onClick?: () => void }> = ({ icon: Icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 text-on-surface-variant hover:bg-white/5 rounded-2xl transition-colors active:translate-x-1"
  >
    <Icon size={20} className="text-secondary" />
    <span className="font-bold">{label}</span>
  </button>
);
