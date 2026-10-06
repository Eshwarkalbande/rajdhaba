import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export const CookieNotice: React.FC = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const isConsent = localStorage.getItem('raj_dhaba_cookie_consent');
    if (!isConsent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('raj_dhaba_cookie_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <aside 
      aria-label="Cookie consent banner"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-sm z-50 p-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs shadow-2xl space-y-2.5 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <Cookie className="w-4 h-4" />
          <span>Local Storage & Cookies</span>
        </div>
        <button
          onClick={handleAccept}
          className="text-stone-400 hover:text-white"
          aria-label="Close cookie notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-stone-400 leading-relaxed font-light">
        We use small browser cookies & local storage to remember your cart dishes, language choice,
        and promo codes for quick WhatsApp ordering.
      </p>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition-colors cursor-pointer"
        >
          Accept & Continue
        </button>
      </div>
    </aside>
  );
};
