import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  ShoppingBag,
  Info,
  Check,
  Tag,
  ArrowRight
} from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { CartItem, CustomerDetails, OrderType } from '../types';
import { generateWhatsAppOrderUrl, formatINR, trackEvent } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  language,
  cartItems,
  onUpdateQuantity,
  onClearCart,
}) => {
  const t = UI_STRINGS[language];
  const deliveryRules = RESTAURANT_CONFIG.business.delivery;
  const offer = RESTAURANT_CONFIG.offer;

  // Customer Form State
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    address: '',
    notes: '',
    orderType: 'delivery',
    couponCode: '',
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Subtotal Calculation
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );

  // Delivery fee calculation
  let deliveryFee = 0;
  if (customer.orderType === 'delivery' && cartItems.length > 0) {
    if (subtotal >= deliveryRules.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = deliveryRules.deliveryCharge;
    }
  }

  // Discount calculation
  let discount = 0;
  if (appliedCoupon === offer.code && subtotal >= offer.minOrder) {
    discount = Math.round((subtotal * offer.discountPercent) / 100);
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = (customer.couponCode || '').trim().toUpperCase();
    if (!code) return;

    if (code === offer.code) {
      if (subtotal < offer.minOrder) {
        setCouponError(`Coupon requires minimum order of ₹${offer.minOrder}`);
      } else {
        setAppliedCoupon(offer.code);
        trackEvent('coupon_applied_success', { code });
      }
    } else {
      setCouponError('Invalid coupon code. Try HIGHWAY15');
    }
  };

  const handleSendOrder = () => {
    const errors: Record<string, string> = {};

    if (!customer.name.trim()) {
      errors.name = 'Please provide your name';
    }
    if (!customer.phone.trim() || customer.phone.replace(/[^0-9]/g, '').length < 10) {
      errors.phone = 'Please provide a valid 10-digit mobile number';
    }
    if (customer.orderType === 'delivery') {
      if (!customer.address.trim()) {
        errors.address = 'Please provide your delivery address';
      }
      if (subtotal < deliveryRules.minOrderAmount) {
        errors.subtotal = `Minimum order for delivery is ₹${deliveryRules.minOrderAmount}`;
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const whatsappUrl = generateWhatsAppOrderUrl(
      cartItems,
      customer,
      subtotal,
      deliveryFee,
      discount,
      grandTotal
    );

    trackEvent('whatsapp_checkout_clicked', {
      grandTotal,
      itemsCount: cartItems.length,
      orderType: customer.orderType,
    });

    // Open WhatsApp directly
    window.location.href = whatsappUrl;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-screen sm:max-w-md bg-stone-900 border-l border-stone-800 flex flex-col shadow-2xl text-stone-100">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-display text-lg font-semibold text-white">
                {t.cartTitle}
              </h2>
              <span className="text-xs font-mono bg-stone-800 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            
            {/* Empty state */}
            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-stone-300 font-medium">{t.emptyCart}</p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Add signature Dal Tadka, Tandoori Chicken, or Butter Naan to start your order.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-amber-400 font-medium hover:underline"
                >
                  <span>Browse Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Itemized Cart List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400 pb-1">
                    <span>Selected Items</span>
                    <button
                      onClick={onClearCart}
                      className="text-stone-500 hover:text-red-400 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  {cartItems.map((ci) => {
                    const itemTotal = ci.menuItem.price * ci.quantity;
                    const itemName =
                      language === 'hi'
                        ? ci.menuItem.hindiName
                        : language === 'mr'
                        ? ci.menuItem.marathiName
                        : ci.menuItem.name;

                    return (
                      <div
                        key={ci.menuItem.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800/90"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                ci.menuItem.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            <h4 className="text-xs font-medium text-stone-200 truncate">
                              {itemName}
                            </h4>
                          </div>
                          <div className="text-[11px] font-mono text-stone-400 mt-0.5">
                            ₹{ci.menuItem.price} each · <span className="text-amber-400 font-bold">₹{itemTotal}</span>
                          </div>
                        </div>

                        {/* Stepper Controls */}
                        <div className="flex items-center gap-1 bg-stone-900 border border-stone-800 rounded-lg p-0.5 shrink-0">
                          <button
                            onClick={() => onUpdateQuantity(ci.menuItem.id, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-mono font-bold text-amber-400 tabular-nums">
                            {ci.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(ci.menuItem.id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Free Delivery Progress Indicator */}
                {customer.orderType === 'delivery' && (
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1.5">
                    {subtotal >= deliveryRules.freeDeliveryThreshold ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{t.freeDeliveryUnlocked}</span>
                      </div>
                    ) : (
                      <div className="text-stone-300">
                        <span>
                          {t.addMoreForFreeDelivery.replace(
                            '{diff}',
                            String(deliveryRules.freeDeliveryThreshold - subtotal)
                          )}
                        </span>
                        <div className="w-full bg-stone-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                (subtotal / deliveryRules.freeDeliveryThreshold) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-stone-300 block">
                    {t.orderType}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, orderType: 'dine_in' })}
                      className={`py-2 px-1 rounded-lg text-center transition-colors ${
                        customer.orderType === 'dine_in'
                          ? 'bg-amber-600 text-white font-medium shadow-sm'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Dine-in
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, orderType: 'takeaway' })}
                      className={`py-2 px-1 rounded-lg text-center transition-colors ${
                        customer.orderType === 'takeaway'
                          ? 'bg-amber-600 text-white font-medium shadow-sm'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Takeaway
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, orderType: 'delivery' })}
                      className={`py-2 px-1 rounded-lg text-center transition-colors ${
                        customer.orderType === 'delivery'
                          ? 'bg-amber-600 text-white font-medium shadow-sm'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Delivery
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-3 pt-2">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-medium text-stone-300 block mb-1">
                      {t.nameLabel} *
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="e.g. Rameshwar Patil"
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-red-400 mt-0.5">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-medium text-stone-300 block mb-1">
                      {t.phoneLabel} *
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.phone && (
                      <p className="text-[11px] text-red-400 mt-0.5">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Address (If Delivery) */}
                  {customer.orderType === 'delivery' && (
                    <div>
                      <label className="text-xs font-medium text-stone-300 block mb-1">
                        {t.addressLabel} *
                      </label>
                      <textarea
                        rows={2}
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="House no., Landmark, Village/Town (Dahegaon / Saoner area)"
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      />
                      {formErrors.address && (
                        <p className="text-[11px] text-red-400 mt-0.5">{formErrors.address}</p>
                      )}
                      {formErrors.subtotal && (
                        <p className="text-[11px] text-red-400 mt-0.5">{formErrors.subtotal}</p>
                      )}
                    </div>
                  )}

                  {/* Cooking notes */}
                  <div>
                    <label className="text-xs font-medium text-stone-300 block mb-1">
                      {t.notesLabel}
                    </label>
                    <input
                      type="text"
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="e.g. Less spicy, send extra onions and mint chutney"
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Coupon Code Input */}
                  <div className="pt-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={customer.couponCode || ''}
                          onChange={(e) =>
                            setCustomer({ ...customer, couponCode: e.target.value.toUpperCase() })
                          }
                          placeholder="Promo code (HIGHWAY15)"
                          className="w-full pl-8 pr-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-100 font-mono uppercase focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {appliedCoupon && (
                      <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Code {appliedCoupon} applied (-{offer.discountPercent}%)</span>
                      </p>
                    )}
                    {couponError && (
                      <p className="text-[11px] text-red-400 mt-1">{couponError}</p>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-stone-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-400">
                    <span>{t.subtotal}</span>
                    <span className="font-mono tabular-nums text-stone-200">{formatINR(subtotal)}</span>
                  </div>

                  {customer.orderType === 'delivery' && (
                    <div className="flex justify-between text-stone-400">
                      <span>{t.deliveryFee}</span>
                      <span className="font-mono tabular-nums">
                        {deliveryFee === 0 ? (
                          <span className="text-emerald-400 font-semibold">FREE</span>
                        ) : (
                          formatINR(deliveryFee)
                        )}
                      </span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Special Discount</span>
                      <span className="font-mono tabular-nums font-bold">-{formatINR(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800">
                    <span>{t.grandTotal}</span>
                    <span className="font-mono tabular-nums text-amber-400 text-base">
                      {formatINR(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Disclaimer note */}
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40 text-[11px] text-amber-300/90 flex gap-2">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{t.confirmNotice}</span>
                </div>
              </>
            )}

          </div>

          {/* Drawer Footer Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-stone-800 bg-stone-950/95 space-y-2 safe-area-bottom">
              <button
                onClick={handleSendOrder}
                type="button"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>{t.sendWhatsAppBtn} ({formatINR(grandTotal)})</span>
              </button>

              <p className="text-[10px] text-center text-stone-500">
                Tap to open WhatsApp with your itemized bill pre-filled
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
