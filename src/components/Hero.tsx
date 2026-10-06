import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Phone,
  Flame,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  HelpCircle,
  Bot
} from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { trackEvent, generateWhatsAppQuickChatUrl } from '../utils/whatsapp';

interface HeroProps {
  language: LanguageCode;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
  onOpenAiAssistant: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onOpenCart,
  onOpenQuiz,
  onOpenAiAssistant,
}) => {
  const t = UI_STRINGS[language];
  const business = RESTAURANT_CONFIG.business;

  // 3D Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || window.innerWidth < 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Max tilt 12 degrees
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const heroHeadline =
    language === 'hi'
      ? 'देसी घी का तड़का, मिट्टी के तंदूर का स्वाद'
      : language === 'mr'
      ? 'अस्सल गावरान चव आणि मातीच्या तंदूरचा सुगंध'
      : 'Authentic Highway Dhaba Flavors & Warm Family Dining';

  const heroSubtext =
    language === 'hi'
      ? 'दहेगांव रोड पर परिवार के साथ सुकून से बैठें या घर बैठे गरमा-गरम दाल तड़का, पनीर टिक्का और हांडी चिकन सीधे व्हाट्सएप पर आर्डर करें।'
      : language === 'mr'
      ? 'दहेगाव रोडवरील निसर्गरम्य वातावरणात कौटुंबिक जेवणाचा आनंद घ्या किंवा गरमागरम ढाबा स्पेशल जेवण थेट व्हॉट्सॲपवर मागवा.'
      : 'Savor rich slow-cooked Dal Tadka, charcoal clay-tandoor kebabs, and authentic clay pot Chicken Handi. Open garden seating, private AC hall, and 35-minute WhatsApp delivery.';

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100">
      {/* Background ambient warm illumination */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-600/15 via-red-900/10 to-transparent blur-3xl rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust badge kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 border border-amber-600/30 text-amber-300 text-xs font-medium max-w-full">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse shrink-0" />
              <span className="truncate">100% Pure Desi Ghee & Charcoal Clay Tandoor</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-[1.2] text-balance">
              {heroHeadline}
            </h1>

            {/* Subtitle prose */}
            <p className="text-sm sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-light">
              {heroSubtext}
            </p>

            {/* Primary Action Button Cluster */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
              {/* WhatsApp Order Button */}
              <button
                onClick={() => {
                  trackEvent('hero_order_whatsapp_clicked');
                  onOpenCart();
                }}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white/20 shrink-0" />
                <span>{t.navOrderWhatsApp}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* View Menu Button */}
                <a
                  href="#menu"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700/80 font-medium text-xs sm:text-base transition-colors"
                >
                  <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.viewMenu}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 hidden sm:inline" />
                </a>

                {/* Direct Call Button */}
                <a
                  href={`tel:${business.phoneCall}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 font-medium text-xs sm:text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t.callUs}</span>
                </a>
              </div>
            </div>

            {/* Interactive Feature Shortcuts: AI Assistant & Dish Quiz */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                onClick={onOpenAiAssistant}
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/50 border border-amber-700/40 text-amber-300 text-xs font-medium transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask AI Menu Guide (Gemini)</span>
              </button>

              <button
                onClick={onOpenQuiz}
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 text-stone-300 text-xs font-medium transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>"What Should I Eat?" Quiz</span>
              </button>
            </div>

            {/* Proof & Trust Markers (Adjacency principle) */}
            <div className="pt-4 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Open 11 AM – 11:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Delivery Within 10 km</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Dahegaon (Rangari)</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Tilting Signature Feast Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: '1000px',
              }}
              className="relative w-full max-w-md group"
            >
              {/* Card Container with 3D Transform */}
              <div
                style={{
                  transform:
                    isReducedMotion || window.innerWidth < 768
                      ? 'none'
                      : `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1, 1, 1)`,
                  transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                  transformStyle: 'preserve-3d',
                }}
                className="relative rounded-2xl overflow-hidden bg-stone-900 border border-amber-600/30 shadow-2xl shadow-stone-950/80"
              >
                {/* Feast Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-950">
                  <img
                    src="/src/assets/images/hero_dhaba_feast_1791300327374.jpg"
                    alt="Authentic Highway Dhaba Feast at New Raj Dhaba with Dal Tadka and Tandoori Rotis"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Contrast Scrim for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                  {/* Rising Steam Effect over the handi */}
                  {!isReducedMotion && (
                    <div 
                      aria-hidden="true" 
                      className="absolute bottom-16 left-1/3 -translate-x-1/2 pointer-events-none"
                    >
                      <div className="w-6 h-12 bg-gradient-to-t from-white/30 to-transparent rounded-full blur-md animate-steam" />
                      <div className="w-4 h-10 bg-gradient-to-t from-white/20 to-transparent rounded-full blur-sm animate-steam-delayed -ml-2" />
                    </div>
                  )}

                  {/* Floating Spice Indicator */}
                  {!isReducedMotion && (
                    <div 
                      aria-hidden="true" 
                      className="absolute top-4 right-4 pointer-events-none px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-500/40 text-[11px] text-amber-300 animate-float-slow flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Fresh Tandoor Charcoal</span>
                    </div>
                  )}
                </div>

                {/* Card Content Overlay */}
                <div className="p-5 space-y-3 bg-stone-900/95">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg text-white font-semibold">
                        Highway Royal Dhaba Thali
                      </h3>
                      <p className="text-xs text-amber-400/90 font-medium">
                        Dal Tadka · Paneer Sabji · Jeera Rice · Butter Rotis
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Combo Special</span>
                      <span className="font-mono tabular-nums text-lg font-bold text-amber-400">
                        ₹240
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs text-stone-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Ready in 20 Mins
                    </span>
                    <button
                      onClick={() => {
                        trackEvent('hero_dish_quick_order');
                        onOpenCart();
                      }}
                      className="text-amber-400 hover:text-amber-300 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span>Add to Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
