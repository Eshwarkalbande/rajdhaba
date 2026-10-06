import React from 'react';
import { MessageCircle, Phone, Navigation, ShoppingBag, Bot } from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { trackEvent, generateWhatsAppQuickChatUrl } from '../utils/whatsapp';

interface FloatingActionsProps {
  language: LanguageCode;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiAssistant: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  language,
  cartCount,
  onOpenCart,
  onOpenAiAssistant,
}) => {
  const t = UI_STRINGS[language];
  const business = RESTAURANT_CONFIG.business;

  return (
    <>
      {/* Desktop & Tablet: Floating WhatsApp & Gemini Chatbot Buttons (Bottom Right) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col items-end gap-2.5 pointer-events-auto">
        
        {/* Gemini Chatbot Floating Button */}
        <button
          onClick={() => {
            trackEvent('floating_gemini_chat_clicked');
            onOpenAiAssistant();
          }}
          type="button"
          className="group relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-amber-500/50 hover:border-amber-400 text-xs font-semibold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Chat with Dhaba AI Concierge"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <Bot className="w-4 h-4 text-amber-400" />
          <span className="font-sans">Ask AI Concierge</span>
        </button>

        {/* Floating WhatsApp Action Button */}
        <button
          onClick={() => {
            trackEvent('floating_whatsapp_btn_clicked');
            onOpenCart();
          }}
          type="button"
          className="group relative inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer whatsapp-pulse"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white/20" />
          <span className="font-sans">Order on WhatsApp</span>
          {cartCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-950 text-amber-400 text-[10px] font-bold font-mono">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Sticky Bottom Bar (Strictly <15% viewport height, ~54px + safe area) */}
      <nav 
        aria-label="Mobile quick actions"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 px-2.5 py-1.5 flex items-center justify-between gap-1.5 safe-area-bottom shadow-2xl"
      >
        {/* Call Button */}
        <a
          href={`tel:${business.phoneCall}`}
          onClick={() => trackEvent('mobile_bar_call_click')}
          className="flex-1 min-w-[50px] flex flex-col items-center justify-center py-1 rounded-lg text-stone-300 hover:text-white active:bg-stone-900 transition-colors"
        >
          <Phone className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[10px] mt-0.5 font-medium truncate">Call</span>
        </a>

        {/* AI Concierge Chatbot Button */}
        <button
          onClick={() => {
            trackEvent('mobile_bar_ai_click');
            onOpenAiAssistant();
          }}
          type="button"
          className="flex-1 min-w-[50px] flex flex-col items-center justify-center py-1 rounded-lg text-amber-300 hover:text-amber-200 active:bg-stone-900 transition-colors cursor-pointer"
        >
          <Bot className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[10px] mt-0.5 font-medium truncate">AI Guide</span>
        </button>

        {/* Directions Button */}
        <a
          href={business.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('mobile_bar_maps_click')}
          className="flex-1 min-w-[50px] flex flex-col items-center justify-center py-1 rounded-lg text-stone-300 hover:text-white active:bg-stone-900 transition-colors"
        >
          <Navigation className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[10px] mt-0.5 font-medium truncate">Map</span>
        </a>

        {/* WhatsApp / Cart Primary CTA */}
        <button
          onClick={() => {
            trackEvent('mobile_bar_order_click');
            onOpenCart();
          }}
          type="button"
          className="flex-[2] py-2 px-2.5 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/50 truncate cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white/20 shrink-0" />
          <span className="truncate">Order WhatsApp</span>
          {cartCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-stone-950 text-amber-400 text-[9px] font-bold font-mono flex items-center justify-center shrink-0">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
};
