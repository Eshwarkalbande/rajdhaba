import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { RESTAURANT_CONFIG } from './src/data/restaurantConfig';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(express.json());

// In-memory IP rate limiter: max 30 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Clean up stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Initialize Gemini SDK if GEMINI_API_KEY is available
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Ground-truth menu context
const menuSummary = RESTAURANT_CONFIG.menuItems
  .map(
    (item) =>
      `- [ID: ${item.id}] ${item.name} (${item.hindiName}) [${item.isVeg ? 'VEG' : 'NON-VEG'}, Spice Level: ${item.spicyLevel}/3]: ₹${item.price}. ${
        item.description
      }${item.isSignature ? ' [SIGNATURE]' : ''}${item.isBestseller ? ' [BESTSELLER]' : ''}`
  )
  .join('\n');

// Specific system instructions for different chatbot roles
function getSystemInstruction(role: string = 'concierge'): string {
  const baseRules = `
RESTAURANT DETAILS:
- Business: New Raj Dhaba And Family Restaurant (न्यू राज ढाबा एंड फैमिली रेस्टोरेंट)
- Address: Dahegaon Rd, Dahegaon (Rangari), Maharashtra 441113 (near Saoner bypass)
- Timings: 11:00 AM – 11:30 PM (All 7 Days)
- Seating: Outdoor garden lawn with warm ambient fairy lights, AC Family dining hall, traditional Punjabi charpai (cots), highway drive-through/parking bay.
- Delivery: Within 10 km (Dahegaon, Rangari, Saoner bypass). Minimum order ₹250. FREE delivery on orders over ₹500 (else ₹40 delivery fee).
- Ordering: Orders are placed through WhatsApp directly with the owner (${RESTAURANT_CONFIG.business.phoneDisplay}) for instant confirmation.
- Authentic Menu:
${menuSummary}

STRICT INVARIANTS:
1. ONLY recommend dishes, combos, and prices that exist in this exact menu. Never invent dishes, prices, or fake offers.
2. If asked about items not on the menu, explicitly say it is not available and recommend the closest authentic dish from our menu.
3. Keep track of previous conversation turns to provide cohesive, personalized advice.
4. Respond in the language used by the guest (English, Hindi, or Marathi).
5. Suggest exact dish names and prices with totals when making recommendations.
`;

  switch (role) {
    case 'chef':
      return `You are Chef Gurpreet, the master chef at New Raj Dhaba.
${baseRules}
ROLE & TONE:
- Passionate, authentic, culinary-focused.
- You explain how the clay tandoor imparts charcoal smokiness, how the Dal Tadka uses double pure desi ghee tempering, and how the Chicken Handi is slow-cooked in sealed earthen clay pots.
- Advise guests on spice pairings (e.g. Garlic Naan with Chicken Handi, Jeera Rice with Dal Tadka).
- Keep replies appetizing, informative, and concise (under 120 words).`;

    case 'party_planner':
      return `You are Preeti, the Event & Family Banquet Coordinator at New Raj Dhaba.
${baseRules}
ROLE & TONE:
- Organized, hospitable, great at group math and banquet planning.
- When guests ask about dining for 4, 8, 15, or 25+ people, calculate exact quantity of main courses, rotis, rice, and desserts from the menu, with itemized costs.
- Explain seating options (AC family hall for private comfort, or garden terrace with fairy lights).
- Encourage confirming party dates on WhatsApp with the owner.`;

    case 'concierge':
    default:
      return `You are Rajveer, the digital host and concierge at New Raj Dhaba.
${baseRules}
ROLE & TONE:
- Warm, polite, respectful, and eager to help highway commuters and local families.
- Help guests choose dishes matching their budget, taste, or dietary needs (pure veg, non-veg, mild, spicy).
- If the guest wants to order or inquire about custom requests, encourage tapping "Order on WhatsApp" to chat with the owner.
- Keep responses friendly, helpful, and concise (under 100 words).`;
  }
}

