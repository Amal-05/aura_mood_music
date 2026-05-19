import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { getMoodMusicRecs, PlaylistSuggestion } from '../lib/gemini';
import { MoodType } from '../types';
import { Play, Shuffle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mood = searchParams.get('mood') as MoodType || 'energetic';
  const energy = parseInt(searchParams.get('energy') || '60');
  
  const [playlists, setPlaylists] = useState<PlaylistSuggestion[]>([]);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const { setPlayingTrack, setIsFullScreen } = usePlayer();

  // Stable SoundCloud sets for moods
  const MOOD_SOUNDCLOUD: Record<string, string> = {
    happy: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1253451556&color=%234cd7f6&auto_play=true',
    calm: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1253448835&color=%234cd7f6&auto_play=true',
    melancholy: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1301017042&color=%234cd7f6&auto_play=true',
    energetic: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/219920150&color=%234cd7f6&auto_play=true'
  };

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      const data = await getMoodMusicRecs(mood, energy);
      setPlaylists(data.playlists);
      setQuote(data.quote);
      setLoading(false);
    };
    fetchRecs();
  }, [mood, energy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-8">
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 180, 360],
             borderRadius: ["20%", "50%", "20%"]
           }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary"
        />
        <p className="text-on-surface-variant font-medium animate-pulse">Syncing with the digital ether...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-32"
    >
      {quote && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-on-surface-variant font-medium tracking-wider text-xs uppercase mb-3">Today's Aura</p>
          <h3 className="text-xl font-display font-medium italic text-on-surface leading-relaxed">
            "{quote}"
          </h3>
        </motion.div>
      )}

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-display font-bold">Curated Journeys</h2>
          <div className="h-[2px] flex-grow bg-gradient-to-r from-secondary/30 to-transparent"></div>
        </div>

        <div className="space-y-6">
          {playlists.map((playlist, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel overflow-hidden rounded-3xl group"
            >
              <div className="relative aspect-video bg-surface-variant/30 flex items-center justify-center overflow-hidden">
                <div className="text-6xl opacity-10 group-hover:scale-110 transition-transform duration-700">🎵</div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-xl font-bold mb-1">{playlist.title}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-1">{playlist.description}</p>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const url = MOOD_SOUNDCLOUD[mood];
                      setPlayingTrack({ title: playlist.title, url });
                      setIsFullScreen(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-on-primary shadow-lg"
                  >
                    <Play size={18} className="fill-on-primary" />
                    Internal Play
                  </button>
                  <button 
                    onClick={() => window.open(`https://open.spotify.com/search/${playlist.title}`, '_blank')}
                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                  >
                    <Shuffle size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Energy Level Context */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
         <div className="flex justify-between items-center">
            <h4 className="font-bold">Aura Intensity</h4>
            <span className="text-primary font-mono">{energy}%</span>
         </div>
         <div className="relative h-2 w-full bg-white/10 rounded-full">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_12px_rgba(76,215,246,0.6)]"
              style={{ width: `${energy}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-secondary shadow-[0_0_15px_rgba(76,215,246,1)]"
              style={{ left: `${energy}%`, transform: 'translate(-50%, -50%)' }}
            />
         </div>
         <div className="flex justify-between text-xs text-on-surface-variant font-bold">
            <span>Melancholy</span>
            <span>Energetic</span>
         </div>
      </div>
    </motion.div>
  );
};
