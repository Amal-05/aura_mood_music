import React from 'react';
import { motion } from 'motion/react';
import { signInWithGoogle } from '../lib/firebase';
import { Music, Zap, Sparkles, Heart } from 'lucide-react';

export const Login: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-12 text-center relative z-10"
      >
        <div className="space-y-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 5 }}
            className="w-24 h-24 bg-gradient-to-tr from-primary to-secondary rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl glow-primary"
          >
            <Music size={40} className="text-white fill-white" />
          </motion.div>
          
          <h1 className="text-6xl font-display font-black tracking-tighter text-on-surface italic">
            AURA
          </h1>
          <p className="text-on-surface-variant font-medium tracking-widest text-xs uppercase">
            Sync your soul with sound
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Zap, label: 'Mood Driven', color: 'text-tertiary' },
            { icon: Heart, label: 'Personalized', color: 'text-primary' },
            { icon: Sparkles, label: 'AI Curated', color: 'text-secondary' },
            { icon: Music, label: 'Spotify Sync', color: 'text-primary' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="glass-panel p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/5"
            >
              <feature.icon size={20} className={feature.color} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{feature.label}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            try {
              await signInWithGoogle();
            } catch (error: any) {
              console.error("Google Sign-in Error:", error);
              alert(`Sign-in failed: ${error.message}\n\nIf you are on Vercel, make sure you have added this domain to the Firebase Console -> Authentication -> Settings -> Authorized domains.`);
            }
          }}
          className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-white/90 transition-all group"
        >
          <div className="w-5 h-5 bg-black/10 rounded-full flex items-center justify-center text-xs font-bold">G</div>
          Continue with Google
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.div>
        </motion.button>

        <p className="text-[10px] text-on-surface-variant/60 font-medium">
          By continuing, you agree to Aura's Terms & Privacy Policy
        </p>
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute top-1/4 right-10 opacity-20"
      >
        <Music size={32} className="text-primary" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-10 opacity-20"
      >
        <Sparkles size={32} className="text-secondary" />
      </motion.div>
    </div>
  );
};
