import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, auth, type FirebaseUser, db } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { TopBar } from './components/TopBar';
import { Drawer } from './components/Drawer';
import { BottomNav } from './components/BottomNav';
import { BackgroundAmbient } from './components/BackgroundAmbient';
import { MoodSelector } from './views/MoodSelector';
import { Explore } from './views/Explore';
import { Journey } from './views/Journey';
import { Profile } from './views/Profile';
import { Settings } from './views/Settings';
import { Login } from './views/Login';
import { UserProfile } from './types';
import { motion, AnimatePresence } from 'motion/react';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

import { PlayerProvider } from './context/PlayerContext';
import { AudioPlayer } from './components/AudioPlayer';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Explorer',
            photoURL: user.photoURL || '',
            level: 1,
            streak: 0,
            totalListeningMinutes: 0,
            harmonyScore: 0,
            lastActiveAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-surface">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl font-display font-black text-primary"
        >
          AURA
        </motion.div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      <PlayerProvider>
        <Router>
          <div className="min-h-screen pb-32">
            <BackgroundAmbient />
            <TopBar onMenuClick={() => setIsMenuOpen(true)} />
            <Drawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />
            <AnimatePresence mode="wait">
              {!user ? (
                <Login key="login" />
              ) : (
                <main className="pt-24 px-5 max-w-4xl mx-auto">
                  <Routes>
                    <Route path="/" element={<MoodSelector />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/journey" element={<Journey />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              )}
            </AnimatePresence>
            <AudioPlayer />
            <BottomNav />
          </div>
        </Router>
      </PlayerProvider>
    </AuthContext.Provider>
  );
}
