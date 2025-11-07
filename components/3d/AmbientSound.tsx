'use client';

import { useEffect, useRef, useState } from 'react';

interface AmbientSoundProps {
  enabled?: boolean;
}

export default function AmbientSound({ enabled = true }: AmbientSoundProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const initAudio = () => {
      if (audioContextRef.current) return;

      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioContextRef.current;

      // Create ambient drone layers
      const frequencies = [55, 82.5, 110, 165]; // Low ambient frequencies
      
      frequencies.forEach((freq, index) => {
        // Oscillator
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gain node for volume control
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.01 + (index * 0.005), ctx.currentTime);

        // LFO for subtle modulation
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1 + (index * 0.05), ctx.currentTime);
        
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(2, ctx.currentTime);
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Start
        oscillator.start();
        lfo.start();

        oscillatorsRef.current.push(oscillator);
        gainNodesRef.current.push(gainNode);
      });

      // Add white noise for atmosphere
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for the noise
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(100, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.005, ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start();

      gainNodesRef.current.push(noiseGain);

      setIsInitialized(true);
    };

    // Initialize on user interaction (required by browsers)
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      // Cleanup
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {
          // Ignore errors on cleanup
        }
      });
      
      gainNodesRef.current.forEach(gain => {
        try {
          gain.disconnect();
        } catch (e) {
          // Ignore errors on cleanup
        }
      });

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [enabled]);

  // Create click sound effect
  const playClickSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  // Create hover sound effect
  const playHoverSound = () => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  };

  // Expose functions globally for easy access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).playClickSound = playClickSound;
      (window as any).playHoverSound = playHoverSound;
    }
  }, [isInitialized]);

  return null; // This component doesn't render anything
}
