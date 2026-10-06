import React from 'react';
import { Star, MessageSquareQuote, CheckCircle, ThumbsUp } from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';

interface ReviewsSectionProps {
  language: LanguageCode;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ language }) => {
  const t = UI_STRINGS[language];
  const reviews = RESTAURANT_CONFIG.reviews;

  return (
    <section id="reviews" className="py-16 md:py-24 bg-stone-950 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>4.9 / 5 Google & Highway Rating</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
            {t.reviewsTitle}
          </h2>
          <p className="mt-2 text-stone-400 text-sm sm:text-base font-light">
            Real dining experiences from highway commuters and local Dahegaon families.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const comment = language === 'hi' ? rev.commentHindi : rev.comment;

            return (
              <div
                key={rev.id}
                className="bg-stone-900/90 rounded-2xl p-6 border border-stone-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-amber-600/30 transition-colors"
              >
                <div className="space-y-3">
                  {/* Rating Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-stone-500 font-mono">{rev.date}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light italic">
                    "{comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-100">
                      {rev.name}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>{rev.type}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>{rev.city}</span>
                    <span className="text-[11px] text-amber-400/90 truncate max-w-[140px]">
                      ❤️ {rev.dishRecommended}
                    </span>
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
