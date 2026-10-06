import React, { useState } from 'react';
import { ShoppingBag, Globe, Menu as MenuIcon, X, Phone, Bot } from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';

interface TopNavProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiAssistant: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  language,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenAiAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_STRINGS[language];
  const business = RESTAURANT_CONFIG.business;

  const brandName =
    language === 'hi' ? business.nameHindi : language === 'mr' ? business.nameMarathi : business.name;

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
        {/* Zone 1: Brand title, single text element wordmark with truncation escape hatch */}
        <a
          href="#"
          className="group flex flex-col focus:outline-none min-w-0 shrink"
        >
          <span className="font-display text-base sm:text-2xl text-amber-400 group-hover:text-amber-300 transition-colors tracking-wide truncate max-w-[150px] xs:max-w-[210px] sm:max-w-none">
            {brandName}
          </span>
          <span className="text-[10px] sm:text-[11px] font-sans text-stone-400 hidden sm:inline">
            Dahegaon (Rangari), Maharashtra 441113
          </span>
        </a>

        {/* Zone 2: 4-6 nav links, 1-2 word labels, single line */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-300">
          <a
            href="#menu"
            className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-amber-500 after:transition-all"
          >
            {t.navMenu}
          </a>
          <a
            href="#specialties"
            className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-amber-500 after:transition-all"
          >
            {t.navSpecialties}
          </a>
          <a
            href="#seating"
            className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-amber-500 after:transition-all"
          >
            {t.navSeating}
          </a>
          <a
            href="#gallery"
            className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-amber-500 after:transition-all"
          >
            {language === 'hi' ? 'गैलरी' : language === 'mr' ? 'गॅलरी' : 'Gallery'}
          </a>
          <a
            href="#reviews"
            className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-amber-500 after:transition-all"
          >
            {t.navReviews}
          </a>
          <a
            href="#location"
            className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-amber-500 after:transition-all"
          >
            {t.navLocation}
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Language selector toggle */}
          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-lg p-0.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-amber-500 ml-1.5 mr-0.5 hidden sm:block" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'en'
                  ? 'bg-amber-600 text-white font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'hi'
                  ? 'bg-amber-600 text-white font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="हिंदी"
            >
              हिंदी
            </button>
            <button
              onClick={() => onLanguageChange('mr')}
              className={`px-2 py-1 rounded transition-colors ${
                language === 'mr'
                  ? 'bg-amber-600 text-white font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="मराठी"
            >
              मराठी
            </button>
          </div>

          {/* Ask AI Concierge Action for desktop */}
          <button
            onClick={onOpenAiAssistant}
            type="button"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Concierge</span>
          </button>

          {/* Quick Call Action for desktop */}
          <a
            href={`tel:${business.phoneCall}`}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-200 bg-stone-900 hover:bg-stone-800 border border-stone-700/80 rounded-lg transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{business.phoneDisplay}</span>
          </a>

          {/* Cart Drawer Button */}
          <button
            onClick={onOpenCart}
            type="button"
            className="relative inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors shadow-sm whitespace-nowrap cursor-pointer"
            aria-label={`Open shopping cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t.cartTitle}</span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-950 text-amber-400 text-[11px] font-bold font-mono">
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-900 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-200">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {t.navMenu}
            </a>
            <a
              href="#specialties"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {t.navSpecialties}
            </a>
            <a
              href="#seating"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {t.navSeating}
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {language === 'hi' ? 'गैलरी' : language === 'mr' ? 'गॅलरी' : 'Gallery'}
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {t.navReviews}
            </a>
            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-stone-800 transition-colors"
            >
              {t.navLocation}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiAssistant();
              }}
              type="button"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-600/40 text-left font-medium text-xs mt-1 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>Chat with AI Dhaba Concierge (Gemini)</span>
            </button>
          </nav>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
            <span>{business.openingHours}</span>
            <a
              href={`tel:${business.phoneCall}`}
              className="text-amber-400 hover:underline font-mono"
            >
              {business.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
