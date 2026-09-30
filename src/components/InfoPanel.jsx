import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, Home, X, Calendar, User, Info, Sparkles } from 'lucide-react';
import { getFallbackDataUri } from '../utils/textureHelper';

export function InfoPanel({
  exhibit,
  onClose,
  onPrev,
  onNext,
  onOverview,
  _currentIndex,
  totalCount
}) {
  const [imgError, setImgError] = useState(false);

  if (!exhibit) return null;

  const imgSrc = imgError ? getFallbackDataUri(exhibit.name) : exhibit.image;

  return (
    <aside
      className="info-panel-sheet"
      role="dialog"
      aria-labelledby="info-panel-title"
      aria-modal="false"
    >
      {/* Top Drag Handle / Accent Bar */}
      <div className="sheet-handle-container">
        <div className="sheet-handle" />
      </div>

      {/* Header bar */}
      <div className="sheet-header">
        <div className="sheet-tag">
          <span className="gold-dot" />
          <span className="sheet-tag-text">
            {exhibit.number} / 0{totalCount} • ЖӘДІГЕР
          </span>
        </div>

        <div className="sheet-header-actions">
          <button
            onClick={onOverview}
            className="icon-btn"
            title="Бастапқы шолуға оралу"
            aria-label="Бастапқы бет"
          >
            <Home size={18} />
            <span className="icon-btn-label">Бастапқы бет</span>
          </button>
          <button
            onClick={onClose}
            className="close-btn"
            title="Жабу"
            aria-label="Ақпаратты жабу"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="sheet-body">
        {/* Visual Hero Block */}
        <div className="sheet-media-card">
          <div className="sheet-img-wrap">
            <img
              src={imgSrc}
              alt={exhibit.fullName}
              className="sheet-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="sheet-title-group">
            <h2 id="info-panel-title" className="sheet-title">
              {exhibit.fullName}
            </h2>
            <p className="sheet-subtitle">{exhibit.title}</p>
          </div>
        </div>

        {/* Metadata Cards */}
        <div className="sheet-meta-grid">
          <div className="meta-card">
            <div className="meta-icon-wrap">
              <Calendar size={17} className="meta-icon" />
            </div>
            <div className="meta-details">
              <span className="meta-label">Қабылданған уақыты</span>
              <strong className="meta-value">{exhibit.adoptedDate}</strong>
            </div>
          </div>

          <div className="meta-card">
            <div className="meta-icon-wrap">
              <User size={17} className="meta-icon" />
            </div>
            <div className="meta-details">
              <span className="meta-label">Авторы / Авторлары</span>
              <strong className="meta-value">{exhibit.author}</strong>
            </div>
          </div>
        </div>

        {/* Short Pedagogical Description */}
        <div className="sheet-description-card">
          <div className="desc-header">
            <Info size={16} className="desc-icon" />
            <span className="desc-title">Сипаттамасы мен маңызы</span>
          </div>
          <p className="desc-text">{exhibit.shortDescription}</p>
        </div>

        {/* Key Symbolic Elements (Educational chips) */}
        {exhibit.meaning && exhibit.meaning.length > 0 && (
          <div className="sheet-symbols-section">
            <div className="symbols-header">
              <Sparkles size={16} className="symbols-icon" />
              <span className="symbols-title">Негізгі рәміздік белгілері</span>
            </div>
            <div className="symbols-chips-list">
              {exhibit.meaning.map((m, idx) => (
                <div key={idx} className="symbol-chip">
                  <span className="symbol-chip-title">{m.label}:</span>{' '}
                  <span className="symbol-chip-desc">{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Official More Info CTA */}
        <div className="sheet-actions">
          <a
            href={exhibit.moreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-more-btn"
            title="ҚР Президентінің ресми сайтынан оқу"
          >
            <span>Толығырақ (Ақорда ресми сайты)</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="sheet-bottom-nav" aria-label="Жәдігерлер бойынша навигация">
        <button
          onClick={onPrev}
          className="nav-btn prev-btn"
          aria-label="Алдыңғы жәдігер"
        >
          <ChevronLeft size={20} />
          <span>Алдыңғы</span>
        </button>

        <button
          onClick={onOverview}
          className="nav-btn overview-btn"
          aria-label="Мұражай шолуына қайту"
        >
          <Home size={18} />
          <span>Бастапқы бет</span>
        </button>

        <button
          onClick={onNext}
          className="nav-btn next-btn"
          aria-label="Келесі жәдігер"
        >
          <span>Келесі</span>
          <ChevronRight size={20} />
        </button>
      </nav>
    </aside>
  );
}
