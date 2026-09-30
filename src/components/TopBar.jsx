import React from 'react';
import { Home, ListFilter, Sparkles, QrCode } from 'lucide-react';
import { EXHIBITS } from '../data/exhibits';

export function TopBar({
  activeExhibit,
  onSelectExhibit,
  onOverview,
  is3DMode,
  onToggleMode,
  onOpenQr
}) {
  return (
    <header className="museum-topbar" role="banner">
      <div className="topbar-inner">
        {/* Brand / Title */}
        <div className="topbar-brand" onClick={onOverview} role="button" tabIndex={0}>
          <div className="brand-icon-wrapper">
            <Sparkles size={16} className="gold-sparkle" />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-title">Рәміздер 3D</span>
            <span className="brand-subtitle">Виртуалды мұражай</span>
          </div>
        </div>

        {/* Quick Exhibit Navigation Pills */}
        <nav className="topbar-pills" aria-label="Жәдігерлерді таңдау">
          {EXHIBITS.map((exhibit) => {
            const isActive = activeExhibit?.id === exhibit.id;
            return (
              <button
                key={exhibit.id}
                onClick={() => onSelectExhibit(exhibit)}
                className={`exhibit-pill ${isActive ? 'active' : ''}`}
                aria-pressed={isActive}
              >
                <span className="pill-number">{exhibit.number}</span>
                <span className="pill-name">{exhibit.id === 'anthem' ? 'Әнұран' : exhibit.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility Buttons */}
        <div className="topbar-actions">
          {activeExhibit && (
            <button
              onClick={onOverview}
              className="overview-quick-btn"
              title="Жалпы шолуға қайту"
              aria-label="Жалпы көрініс"
            >
              <Home size={16} />
              <span className="quick-btn-label">Шолу</span>
            </button>
          )}

          {/* QR Code Modal Trigger Button */}
          <button
            onClick={onOpenQr}
            className="qr-toggle-btn"
            title="Сайттың QR-кодын көрсету"
            aria-label="QR-кодты ашу"
          >
            <QrCode size={16} className="qr-icon-gold" />
            <span className="qr-toggle-label">QR</span>
          </button>

          <button
            onClick={onToggleMode}
            className="mode-toggle-btn"
            title={is3DMode ? 'Тізім түріне ауысу' : '3D түріне ауысу'}
            aria-label="Көру режимін ауыстыру"
          >
            <ListFilter size={16} />
            <span className="mode-toggle-label">{is3DMode ? 'Тізім' : '3D'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
