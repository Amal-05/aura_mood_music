import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Moon, Volume2, Shield, Bell, HelpCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({
    darkMode: true,
    hifi: true,
    notifications: true,
    incognito: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 glass-panel rounded-xl text-primary active:scale-90 transition-transform"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-2xl font-display font-bold">Preferences</h2>
      </div>

      <section className="space-y-4">
        <div className="glass-panel p-1 rounded-3xl overflow-hidden">
          <SettingItem 
            icon={Moon} 
            label="Dark Mode" 
            active={toggles.darkMode} 
            onClick={() => setToggles({...toggles, darkMode: !toggles.darkMode})}
          />
          <SettingItem 
            icon={Volume2} 
            label="High Fidelity Audio" 
            active={toggles.hifi} 
            onClick={() => setToggles({...toggles, hifi: !toggles.hifi})}
          />
          <SettingItem 
            icon={Bell} 
            label="Mood Reminders" 
            active={toggles.notifications} 
            onClick={() => setToggles({...toggles, notifications: !toggles.notifications})}
          />
          <SettingItem 
            icon={Shield} 
            label="Incognito VSync" 
            active={toggles.incognito} 
            onClick={() => setToggles({...toggles, incognito: !toggles.incognito})}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold px-2">Support</h3>
        <div className="glass-panel p-1 rounded-3xl">
          <button className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <HelpCircle size={20} />
              <span className="font-bold">Help Center</span>
            </div>
          </button>
        </div>
      </section>

      <div className="text-center pt-8">
        <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-[0.3em] font-black italic">
          AURA v1.0.42 • Pure Energy
        </p>
      </div>
    </motion.div>
  );
};

const SettingItem: React.FC<{ 
  icon: any; 
  label: string; 
  active: boolean;
  onClick: () => void 
}> = ({ icon: Icon, label, active, onClick }) => (
  <div className="flex items-center justify-between p-5 border-b border-white/5 last:border-0">
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${active ? 'bg-primary/20 text-primary' : 'bg-white/5 text-on-surface-variant'}`}>
        <Icon size={20} />
      </div>
      <span className="font-bold text-on-surface">{label}</span>
    </div>
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-secondary' : 'bg-surface-container-highest'}`}
    >
      <motion.div 
        animate={{ x: active ? 26 : 4 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
      />
    </button>
  </div>
);
