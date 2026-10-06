import React, { useState, useEffect } from 'react';
import { RESTAURANT_CONFIG, MenuItem, LanguageCode } from './data/restaurantConfig';
import { CartItem } from './types';
import { OfferBanner } from './components/OfferBanner';
import { TopNav } from './components/TopNav';
import { Hero } from './components/Hero';
import { Specialties } from './components/Specialties';
import { MenuSection } from './components/MenuSection';
import { SeatingSection } from './components/SeatingSection';
import { GallerySection } from './components/GallerySection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { CartDrawer } from './components/CartDrawer';
import { GeminiChatbot } from './components/GeminiChatbot';
import { EatQuizModal } from './components/EatQuizModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { CookieNotice } from './components/CookieNotice';
import { trackEvent } from './utils/whatsapp';

export default function App() {
  // 1. Language State
  const [language, setLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('raj_dhaba_lang');
      if (saved === 'hi' || saved === 'mr' || saved === 'en') return saved;
    } catch {}
    return 'en';
  });

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('raj_dhaba_lang', newLang);
    } catch {}
    trackEvent('language_switched', { language: newLang });
  };

  // 2. Cart State with Local Storage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('raj_dhaba_cart');
      if (savedCart) return JSON.parse(savedCart);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('raj_dhaba_cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // 3. Modals & Drawer Visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (dish: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === dish.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === dish.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const nextQty = ci.quantity + delta;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    trackEvent('cart_cleared');
  };

  const handleAddMultipleToCart = (newItems: { menuItem: MenuItem; quantity: number }[]) => {
    setCartItems((prev) => {
      const updated = [...prev];
      for (const item of newItems) {
        const existingIdx = updated.findIndex((ci) => ci.menuItem.id === item.menuItem.id);
        if (existingIdx >= 0) {
          updated[existingIdx].quantity += item.quantity;
        } else {
          updated.push({ menuItem: item.menuItem, quantity: item.quantity });
        }
      }
      return updated;
    });
    setIsCartOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* 1. Promotional Offer Banner with Countdown */}
      <OfferBanner language={language} />

      {/* 2. Top Navigation Bar (Strict 3-zone contract) */}
      <TopNav
        language={language}
        onLanguageChange={handleLanguageChange}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* 3. Main Body Sections */}
      <main className="flex-1">
        {/* Hero with 3D tilt, rising steam, floating spice elements */}
        <Hero
          language={language}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        />

        {/* Signature Dhaba Specialties */}
        <Specialties
          language={language}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* Full Menu with Categories, Search, and Veg/Non-Veg Filters */}
        <MenuSection
          language={language}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* Seating Features & Table Enquiry Form */}
        <SeatingSection language={language} />

        {/* Restaurant & Food Photos Horizontal Swipe Gallery */}
        <GallerySection language={language} />

        {/* Real Customer Reviews */}
        <ReviewsSection language={language} />

        {/* Location & Embedded Google Map */}
        <LocationSection language={language} />

        {/* FAQ Section */}
        <FaqSection language={language} />
      </main>

      {/* 4. Footer */}
      <Footer
        language={language}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* 5. Floating Actions & Sticky Mobile Bottom Bar */}
      <FloatingActions
        language={language}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* 6. Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        language={language}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
      />

      {/* 7. Multi-Turn Gemini AI Chatbot */}
      <GeminiChatbot
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        language={language}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 8. "What Should I Eat?" Quiz Modal */}
      <EatQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        language={language}
        onAddMultipleToCart={handleAddMultipleToCart}
      />

      {/* 9. Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* 10. Cookie Notice */}
      <CookieNotice />
    </div>
  );
}
