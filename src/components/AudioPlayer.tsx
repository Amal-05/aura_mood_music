import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Repeat, Heart, Shuffle, Volume2, ChevronDown, Activity, Music } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const { 
    playingTrack, setPlayingTrack, 
    isPlaying, isFullScreen, setIsFullScreen, 
    currentTime, duration, 
    iframeRef, togglePlay, seekTo 
  } = usePlayer();

  if (!playingTrack) return null;

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Full-Screen Player Overlay */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-surface flex flex-col p-8 pt-12 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-surface to-surface" />
            
            <button 
              onClick={() => setIsFullScreen(false)}
              className="relative z-10 w-12 h-12 rounded-full glass-panel flex items-center justify-center mb-12 self-center hover:bg-white/10 transition-colors"
            >
              <ChevronDown size={24} />
            </button>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center space-y-12">
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="w-64 h-64 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-2xl relative flex items-center justify-center group"
              >
                <div className="absolute inset-4 rounded-full border-4 border-white/20 border-dashed" />
                <div className="w-12 h-12 bg-surface rounded-full border-4 border-white/30 relative z-20" />
                <Activity size={80} className="text-white/40 absolute" />
              </motion.div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold leading-tight">{playingTrack.title}</h2>
                <p className="text-primary font-bold tracking-widest uppercase text-sm">Aura Internal Engine</p>
              </div>

              <div className="w-full space-y-2">
                <input 
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seekTo(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs font-mono text-on-surface-variant">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <button className="text-on-surface-variant hover:text-white transition-colors">
                  <SkipBack size={32} />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-xl active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause size={36} className="text-white fill-white" />
                  ) : (
                    <Play size={36} className="text-white fill-white ml-2" />
                  )}
                </button>
                <button className="text-on-surface-variant hover:text-white transition-colors">
                  <SkipForward size={32} />
                </button>
              </div>

              <div className="flex justify-between w-full pt-8">
                <Repeat size={20} className="text-on-surface-variant" />
                <div className="flex gap-8">
                   <Heart size={20} className="text-on-surface-variant" />
                   <Shuffle size={20} className="text-on-surface-variant" />
                </div>
                <Volume2 size={20} className="text-on-surface-variant" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Player Bar */}
      <AnimatePresence>
        {!isFullScreen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsFullScreen(true)}
            className="fixed bottom-24 left-5 right-5 z-50 glass-panel p-5 rounded-3xl border-t border-white/20 shadow-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-5">
              <button 
                onClick={togglePlay}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                {isPlaying ? (
                  <Pause size={28} className="text-white fill-white relative z-10" />
                ) : (
                  <Play size={28} className="text-white fill-white ml-1 relative z-10" />
                )}
                {isPlaying && (
                   <motion.div 
                     animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                     className="absolute inset-0 bg-white rounded-full blur-xl"
                   />
                )}
              </button>

              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5 items-end h-3">
                    {[1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        animate={isPlaying ? { height: ['40%', '100%', '40%'] } : { height: '20%' }}
                        transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1), ease: 'easeInOut' }}
                        className="w-1 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {isPlaying ? 'Now Syncing' : 'Aura Paused'}
                  </p>
                </div>
                <h4 className="font-bold text-lg truncate leading-none mb-1">{playingTrack.title}</h4>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <Music size={12} /> SoundCloud Engine
                </p>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setPlayingTrack(null);
                }}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Audio Engine (SoundCloud) */}
      <div className="absolute left-[-9999px] top-0 pointer-events-none opacity-0">
        <iframe
          ref={iframeRef}
          width="100"
          height="100"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={playingTrack.url}
        />
      </div>
    </>
  );
};
