import React from 'react';
import { Compass, Sparkles, BookOpen, Layers } from 'lucide-react';
import { MUSEUM_METADATA } from '../data/exhibits';

export function StartModal({ onEnter, onSwitchToFallback }) {
  return (
    <div className="start-modal-backdrop">
      <div className="start-modal-card" role="dialog" aria-modal="true">
        {/* Decorative Top Accent Glow */}
        <div className="modal-glow" />

        {/* National Emblem Badge Icon */}
        <div className="modal-badge-wrapper">
          <div className="modal-badge-icon">
            <Sparkles size={28} className="gold-sparkle" />
          </div>
          <span className="modal-badge-pill">{MUSEUM_METADATA.badge}</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="modal-title">{MUSEUM_METADATA.title}</h1>
        <p className="modal-subtitle">{MUSEUM_METADATA.subtitle}</p>

        {/* Exhibits Quick Preview Pills */}
        <div className="modal-exhibits-preview">
          <div className="preview-pill">
            <span className="preview-num">01</span>
            <span className="preview-name">Мемлекеттік Ту</span>
          </div>
          <div className="preview-pill">
            <span className="preview-num">02</span>
            <span className="preview-name">Мемлекеттік Елтаңба</span>
          </div>
          <div className="preview-pill">
            <span className="preview-num">03</span>
            <span className="preview-name">Мемлекеттік Әнұран</span>
          </div>
        </div>

        {/* Mobile touch tip */}
        <div className="modal-tip-box">
          <Compass size={20} className="tip-icon" />
          <p className="tip-text">
            <strong>Нұсқаулық:</strong> Экранды бір саусақпен жылжытып 3D залын айналдырыңыз. Жәдігерді бассаңыз, камера автоматты түрде жақындайды.
          </p>
        </div>

        {/* Main Actions */}
        <div className="modal-actions">
          <button
            onClick={onEnter}
            className="enter-museum-btn"
            autoFocus
          >
            <span>{MUSEUM_METADATA.enterButtonText}</span>
            <Layers size={20} />
          </button>

          <button
            onClick={onSwitchToFallback}
            className="text-mode-btn"
          >
            <BookOpen size={17} />
            <span>Тізім түрінде оқу (2D нұсқа)</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="modal-footer-note">
          <span>QR-код арқылы ашылған мектеп оқу құралы</span>
        </div>
      </div>
    </div>
  );
}
