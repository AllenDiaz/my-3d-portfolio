'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TOUR_STOPS } from '@/components/3d/cameraPoses';

// Matches the flight-engine duration in SceneSetup so auto-advance waits for
// the camera to land before the dwell starts.
const FLIGHT_MS = 1400;

/**
 * Caption card + step controls for the guided tour. Auto-advances after each
 * stop's dwell; Back/Next/End are manual overrides. Mounted on the /3d-office
 * page alongside the other overlays.
 */
export default function TourOverlay() {
  const tourActive = useStore((state) => state.tourActive);
  const tourStep = useStore((state) => state.tourStep);
  const setTourStep = useStore((state) => state.setTourStep);
  const stopTour = useStore((state) => state.stopTour);

  // Auto-advance: flight time + dwell, cleared on manual nav/unmount (the
  // timer resets whenever tourStep changes).
  useEffect(() => {
    if (!tourActive) return;
    const stop = TOUR_STOPS[tourStep];
    if (!stop) return;
    const timer = setTimeout(() => {
      if (tourStep >= TOUR_STOPS.length - 1) {
        stopTour();
      } else {
        setTourStep(tourStep + 1);
      }
    }, FLIGHT_MS + stop.dwellMs);
    return () => clearTimeout(timer);
  }, [tourActive, tourStep, setTourStep, stopTour]);

  const stop = TOUR_STOPS[tourStep];

  return (
    <AnimatePresence>
      {tourActive && stop && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg pointer-events-auto"
        >
          <div className="bg-black/75 backdrop-blur-md border border-gray-700/60 rounded-xl px-5 py-4 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold font-mono text-teal-300">{stop.title}</p>
                <p className="mt-1 text-sm text-gray-300">{stop.caption}</p>
              </div>
              <button
                onClick={stopTour}
                aria-label="End tour"
                title="End tour"
                className="shrink-0 p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              {/* Progress dots */}
              <div className="flex items-center gap-1.5" aria-label={`Stop ${tourStep + 1} of ${TOUR_STOPS.length}`}>
                {TOUR_STOPS.map((s, i) => (
                  <span
                    key={s.title}
                    className={`h-1.5 rounded-full transition-all ${
                      i === tourStep ? 'w-5 bg-teal-400' : 'w-1.5 bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTourStep(Math.max(0, tourStep - 1))}
                  disabled={tourStep === 0}
                  aria-label="Previous stop"
                  className="p-1.5 rounded-md border border-gray-700 text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    tourStep >= TOUR_STOPS.length - 1 ? stopTour() : setTourStep(tourStep + 1)
                  }
                  aria-label={tourStep >= TOUR_STOPS.length - 1 ? 'Finish tour' : 'Next stop'}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-teal-600/80 hover:bg-teal-500/80 text-sm font-medium transition-colors cursor-pointer"
                >
                  {tourStep >= TOUR_STOPS.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
