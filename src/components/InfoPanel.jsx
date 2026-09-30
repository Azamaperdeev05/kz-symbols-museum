import React, { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Home,
  X,
  Calendar,
  User,
  Info,
  Music,
  Play,
  Pause,
  FileText,
  Volume2
} from 'lucide-react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);

  // Pause audio when panel unmounts
  useEffect(() => {
    const audioEl = audioRef.current;
    return () => {
      if (audioEl) {
        audioEl.pause();
      }
    };
  }, []);

  if (!exhibit) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Audio playback error (file might not be added yet):', err);
            setAudioError(true);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setAudioError(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const imgSrc = imgError ? getFallbackDataUri(exhibit.title) : exhibit.image;

  return (
    <aside
      className="info-panel-sheet"
      role="dialog"
      aria-labelledby="info-panel-title"
      aria-modal="false"
    >
      {/* HTML5 Audio Element (NO autoplay) */}
      {exhibit.audio && (
        <audio
          ref={audioRef}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleAudioEnded}
          onError={() => setAudioError(true)}
        >
          <source src={exhibit.audio} type="audio/mp4" />
          <source src="/audio/anthem.mp3" type="audio/mpeg" />
        </audio>
      )}

      {/* Top Drag Handle */}
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
        {/* Visual Hero Block: Either Stylized Plaque or Photo */}
        {exhibit.isPlaque ? (
          <div className="anthem-plaque-card">
            <div className="anthem-plaque-icon-wrap">
              <Music size={32} className="plaque-music-icon" />
            </div>
            <div className="anthem-plaque-details">
              <span className="anthem-plaque-badge">МЕМЛЕКЕТТІК РӘМІЗ</span>
              <h2 id="info-panel-title" className="sheet-title">
                {exhibit.title}
              </h2>
              <p className="anthem-plaque-name">«Менің Қазақстаным»</p>
            </div>
          </div>
        ) : (
          <div className="sheet-media-card">
            <div className="sheet-img-wrap">
              <img
                src={imgSrc}
                alt={exhibit.title}
                className="sheet-img"
                loading="lazy"
                onError={() => setImgError(true)}
              />
            </div>
            <div className="sheet-title-group">
              <span className="sheet-badge-tag">МЕМЛЕКЕТТІК РӘМІЗ</span>
              <h2 id="info-panel-title" className="sheet-title">
                {exhibit.title}
              </h2>
            </div>
          </div>
        )}

        {/* Audio Player Widget (For Anthem) */}
        {exhibit.audio && (
          <div className="audio-player-card">
            <div className="audio-player-main">
              <button
                onClick={togglePlay}
                className={`audio-toggle-btn ${isPlaying ? 'playing' : ''}`}
                title={isPlaying ? 'Тоқтату' : 'Тыңдау'}
                aria-label={isPlaying ? 'Әнұранды тоқтату' : 'Әнұранды тыңдау'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="play-icon" />}
              </button>

              <div className="audio-track-info">
                <div className="audio-track-header">
                  <span className="audio-track-title">Мемлекеттік Әнұран</span>
                  <div className="audio-time-badge">
                    <Volume2 size={13} className="volume-icon" />
                    <span>{formatTime(currentTime)} / {formatTime(duration || 90)}</span>
                  </div>
                </div>

                <div className="audio-progress-bar">
                  <div
                    className="audio-progress-fill"
                    style={{
                      width: `${duration > 0 ? (currentTime / duration) * 100 : isPlaying ? 50 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {audioError && (
              <p className="audio-fallback-note">
                ℹ️ Аудио файлы: <code>/audio/anthem.mp4</code> (файл қосылуда)
              </p>
            )}
          </div>
        )}

        {/* Metadata Grid */}
        <div className="sheet-meta-grid">
          <div className="meta-card">
            <div className="meta-icon-wrap">
              <Calendar size={17} className="meta-icon" />
            </div>
            <div className="meta-details">
              <span className="meta-label">Қабылданған жылы</span>
              <strong className="meta-value">{exhibit.year}</strong>
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

        {/* Description Card */}
        <div className="sheet-description-card">
          <div className="desc-header">
            <Info size={16} className="desc-icon" />
            <span className="desc-title">Сипаттамасы</span>
          </div>
          <p className="desc-text">{exhibit.text}</p>
        </div>

        {/* Links Section: Толығырақ & Extra Link (Нота) */}
        <div className="sheet-actions">
          <a
            href={exhibit.link}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-more-btn"
            title="Толығырақ оқу"
          >
            <span>Толығырақ</span>
            <ExternalLink size={17} />
          </a>

          {exhibit.extraLink && (
            <a
              href={exhibit.extraLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-extra-link-btn"
              title="Әнұранның нотасын ашу"
            >
              <FileText size={17} />
              <span>{exhibit.extraLink.label} (PDF)</span>
              <ExternalLink size={15} />
            </a>
          )}
        </div>

        {/* Mandatory Source Attribution */}
        <div className="sheet-source-footer">
          <span>Дереккөз: </span>
          <a
            href="https://www.akorda.kz"
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
          >
            akorda.kz
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
