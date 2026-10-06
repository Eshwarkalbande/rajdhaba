import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { trackEvent } from '../utils/whatsapp';

interface GallerySectionProps {
  language: LanguageCode;
}

interface GalleryItem {
  id: string;
  image: string;
  title: string;
  titleHindi: string;
  titleMarathi: string;
  category: string;
  caption: string;
  captionHindi: string;
  captionMarathi: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ language }) => {
  const t = UI_STRINGS[language];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasSwipedHint, setHasSwipedHint] = useState(false);

  // References
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isMouseDown = useRef<boolean>(false);

  const thumbStripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      image: '/src/assets/images/hero_dhaba_feast_1791300327374.jpg',
      title: 'Grand Highway Dhaba Feast',
      titleHindi: 'असली ढाबा थाली व दावत',
      titleMarathi: 'अस्सल ढाबा शाही बेत',
      category: 'Special Feast',
      caption: 'Full spread of copper handi Dal Tadka, Biryani, char-grilled Tandoori rotis, and fresh salads on a rustic teak table.',
      captionHindi: 'तांबे की हांडी में दाल तड़का, सुगंधित बिरयानी, तंदूरी रोटियां और लजीज सलाद।',
      captionMarathi: 'तांब्याच्या हंडीत डाळ तडका, दम बिर्याणी, तंदूरी पोळ्या आणि ताजी कोशिंबीर.',
    },
    {
      id: 'g2',
      image: '/src/assets/images/specialty_dal_tadka_1791300341169.jpg',
      title: 'Double Desi Ghee Dal Tadka',
      titleHindi: 'डबल देसी घी दाल तड़का',
      titleMarathi: 'डबल साजूक तूप डाळ तडका',
      category: 'Signature Dish',
      caption: 'Yellow arhar dal simmered on iron tawa and tempered with cumin, whole red chillies, and garlic in smoking pure desi ghee.',
      captionHindi: 'शुद्ध देसी घी, साबुत लाल मिर्च और लहसुन के तड़के वाली हमारी सबसे लोकप्रिय दाल।',
      captionMarathi: 'शुद्ध साजूक तूप, लसूण आणि लाल मिरच्यांचा खमंग तडका असलेली अस्सल ढाबा डाळ.',
    },
    {
      id: 'g3',
      image: '/src/assets/images/specialty_paneer_tikka_1791300360286.jpg',
      title: 'Clay Tandoor Charcoal Paneer Tikka',
      titleHindi: 'मिट्टी के तंदूर का पनीर टिक्का',
      titleMarathi: 'मातीच्या तंदूरमधील पनीर टिक्का',
      category: 'Tandoori Starter',
      caption: 'Fresh malai paneer cubes marinated with curd and spices, roasted directly over live coals in a traditional clay tandoor.',
      captionHindi: 'दही और कश्मीरी मसालों में मेरिनेट किया हुआ धुआंधार पनीर टिक्का।',
      captionMarathi: 'दही व मसाल्यांमध्ये मुरवलेले मऊ पनीर, कोळशावर भाजलेले खमंग टिक्का.',
    },
    {
      id: 'g4',
      image: '/src/assets/images/specialty_chicken_handi_1791300382179.jpg',
      title: 'Desi Chicken Handi in Earthen Clay Pot',
      titleHindi: 'देसी चिकन हांडी (मिट्टी का बर्तन)',
      titleMarathi: 'देशी चिकन हांडी (मातीचे भांडे)',
      category: 'Non-Veg Pride',
      caption: 'Slow-cooked in a sealed earthen pot with coarse highway spices, spicy red tarri gravy, and soft garlic butter naan.',
      captionHindi: 'मिट्टी की हांडी में धीमी आंच पर पका चिकन, गाढ़ी तरी और खड़े मसालों की महक।',
      captionMarathi: 'मातीच्या हांडीमध्ये शिजवलेले चिकन, गावरान मसाल्यांचा झणझणीत रस्सा.',
    },
    {
      id: 'g5',
      image: '/src/assets/images/ambiance_dhaba_lawn_1791300394256.jpg',
      title: 'Night Terrace Garden & Fairy Lights',
      titleHindi: 'गार्डन व छत बैठक (रात का नजारा)',
      titleMarathi: 'ओपन गार्डन व गच्ची (रात्रीचा देखावा)',
      category: 'Dhaba Ambiance',
      caption: 'Open-air terrace lawn illuminated with warm string bulb fairy lights, comfortable wooden tables, and starry night skies.',
      captionHindi: 'गर्मियों की शाम में ठंडी हवा, खूबसूरत लाइटें और तारों भरी रात के नीचे सुकून भरा भोजन।',
      captionMarathi: 'रोषणाईने सजलेले ओपन गार्डन, शांत निसर्गरम्य वातावरण आणि कौटुंबिक जेवणाचा आनंद.',
    },
  ];

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const thumbBtn = thumbRefs.current[activeIndex];
    if (thumbBtn && thumbStripRef.current) {
      thumbBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1));
    setHasSwipedHint(true);
    trackEvent('gallery_swipe_prev', { newIndex: activeIndex - 1 });
  }, [galleryItems.length, activeIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
    setHasSwipedHint(true);
    trackEvent('gallery_swipe_next', { newIndex: activeIndex + 1 });
  }, [galleryItems.length, activeIndex]);

  // Touch Swipe Handlers with real-time finger-follow transform
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Detect horizontal swipe intent vs vertical page scroll
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipe.current) {
      // Apply rubber-band resistance at edges
      let resistanceDelta = deltaX;
      if (
        (activeIndex === 0 && deltaX > 0) ||
        (activeIndex === galleryItems.length - 1 && deltaX < 0)
      ) {
        resistanceDelta = deltaX * 0.35;
      }
      setDragOffset(resistanceDelta);
    }
  };

  const onTouchEnd = () => {
    if (isHorizontalSwipe.current) {
      const threshold = 45; // 45px swipe threshold
      if (dragOffset < -threshold) {
        handleNext();
      } else if (dragOffset > threshold) {
        handlePrev();
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalSwipe.current = null;
  };

  // Mouse Drag handlers for desktop drag-to-swipe
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
    isMouseDown.current = true;
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || mouseStartX.current === null) return;
    const deltaX = e.clientX - mouseStartX.current;
    let resistanceDelta = deltaX;
    if (
      (activeIndex === 0 && deltaX > 0) ||
      (activeIndex === galleryItems.length - 1 && deltaX < 0)
    ) {
      resistanceDelta = deltaX * 0.35;
    }
    setDragOffset(resistanceDelta);
  };

  const onMouseUp = () => {
    if (!isMouseDown.current) return;
    if (dragOffset < -50) {
      handleNext();
    } else if (dragOffset > 50) {
      handlePrev();
    }
    setDragOffset(0);
    setIsDragging(false);
    isMouseDown.current = false;
    mouseStartX.current = null;
  };

  const onMouseLeave = () => {
    if (isMouseDown.current) {
      onMouseUp();
    }
  };

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrev, handleNext]);

  const currentItem = galleryItems[activeIndex];
  const itemTitle =
    language === 'hi'
      ? currentItem.titleHindi
      : language === 'mr'
      ? currentItem.titleMarathi
      : currentItem.title;
  const itemCaption =
    language === 'hi'
      ? currentItem.captionHindi
      : language === 'mr'
      ? currentItem.captionMarathi
      : currentItem.caption;

  return (
    <section id="gallery" className="py-14 sm:py-20 bg-stone-900 border-b border-stone-800 text-stone-100 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Dhaba Atmosphere & Food</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-tight">
              {language === 'hi'
                ? 'फोटो गैलरी: ढाबा और व्यंजन'
                : language === 'mr'
                ? 'छायाचित्रे: ढाबा आणि चविष्ट पदार्थ'
                : 'Restaurant & Food Gallery'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 font-light">
              Swipe left or right to explore our fresh tandoor dishes, handi curries, and open-air lawn ambiance.
            </p>
          </div>

          {/* Desktop & Tablet Navigation Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handlePrev}
              type="button"
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 active:scale-95 transition-all cursor-pointer shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 active:scale-95 transition-all cursor-pointer shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN TOUCH-FRIENDLY HORIZONTAL SWIPE CAROUSEL */}
        <div className="relative group rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl touch-pan-y">
          
          {/* Top Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-stone-800/80">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / galleryItems.length) * 100}%` }}
            />
          </div>

          {/* Real-time Smooth Drag Track */}
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            className="flex cursor-grab active:cursor-grabbing"
            style={{
              transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
          >
            {galleryItems.map((item, idx) => {
              const title =
                language === 'hi'
                  ? item.titleHindi
                  : language === 'mr'
                  ? item.titleMarathi
                  : item.title;
              const caption =
                language === 'hi'
                  ? item.captionHindi
                  : language === 'mr'
                  ? item.captionMarathi
                  : item.caption;

              return (
                <div
                  key={item.id}
                  className="w-full shrink-0 relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden select-none"
                  onClick={() => {
                    // Open lightbox on tap if not dragging
                    if (Math.abs(dragOffset) < 5) {
                      setActiveIndex(idx);
                      setLightboxOpen(true);
                    }
                  }}
                >
                  <img
                    src={item.image}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 pointer-events-none"
                    draggable={false}
                  />

                  {/* Contrast Scrim for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono text-amber-300 shadow-sm">
                      {item.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(idx);
                        setLightboxOpen(true);
                      }}
                      className="pointer-events-auto p-2 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-700 text-stone-200 hover:text-white text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform cursor-pointer"
                      title="Expand to Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">View Full</span>
                    </button>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 pointer-events-none">
                    <h3 className="font-display text-lg sm:text-2xl font-bold text-white leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 font-light mt-1 line-clamp-2 max-w-2xl">
                      {caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Mobile Touch Chevrons (>= 48px touch targets) */}
          <button
            onClick={handlePrev}
            type="button"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700/80 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform cursor-pointer z-10 hover:bg-stone-900"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700/80 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform cursor-pointer z-10 hover:bg-stone-900"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Floating Mobile Gesture Prompt Badge (Disappears after user swiped) */}
          {!hasSwipedHint && (
            <div className="sm:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1.5 rounded-full bg-stone-950/90 border border-amber-500/50 backdrop-blur-md text-[11px] text-amber-300 font-medium pointer-events-none shadow-lg animate-pulse">
              👈 Swipe to explore photos 👉
            </div>
          )}

        </div>

        {/* Carousel Indicators & Slide Counter */}
        <div className="flex items-center justify-between pt-3 px-1">
          {/* Expanding Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {galleryItems.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => {
                  setActiveIndex(dotIdx);
                  setHasSwipedHint(true);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === dotIdx
                    ? 'w-7 bg-amber-500'
                    : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          {/* Counter Badge */}
          <div className="text-xs font-mono text-stone-400">
            <span className="text-amber-400 font-bold">{activeIndex + 1}</span> / {galleryItems.length}
          </div>
        </div>

        {/* TOUCH-FRIENDLY HORIZONTAL SWIPEABLE THUMBNAIL STRIP */}
        <div className="relative mt-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={thumbStripRef}
            className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar touch-momentum touch-pan-y"
          >
            {galleryItems.map((item, thumbIdx) => {
              const isSelected = activeIndex === thumbIdx;
              const title =
                language === 'hi'
                  ? item.titleHindi
                  : language === 'mr'
                  ? item.titleMarathi
                  : item.title;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    thumbRefs.current[thumbIdx] = el;
                  }}
                  onClick={() => {
                    setActiveIndex(thumbIdx);
                    setHasSwipedHint(true);
                  }}
                  className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-amber-500 shadow-md scale-102 ring-2 ring-amber-500/40 opacity-100'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${thumbIdx + 1}: ${title}`}
                >
                  <img
                    src={item.image}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-amber-500/10 border-t-2 border-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* FULLSCREEN TOUCH-FRIENDLY LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white safe-area-inset-top">
            <div>
              <h4 className="font-display text-base sm:text-lg font-bold">{itemTitle}</h4>
              <span className="text-xs font-mono text-stone-400">
                Photo {activeIndex + 1} of {galleryItems.length} · {currentItem.category}
              </span>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Center Image with Touch Swiping */}
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="flex-1 flex items-center justify-center relative my-4 touch-pan-y"
          >
            <img
              src={currentItem.image}
              alt={itemTitle}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-stone-800 select-none"
              style={{
                transform: `translateX(${dragOffset}px)`,
                transition: isDragging ? 'none' : 'transform 260ms ease-out',
              }}
            />

            {/* Lightbox Prev / Next Buttons */}
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-950/80 border border-stone-700 text-white flex items-center justify-center hover:bg-stone-800 active:scale-90 transition-all cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-stone-950/80 border border-stone-700 text-white flex items-center justify-center hover:bg-stone-800 active:scale-90 transition-all cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Caption */}
          <div className="text-center text-xs sm:text-sm text-stone-300 max-w-xl mx-auto safe-area-bottom">
            {itemCaption}
          </div>
        </div>
      )}
    </section>
  );
};
