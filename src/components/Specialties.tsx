import React from 'react';
import { Plus, Minus, Check, Flame, Sparkles } from 'lucide-react';
import { RESTAURANT_CONFIG, MenuItem, LanguageCode } from '../data/restaurantConfig';
import { CartItem } from '../types';
import { trackEvent } from '../utils/whatsapp';

interface SpecialtiesProps {
  language: LanguageCode;
  cartItems: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
}

export const Specialties: React.FC<SpecialtiesProps> = ({
  language,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
}) => {
  // Find our 3 signature dishes
  const signatureItems = RESTAURANT_CONFIG.menuItems.filter((i) => i.isSignature && i.image);

  const sectionTitle =
    language === 'hi'
      ? 'न्यू राज ढाबा की मुख्य विशेषताएं'
      : language === 'mr'
      ? 'न्यू राज ढाब्याची खास वैशिष्ट्ये'
      : 'Signature Dhaba Specialties';

  const sectionSubtitle =
    language === 'hi'
      ? 'दशकों पुराना पारंपरिक स्वाद, शुद्ध देसी घी और मिट्टी के तंदूर का कमाल।'
      : language === 'mr'
      ? 'वर्षानुवर्षे जपलेली अस्सल चव, शुद्ध साजूक तूप आणि मातीच्या तंदूरची जादू.'
      : 'Time-honored recipes perfected on slow flame with whole spices and pure desi ghee.';

  const getItemQuantity = (itemId: string): number => {
    const found = cartItems.find((ci) => ci.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <section id="specialties" className="py-16 md:py-24 bg-stone-900 border-t border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chef's Handcrafted Pride</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-bold text-balance">
            {sectionTitle}
          </h2>
          <p className="mt-2 text-stone-400 text-sm sm:text-base font-light">
            {sectionSubtitle}
          </p>
        </div>

        {/* 3-Column Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signatureItems.map((dish) => {
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
                className="group flex flex-col bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-600/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-stone-950/80"
              >
                {/* Image Container with Fallback */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-900 to-stone-950 text-stone-600">
                      <Flame className="w-12 h-12 text-amber-600/40" />
                    </div>
                  )}

                  {/* Veg / Non-Veg Indicator & Price Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 rounded-sm border ${
                        dish.isVeg
                          ? 'border-emerald-500/80 bg-stone-950/80'
                          : 'border-red-500/80 bg-stone-950/80'
                      }`}
                      title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          dish.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-stone-950/90 backdrop-blur-md border border-stone-800 text-amber-400 font-mono text-sm font-bold tabular-nums">
                    ₹{dish.price}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Metadata line without pill box */}
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span>{dish.isVeg ? 'Pure Veg' : 'Non-Veg'}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {dish.spicyLevel === 3
                          ? 'Highway Spicy'
                          : dish.spicyLevel === 2
                          ? 'Medium Tadka'
                          : 'Mild & Rich'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-400/90 font-medium">Signature</span>
                    </div>

                    <h3 className="font-display text-lg text-white font-semibold group-hover:text-amber-300 transition-colors">
                      {displayName}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-400 line-clamp-3 font-light leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  {/* Action / Stepper Button */}
                  <div className="pt-2 border-t border-stone-900 flex items-center justify-between">
                    <span className="text-xs text-stone-400">Order for meal:</span>

                    {qty === 0 ? (
                      <button
                        onClick={() => {
                          onAddToCart(dish);
                          trackEvent('add_to_cart_specialty', { dishId: dish.id, name: dish.name });
                        }}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add +</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(dish.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-amber-400 tabular-nums">
                          {qty}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(dish.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
