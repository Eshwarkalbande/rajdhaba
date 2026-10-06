import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  MessageCircle,
  Sparkles,
  Loader2,
  RefreshCw,
  Phone
} from 'lucide-react';
import { RESTAURANT_CONFIG, LanguageCode, UI_STRINGS } from '../data/restaurantConfig';
import { ChatMessage } from '../types';
import { generateWhatsAppQuickChatUrl, trackEvent } from '../utils/whatsapp';

interface AiMenuAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const AiMenuAssistant: React.FC<AiMenuAssistantProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = UI_STRINGS[language];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: 'init-1',
    role: 'assistant',
    content:
      language === 'hi'
        ? 'नमस्ते! मैं न्यू राज ढाबा का एआई मेन्यू सहायक हूँ। आप मुझसे बजट, कॉम्बो, शाकाहारी/मांसाहारी व्यंजन या डिलीवरी के बारे में पूछ सकते हैं। आप आज क्या खाना पसंद करेंगे?'
        : language === 'mr'
        ? 'नमस्कार! मी न्यू राज ढाब्याचा एआय मेनू सहाय्यक आहे. बजेट, कॉम्बो, शाकाहारी किंवा मांसाहारी पदार्थांबद्दल मला थेट विचारा. आज काय बेत आहे?'
        : 'Welcome to New Raj Dhaba! I can recommend dishes based on your budget, party size, or spice preference—strictly from our authentic menu. How can I help you today?',
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatCount, setChatCount] = useState<number>(0);
  const [showLeadCapture, setShowLeadCapture] = useState<boolean>(false);
  const [leadName, setLeadName] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');

  const quickPrompts = [
    language === 'hi'
      ? '4 लोगों के लिए बेस्ट वेज कॉम्बो बताओ'
      : language === 'mr'
      ? '४ जणांसाठी खास शाकाहारी कॉम्बो सांगा'
      : 'Suggest a veg combo for 4 people',

    language === 'hi'
      ? 'नॉन-वेज में सबसे खास क्या है?'
      : language === 'mr'
      ? 'नॉन-व्हेजमधील खास पदार्थ कोणते?'
      : 'What are your signature non-veg dishes?',

    language === 'hi'
      ? 'दाल तड़का और बटर नान का क्या रेट है?'
      : language === 'mr'
      ? 'डाळ तडका आणि बटर नानची किंमत काय आहे?'
      : 'Price of Dal Tadka & Butter Naan?',

    language === 'hi'
      ? 'डिलीवरी का समय और दायरा क्या है?'
      : language === 'mr'
      ? 'डिलिव्हरी वेळ व परिसर काय आहे?'
      : 'Delivery radius & opening hours?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setChatCount((c) => c + 1);

    trackEvent('ai_assistant_query', { query: text, language });

    try {
      const response = await fetch('/api/menu-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Here are our recommendations from the menu.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If user has asked 3 or more questions, prompt for direct lead capture / WhatsApp link
      if (chatCount >= 2) {
        setShowLeadCapture(true);
      }
    } catch (err) {
      console.error('Error fetching assistant response:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'hi'
            ? 'क्षमा करें, नेटवर्क में देरी हो रही है। आप सीधे मालिक से व्हाट्सएप पर बात करके आर्डर या जानकारी ले सकते हैं।'
            : 'I am experiencing a slight network delay. Please tap below to chat directly with our dhaba owner on WhatsApp!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendLeadToWhatsApp = () => {
    if (!leadPhone.trim()) return;
    const phone = RESTAURANT_CONFIG.business.whatsappNumber;
    const msg = `Namaste New Raj Dhaba! My name is ${leadName || 'Guest'} (${leadPhone}). I was exploring your menu assistant and would like to place an order or discuss party catering.`;
    trackEvent('lead_captured_to_whatsapp', { leadName, leadPhone });
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg h-[92vh] sm:h-[650px] bg-stone-900 border border-stone-800 rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-100 z-10">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 bg-stone-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-white">
                  {t.aiAssistantTitle}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                {t.aiAssistantSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-600 text-white rounded-br-xs font-medium'
                    : 'bg-stone-950 border border-stone-800 text-stone-200 rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.content}</p>
                <span
                  className={`block text-[10px] mt-1 ${
                    m.role === 'user' ? 'text-amber-200' : 'text-stone-500'
                  }`}
                >
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-stone-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-stone-400">
              <div className="w-7 h-7 rounded-lg bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400 shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-stone-400 flex items-center gap-2">
                <span>Checking menu dishes & prices...</span>
              </div>
            </div>
          )}

          {/* Lead Capture Module */}
          {showLeadCapture && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-700/50 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Ready to order or plan a family feast?</span>
              </div>
              <p className="text-stone-300 text-[11px]">
                Leave your name & number to connect directly with the dhaba owner on WhatsApp:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded-md text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="px-2.5 py-1.5 bg-stone-900 border border-stone-800 rounded-md text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                onClick={handleSendLeadToWhatsApp}
                type="button"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send to WhatsApp</span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-stone-950/60 border-t border-stone-800 overflow-x-auto scrollbar-none flex gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-full bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-amber-300 text-xs whitespace-nowrap transition-colors border border-stone-700/80 shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'hi'
                ? 'व्यंजन, बजट या कॉम्बो के बारे में पूछें...'
                : 'Ask about budget, combos or spice level...'
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

          <a
            href={generateWhatsAppQuickChatUrl('Chat with Owner')}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            title="Chat directly with owner on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
