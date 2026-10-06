import React from 'react';
import { Phone, MapPin, Clock, MessageCircle, Heart } from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';

interface FooterProps {
  language: LanguageCode;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenPrivacy }) => {
  const t = UI_STRINGS[language];
  const business = RESTAURANT_CONFIG.business;

  const brandName =
    language === 'hi' ? business.nameHindi : language === 'mr' ? business.nameMarathi : business.name;

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs py-12 pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Summary */}
          <div className="space-y-3">
            <h3 className="font-display text-lg text-amber-400 font-bold">
              {brandName}
            </h3>
            <p className="text-stone-400 font-light leading-relaxed">
              Authentic Indian Highway Dhaba serving authentic Tandoori starters, Dal Tadka, and Handi
              curries. Open garden lawn & AC family seating.
            </p>
            <div className="flex items-center gap-2 text-stone-300 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{business.daysOpen} ({business.openingHours})</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  {t.navMenu}
                </a>
              </li>
              <li>
                <a href="#specialties" className="hover:text-amber-400 transition-colors">
                  {t.navSpecialties}
                </a>
              </li>
              <li>
                <a href="#seating" className="hover:text-amber-400 transition-colors">
                  {t.navSeating}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-400 transition-colors">
                  {language === 'hi' ? 'गैलरी' : language === 'mr' ? 'गॅलरी' : 'Gallery'}
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-amber-400 transition-colors">
                  {t.navReviews}
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-amber-400 transition-colors">
                  {t.navLocation}
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider font-mono">
              Delivery & Services
            </h4>
            <p className="text-stone-400 font-light leading-relaxed">
              We deliver within 10 km (Dahegaon, Rangari, Saoner bypass, Khapa road).
            </p>
            <div className="space-y-1 text-stone-300">
              <p>· Minimum Order: ₹{business.delivery.minOrderAmount}</p>
              <p>· Free Delivery on orders over ₹{business.delivery.freeDeliveryThreshold}</p>
              <p>· Estimated Time: {business.delivery.estimatedMinutes}</p>
            </div>
          </div>

          {/* Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-100 uppercase tracking-wider font-mono">
              Address & Contact
            </h4>
            <div className="space-y-2 text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{business.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${business.phoneCall}`} className="hover:text-amber-400 font-mono">
                  {business.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Privacy */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} {business.name}. {t.copyright}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-stone-300 underline transition-colors cursor-pointer"
            >
              Privacy Policy & Terms
            </button>
            <span>·</span>
            <span>Made for Highway Food Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
