'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/useStore';

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    playClickSound?: () => void;
    playHoverSound?: () => void;
  }
}

interface AmbientSoundProps {
  enabled?: boolean;
}

/**
 * Procedural ambient soundscape (low sine drones + filtered noise) plus short
 * synth blips for hover/click feedback (exposed as window.playHoverSound /
 * window.playClickSound, called by useHoverFeedback). Everything routes
 * through one master gain so the store's `soundMuted` flag silences the whole
 * bus with a short ramp.
 */
export default function AmbientSound({ enabled = true }: AmbientSoundProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const soundMuted = useStore((state) => state.soundMuted);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const initAudio = () => {
      if (audioContextRef.current) return;

      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) return;
      audioContextRef.current = new AudioContextCtor();
      const ctx = audioContextRef.current;

      // Master bus — the mute toggle ramps this single gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(
        useStore.getState().soundMuted ? 0 : 1,
        ctx.currentTime
      );
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

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
        gainNode.connect(masterGain);

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
      noiseGain.connect(masterGain);

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
        } catch {
          // Ignore errors on cleanup
        }
      });

      gainNodesRef.current.forEach(gain => {
        try {
          gain.disconnect();
        } catch {
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

  // Mute/unmute the whole bus with a short ramp (no hard pop)
  useEffect(() => {
    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;
    masterGain.gain.setTargetAtTime(soundMuted ? 0 : 1, ctx.currentTime, 0.08);
  }, [soundMuted, isInitialized]);

  // Expose the interaction blips globally (consumed by useHoverFeedback)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const playBlip = (
      startFreq: number,
      endFreq: number | null,
      gain: number,
      duration: number
    ) => {
      const ctx = audioContextRef.current;
      const masterGain = masterGainRef.current;
      if (!ctx || !masterGain || useStore.getState().soundMuted) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
      if (endFreq !== null) {
        oscillator.frequency.exponentialRampToValueAtTime(
          endFreq,
          ctx.currentTime + duration
        );
      }

      gainNode.gain.setValueAtTime(gain, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    };

    window.playClickSound = () => playBlip(800, 400, 0.06, 0.1);
    window.playHoverSound = () => playBlip(600, null, 0.02, 0.05);

    return () => {
      delete window.playClickSound;
      delete window.playHoverSound;
    };
  }, [isInitialized]);

  return null; // This component doesn't render anything
}
