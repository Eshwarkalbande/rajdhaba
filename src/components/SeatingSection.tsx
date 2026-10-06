import React, { useState } from 'react';
import {
  Trees,
  Wind,
  Coffee,
  Car,
  Calendar,
  Clock,
  Users,
  MessageCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { TableBooking } from '../types';
import { generateWhatsAppBookingUrl, trackEvent } from '../utils/whatsapp';

interface SeatingSectionProps {
  language: LanguageCode;
}

export const SeatingSection: React.FC<SeatingSectionProps> = ({ language }) => {
  const t = UI_STRINGS[language];
  const business = RESTAURANT_CONFIG.business;

  // Form State
  const [booking, setBooking] = useState<TableBooking>({
    name: '',
    phone: '',
    guests: 4,
    date: new Date().toISOString().split('T')[0],
    time: '08:00 PM',
    seatingPreference: 'Outdoor Lawn with Fairy Lights',
    specialRequests: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!booking.name.trim()) errors.name = 'Please provide your name';
    if (!booking.phone.trim() || booking.phone.replace(/[^0-9]/g, '').length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    const whatsappUrl = generateWhatsAppBookingUrl(booking);

    trackEvent('table_booking_whatsapp_submitted', {
      guests: booking.guests,
      seating: booking.seatingPreference,
    });

    setSubmitted(true);
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 400);
  };

  const seatingCards = [
    {
      title: 'Outdoor Garden & Terrace',
      titleHindi: 'खुला बगीचा एवं छत बैठक',
      titleMarathi: 'ओपन गार्डन व गच्ची बैठक',
      desc: 'Ambient string lights, fresh evening air, and a relaxed rustic atmosphere for memorable family evenings.',
      icon: Trees,
    },
    {
      title: 'AC Family Dining Hall',
      titleHindi: 'वातानुकूलित (AC) फैमिली हॉल',
      titleMarathi: 'वातानुकूलित (AC) फॅमिली हॉल',
      desc: 'Private, noise-free, air-conditioned seating designed for family gatherings, elders, and celebratory dinners.',
      icon: Wind,
    },
    {
      title: 'Authentic Charpai (Khatia)',
      titleHindi: 'पारंपरिक चारपाई (खटिया) बैठक',
      titleMarathi: 'पारंपरिक चारपाई (खाट) बैठक',
      desc: 'Classic Punjabi dhaba feel with woven cots, wooden takht chowki tables, and comfortable relaxed dining.',
      icon: Coffee,
    },
    {
      title: 'Highway Drive-Through Bay',
      titleHindi: 'हाईवे कार पार्किंग व ड्राइव-थ्रू',
      titleMarathi: 'हायवे कार पार्किंग व ड्राइव्ह-थ्रू',
      desc: 'Broad paved parking space with fast car-side service for travelers on the move.',
      icon: Car,
    },
  ];

  return (
    <section id="seating" className="py-16 md:py-24 bg-stone-900 border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Relaxing Ambiance</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-white font-bold tracking-tight">
            {language === 'hi'
              ? 'आरामदायक बैठक व पारिवारिक वातावरण'
              : language === 'mr'
              ? 'आरामदायी बैठक व कौटुंबिक वातावरण'
              : 'Relaxing Ambiance & Family Seating'}
          </h2>
          <p className="mt-2 text-stone-400 text-sm sm:text-base font-light">
            {language === 'hi'
              ? 'चाहे रात के तारों के नीचे बैठना हो या ठंडे एसी हॉल में, न्यू राज ढाबा में हर किसी के लिए खास जगह है।'
              : 'Whether you prefer starry open-air garden dining or a quiet AC hall, we have the ideal space for your group.'}
          </p>
        </div>

        {/* Feature Grid with Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          
          {/* Garden Photo Showcase (7 cols) */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-stone-800 shadow-2xl group">
            <div className="aspect-[16/9] w-full overflow-hidden bg-stone-950">
              <img
                src="/images/ambiance_dhaba_lawn_1791300394256.jpg"
                alt="New Raj Dhaba outdoor lawn seating illuminated with fairy lights"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                Evening Experience
              </span>
              <h3 className="font-display text-xl font-bold">
                Lawn Dining with Ambient Fairy Lights
              </h3>
              <p className="text-xs text-stone-300 font-light mt-1 max-w-md">
                Cool evening breeze from Dahegaon fields paired with hot bubbling Dal Tadka.
              </p>
            </div>
          </div>

          {/* 4 Feature Cards (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {seatingCards.map((card, idx) => {
              const Icon = card.icon;
              const title =
                language === 'hi'
                  ? card.titleHindi
                  : language === 'mr'
                  ? card.titleMarathi
                  : card.title;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-amber-600/40 transition-colors flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-100">{title}</h4>
                    <p className="text-xs text-stone-400 mt-1 font-light leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Table & Visit Enquiry Form */}
        <div className="max-w-3xl mx-auto bg-stone-950 rounded-2xl border border-stone-800 p-4 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              {language === 'hi' ? 'टेबल या फैमिली विजिट के लिए पूछें' : 'Reserve a Table or Inquire via WhatsApp'}
            </h3>
            <p className="text-xs text-stone-400 font-light mt-1">
              Fill in your details below and we will prepare a table for your family.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={booking.name}
                  onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  placeholder="e.g. Rameshwar Patil"
                  className="w-full px-3.5 py-3 bg-stone-900 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  type="tel"
                  value={booking.phone}
                  onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-3 bg-stone-900 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 min-h-[44px]"
                />
                {formErrors.phone && (
                  <p className="text-[11px] text-red-400 mt-1">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Guests */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">
                  No. of Guests
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={booking.guests}
                    onChange={(e) => setBooking({ ...booking, guests: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {[1, 2, 4, 6, 8, 10, 15, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">
                  Visit Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={booking.date}
                    onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1">
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={booking.time}
                    onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {[
                      '12:30 PM (Lunch)',
                      '01:30 PM (Lunch)',
                      '07:30 PM (Dinner)',
                      '08:30 PM (Dinner)',
                      '09:30 PM (Dinner)',
                      '10:30 PM (Late Dinner)',
                    ].map((tSlot) => (
                      <option key={tSlot} value={tSlot}>
                        {tSlot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seating Choice */}
            <div>
              <label className="text-xs font-medium text-stone-300 block mb-1">
                Seating Preference
              </label>
              <select
                value={booking.seatingPreference}
                onChange={(e) => setBooking({ ...booking, seatingPreference: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Outdoor Lawn with Fairy Lights">
                  Outdoor Garden Lawn (with ambient fairy lights)
                </option>
                <option value="AC Family Dining Hall">
                  AC Family Dining Hall (Cool & Private)
                </option>
                <option value="Traditional Charpai (Khatia)">
                  Traditional Charpai / Khatia (Punjabi cot style)
                </option>
                <option value="Any Available Best Table">
                  Any Available Best Table
                </option>
              </select>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Confirm Table via WhatsApp</span>
              </button>
              <p className="text-[11px] text-center text-stone-500 mt-2">
                Sends booking request to the owner. Free cancellation anytime.
              </p>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};
