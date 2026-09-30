import React, { useState, useEffect, useCallback } from 'react';
import { MuseumCanvas } from './components/MuseumCanvas';
import { InfoPanel } from './components/InfoPanel';
import { StartModal } from './components/StartModal';
import { TopBar } from './components/TopBar';
import { FallbackView } from './components/FallbackView';
import { CanvasErrorBoundary } from './components/CanvasErrorBoundary';
import { EXHIBITS, MUSEUM_METADATA } from './data/exhibits';
import { Compass } from 'lucide-react';
import './App.css';

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState(null);
  const [hoveredExhibitId, setHoveredExhibitId] = useState(null);
  const [webGlSupported] = useState(() => checkWebGLSupport());
  const [is3DMode, setIs3DMode] = useState(() => checkWebGLSupport());
  const [showGuideTip, setShowGuideTip] = useState(true);

  // Auto-hide the initial touch hint after 7 seconds
  useEffect(() => {
    if (hasEntered && is3DMode) {
      const timer = setTimeout(() => {
        setShowGuideTip(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [hasEntered, is3DMode]);

  // Exhibit selection & navigation
  const handleSelectExhibit = useCallback((exhibit) => {
    setActiveExhibit(exhibit);
    setShowGuideTip(false);
  }, []);

  const handleOverview = useCallback(() => {
    setActiveExhibit(null);
  }, []);

  const currentIndex = activeExhibit
    ? EXHIBITS.findIndex((e) => e.id === activeExhibit.id)
    : -1;

  const handleNext = useCallback(() => {
    if (currentIndex === -1) {
      setActiveExhibit(EXHIBITS[0]);
    } else {
      const nextIdx = (currentIndex + 1) % EXHIBITS.length;
      setActiveExhibit(EXHIBITS[nextIdx]);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex === -1) {
      setActiveExhibit(EXHIBITS[EXHIBITS.length - 1]);
    } else {
      const prevIdx = (currentIndex - 1 + EXHIBITS.length) % EXHIBITS.length;
      setActiveExhibit(EXHIBITS[prevIdx]);
    }
  }, [currentIndex]);

  const handleToggleMode = useCallback(() => {
    if (!webGlSupported) return;
    setIs3DMode((prev) => !prev);
  }, [webGlSupported]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleOverview();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOverview, handleNext, handlePrev]);

  return (
    <div className="app-viewport">
      {/* 1. Welcoming Start Screen Modal */}
      {!hasEntered && (
        <StartModal
          onEnter={() => setHasEntered(true)}
          onSwitchToFallback={() => {
            setHasEntered(true);
            setIs3DMode(false);
          }}
        />
      )}

      {/* 2. Top Header Bar (Always present once entered) */}
      {hasEntered && (
        <TopBar
          activeExhibit={activeExhibit}
          onSelectExhibit={handleSelectExhibit}
          onOverview={handleOverview}
          is3DMode={is3DMode}
          onToggleMode={handleToggleMode}
        />
      )}

      {/* 3. Main Stage: Either 3D Virtual Hall or 2D Card List */}
      {is3DMode ? (
        <CanvasErrorBoundary>
          <main className="museum-main" role="main">
            <MuseumCanvas
              activeExhibit={activeExhibit}
              hoveredExhibitId={hoveredExhibitId}
              onSelectExhibit={handleSelectExhibit}
              onHoverExhibit={setHoveredExhibitId}
              onFloorClick={handleOverview}
            />

            {/* Floating Guide Toast for Mobile Students */}
            {hasEntered && showGuideTip && !activeExhibit && (
              <div className="floating-guide-toast" role="status">
                <Compass size={18} className="guide-icon pulse" />
                <span>{MUSEUM_METADATA.instructionText}</span>
                <button
                  onClick={() => setShowGuideTip(false)}
                  className="guide-dismiss-btn"
                  aria-label="Нұсқаулықты жабу"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Bottom Info Sheet / Details Panel */}
            {activeExhibit && (
              <InfoPanel
                exhibit={activeExhibit}
                onClose={() => setActiveExhibit(null)}
                onPrev={handlePrev}
                onNext={handleNext}
                onOverview={handleOverview}
                currentIndex={currentIndex}
                totalCount={EXHIBITS.length}
              />
            )}
          </main>
        </CanvasErrorBoundary>
      ) : (
        <FallbackView
          onSwitchTo3D={() => setIs3DMode(true)}
          webGlFailed={!webGlSupported}
        />
      )}
    </div>
  );
}

export default App;
