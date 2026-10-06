import { CartItem, CustomerDetails, TableBooking } from '../types';
import { RESTAURANT_CONFIG } from '../data/restaurantConfig';

/**
 * Clean phone number to ensure standard wa.me format:
 * digits only, no spaces, no dashes, no '+'
 */
export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, '');
}

/**
 * Format currency with Indian Rupee symbol
 */
export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Analytics Event Tracker
 */
export function trackEvent(eventName: string, data?: Record<string, any>) {
  try {
    const timestamp = new Date().toISOString();
    const eventPayload = { event: eventName, timestamp, data };
    
    // Store in localStorage for inspection/session history
    const existing = JSON.parse(localStorage.getItem('raj_dhaba_analytics') || '[]');
    existing.push(eventPayload);
    // Keep last 50 events
    if (existing.length > 50) existing.shift();
    localStorage.setItem('raj_dhaba_analytics', JSON.stringify(existing));
    
    // Developer console log
    console.info(`[Analytics] ${eventName}:`, data);
  } catch (e) {
    // Fail quietly if storage is blocked
  }
}

/**
 * Generate WhatsApp Order Message & Direct Link
 */
export function generateWhatsAppOrderUrl(
  items: CartItem[],
  customer: CustomerDetails,
  subtotal: number,
  deliveryFee: number,
  discount: number,
  grandTotal: number
): string {
  const business = RESTAURANT_CONFIG.business;
  const phone = sanitizePhoneNumber(business.whatsappNumber);

  const orderTypeLabels: Record<string, string> = {
    dine_in: '🍽️ Dine-in at Dhaba',
    takeaway: '🥡 Takeaway / Drive-through Pickup',
    delivery: '🛵 Home Delivery',
  };

  const lines: string[] = [];
  lines.push(`*━━━━━━━━━━━━━━━━━━━━*`);
  lines.push(`*NEW RAJ DHABA & RESTAURANT*`);
  lines.push(`*NEW FOOD ORDER INQUIRY*`);
  lines.push(`*━━━━━━━━━━━━━━━━━━━━*`);
  lines.push(``);
  lines.push(`*Order Type:* ${orderTypeLabels[customer.orderType] || customer.orderType}`);
  lines.push(`*Customer Name:* ${customer.name.trim() || 'Guest'}`);
  lines.push(`*Phone:* ${customer.phone.trim() || 'Not specified'}`);

  if (customer.orderType === 'delivery') {
    lines.push(`*Delivery Address:* ${customer.address.trim() || 'Address not provided'}`);
  }

  if (customer.notes.trim()) {
    lines.push(`*Cooking Notes:* ${customer.notes.trim()}`);
  }

  lines.push(``);
  lines.push(`*ITEMIZED BILL:*`);
  items.forEach((item, index) => {
    const vegBadge = item.menuItem.isVeg ? '🟢 [Veg]' : '🔴 [Non-Veg]';
    const itemTotal = item.menuItem.price * item.quantity;
    lines.push(`${index + 1}. ${item.menuItem.name} ${vegBadge}`);
    lines.push(`   ↳ ${item.quantity} x ₹${item.menuItem.price} = *₹${itemTotal}*`);
  });

  lines.push(``);
  lines.push(`*--------------------------*`);
  lines.push(`Subtotal: ₹${subtotal}`);
  if (customer.orderType === 'delivery') {
    lines.push(`Delivery Fee: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}`);
  }
  if (discount > 0) {
    lines.push(`Special Discount: -₹${discount}`);
  }
  lines.push(`*GRAND TOTAL: ₹${grandTotal}*`);
  lines.push(`*--------------------------*`);
  lines.push(``);
  lines.push(`_Please confirm availability and estimated preparation/delivery time._`);
  lines.push(`_Sent via official website (newrajdhaba.in)_`);

  const fullText = lines.join('\n');
  const encodedText = encodeURIComponent(fullText);

  trackEvent('whatsapp_order_generated', {
    itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
    grandTotal,
    orderType: customer.orderType,
  });

  return `https://wa.me/${phone}?text=${encodedText}`;
}

/**
 * Generate WhatsApp Table Reservation URL
 */
export function generateWhatsAppBookingUrl(booking: TableBooking): string {
  const business = RESTAURANT_CONFIG.business;
  const phone = sanitizePhoneNumber(business.whatsappNumber);

  const lines = [
    `*━━━━━━━━━━━━━━━━━━━━*`,
    `*TABLE RESERVATION ENQUIRY*`,
    `*NEW RAJ DHABA & RESTAURANT*`,
    `*━━━━━━━━━━━━━━━━━━━━*`,
    ``,
    `*Guest Name:* ${booking.name}`,
    `*Contact Number:* ${booking.phone}`,
    `*No. of People:* ${booking.guests} Guests`,
    `*Preferred Date:* ${booking.date}`,
    `*Preferred Time:* ${booking.time}`,
    `*Seating Choice:* ${booking.seatingPreference}`,
  ];

  if (booking.specialRequests?.trim()) {
    lines.push(`*Special Request:* ${booking.specialRequests.trim()}`);
  }

  lines.push(``);
  lines.push(`_Kindly confirm table availability and booking status._`);

  trackEvent('table_reservation_enquiry', {
    guests: booking.guests,
    seatingPreference: booking.seatingPreference,
  });

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Generate Quick Chat URL for owner on WhatsApp
 */
export function generateWhatsAppQuickChatUrl(topic: string = 'General Inquiry'): string {
  const business = RESTAURANT_CONFIG.business;
  const phone = sanitizePhoneNumber(business.whatsappNumber);

  const message = `Namaste New Raj Dhaba! I have a question regarding: ${topic}. Could you please help me?`;
  
  trackEvent('whatsapp_quick_chat_click', { topic });
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
