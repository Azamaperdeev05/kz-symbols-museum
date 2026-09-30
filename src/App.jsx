import React, { useState, useEffect, useCallback } from 'react';
import { MuseumCanvas } from './components/MuseumCanvas';
import { InfoPanel } from './components/InfoPanel';
import { StartModal } from './components/StartModal';
import { TopBar } from './components/TopBar';
import { FallbackView } from './components/FallbackView';
import { CanvasErrorBoundary } from './components/CanvasErrorBoundary';
import { QrModal } from './components/QrModal';
import { WalkControls } from './components/WalkControls';
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
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [walkDirection, setWalkDirection] = useState(0);

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
    setWalkDirection(0);
  }, []);

  const handleOverview = useCallback(() => {
    setActiveExhibit(null);
    setWalkDirection(0);
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

  // Walking Controls handlers
  const handleWalkLeft = useCallback(() => {
    setWalkDirection(-1);
    setShowGuideTip(false);
  }, []);

  const handleWalkRight = useCallback(() => {
    setWalkDirection(1);
    setShowGuideTip(false);
  }, []);

  const handleStepLeft = useCallback(() => {
    setShowGuideTip(false);
    if (activeExhibit) {
      handlePrev();
    } else {
      // Step left along hall
      setWalkDirection(-1);
      setTimeout(() => setWalkDirection(0), 220);
    }
  }, [activeExhibit, handlePrev]);

  const handleStepRight = useCallback(() => {
    setShowGuideTip(false);
    if (activeExhibit) {
      handleNext();
    } else {
      // Step right along hall
      setWalkDirection(1);
      setTimeout(() => setWalkDirection(0), 220);
    }
  }, [activeExhibit, handleNext]);

  const handleToggleMode = useCallback(() => {
    if (!webGlSupported) return;
    setIs3DMode((prev) => !prev);
  }, [webGlSupported]);

  // Keyboard navigation & walking controls (Arrow keys + A/D keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isQrOpen) {
          setIsQrOpen(false);
        } else {
          handleOverview();
        }
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (activeExhibit) {
          handleNext();
        } else {
          setWalkDirection(1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (activeExhibit) {
          handlePrev();
        } else {
          setWalkDirection(-1);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (
        e.key === 'ArrowRight' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'A' ||
        e.key === 'd' ||
        e.key === 'D'
      ) {
        setWalkDirection(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleOverview, handleNext, handlePrev, activeExhibit, isQrOpen]);

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
          onOpenQr={() => setIsQrOpen(true)}
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
          onOpenQr={() => setIsQrOpen(true)}
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
              walkDirection={walkDirection}
            />

            {/* Left / Right Walking Controls for mobile & desktop */}
            {hasEntered && !activeExhibit && (
              <WalkControls
                onWalkLeft={handleWalkLeft}
                onWalkRight={handleWalkRight}
                onStepLeft={handleStepLeft}
                onStepRight={handleStepRight}
              />
            )}

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
                key={activeExhibit.id}
                exhibit={activeExhibit}
                onClose={() => setActiveExhibit(null)}
                onPrev={handlePrev}
                onNext={handleNext}
                onOverview={handleOverview}
                _currentIndex={currentIndex}
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

      {/* 4. Global QR Code Modal */}
      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
      />
    </div>
  );
}

export default App;
