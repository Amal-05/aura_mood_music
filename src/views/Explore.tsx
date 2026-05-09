import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { getMoodMusicRecs, PlaylistSuggestion } from '../lib/gemini';
import { MOODS, MoodType } from '../types';
import { Play, Bookmark, Heart, Shuffle } from 'lucide-react';

export const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mood = searchParams.get('mood') as MoodType || 'energetic';
  const energy = parseInt(searchParams.get('energy') || '60');
  
  const [playlists, setPlaylists] = useState<PlaylistSuggestion[]>([]);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);

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
      className="space-y-8 pb-12"
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
              <div className="relative aspect-video">
                <img src={playlist.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <div className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-xl">
                  <Play size={18} className="text-secondary fill-secondary" />
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-display font-bold leading-tight">{playlist.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Source: {playlist.source}</p>
                  </div>
                  <button className="text-on-surface-variant hover:text-primary transition-colors">
                    <Heart size={20} />
                  </button>
                </div>

                <p className="text-sm text-on-surface-variant line-clamp-2">{playlist.description}</p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => window.open(playlist.searchUrl, '_blank')}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform text-on-primary shadow-lg"
                  >
                    <Play size={18} className="fill-on-primary" />
                    Quick Play
                  </button>
                  <button className="p-3 glass-panel rounded-xl hover:bg-white/10 transition-colors">
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="glass-panel p-8 rounded-3xl space-y-4">
        <h4 className="text-xl font-bold flex items-center gap-2">
          Fine-tune Energy
          <Shuffle size={18} className="text-primary" />
        </h4>
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
