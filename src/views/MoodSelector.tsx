import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { db, addDoc, collection, serverTimestamp } from '../lib/firebase';
import { MOODS, MoodType, MoodLog } from '../types';

export const MoodSelector: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [energy, setEnergy] = useState(60);
  const [isFinding, setIsFinding] = useState(false);

  const handleFindVibe = async () => {
    if (!user) return;
    setIsFinding(true);
    
    try {
      const moodLog: Partial<MoodLog> = {
        userId: user.uid,
        moodType: selectedMood,
        energyValue: energy,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'mood_logs'), moodLog);
      
      setTimeout(() => {
        navigate(`/explore?mood=${selectedMood}&energy=${energy}`);
      }, 1500);
    } catch (error) {
      console.error("Error saving mood log:", error);
      setIsFinding(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-12 relative"
    >
      <div className="space-y-2">
        <p className="font-semibold text-secondary tracking-[0.2em] text-xs uppercase">How are you feeling?</p>
        <h2 className="font-display text-4xl font-bold text-on-surface">Sync your current energy</h2>
      </div>

      <div className="relative py-8 flex flex-col items-center gap-8">
        <motion.div
          key={selectedMood}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.05, 1], opacity: 1, rotate: [0, 2, -2, 0] }}
          transition={{ 
            opacity: { duration: 0.3 },
            scale: { repeat: Infinity, duration: 4 },
            rotate: { repeat: Infinity, duration: 4 }
          }}
          className="w-48 h-48 rounded-full glass-panel flex items-center justify-center p-8 drop-shadow-[0_0_30px_rgba(208,188,255,0.3)] relative overflow-hidden"
        >
          <div className="w-full h-full relative z-10 flex items-center justify-center text-[100px]">
            {MOODS[selectedMood].icon}
          </div>
          <div className={`absolute inset-0 bg-gradient-to-tr from-transparent opacity-20 filter blur-2xl ${MOODS[selectedMood].color.replace('text-', 'bg-')}`} />
        </motion.div>

        <div className="w-full max-w-sm space-y-4">
          <div className="relative h-12 flex items-center">
            {/* The glowing "light path" behind the slider */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scaleY: [0.8, 1.1, 0.8]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full blur-sm"
              />
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="mood-slider w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 z-20 outline-none"
              style={{
                background: `linear-gradient(to right, var(--color-primary) ${energy}%, rgba(255,255,255,0.1) ${energy}%)`
              }}
            />

            {/* The Animated Glow that follows the thumb */}
            <motion.div
              initial={false}
              animate={{ left: `${energy}%` }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-10"
            >
              <div className="w-12 h-12 bg-primary rounded-full blur-2xl opacity-30 animate-pulse" />
            </motion.div>
          </div>
          
          <div className="flex justify-between text-on-surface-variant font-bold text-[10px] uppercase tracking-widest px-1">
            <span className={energy < 30 ? 'text-primary' : 'opacity-40'}>Low Vibe</span>
            <span className={energy > 70 ? 'text-secondary' : 'opacity-40'}>High Frequency</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
        {(Object.keys(MOODS) as MoodType[]).map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMood(m)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
              selectedMood === m ? 'glass-panel scale-110 glow-primary' : 'opacity-60'
            }`}
          >
            <span className="text-2xl">{MOODS[m].icon}</span>
            <span className="text-[10px] uppercase font-bold">{MOODS[m].label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleFindVibe}
        disabled={isFinding}
        className="px-12 py-4 bg-gradient-to-r from-primary to-secondary rounded-full font-display text-xl font-bold text-on-primary shadow-lg glow-primary hover:opacity-90 active:scale-95 transition-all w-full max-w-xs mx-auto"
      >
        {isFinding ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
          />
        ) : (
          'Find My Vibe'
        )}
      </button>

      <section className="pt-12 text-left space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="font-display text-2xl font-bold">Trending Moods</h3>
          <span className="text-secondary font-bold text-sm">View All</span>
        </div>
        
        <div className="space-y-4">
          {[
            { id: 1, title: 'Cyber Zen', img: 'https://picsum.photos/seed/cyber/400/225', color: 'text-secondary', tags: ['Focus', 'Digital'] },
            { id: 2, title: 'Neon Rush', img: 'https://picsum.photos/seed/neon/400/225', color: 'text-tertiary', tags: ['Energy', 'Retro'] },
          ].map(mood => (
            <div key={mood.id} className="glass-panel p-4 rounded-3xl space-y-4 group">
               <div className="h-40 rounded-2xl overflow-hidden relative bg-surface-variant/50 flex items-center justify-center">
                  <div className={`text-6xl font-bold opacity-30 ${mood.color}`}>{mood.title[0]}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               </div>
               <div className="flex justify-between items-center">
                  <div>
                    <h4 className={`text-xl font-bold ${mood.color}`}>{mood.title}</h4>
                    <div className="flex gap-2 mt-1">
                      {mood.tags.map(t => (
                        <span key={t} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  <button className="p-2 glass-panel rounded-full">
                    <motion.div whileTap={{ scale: 0.8 }}>⚡</motion.div>
                  </button>
               </div>
            </div>
          ))}
        </div>
      </section>
    </motion.section>
  );
};
