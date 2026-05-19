import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface PlayingTrack {
  title: string;
  url: string;
  cover?: string;
}

interface PlayerContextType {
  playingTrack: PlayingTrack | null;
  setPlayingTrack: (track: PlayingTrack | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isFullScreen: boolean;
  setIsFullScreen: (full: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (time: number) => void;
  iframeRef: React.RefObject<any>;
  togglePlay: (e?: React.MouseEvent) => void;
  seekTo: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playingTrack, setPlayingTrack] = useState<PlayingTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const iframeRef = useRef<any>(null); // This is now used for ReactPlayer

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
    if (iframeRef.current) {
      iframeRef.current.seekTo(time / 1000);
    }
  };

  return (
    <PlayerContext.Provider value={{
      playingTrack, setPlayingTrack,
      isPlaying, setIsPlaying,
      isFullScreen, setIsFullScreen,
      currentTime, setCurrentTime, duration, setDuration,
      iframeRef, togglePlay, seekTo
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
