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
  duration: number;
  iframeRef: React.RefObject<HTMLIFrameElement>;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ((window as any).SC && iframeRef.current) {
      const widget = (window as any).SC.Widget(iframeRef.current);
      widget.toggle();
      setIsPlaying(!isPlaying);
    }
  };

  const seekTo = (time: number) => {
    if ((window as any).SC && iframeRef.current) {
      const widget = (window as any).SC.Widget(iframeRef.current);
      widget.seekTo(time);
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    let interval: any;
    if (playingTrack && (window as any).SC) {
      interval = setInterval(() => {
        const widget = (window as any).SC.Widget(iframeRef.current);
        widget.getPosition((pos: number) => setCurrentTime(pos));
        widget.getDuration((dur: number) => setDuration(dur));
        widget.isPaused((paused: boolean) => setIsPlaying(!paused));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playingTrack]);

  return (
    <PlayerContext.Provider value={{
      playingTrack, setPlayingTrack,
      isPlaying, setIsPlaying,
      isFullScreen, setIsFullScreen,
      currentTime, duration,
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
