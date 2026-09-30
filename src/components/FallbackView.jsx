import React, { useState, useRef } from 'react';
import {
  ExternalLink,
  Calendar,
  User,
  Sparkles,
  Box,
  Music,
  Play,
  Pause,
  FileText,
  Volume2
} from 'lucide-react';
import { EXHIBITS, MUSEUM_METADATA } from '../data/exhibits';
import { getFallbackDataUri } from '../utils/textureHelper';

export function FallbackView({ onSwitchTo3D, webGlFailed = false }) {
  const [imageErrors, setImageErrors] = useState({});
  const [playingId, setPlayingId] = useState(null);
  const audioRefs = useRef({});

  const handleImgError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const toggleAudio = (id) => {
    const audio = audioRefs.current[id];
    if (!audio) return;
    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      // Pause any other playing
      Object.values(audioRefs.current).forEach((a) => a && a.pause());
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => setPlayingId(id)).catch((err) => {
          console.warn('Audio play failed:', err);
          setPlayingId(null);
        });
      }
    }
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
        <p className="fallback-subtitle">{MUSEUM_METADATA.subtitle}</p>

        {webGlFailed && (
          <p className="fallback-notice">
            Құрылғыңызда 3D графигі қолдау таппағандықтан, жәдігерлер электронды каталог түрінде ұсынылды.
          </p>
        )}

        {onSwitchTo3D && !webGlFailed && (
          <button onClick={onSwitchTo3D} className="switch-3d-btn">
            <Box size={18} />
            <span>3D виртуалды залын ашу</span>
          </button>
        )}
      </header>

      {/* Exhibits Cards List */}
      <div className="fallback-cards-list">
        {EXHIBITS.map((exhibit) => {
          const hasError = imageErrors[exhibit.id];
          const imgSrc = hasError ? getFallbackDataUri(exhibit.title) : exhibit.image;

          return (
            <article key={exhibit.id} className="fallback-card">
              {/* Media Block: Stylized Plaque for Anthem, Photo for others */}
              {exhibit.isPlaque ? (
                <div className="fallback-anthem-plaque">
                  <div className="anthem-plaque-icon-wrap">
                    <Music size={36} className="plaque-music-icon" />
                  </div>
                  <h3 className="fallback-plaque-title">{exhibit.title}</h3>
                  <p className="fallback-plaque-subtitle">«Менің Қазақстаным»</p>
                  <span className="fallback-card-number">{exhibit.number}</span>
                </div>
              ) : (
                <div className="fallback-card-img-wrap">
                  <img
                    src={imgSrc}
                    alt={exhibit.title}
                    className="fallback-card-img"
                    loading="lazy"
                    onError={() => handleImgError(exhibit.id)}
                  />
                  <span className="fallback-card-number">{exhibit.number}</span>
                </div>
              )}

              <div className="fallback-card-content">
                <div className="fallback-card-heading">
                  <span className="fallback-card-tag">МЕМЛЕКЕТТІК РӘМІЗ</span>
                  <h2 className="fallback-card-title">{exhibit.title}</h2>
                </div>

                <div className="fallback-meta-row">
                  <div className="fallback-meta-item">
                    <Calendar size={15} className="fallback-meta-icon" />
                    <span>
                      <strong>Қабылданған жылы:</strong> {exhibit.year}
                    </span>
                  </div>
                  <div className="fallback-meta-item">
                    <User size={15} className="fallback-meta-icon" />
                    <span>
                      <strong>Авторы:</strong> {exhibit.author}
                    </span>
                  </div>
                </div>

                {/* Audio player for Anthem if audio property is present */}
                {exhibit.audio && (
                  <div className="fallback-audio-card">
                    <audio
                      ref={(el) => (audioRefs.current[exhibit.id] = el)}
                      src={exhibit.audio}
                      preload="metadata"
                      onEnded={() => setPlayingId(null)}
                      onError={() => console.warn('Audio file not found')}
                    />
                    <button
                      onClick={() => toggleAudio(exhibit.id)}
                      className={`fallback-audio-btn ${playingId === exhibit.id ? 'playing' : ''}`}
                      aria-label={playingId === exhibit.id ? 'Тоқтату' : 'Әнұранды тыңдау'}
                    >
                      {playingId === exhibit.id ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} className="play-icon" />
                      )}
                      <span>
                        {playingId === exhibit.id ? 'Тоқтату' : 'Әнұранды тыңдау'}
                      </span>
                    </button>
                    <div className="audio-time-badge">
                      <Volume2 size={14} className="volume-icon" />
                      <span>{exhibit.audio}</span>
                    </div>
                  </div>
                )}

                <p className="fallback-desc">{exhibit.text}</p>

                <div className="fallback-card-footer">
                  <div className="fallback-actions-group">
                    <a
                      href={exhibit.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fallback-more-link"
                    >
                      <span>Толығырақ</span>
                      <ExternalLink size={16} />
                    </a>

                    {exhibit.extraLink && (
                      <a
                        href={exhibit.extraLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fallback-extra-link"
                        title="Нотаны ашу"
                      >
                        <FileText size={16} />
                        <span>{exhibit.extraLink.label} (PDF)</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  <div className="fallback-source-tag">
                    Дереккөз: <a href="https://www.akorda.kz" target="_blank" rel="noopener noreferrer">akorda.kz</a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="fallback-page-footer">
        <p>Қазақстанның мемлекеттік рәміздері • Республика күніне арналған виртуалды көрме</p>
        <p className="footer-source">Дереккөз: akorda.kz</p>
      </footer>
    </div>
  );
}
