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
    highResIcon: ''
  },
  calm: { 
    label: 'Calm', 
    icon: '😌', 
    color: 'text-secondary',
    highResIcon: ''
  },
  sad: { 
    label: 'Sad', 
    icon: '💔', 
    color: 'text-primary',
    highResIcon: ''
  },
  angry: { 
    label: 'Angry', 
    icon: '😡', 
    color: 'text-primary',
    highResIcon: ''
  },
  energetic: { 
    label: 'Energetic', 
    icon: '🔥', 
    color: 'text-tertiary',
    highResIcon: ''
  },
  lonely: { 
    label: 'Lonely', 
    icon: '🌧', 
    color: 'text-primary',
    highResIcon: '' 
  },
  sleepy: { 
    label: 'Sleepy', 
    icon: '😴', 
    color: 'text-secondary',
    highResIcon: ''
  },
};
