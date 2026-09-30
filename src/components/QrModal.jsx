import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, Download, X } from 'lucide-react';

export function QrModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = 'https://kz-symbols-museum.vercel.app/';

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(siteUrl);
      } else {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = siteUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/images/museum-qr.png';
    link.download = 'kz-symbols-museum-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="qr-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="qr-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-glow" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="qr-modal-close"
          aria-label="Жабу"
          title="Жабу"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="qr-modal-header">
          <div className="qr-badge-icon">
            <QrCode size={24} className="gold-sparkle" />
          </div>
          <h2 className="qr-modal-title">Сайттың QR-коды</h2>
          <p className="qr-modal-subtitle">
            Мектеп оқушылары мен мұғалімдер үшін виртуалды көрмеге жедел кіру
          </p>
        </div>

        {/* QR Code Presentation Box */}
        <div className="qr-code-frame">
          <div className="qr-image-wrapper">
            <img
              src="/images/museum-qr.png"
              alt="https://kz-symbols-museum.vercel.app/ QR коды"
              className="qr-image"
              width="220"
              height="220"
            />
          </div>
          <div className="qr-scan-badge">
            <span>Камерамен сканерлеңіз</span>
          </div>
        </div>

        {/* Direct Link Box */}
        <div className="qr-link-box">
          <span className="qr-link-label">Тікелей сайт сілтемесі:</span>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="qr-site-anchor"
            title="Сайтқа өту"
          >
            <span className="qr-url-text">{siteUrl}</span>
            <ExternalLink size={15} className="qr-anchor-icon" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="qr-actions-row">
          <button
            onClick={handleCopy}
            className={`qr-action-btn ${copied ? 'copied' : ''}`}
            title="Сілтемені көшіріп алу"
          >
            {copied ? <Check size={17} className="btn-icon" /> : <Copy size={17} className="btn-icon" />}
            <span>{copied ? 'Сілтеме көшірілді!' : 'Сілтемені көшіру'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="qr-action-btn secondary"
            title="QR-код суретін жүктеп алу"
          >
            <Download size={17} className="btn-icon" />
            <span>QR жүктеу (PNG)</span>
          </button>
        </div>

        <p className="qr-footer-hint">
          Сілтеме мен QR-код интерактивті тақтаға, презентацияға немесе сынып парақшасына орналастыруға дайын.
        </p>
      </div>
    </div>
  );
}