// Fallback rule-based responses if API key is missing or fails
function getRuleBasedResponse(query: string, language: string = 'en', role: string = 'concierge'): string {
  const q = query.toLowerCase();

  if (q.includes('veg') && (q.includes('4') || q.includes('people') || q.includes('combo') || q.includes('family'))) {
    if (language === 'hi') {
      return "4 लोगों के लिए परफेक्ट वेज कॉम्बो: 1x कढ़ाई पनीर (₹240), 1x ढाबा दाल तड़का (₹160), 8x बटर तंदूरी रोटी (₹160), 1x जीरा राइस (₹120) और 4x कुल्हड़ मलाई लस्सी (₹280)। कुल: ₹960 (मुफ्त डिलीवरी सहित)!";
    }
    if (language === 'mr') {
      return "४ जणांसाठी परिपूर्ण शाकाहारी कॉम्बो: १x कढई पनीर (₹२४०), १x ढाबा डाळ तडका (₹१६०), ८x बटर तंदूरी रोटी (₹१६०), १x जिरा राईस (₹१२०) आणि ४x कुल्हड लस्सी (₹२८०). एकूण: ₹९६०!";
    }
    return "Perfect Veg Combo for 4: 1x Kadhai Paneer (₹240), 1x Dhaba Dal Tadka (₹160), 8x Butter Tandoori Roti (₹160), 1x Jeera Rice (₹120), and 4x Kulhad Lassi (₹280). Total: ₹960 with Free Delivery!";
  }

  if (q.includes('non veg') || q.includes('chicken') || q.includes('mutton') || q.includes('non-veg')) {
    if (language === 'hi') {
      return "नॉन-वेज में हमारी पहचान 'ढाबा देसी चिकन हांडी' (हाफ ₹290 / फुल ₹520) और कोयला तंदूर 'तंदूरी चिकन' (₹240) है। साथ में गार्लिक बटर नान (₹60) का स्वाद लाजवाब रहेगा!";
    }
    return "Our signature non-veg dish is the earthen clay pot Dhaba Desi Chicken Handi (Half ₹290 / Full ₹520) and Charcoal Tandoori Chicken (Half ₹240). Best paired with Garlic Butter Naan (₹60)!";
  }

  if (q.includes('timing') || q.includes('open') || q.includes('time')) {
    return language === 'hi'
      ? "हम रोजाना सुबह 11:00 बजे से रात 11:30 बजे तक सातों दिन खुले रहते हैं। डाइन-इन, ड्राइव-थ्रू और डिलीवरी सभी समय उपलब्ध हैं!"
      : "We are open daily from 11:00 AM to 11:30 PM (all 7 days). Dine-in, drive-through, and delivery are active throughout.";
  }

  if (q.includes('delivery') || q.includes('address') || q.includes('area')) {
    return language === 'hi'
      ? "हम दहेगांव, रंगारी, सावनेर बायपास और 10 किमी दायरे में होम डिलीवरी करते हैं। न्यूनतम आर्डर ₹250 है और ₹500 से ऊपर की डिलीवरी बिल्कुल मुफ्त है!"
      : "We deliver within 10 km (Dahegaon, Rangari, Saoner bypass). Minimum order is ₹250. Orders above ₹500 get FREE delivery!";
  }

  return language === 'hi'
    ? "नमस्ते! मैं न्यू राज ढाबा का सहायक हूँ। आप मुझसे बजट, कॉम्बो, शाकाहारी/मांसाहारी व्यंजन या सिटिंग के बारे में पूछ सकते हैं।"
    : "Welcome to New Raj Dhaba! Ask me about dish recommendations, party combos, spice levels, or seating options.";
}

// POST /api/chat - Multi-turn Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
      rateLimited: true,
    });
    return;
  }

  const {
    message,
    history = [],
    role = 'concierge',
    language = 'en',
    speed = 'standard', // 'fast' -> gemini-3.1-flash-lite, 'standard' -> gemini-3.5-flash
  } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  // Model selection per instructions:
  // - gemini-3.5-flash for general tasks
  // - gemini-3.1-flash-lite for tasks that should happen fast
  const selectedModel = speed === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash';
  const systemInstruction = getSystemInstruction(role);

  if (aiClient) {
    try {
      // Build full multi-turn conversation history
      const formattedContents = [
        ...history.slice(-8).map((h: { role: string; content: string }) => ({
          role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })),
        {
          role: 'user',
          parts: [
            {
              text: `[Preferred Language: ${language}] [Role context: ${role}]\nGuest: ${message}`,
            },
          ],
        },
      ];

      const response = await aiClient.models.generateContent({
        model: selectedModel,
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 350,
        },
      });

      const replyText = response.text?.trim();

      if (replyText) {
        res.json({
          reply: replyText,
          modelUsed: selectedModel,
          role,
          provider: 'gemini',
        });
        return;
      }
    } catch (err: any) {
      console.warn(`Gemini (${selectedModel}) call failed, falling back to rule engine:`, err?.message || err);
    }
  }

  // Fallback response
  const fallbackReply = getRuleBasedResponse(message, language, role);
  res.json({
    reply: fallbackReply,
    modelUsed: 'rule-engine-fallback',
    role,
    provider: 'rules',
  });
});

// Legacy /api/menu-assistant route forwarding to /api/chat
app.post('/api/menu-assistant', (req: Request, res: Response) => {
  // Map to /api/chat
  req.url = '/api/chat';
  app._router.handle(req, res, () => {});
});

// GET /api/health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    restaurant: RESTAURANT_CONFIG.business.name,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    modelsSupported: ['gemini-3.5-flash', 'gemini-3.1-flash-lite'],
  });
});

// Mount Vite in dev, static dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
