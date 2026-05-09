import React from 'react';
import { motion } from 'motion/react';

export const BackgroundAmbient: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
      {/* Animated Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 45, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-1/4 -left-1/4 w-[100%] h-[100%] bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] blur-[100px]"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.05, 0.15, 0.05],
          rotate: [0, -45, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute -bottom-1/4 -right-1/4 w-[100%] h-[100%] bg-[radial-gradient(circle_at_center,_var(--color-secondary)_0%,_transparent_70%)] blur-[100px]"
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: `${Math.random() * 100}vw`, 
            y: `${Math.random() * 100}vh`,
            opacity: 0 
          }}
          animate={{ 
            y: ['-10vh', '110vh'],
            opacity: [0, 0.3, 0],
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`]
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
        />
      ))}

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'
        }}
      />
    </div>
  );
};
