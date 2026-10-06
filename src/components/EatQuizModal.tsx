import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Sparkles,
  Check,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { RESTAURANT_CONFIG, MenuItem, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { QuizState } from '../types';
import { formatINR, sanitizePhoneNumber, trackEvent } from '../utils/whatsapp';

interface EatQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onAddMultipleToCart: (items: { menuItem: MenuItem; quantity: number }[]) => void;
}

export const EatQuizModal: React.FC<EatQuizModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddMultipleToCart,
}) => {
  const t = UI_STRINGS[language];
  const [step, setStep] = useState<number>(1);
  const [quizState, setQuizState] = useState<QuizState>({
    diet: 'veg',
    spice: 2,
    groupSize: 'solo',
    budget: 'medium',
  });

  const [recommendedCombo, setRecommendedCombo] = useState<
    { menuItem: MenuItem; quantity: number }[] | null
  >(null);

  // Compute recommendation based on quiz answers
  const computeRecommendation = (answers: QuizState) => {
    const all = RESTAURANT_CONFIG.menuItems;
    const combo: { menuItem: MenuItem; quantity: number }[] = [];

    const isVeg = answers.diet === 'veg' || answers.diet === 'any';

    if (answers.groupSize === 'solo') {
      if (isVeg) {
        if (answers.budget === 'budget') {
          const dal = all.find((i) => i.id === 'm9')!; // Dal Tadka ₹160
          const roti = all.find((i) => i.id === 'm24')!; // Butter Roti ₹20
          combo.push({ menuItem: dal, quantity: 1 });
          combo.push({ menuItem: roti, quantity: 3 }); // 160 + 60 = 220
        } else {
          const thali = all.find((i) => i.id === 'm33')!; // Veg Thali ₹240
          const lassi = all.find((i) => i.id === 'm35')!; // Lassi ₹70
          combo.push({ menuItem: thali, quantity: 1 });
          combo.push({ menuItem: lassi, quantity: 1 }); // 310
        }
      } else {
        // Solo non-veg
        const thali = all.find((i) => i.id === 'm34')!; // Highway Non-Veg Thali ₹320
        const lassi = all.find((i) => i.id === 'm35')!; // Lassi ₹70
        combo.push({ menuItem: thali, quantity: 1 });
        combo.push({ menuItem: lassi, quantity: 1 });
      }
    } else if (answers.groupSize === 'couple') {
      if (isVeg) {
        const paneer = all.find((i) => i.id === 'm12') || all.find((i) => i.id === 'm11')!; // Kadhai Paneer ₹240
        const dal = all.find((i) => i.id === 'm9')!; // Dal Tadka ₹160
        const naan = all.find((i) => i.id === 'm25')!; // Butter Naan ₹45
        const lassi = all.find((i) => i.id === 'm35')!; // Lassi ₹70
        combo.push({ menuItem: paneer, quantity: 1 });
        combo.push({ menuItem: dal, quantity: 1 });
        combo.push({ menuItem: naan, quantity: 4 });
        combo.push({ menuItem: lassi, quantity: 2 });
      } else {
        const chickenHandi = all.find((i) => i.id === 'm16')!; // Chicken Handi Half ₹290
        const tikka = all.find((i) => i.id === 'm5')!; // Tandoori Chicken Half ₹240
        const naan = all.find((i) => i.id === 'm25')!; // Butter Naan ₹45
        const rice = all.find((i) => i.id === 'm29')!; // Jeera Rice ₹120
        combo.push({ menuItem: chickenHandi, quantity: 1 });
        combo.push({ menuItem: tikka, quantity: 1 });
        combo.push({ menuItem: naan, quantity: 3 });
        combo.push({ menuItem: rice, quantity: 1 });
      }
    } else {
      // Family (4+ people)
      if (isVeg) {
        const paneerTikka = all.find((i) => i.id === 'm1')!; // Paneer Tikka ₹220
        const kadhaiPaneer = all.find((i) => i.id === 'm12')!; // Kadhai Paneer ₹240
        const dalTadka = all.find((i) => i.id === 'm9')!; // Dal Tadka ₹160
        const butterRoti = all.find((i) => i.id === 'm24')!; // Butter Roti ₹20
        const biryani = all.find((i) => i.id === 'm30')!; // Veg Biryani ₹210
        const lassi = all.find((i) => i.id === 'm35')!; // Lassi ₹70
        combo.push({ menuItem: paneerTikka, quantity: 1 });
        combo.push({ menuItem: kadhaiPaneer, quantity: 1 });
        combo.push({ menuItem: dalTadka, quantity: 1 });
        combo.push({ menuItem: butterRoti, quantity: 8 });
        combo.push({ menuItem: biryani, quantity: 1 });
        combo.push({ menuItem: lassi, quantity: 4 });
      } else {
        const tandooriChicken = all.find((i) => i.id === 'm6')!; // Tandoori Full ₹420
        const chickenHandiFull = all.find((i) => i.id === 'm17')!; // Handi Full ₹520
        const butterNaan = all.find((i) => i.id === 'm25')!; // Butter Naan ₹45
        const chickenBiryani = all.find((i) => i.id === 'm31')!; // Biryani ₹280
        const lassi = all.find((i) => i.id === 'm35')!; // Lassi ₹70
        combo.push({ menuItem: tandooriChicken, quantity: 1 });
        combo.push({ menuItem: chickenHandiFull, quantity: 1 });
        combo.push({ menuItem: butterNaan, quantity: 6 });
        combo.push({ menuItem: chickenBiryani, quantity: 1 });
        combo.push({ menuItem: lassi, quantity: 4 });
      }
    }

    setRecommendedCombo(combo);
    trackEvent('quiz_recommendation_generated', {
      answers,
      itemCount: combo.length,
      total: combo.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0),
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      computeRecommendation(quizState);
      setStep(5);
    }
  };

  const handleReset = () => {
    setStep(1);
    setRecommendedCombo(null);
  };

  const handleAddAllToCart = () => {
    if (!recommendedCombo) return;
    onAddMultipleToCart(recommendedCombo);
    trackEvent('quiz_add_combo_to_cart');
    onClose();
  };

  const handleOrderOnWhatsApp = () => {
    if (!recommendedCombo) return;
    const phone = sanitizePhoneNumber(RESTAURANT_CONFIG.business.whatsappNumber);
    const total = recommendedCombo.reduce(
      (acc, i) => acc + i.menuItem.price * i.quantity,
      0
    );

    const lines = [
      `*━━━━━━━━━━━━━━━━━━━━*`,
      `*NEW RAJ DHABA & RESTAURANT*`,
      `*QUIZ RECOMMENDED COMBO ORDER*`,
      `*━━━━━━━━━━━━━━━━━━━━*`,
      ``,
      `*Items in Combo:*`,
    ];

    recommendedCombo.forEach((item, idx) => {
      lines.push(
        `${idx + 1}. ${item.menuItem.name} - ${item.quantity}x (₹${
          item.menuItem.price * item.quantity
        })`
      );
    });

    lines.push(``);
    lines.push(`*ESTIMATED TOTAL: ₹${total}*`);
    lines.push(`_Please confirm if this combo can be prepared for Dine-in / Delivery._`);

    trackEvent('quiz_combo_whatsapp_order');
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  if (!isOpen) return null;

  const comboTotal =
    recommendedCombo?.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100 z-10 max-h-[92dvh] sm:max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 bg-stone-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white">
                {t.quizTitle}
              </h3>
              <p className="text-xs text-stone-400 font-light">
                {step <= 4 ? `Step ${step} of 4` : 'Your Perfect Dhaba Combo'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* STEP 1: Diet */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-stone-200">
                1. What is your food preference today?
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'veg', label: '100% Pure Vegetarian', desc: 'Paneer, Dal Tadka, Sev Bhaji & Tandoori Chaap' },
                  { id: 'nonveg', label: 'Desi Non-Vegetarian', desc: 'Handi Chicken, Mutton Rogan Josh & Tandoori Chicken' },
                  { id: 'any', label: 'Mixed / Anything Goes', desc: 'Surprise us with the chef’s top favorites' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setQuizState({ ...quizState, diet: opt.id as any })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      quizState.diet === opt.id
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Spice Level */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-stone-200">
                2. How spicy do you like your highway food?
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { val: 1, label: 'Mild & Creamy', desc: 'Butter Paneer, Dal Makhani, subtle cardamoms' },
                  { val: 2, label: 'Medium Desi Spiced', desc: 'Authentic Dal Tadka, Tandoori Chicken (balanced heat)' },
                  { val: 3, label: 'Highway Zordaar Tadka 🔥', desc: 'Clay Handi chicken, Vidarbha Sev Bhaji with red tarri' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setQuizState({ ...quizState, spice: opt.val as any })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      quizState.spice === opt.val
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Group Size */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-stone-200">
                3. How many people are eating?
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'solo', label: 'Just Me (Solo Eater)', desc: 'Wholesome hearty single meal or thali' },
                  { id: 'couple', label: '2 People (Couple / Friends)', desc: '2 curries/kebabs + tandoori breads & drink' },
                  { id: 'family', label: 'Family & Group (4+ People)', desc: 'Grand dhaba feast with starters, handi curries & biryani' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setQuizState({ ...quizState, groupSize: opt.id as any })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      quizState.groupSize === opt.id
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Budget per person */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-stone-200">
                4. What is your expected budget per person?
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'budget', label: 'Value Saver (₹150 – ₹200 / person)', desc: 'Essential hearty dhaba meal' },
                  { id: 'medium', label: 'Standard Feast (₹220 – ₹320 / person)', desc: 'Full course with rich curries & lassi' },
                  { id: 'premium', label: 'Royal Treat (₹350+ / person)', desc: 'Specialty starters, handi clay curries & desserts' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setQuizState({ ...quizState, budget: opt.id as any })}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      quizState.budget === opt.id
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm'
                        : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Recommendation Result */}
          {step === 5 && recommendedCombo && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-amber-300">Curated Combo for You</span>
                  <p className="text-[11px] text-stone-400">Strictly matched to your selected budget & taste</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Total</span>
                  <span className="font-mono tabular-nums text-base font-bold text-amber-400">
                    {formatINR(comboTotal)}
                  </span>
                </div>
              </div>

              {/* Itemized list */}
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {recommendedCombo.map((ci) => (
                  <div
                    key={ci.menuItem.id}
                    className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ci.menuItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium text-stone-200">
                        {ci.quantity}x {ci.menuItem.name}
                      </span>
                    </div>
                    <span className="font-mono tabular-nums text-amber-400 font-bold">
                      {formatINR(ci.menuItem.price * ci.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/95 flex items-center justify-between gap-3 safe-area-bottom">
          {step <= 4 ? (
            <>
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-lg text-xs text-stone-400 hover:text-white transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{step === 4 ? 'Get Recommendation' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="w-full space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddAllToCart}
                  className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add All to Cart</span>
                </button>

                <button
                  onClick={handleOrderOnWhatsApp}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp</span>
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-1 text-center text-[11px] text-stone-400 hover:text-stone-200 inline-flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
