import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  MessageCircle,
  Sparkles,
  Loader2,
  RotateCcw,
  Plus,
  Minimize2,
  Maximize2,
  Flame,
  Zap,
  Users
} from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, MenuItem, UI_STRINGS } from '../data/restaurantConfig';
import { trackEvent, generateWhatsAppQuickChatUrl } from '../utils/whatsapp';

export type ChatbotRole = 'concierge' | 'chef' | 'party_planner';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelUsed?: string;
  detectedDishes?: MenuItem[];
}

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onAddToCart: (item: MenuItem) => void;
  onOpenCart: () => void;
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isOpen,
  onClose,
  language,
  onAddToCart,
  onOpenCart,
}) => {
  const t = UI_STRINGS[language];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [activeRole, setActiveRole] = useState<ChatbotRole>('concierge');
  const [speedMode, setSpeedMode] = useState<'standard' | 'fast'>('standard');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Initial greeting based on role & language
  const getGreeting = (role: ChatbotRole, lang: LanguageCode): string => {
    if (role === 'chef') {
      return lang === 'hi'
        ? 'राम-राम जी! मैं शेफ गुरप्रीत हूँ। हमारे मिट्टी के तंदूर, डबल देसी घी के तड़के और हांडी के मसालों के बारे में जो पूछना चाहें, पूछिए!'
        : 'Sat Sri Akal! I am Chef Gurpreet. Ask me about our slow-flame clay handi secrets, double desi ghee tempering, or dish pairings!';
    }
    if (role === 'party_planner') {
      return lang === 'hi'
        ? 'नमस्ते! मैं प्रीति हूँ, न्यू राज ढाबा की बैंक्वेट प्लानर। 4 से लेकर 50 लोगों के परिवार या दोस्तों की दावत के लिए बजट और कॉम्बो प्लान करने में मैं आपकी मदद करूँगी।'
        : 'Welcome! I am Preeti, your Dhaba Banquet Planner. Tell me your guest count (e.g. 6, 12, or 25 people) and budget, and I will plan your exact feast with prices.';
    }
    return lang === 'hi'
      ? 'नमस्ते! मैं राजवीर हूँ, न्यू राज ढाबा का डिजिटल होस्ट। मेन्यू, कॉम्बो, डिलीवरी या टेबल सिटिंग के बारे में आप जो भी जानना चाहें, बेझिझक पूछें!'
      : lang === 'mr'
      ? 'नमस्कार! मी राजवीर, न्यू राज ढाब्याचा डिजिटल सहाय्यक. मेनू, कॉम्बो, डिलिव्हरी किंवा टेबल बुकिंगबद्दल काहीही विचारा!'
      : 'Hello & Welcome! I am Rajveer, your host at New Raj Dhaba. Ask me for recommendations, budget combos, spice levels, or delivery details.';
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-0',
      role: 'assistant',
      content: getGreeting('concierge', language),
      timestamp: new Date(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Helper: Detect menu dishes mentioned in assistant text for one-tap Add to Cart
  const detectDishesInText = (text: string): MenuItem[] => {
    const textLower = text.toLowerCase();
    const matches: MenuItem[] = [];
    const allDishes = RESTAURANT_CONFIG.menuItems;

    for (const dish of allDishes) {
      const nameMatch = textLower.includes(dish.name.toLowerCase());
      const hindiMatch = textLower.includes(dish.hindiName.toLowerCase());
      if (nameMatch || hindiMatch) {
        matches.push(dish);
        if (matches.length >= 3) break;
      }
    }
    return matches;
  };

  // Role Switch Handler
  const handleRoleChange = (newRole: ChatbotRole) => {
    setActiveRole(newRole);
    const greetingMsg: ChatMessage = {
      id: `role-switch-${Date.now()}`,
      role: 'assistant',
      content: getGreeting(newRole, language),
      timestamp: new Date(),
      modelUsed: speedMode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash',
    };
    setMessages((prev) => [...prev, greetingMsg]);
    trackEvent('chatbot_role_switched', { newRole });
  };

  // Reset / Clear Thread
  const handleResetChat = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'assistant',
        content: getGreeting(activeRole, language),
        timestamp: new Date(),
        modelUsed: speedMode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash',
      },
    ]);
    trackEvent('chatbot_thread_reset');
  };

  // Send Message
  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    trackEvent('chatbot_message_sent', {
      role: activeRole,
      speed: speedMode,
      queryLength: text.length,
    });

    try {
      // Build conversation history for multi-turn thread
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          role: activeRole,
          language,
          speed: speedMode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error (${res.status})`);
      }

      const data = await res.json();
      const replyText = data.reply || 'Here is your recommendation from our menu.';
      const detected = detectDishesInText(replyText);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
        modelUsed: data.modelUsed || (speedMode === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'),
        detectedDishes: detected,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? 'क्षमा करें, नेटवर्क में देरी है। आप सीधे व्हाट्सएप पर मालिक से बात कर सकते हैं!'
            : 'Slight delay in AI response. You can also chat directly with our owner on WhatsApp!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Role info metadata
  const roleMeta: Record<ChatbotRole, { name: string; title: string; icon: any }> = {
    concierge: { name: 'Rajveer', title: 'Dhaba Host', icon: Bot },
    chef: { name: 'Chef Gurpreet', title: 'Clay Tandoor Master', icon: Flame },
    party_planner: { name: 'Preeti', title: 'Banquet Planner', icon: Users },
  };

  const CurrentIcon = roleMeta[activeRole].icon;

  const quickPrompts = [
    activeRole === 'concierge' && (language === 'hi' ? '4 लोगों के लिए वेज कॉम्बो' : 'Veg combo for 4'),
    activeRole === 'concierge' && (language === 'hi' ? 'दाल तड़का और बटर नान का रेट' : 'Dal Tadka & Butter Naan price'),
    activeRole === 'chef' && (language === 'hi' ? 'हांडी चिकन की क्या खासियत है?' : 'What makes Chicken Handi special?'),
    activeRole === 'chef' && (language === 'hi' ? 'पनीर टिक्का कैसे बनता है?' : 'How is Paneer Tikka prepared?'),
    activeRole === 'party_planner' && (language === 'hi' ? '12 लोगों की दावत का प्लान' : '12-person family feast budget'),
    activeRole === 'party_planner' && (language === 'hi' ? 'एसी हॉल की बुकिंग कैसे करें?' : 'How to book AC Family Hall?'),
  ].filter(Boolean) as string[];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4 sm:pr-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity"
      />

      {/* Chat Window Container */}
      <div
        className={`relative w-full ${
          isExpanded ? 'sm:max-w-3xl sm:h-[90vh]' : 'sm:max-w-lg sm:h-[680px]'
        } h-[92dvh] max-h-[92dvh] sm:h-[680px] sm:max-h-none bg-stone-900 border border-stone-800 rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100 z-10 transition-all duration-300`}
      >
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-stone-800 bg-stone-950/95 flex items-center justify-between gap-3">
          {/* Persona Avatar & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm sm:text-base font-semibold text-white">
                  {roleMeta[activeRole].name}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-stone-800 text-stone-300 border border-stone-700">
                  {roleMeta[activeRole].title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[10px] text-amber-300/90">
                  {speedMode === 'fast' ? 'Gemini 3.1 Flash-Lite' : 'Gemini 3.5 Flash'}
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Speed Toggle, Expand, Reset, Close */}
          <div className="flex items-center gap-1.5">
            {/* Speed toggle */}
            <button
              onClick={() =>
                setSpeedMode((prev) => (prev === 'standard' ? 'fast' : 'standard'))
              }
              type="button"
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1 ${
                speedMode === 'fast'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                  : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
              }`}
              title={speedMode === 'fast' ? 'Fast Mode (Flash-Lite)' : 'Standard Mode (Flash 3.5)'}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px]">
                {speedMode === 'fast' ? 'Fast' : 'Standard'}
              </span>
            </button>

            {/* Clear conversation */}
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Expand / Minimize Toggle (Desktop) */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title={isExpanded ? 'Compact view' : 'Expand view'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="px-4 py-2 bg-stone-950 border-b border-stone-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-stone-500 mr-1 shrink-0">Role:</span>
          <button
            onClick={() => handleRoleChange('concierge')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeRole === 'concierge'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            🍽️ Host Rajveer
          </button>
          <button
            onClick={() => handleRoleChange('chef')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeRole === 'chef'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            👨‍🍳 Chef Gurpreet
          </button>
          <button
            onClick={() => handleRoleChange('party_planner')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeRole === 'party_planner'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            🎉 Banquet Planner
          </button>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <CurrentIcon className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[85%] space-y-2">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-600 text-white rounded-br-xs font-medium'
                      : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>

                  <div className="flex items-center justify-between gap-3 text-[10px] mt-1.5 pt-1 border-t border-stone-800/40">
                    <span
                      className={m.role === 'user' ? 'text-amber-200' : 'text-stone-500 font-mono'}
                    >
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {m.modelUsed && (
                      <span className="text-[9px] font-mono text-amber-400/80">
                        {m.modelUsed}
                      </span>
                    )}
                  </div>
                </div>

                {/* Detected dish chips inside assistant turn */}
                {m.detectedDishes && m.detectedDishes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {m.detectedDishes.map((dish) => (
                      <button
                        key={dish.id}
                        onClick={() => {
                          onAddToCart(dish);
                          trackEvent('chatbot_dish_quick_add', { dishId: dish.id, name: dish.name });
                        }}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-amber-500/40 text-amber-300 text-xs font-medium transition-colors shadow-xs"
                      >
                        <Plus className="w-3 h-3 text-amber-400" />
                        <span>Add {dish.name}</span>
                        <span className="font-mono text-stone-400">(₹{dish.price})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-stone-400">
              <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-stone-300 flex items-center gap-2 font-mono text-xs">
                <span>{roleMeta[activeRole].name} is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {quickPrompts.length > 0 && (
          <div className="px-3 py-2 bg-stone-950/80 border-t border-stone-800 overflow-x-auto scrollbar-none flex gap-1.5">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-3 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 text-xs whitespace-nowrap transition-colors border border-stone-800 shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2 safe-area-bottom">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'hi'
                ? `${roleMeta[activeRole].name} से व्यंजन, रेसिपी या पार्टी प्लान पूछें...`
                : `Ask ${roleMeta[activeRole].name} about dishes, spices or party combos...`
            }
            className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold transition-all cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>

          {/* WhatsApp Handoff CTA */}
          <a
            href={generateWhatsAppQuickChatUrl(`Handoff with ${roleMeta[activeRole].name}`)}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            title="Chat with Dhaba Owner on WhatsApp"
            aria-label="Handoff to WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
          </a>
        </div>

      </div>
    </div>
  );
};
