import React, { useState } from 'react';
import { ExternalLink, Calendar, User, Sparkles, Box, CheckCircle } from 'lucide-react';
import { EXHIBITS, MUSEUM_METADATA } from '../data/exhibits';
import { getFallbackDataUri } from '../utils/textureHelper';

export function FallbackView({ onSwitchTo3D, webGlFailed = false }) {
  const [imageErrors, setImageErrors] = useState({});

  const handleImgError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="fallback-container">
      {/* Header */}
      <header className="fallback-header">
        <div className="fallback-badge">
          <Sparkles size={16} className="gold-sparkle" />
          <span>{MUSEUM_METADATA.badge}</span>
        </div>
        <h1 className="fallback-title">{MUSEUM_METADATA.title}</h1>
        <p className="fallback-subtitle">
          {webGlFailed
            ? 'Құрылғыңызда 3D графигі қолдау таппағандықтан, жәдігерлер ыңғайлы тізім түрінде ұсынылды.'
            : 'Мектеп оқушыларына арналған электронды көрме каталогы'}
        </p>

        {onSwitchTo3D && (
          <button
            onClick={onSwitchTo3D}
            className="switch-3d-btn"
          >
            <Box size={18} />
            <span>3D виртуалды залын ашу</span>
          </button>
        )}
      </header>

      {/* Exhibits Cards List */}
      <div className="fallback-cards-list">
        {EXHIBITS.map((exhibit) => {
          const hasError = imageErrors[exhibit.id];
          const imgSrc = hasError ? getFallbackDataUri(exhibit.name) : exhibit.image;

          return (
            <article key={exhibit.id} className="fallback-card">
              <div className="fallback-card-img-wrap">
                <img
                  src={imgSrc}
                  alt={exhibit.fullName}
                  className="fallback-card-img"
                  loading="lazy"
                  onError={() => handleImgError(exhibit.id)}
                />
                <span className="fallback-card-number">{exhibit.number}</span>
              </div>

              <div className="fallback-card-content">
                <div className="fallback-card-heading">
                  <span className="fallback-card-tag">{exhibit.name}</span>
                  <h2 className="fallback-card-title">{exhibit.fullName}</h2>
                </div>

                <div className="fallback-meta-row">
                  <div className="fallback-meta-item">
                    <Calendar size={15} className="fallback-meta-icon" />
                    <span><strong>Қабылданды:</strong> {exhibit.adoptedDate}</span>
                  </div>
                  <div className="fallback-meta-item">
                    <User size={15} className="fallback-meta-icon" />
                    <span><strong>Авторы:</strong> {exhibit.author}</span>
                  </div>
                </div>

                <p className="fallback-desc">{exhibit.shortDescription}</p>

                {exhibit.meaning && (
                  <div className="fallback-symbols">
                    <h3 className="fallback-symbols-heading">Негізгі белгілері:</h3>
                    <ul className="fallback-symbols-list">
                      {exhibit.meaning.map((m, idx) => (
                        <li key={idx} className="fallback-symbol-item">
                          <CheckCircle size={14} className="check-icon" />
                          <span><strong>{m.label}:</strong> {m.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="fallback-card-footer">
                  <a
                    href={exhibit.moreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fallback-more-link"
                  >
                    <span>Толығырақ (Ақорда ресми сайты)</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="fallback-page-footer">
        <p>Қазақстанның мемлекеттік рәміздері • Оқушыларға арналған ақпараттық құрал</p>
      </footer>
    </div>
  );
}
