import React from 'react';
import { useAuth } from '../App';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Flame, Clock, Zap, Award, Settings, History, ChevronRight } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-primary via-secondary to-tertiary glow-primary">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface shadow-inner bg-surface-variant flex items-center justify-center text-4xl font-bold">
               {profile?.displayName?.[0] || 'A'}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface shadow-lg">
             <Award size={16} />
          </div>
        </div>
        <div className="text-center">
           <h2 className="text-3xl font-display font-black">{profile?.displayName || 'Adventurer'}</h2>
           <p className="text-sm text-on-surface-variant font-medium">Level {profile?.level || 1}</p>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 glass-panel rounded-3xl p-6 flex flex-col items-center justify-center space-y-2 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-center gap-2">
             <Flame size={40} className="text-tertiary fill-tertiary drop-shadow-[0_0_12px_rgba(255,185,95,0.8)]" />
             <span className="text-5xl font-display font-black text-tertiary">{profile?.streak || 0}</span>
           </div>
           <h3 className="text-xl font-bold">Day Vibe Streak!</h3>
           <p className="text-xs text-on-surface-variant">You're on fire this week.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-4">
           <Clock size={24} className="text-secondary" />
           <div>
              <p className="text-2xl font-display font-black leading-none">{profile?.totalListeningMinutes || '0h'}</p>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1">Listening Time</p>
           </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-4">
           <Zap size={24} className="text-primary" />
           <div>
              <p className="text-2xl font-display font-black leading-none">{profile?.harmonyScore || 0}</p>
              <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1">Moods Explored</p>
           </div>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-bold px-1">Quick Actions</h3>
        <div className="space-y-2">
          {[
            { icon: Settings, label: 'Settings', color: 'text-primary', onClick: () => navigate('/settings') },
            { icon: History, label: 'Mood History', color: 'text-secondary', onClick: () => navigate('/journey') },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={item.onClick}
              className="w-full flex items-center justify-between glass-panel p-5 rounded-2xl group active:scale-[0.98] transition-transform"
            >
               <div className="flex items-center gap-4">
                 <item.icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
                 <span className="font-bold">{item.label}</span>
               </div>
               <ChevronRight size={18} className="text-on-surface-variant" />
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
