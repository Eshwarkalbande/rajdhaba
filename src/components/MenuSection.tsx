import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Minus,
  Flame,
  Sparkles,
  UtensilsCrossed,
  Utensils,
  Coffee,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Layers,
  ArrowRight
} from 'lucide-react';
import { RESTAURANT_CONFIG, MenuItem, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { CartItem } from '../types';
import { trackEvent } from '../utils/whatsapp';

interface MenuSectionProps {
  language: LanguageCode;
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  language,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const t = UI_STRINGS[language];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  
  // Horizontal scroll indicator state for category strip
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasSwipedOnMobile, setHasSwipedOnMobile] = useState(false);
  const [swipeNotice, setSwipeNotice] = useState<string | null>(null);

  const categories = RESTAURANT_CONFIG.categories;
  const menuItems = RESTAURANT_CONFIG.menuItems;

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Touch Swipe tracking on menu container for category switching
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isHorizontalGesture = useRef<boolean | null>(null);

  // Check scroll bounds of category strip
  const checkScrollBounds = () => {
    if (!categoryScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;
    checkScrollBounds();
    el.addEventListener('scroll', checkScrollBounds, { passive: true });
    window.addEventListener('resize', checkScrollBounds);
    return () => {
      el.removeEventListener('scroll', checkScrollBounds);
      window.removeEventListener('resize', checkScrollBounds);
    };
  }, []);

  // Auto-center active category button when it changes
  useEffect(() => {
    const activeBtn = categoryButtonRefs.current[selectedCategory];
    if (activeBtn && categoryScrollRef.current) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedCategory]);

  // Current category index in categories array
  const currentCategoryIndex = categories.findIndex((c) => c.id === selectedCategory);

  // Programmatic switch to next/previous category
  const navigateCategory = (direction: 'next' | 'prev') => {
    let nextIdx = currentCategoryIndex;
    if (direction === 'next') {
      nextIdx = currentCategoryIndex < categories.length - 1 ? currentCategoryIndex + 1 : 0;
    } else {
      nextIdx = currentCategoryIndex > 0 ? currentCategoryIndex - 1 : categories.length - 1;
    }
    const nextCat = categories[nextIdx];
    setSelectedCategory(nextCat.id);
    setHasSwipedOnMobile(true);
    trackEvent('category_swiped', { from: selectedCategory, to: nextCat.id, direction });

    // Show temporary toast feedback for user delight
    const catLabel = language === 'hi' ? nextCat.hindi : language === 'mr' ? nextCat.marathi : nextCat.name;
    setSwipeNotice(catLabel);
    setTimeout(() => {
      setSwipeNotice(null);
    }, 1800);
  };

  // Scroll category strip horizontally with chevrons
  const scrollCategoryStrip = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    const offset = direction === 'left' ? -220 : 220;
    categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Touch handlers for horizontal swipe navigation between categories
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    isHorizontalGesture.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Check if gesture is primarily horizontal
    if (isHorizontalGesture.current === null) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        isHorizontalGesture.current = Math.abs(deltaX) > Math.abs(deltaY) * 1.3;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null ||
      isHorizontalGesture.current !== true
    ) {
      touchStartX.current = null;
      touchStartY.current = null;
      isHorizontalGesture.current = null;
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - touchStartX.current;
    const duration = Date.now() - touchStartTime.current;

    // Minimum swipe threshold: 45px or quick flick
    if (Math.abs(deltaX) > 45 && duration < 600) {
      if (deltaX < 0) {
        // Swiped left -> Next Category
        navigateCategory('next');
      } else {
        // Swiped right -> Previous Category
        navigateCategory('prev');
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalGesture.current = null;
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Diet filter
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'nonveg' && item.isVeg) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchHindi = item.hindiName.toLowerCase().includes(query);
        const matchMarathi = item.marathiName.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        return matchName || matchHindi || matchMarathi || matchDesc;
      }

      return true;
    });
  }, [selectedCategory, dietFilter, searchQuery, menuItems]);

  const getItemQuantity = (itemId: string): number => {
    const found = cartItems.find((ci) => ci.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  // Count dishes per category for badge display
  const getCategoryCount = (catId: string): number => {
    if (catId === 'all') return menuItems.length;
    return menuItems.filter((i) => i.category === catId).length;
  };

  // Category Icon helper
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'all':
        return <Layers className="w-3.5 h-3.5 shrink-0" />;
      case 'starters':
        return <Flame className="w-3.5 h-3.5 shrink-0 text-amber-400" />;
      case 'main_veg':
        return <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-400" />;
      case 'main_nonveg':
        return <Flame className="w-3.5 h-3.5 shrink-0 text-red-400" />;
      case 'breads':
        return <Utensils className="w-3.5 h-3.5 shrink-0 text-amber-300" />;
      case 'rice_biryani':
        return <Sparkles className="w-3.5 h-3.5 shrink-0 text-yellow-300" />;
      case 'thalis':
        return <UtensilsCrossed className="w-3.5 h-3.5 shrink-0 text-amber-400" />;
      case 'beverages':
        return <Coffee className="w-3.5 h-3.5 shrink-0 text-sky-400" />;
      default:
        return <Utensils className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  return (
    <section id="menu" className="py-14 sm:py-20 bg-stone-950 text-stone-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-500 mb-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Clay Tandoor & Desi Handi</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              {language === 'hi'
                ? 'हमारा प्रामाणिक ढाबा मेन्यू'
                : language === 'mr'
                ? 'आमचा अस्सल ढाबा मेनू'
                : 'Our Authentic Dhaba Menu'}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 font-light">
              {language === 'hi'
                ? 'सभी व्यंजन ताजे मसालों और शुद्ध घी में तैयार किए जाते हैं।'
                : language === 'mr'
                ? 'सर्व पदार्थ ताज्या मसाल्यांमध्ये आणि साजूक तुपात बनवले जातात.'
                : 'Prepared fresh to order with hand-ground spices and traditional clay oven craft.'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'डिश खोजें (उदा. दाल, पनीर, चिकन)...'
                  : language === 'mr'
                  ? 'पदार्थ शोधा (उदा. डाळ, पनीर, चिकन)...'
                  : 'Search menu (e.g. Dal, Paneer, Biryani)...'
              }
              className="w-full pl-10 pr-14 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400 hover:text-amber-300 font-medium px-1.5 py-0.5 rounded bg-stone-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row: Category Tabs & Veg/Non-Veg Toggle */}
        <div className="space-y-4 mb-6">
          
          {/* TOUCH-FRIENDLY HORIZONTAL SWIPE CATEGORIES BAR */}
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            
            {/* Left Scroll Gradient & Tap Arrow */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-4 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent pointer-events-none">
                <button
                  type="button"
                  onClick={() => scrollCategoryStrip('left')}
                  className="pointer-events-auto p-1.5 rounded-full bg-stone-800/90 text-stone-200 hover:text-white shadow-lg border border-stone-700 active:scale-90 transition-transform ml-1 cursor-pointer"
                  aria-label="Scroll categories left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Right Scroll Gradient & Tap Arrow */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-4 bg-gradient-to-l from-stone-950 via-stone-950/90 to-transparent pointer-events-none">
                <button
                  type="button"
                  onClick={() => scrollCategoryStrip('right')}
                  className="pointer-events-auto p-1.5 rounded-full bg-stone-800/90 text-stone-200 hover:text-white shadow-lg border border-stone-700 active:scale-90 transition-transform mr-1 cursor-pointer"
                  aria-label="Scroll categories right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scrollable / Swipeable Categories Container */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar touch-momentum touch-pan-y"
            >
              {categories.map((cat, idx) => {
                const isActive = selectedCategory === cat.id;
                const catLabel =
                  language === 'hi' ? cat.hindi : language === 'mr' ? cat.marathi : cat.name;
                const itemCount = getCategoryCount(cat.id);

                return (
                  <button
                    key={cat.id}
                    ref={(el) => {
                      categoryButtonRefs.current[cat.id] = el;
                    }}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setHasSwipedOnMobile(true);
                      trackEvent('category_tab_click', { categoryId: cat.id });
                    }}
                    type="button"
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-2 border active:scale-95 ${
                      isActive
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-950 font-semibold'
                        : 'bg-stone-900 text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 border-stone-800'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                    <span>{catLabel}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-amber-800/80 text-amber-100'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {itemCount}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* MOBILE SWIPE NAVIGATION CONTROLLER & HINT */}
          <div className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-stone-900/70 border border-stone-800/70 text-xs">
            {/* Previous Category Button */}
            <button
              onClick={() => navigateCategory('prev')}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 active:scale-95 transition-all text-[11px] font-medium cursor-pointer"
              title="Previous category"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            {/* Mobile Category Step Counter & Gesture Hint */}
            <div className="flex flex-col items-center justify-center text-center px-1">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-stone-200 text-xs truncate max-w-[140px] xs:max-w-[200px]">
                  {language === 'hi'
                    ? categories[currentCategoryIndex]?.hindi
                    : language === 'mr'
                    ? categories[currentCategoryIndex]?.marathi
                    : categories[currentCategoryIndex]?.name}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  ({currentCategoryIndex + 1}/{categories.length})
                </span>
              </div>
              <span className="text-[10px] text-stone-400 hidden xs:inline">
                👉 Swipe left/right on dishes to switch category 👈
              </span>
            </div>

            {/* Next Category Button */}
            <button
              onClick={() => navigateCategory('next')}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 active:scale-95 transition-all text-[11px] font-medium cursor-pointer"
              title="Next category"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sub-Filters: Pure Veg / Non-Veg Segmented Control */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="inline-flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
              <button
                onClick={() => setDietFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  dietFilter === 'all'
                    ? 'bg-stone-800 text-white font-medium shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {t.all}
              </button>
              <button
                onClick={() => setDietFilter('veg')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 font-medium'
                    : 'text-stone-400 hover:text-emerald-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{t.pureVeg}</span>
              </button>
              <button
                onClick={() => setDietFilter('nonveg')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  dietFilter === 'nonveg'
                    ? 'bg-red-950/80 text-red-300 border border-red-600/50 font-medium'
                    : 'text-stone-400 hover:text-red-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>{t.nonVeg}</span>
              </button>
            </div>

            <span className="text-stone-400 text-xs">
              Showing <span className="font-bold text-amber-400">{filteredItems.length}</span> dishes
            </span>
          </div>

        </div>

        {/* Temporary Category Swipe Toast Notification */}
        {swipeNotice && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-stone-900/95 border border-amber-500/60 text-amber-300 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Category: {swipeNotice}</span>
          </div>
        )}

        {/* Menu Items Grid with Touch Horizontal Swipe Support */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative touch-pan-y"
        >
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center bg-stone-900/40 rounded-2xl border border-stone-800/80 space-y-3">
              <p className="text-base text-stone-300 font-medium">No dishes found matching your query.</p>
              <p className="text-xs text-stone-500">Try searching for other dishes or reset the filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setDietFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-500 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((dish) => {
                const qty = getItemQuantity(dish.id);
                const displayName =
                  language === 'hi' ? dish.hindiName : language === 'mr' ? dish.marathiName : dish.name;
                const displayDesc =
                  language === 'hi' && dish.descriptionHindi
                    ? dish.descriptionHindi
                    : language === 'mr' && dish.descriptionMarathi
                    ? dish.descriptionMarathi
                    : dish.description;

                return (
                  <div
                    key={dish.id}
                    className="flex flex-col justify-between bg-stone-900/80 rounded-2xl p-5 border border-stone-800/80 hover:border-stone-700 transition-all hover:bg-stone-900 shadow-sm"
                  >
                    <div className="space-y-2.5">
                      {/* Top Row: Diet marker & Price */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {/* Veg / Non-Veg Square Indicator */}
                          <span
                            className={`inline-flex items-center justify-center w-4 h-4 rounded-xs border ${
                              dish.isVeg ? 'border-emerald-500' : 'border-red-500'
                            }`}
                            title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                          </span>

                          {dish.isSignature && (
                            <span className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Signature</span>
                            </span>
                          )}
                          {dish.isBestseller && (
                            <span className="text-[11px] text-amber-300 font-medium">
                              · Bestseller
                            </span>
                          )}
                        </div>

                        {/* Price in Tabular Numerals */}
                        <span className="font-mono tabular-nums text-base font-bold text-amber-400 shrink-0">
                          ₹{dish.price}
                        </span>
                      </div>

                      {/* Dish Name */}
                      <h3 className="font-display text-base text-stone-100 font-semibold leading-snug">
                        {displayName}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-stone-400 line-clamp-2 font-light leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    {/* Bottom Row: Metadata & Stepper with touch-friendly min height */}
                    <div className="pt-4 mt-3 border-t border-stone-800/60 flex items-center justify-between">
                      <div className="text-[11px] text-stone-500">
                        {dish.spicyLevel === 3 ? (
                          <span className="text-red-400/90">Spicy Tadka 🔥🔥🔥</span>
                        ) : dish.spicyLevel === 2 ? (
                          <span className="text-amber-400/80">Medium Spicy 🔥🔥</span>
                        ) : (
                          <span>Mild & Rich 🔥</span>
                        )}
                      </div>

                      {/* Add / Stepper Button with at least 44px touch area */}
                      {qty === 0 ? (
                        <button
                          onClick={() => {
                            onAddToCart(dish);
                            trackEvent('menu_item_add', { id: dish.id, name: dish.name });
                          }}
                          type="button"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-white border border-stone-700/80 hover:border-amber-500 text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap min-h-[40px]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-stone-950 border border-amber-600/60 rounded-xl p-1 shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(dish.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 active:scale-90 transition-all cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-bold text-amber-400 tabular-nums">
                            {qty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(dish.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 active:scale-90 transition-all cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
