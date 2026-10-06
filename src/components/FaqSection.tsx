import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';

interface FaqSectionProps {
  language: LanguageCode;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language }) => {
  const t = UI_STRINGS[language];
  const faqs = RESTAURANT_CONFIG.faqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 md:py-24 bg-stone-950 text-stone-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="mt-2 text-stone-400 text-sm sm:text-base font-light">
            Quick information regarding our food, family seating, parking, and delivery.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const question =
              language === 'hi'
                ? faq.questionHindi
                : language === 'mr'
                ? faq.questionMarathi
                : faq.question;
            const answer =
              language === 'hi'
                ? faq.answerHindi
                : language === 'mr'
                ? faq.answerMarathi
                : faq.answer;

            return (
              <div
                key={idx}
                className="rounded-xl border border-stone-800 bg-stone-900/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-stone-800/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-stone-200">
                    {question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-stone-400 leading-relaxed font-light border-t border-stone-800/60 pt-3">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
