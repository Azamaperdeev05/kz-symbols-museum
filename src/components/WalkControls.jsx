import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Footprints } from 'lucide-react';

export function WalkControls({ onWalkLeft, onWalkRight, onStepLeft, onStepRight }) {
  const walkIntervalRef = useRef(null);

  const startWalking = (direction) => {
    // Immediate step
    if (direction === 'left') {
      onWalkLeft();
    } else {
      onWalkRight();
    }

    // Continuous walking while held down
    clearInterval(walkIntervalRef.current);
    walkIntervalRef.current = setInterval(() => {
      if (direction === 'left') {
        onWalkLeft();
      } else {
        onWalkRight();
      }
    }, 40);
  };

  const stopWalking = () => {
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
  };

  return (
    <div className="walk-controls-overlay" role="region" aria-label="Мұражай ішінде жүру">
      {/* Walk Left Button */}
      <button
        type="button"
        className="walk-btn walk-btn-left"
        onClick={onStepLeft}
        onPointerDown={(e) => {
          e.preventDefault();
          startWalking('left');
        }}
        onPointerUp={stopWalking}
        onPointerLeave={stopWalking}
        onPointerCancel={stopWalking}
        aria-label="Солға жүру"
        title="Солға жүру (басып тұрыңыз)"
      >
        <ChevronLeft size={22} className="walk-btn-arrow" />
        <span className="walk-btn-text">Солға</span>
      </button>

      {/* Center Guidance Badge */}
      <div className="walk-center-hint">
        <Footprints size={15} className="walk-hint-icon" />
        <span>Оңға / Солға жүру</span>
      </div>

      {/* Walk Right Button */}
      <button
        type="button"
        className="walk-btn walk-btn-right"
        onClick={onStepRight}
        onPointerDown={(e) => {
          e.preventDefault();
          startWalking('right');
        }}
        onPointerUp={stopWalking}
        onPointerLeave={stopWalking}
        onPointerCancel={stopWalking}
        aria-label="Оңға жүру"
        title="Оңға жүру (басып тұрыңыз)"
      >
        <span className="walk-btn-text">Оңға</span>
        <ChevronRight size={22} className="walk-btn-arrow" />
      </button>
    </div>
  );
}
