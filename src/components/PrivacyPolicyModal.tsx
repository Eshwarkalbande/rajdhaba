import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../data/restaurantConfig';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const business = RESTAURANT_CONFIG.business;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-xl max-h-[85vh] bg-stone-900 border border-stone-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100 z-10">
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Privacy Policy & WhatsApp Data Usage</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
          <p>
            At <strong>{business.name}</strong>, we respect your privacy. This policy explains how
            we handle customer information when you use our website and WhatsApp ordering system.
          </p>

          <h4 className="text-stone-100 font-semibold text-sm">1. WhatsApp Ordering Information</h4>
          <p>
            When you build an order or submit a table reservation inquiry, your name, contact
            number, delivery address, and food selections are formatted into a WhatsApp message sent
            directly to the restaurant owner ({business.phoneDisplay}). We do not sell, rent, or
            share this information with third parties.
          </p>

          <h4 className="text-stone-100 font-semibold text-sm">2. AI Assistant (Gemini API)</h4>
          <p>
            Questions asked to the AI Menu Guide are processed on our secure server to return
            accurate answers from our menu. No personal credit card or sensitive details are
            collected or stored by the AI service.
          </p>

          <h4 className="text-stone-100 font-semibold text-sm">3. Local Session Analytics</h4>
          <p>
            We use anonymized client-side event logs in local storage (such as counting menu clicks
            and promo code copies) purely to improve our digital menu experience.
          </p>

          <h4 className="text-stone-100 font-semibold text-sm">4. Contact</h4>
          <p>
            For any queries regarding your data or to update your phone number, contact the owner
            directly at {business.phoneDisplay} or visit us at {business.address}.
          </p>
        </div>

        <div className="p-4 border-t border-stone-800 bg-stone-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
