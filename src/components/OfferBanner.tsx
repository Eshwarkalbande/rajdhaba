import React, { useState, useEffect } from 'react';
import { Tag, X, Clock, Check } from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode } from '../data/restaurantConfig';
import { trackEvent } from '../utils/whatsapp';

interface OfferBannerProps {
  language: LanguageCode;
}

export const OfferBanner: React.FC<OfferBannerProps> = ({ language }) => {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 45,
    seconds: 20,
  });

  const offer = RESTAURANT_CONFIG.offer;

  useEffect(() => {
    // Dynamic countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed || !offer.enabled) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(offer.code);
    setCopied(true);
    trackEvent('offer_code_copied', { code: offer.code });
    setTimeout(() => setCopied(false), 2500);
  };

  const titleText =
    language === 'hi' ? offer.titleHindi : language === 'mr' ? offer.titleMarathi : offer.title;

  return (
    <aside 
      aria-label="Promotional offer"
      className="relative z-40 bg-gradient-to-r from-amber-700 via-red-800 to-amber-800 text-amber-50 px-3 py-2 text-xs md:text-sm font-medium border-b border-amber-600/30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden flex-1 justify-center md:justify-start">
          <Tag className="w-4 h-4 text-amber-300 shrink-0 hidden sm:block" />
          <span className="truncate">{titleText}</span>
          
          <button
            onClick={handleCopyCode}
            type="button"
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-amber-200 border border-amber-400/30 text-xs font-mono tracking-wider transition-colors shrink-0"
            title="Click to copy code"
          >
            <span>{offer.code}</span>
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <span className="text-[10px] uppercase text-amber-300/80">Copy</span>
            )}
          </button>
        </div>

        {/* Live Countdown & Dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1 text-xs text-amber-200/90 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-200/80 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
