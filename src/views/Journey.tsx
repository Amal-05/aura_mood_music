import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../App';
import { db, collection, query, where, orderBy, limit, onSnapshot } from '../lib/firebase';
import { MoodLog, MOODS } from '../types';
import { Calendar, Clock, BarChart3 } from 'lucide-react';

export const Journey: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'mood_logs'),
      where('userId', '==', user.uid),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, {
      next: (snapshot) => {
        const logsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MoodLog[];
        
        // Sort by date in JavaScript with safety for null/pending server timestamps
        const sortedLogs = [...logsData].sort((a, b) => {
          const getTime = (val: any) => {
            if (!val) return Date.now(); // Put pending logs at the top
            if (val instanceof Date) return val.getTime();
            if (typeof val.toDate === 'function') return val.toDate().getTime();
            if (typeof val === 'string') return new Date(val).getTime();
            if (typeof val === 'number') return val;
            return 0;
          };
          return getTime(b.createdAt) - getTime(a.createdAt);
        });

        setLogs(sortedLogs.slice(0, 10));
        setLoading(false);
      },
      error: (error) => {
        console.error("Firestore Journey Error:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-8">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
           className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
        <p className="text-on-surface-variant font-medium animate-pulse">Reliving your journey...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold">Vibe Analytics</h2>
            <p className="text-on-surface-variant text-sm">Your recent mood patterns.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-display font-black text-primary">
              {logs.length > 0 ? Math.round(logs.reduce((acc, curr) => acc + (curr.energyValue || 0), 0) / logs.length) : 0}%
            </span>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none">Avg Energy</p>
          </div>
        </div>

        <div className="h-32 w-full flex items-end gap-2 px-1">
          {logs.slice(0, 7).reverse().map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ height: 0 }}
              animate={{ height: `${log.energyValue}%` }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className={`flex-1 rounded-t-xl transition-colors ${i === logs.length - 1 ? 'bg-secondary glow-secondary' : 'bg-primary/20 hover:bg-primary/40'}`}
            />
          ))}
          {logs.length === 0 && <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40 text-xs italic">No data yet. Start tracking!</div>}
        </div>
        <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold opacity-60">
           <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
        </div>
        
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
      </div>

      <div className="space-y-6 relative">
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent opacity-20" />
        
        {logs.map((log, idx) => {
          const moodInfo = MOODS[log.moodType] || { label: 'Unknown', color: 'text-primary', icon: '✨', highResIcon: '' };
          const getSafeDate = (val: any) => {
            if (!val) return new Date();
            if (val instanceof Date) return val;
            if (typeof val.toDate === 'function') return val.toDate();
            return new Date(val);
          };
          const date = getSafeDate(log.createdAt);
          
          return (
            <motion.div 
              key={log.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex gap-6"
            >
              <div className="relative z-10 w-12 h-12 rounded-full glass-panel flex items-center justify-center border border-white/20 shadow-xl overflow-hidden">
                 <span className="text-2xl">{moodInfo.icon}</span>
              </div>
              <div className="flex-1 glass-panel rounded-3xl p-5 space-y-3">
                 <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${moodInfo.color}`}>{date.toLocaleDateString()}</p>
                      <h3 className="text-lg font-bold capitalize">{log.moodType} & {log.energyValue > 50 ? 'High' : 'Low'} Energy</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <Clock size={10} />
                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
                 <p className="text-sm text-on-surface-variant leading-relaxed">
                   You felt {log.moodType} with an energy level of {log.energyValue}%. 
                   {log.energyValue > 70 ? " You were feeling quite vibrant!" : log.energyValue < 30 ? " A mellow moment for reflection." : " A balanced state of being."}
                 </p>
                 <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                   <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Music size={20} className="text-primary" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold truncate">Synced Selection</p>
                      <p className="text-[10px] text-on-surface-variant truncate">Personalized for this mood</p>
                   </div>
                   <div className="w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                   </div>
                 </div>
              </div>
            </motion.div>
          );
        })}

        {logs.length === 0 && (
          <div className="text-center py-20 opacity-40">
            <Calendar size={48} className="mx-auto mb-4" />
            <p>Your journey begins with your first mood log.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
