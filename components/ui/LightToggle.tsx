'use client';

import { useStore } from '@/store/useStore';
import { Lightbulb, LightbulbOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LightToggle() {
  const lightsOn = useStore((state) => state.lightsOn);
  const setLightsOn = useStore((state) => state.setLightsOn);

  const toggleLights = () => {
    setLightsOn(!lightsOn);
  };

  return (
    <motion.button
      onClick={toggleLights}
      className={`
        fixed top-24 right-8 z-50
        flex items-center gap-2
        px-4 py-3 rounded-full
        backdrop-blur-md
        border transition-all duration-300
        hover:scale-105 active:scale-95
        ${lightsOn 
          ? 'bg-yellow-500/20 dark:bg-yellow-500/30 border-yellow-500/50 dark:border-yellow-500/60 text-yellow-300 dark:text-yellow-200 hover:bg-yellow-500/30 dark:hover:bg-yellow-500/40' 
          : 'bg-gray-800/80 dark:bg-gray-700/80 border-gray-600/50 dark:border-gray-500/50 text-gray-400 dark:text-gray-300 hover:bg-gray-700/80 dark:hover:bg-gray-600/80'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={lightsOn ? 'Turn lights off' : 'Turn lights on'}
      title={lightsOn ? 'Turn lights off' : 'Turn lights on'}
    >
      {lightsOn ? (
        <>
          <Lightbulb size={20} className="animate-pulse" />
          <span className="text-sm font-medium hidden sm:inline">Lights On</span>
        </>
      ) : (
        <>
          <LightbulbOff size={20} />
          <span className="text-sm font-medium hidden sm:inline">Lights Off</span>
        </>
      )}
    </motion.button>
  );
}
