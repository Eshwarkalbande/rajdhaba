import React from 'react';
import { MapPin, Navigation, Phone, Clock, MessageCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { trackEvent, generateWhatsAppQuickChatUrl } from '../utils/whatsapp';

interface LocationSectionProps {
  language: LanguageCode;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ language }) => {
  const t = UI_STRINGS[language];
  const business = RESTAURANT_CONFIG.business;

  const addressText =
    language === 'hi'
      ? business.addressHindi
      : language === 'mr'
      ? business.addressMarathi
      : business.address;

  return (
    <section id="location" className="py-16 md:py-24 bg-stone-900 border-t border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Easy Highway Access</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
            {language === 'hi' ? 'हमारा पता और स्थान' : 'Visit Us on Dahegaon Road'}
          </h2>
          <p className="mt-2 text-stone-400 text-sm sm:text-base font-light">
            Conveniently situated on Dahegaon Road near Saoner bypass with spacious vehicle parking.
          </p>
        </div>

        {/* 2-Column: Details Card Left, Embedded Map Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details (5 cols) */}
          <div className="lg:col-span-5 bg-stone-950 rounded-2xl p-6 sm:p-8 border border-stone-800 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {/* Full Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Full Address</h4>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 font-light leading-relaxed">
                    {addressText}
                  </p>
                  <span className="text-[11px] text-amber-400/90 block mt-1">
                    Landmark: {business.landmark}
                  </span>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Operating Hours</h4>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 font-mono">
                    {business.openingHours}
                  </p>
                  <span className="text-[11px] text-emerald-400 block mt-0.5">
                    Open all 7 days for Dine-in, Drive-through & Delivery
                  </span>
                </div>
              </div>

              {/* Telephone & Contact */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Direct Phone Call</h4>
                  <a
                    href={`tel:${business.phoneCall}`}
                    onClick={() => trackEvent('location_call_click')}
                    className="text-xs sm:text-sm text-amber-400 hover:underline font-mono font-bold block mt-1"
                  >
                    {business.phoneDisplay}
                  </a>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    Quick inquiries & table assistance
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-800/80 space-y-2.5">
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('google_maps_directions_click')}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>{t.getDirections} (Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={generateWhatsAppQuickChatUrl('Directions and Landmark')}
                className="w-full py-3 px-4 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Ask Live Route on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Embedded Google Map (7 cols) */}
          <div className="lg:col-span-7 bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 min-h-[280px] sm:min-h-[380px] flex flex-col">
            <div className="p-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Google Maps Location</span>
              </span>
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Open in App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 w-full h-full relative">
              <iframe
                title="Google Maps Location of New Raj Dhaba And Family Restaurant"
                src={business.googleMapsEmbed}
                className="w-full h-full min-h-[350px] border-0 filter grayscale-20 contrast-110"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
