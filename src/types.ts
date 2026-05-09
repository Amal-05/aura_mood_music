import { Timestamp } from './lib/firebase';

export type MoodType = 'happy' | 'calm' | 'sad' | 'angry' | 'energetic' | 'lonely' | 'sleepy';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  level: number;
  streak: number;
  totalListeningMinutes: number;
  harmonyScore: number;
  lastActiveAt?: string;
}

export interface PlaylistData {
  title: string;
  source: string;
  tracks: number;
  coverUrl: string;
}

export interface MoodLog {
  id?: string;
  userId: string;
  moodType: MoodType;
  energyValue: number;
  note?: string;
  playlist?: PlaylistData;
  createdAt: Timestamp | Date;
}

export const MOODS: Record<MoodType, { label: string; icon: string; color: string; highResIcon: string }> = {
  happy: { 
    label: 'Happy', 
    icon: '😊', 
    color: 'text-tertiary',
    highResIcon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60a/512.webp'
  },
  calm: { 
    label: 'Calm', 
    icon: '😌', 
    color: 'text-secondary',
    highResIcon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f60c/512.webp'
  },
  sad: { 
    label: 'Sad', 
    icon: '💔', 
    color: 'text-primary',
    highResIcon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f494/512.webp'
  },
  angry: { 
    label: 'Angry', 
    icon: '😡', 
    color: 'text-primary',
    highResIcon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f621/512.webp'
  },
  energetic: { 
    label: 'Energetic', 
    icon: '🔥', 
    color: 'text-tertiary',
    highResIcon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp'
  },
  lonely: { 
    label: 'Lonely', 
    icon: '🌧', 
    color: 'text-primary',
    highResIcon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f327_fe0f/512.webp' 
  },
  sleepy: { 
    label: 'Sleepy', 
    icon: '😴', 
    color: 'text-secondary',
    highResIcon: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f634/512.webp'
  },
};
