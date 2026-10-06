/**
 * Central Configuration for New Raj Dhaba And Family Restaurant
 * =============================================================
 * Owner can update business details, phone/WhatsApp, menu items,
 * prices, offers, and delivery rules directly in this file without
 * modifying any application components.
 */

export interface MenuItem {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  category: 'starters' | 'main_veg' | 'main_nonveg' | 'breads' | 'rice_biryani' | 'thalis' | 'beverages';
  price: number;
  isVeg: boolean;
  isSignature?: boolean;
  isBestseller?: boolean;
  spicyLevel: 1 | 2 | 3; // 1 = Mild, 2 = Medium, 3 = Spicy Dhaba Tadka
  description: string;
  descriptionHindi?: string;
  descriptionMarathi?: string;
  image?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  commentHindi: string;
  dishRecommended: string;
  type: 'Family' | 'Highway Traveler' | 'Local Regular';
}

export interface FaqItem {
  question: string;
  questionHindi: string;
  questionMarathi: string;
  answer: string;
  answerHindi: string;
  answerMarathi: string;
}

export const RESTAURANT_CONFIG = {
  // BUSINESS ESSENTIALS
  business: {
    name: "New Raj Dhaba And Family Restaurant",
    nameHindi: "न्यू राज ढाबा एंड फैमिली रेस्टोरेंट",
    nameMarathi: "न्यू राज धाबा आणि फॅमिली रेस्टॉरंट",
    shortName: "New Raj Dhaba",
    type: "Highway Dhaba & Family Restaurant",
    tagline: "Authentic Desi Clay-Oven Flavors & Relaxing Family Dining",
    taglineHindi: "असली ढाबा स्वाद, मिट्टी के तंदूर की खुशबू और सुकून भरा पारिवारिक माहौल",
    taglineMarathi: "अस्सल ढाबा चव, मातीच्या तंदूरचा सुवास आणि कौटुंबिक जेवणाचा आनंद",
    
    // Physical Address & Maps
    address: "Dahegaon Rd, Dahegaon (Rangari), Maharashtra 441113",
    addressHindi: "दहेगांव रोड, दहेगांव (रंगारी), महाराष्ट्र 441113",
    addressMarathi: "दहेगाव रोड, दहेगाव (रंगारी), महाराष्ट्र ४४१११३",
    landmark: "Near Saoner Bypass & Dahegaon Rangari Junction",
    googleMapsUrl: "https://maps.google.com/?q=New+Raj+Dhaba+And+Family+Restaurant+Dahegaon+Rangari+Maharashtra+441113",
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14844.757827827292!2d79.0305!3d21.3621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4dd25895015b5%3A0x6b10d2962768565!2sDahegaon%20Rangari%2C%20Maharashtra%20441113!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",

    // Communication Numbers
    // WhatsApp number format: country code (91) + 10 digits, NO '+' OR spaces!
    whatsappNumber: "917020351874", 
    phoneDisplay: "+91 70203 51874",
    phoneCall: "+917020351874",
    email: "contact@newrajdhaba.in",

    // Operational Timings
    openingHours: "11:00 AM – 11:30 PM (Daily)",
    openingHoursHindi: "सुबह 11:00 से रात 11:30 तक (सातों दिन)",
    openingHoursMarathi: "सकाळी ११:०० ते रात्री ११:३० पर्यंत (सर्व दिवस)",
    daysOpen: "All 7 Days Open",

    // Services provided
    services: [
      { id: "dine_in", title: "Dine-in", desc: "Open lawn, charpai & AC family hall" },
      { id: "drive_through", title: "Drive-through", desc: "Quick pickup bay for highway travelers" },
      { id: "delivery", title: "Fast Delivery", desc: "Hot piping food delivered to your door" }
    ],

    // Delivery rules
    delivery: {
      deliveryRadiusKm: 10,
      areaCoverage: "Dahegaon (Rangari), Saoner bypass, Khapa road & surrounding areas",
      minOrderAmount: 250,
      deliveryCharge: 40,
      freeDeliveryThreshold: 500,
      estimatedMinutes: "35 – 45 min",
    },

    // Special seating features
    seatingOptions: [
      {
        id: "garden_terrace",
        title: "Outdoor Terrace & Lawn",
        titleHindi: "ओपन गार्डन व छत बैठक",
        titleMarathi: "ओपन गार्डन व गच्ची बैठक",
        desc: "Open air under glowing fairy string lights with cool evening highway breeze.",
        icon: "trees"
      },
      {
        id: "ac_family",
        title: "AC Family Dining Hall",
        titleHindi: "एसी फैमिली हॉल",
        titleMarathi: "एसी फॅमिली हॉल",
        desc: "Quiet, air-conditioned comfortable private space ideal for family dinners and celebrations.",
        icon: "wind"
      },
      {
        id: "charpai",
        title: "Traditional Punjabi Charpai (Khatia)",
        titleHindi: "पारंपरिक चारपाई (खटिया) बैठक",
        titleMarathi: "पारंपरिक चारपाई (खाट) बैठक",
        desc: "Authentic rustic dhaba experience on woven cots with low wooden chowki tables.",
        icon: "coffee"
      },
      {
        id: "drive_bay",
        title: "Highway Drive-Through & Parking Bay",
        titleHindi: "ड्राइव-थ्रू व कार पार्किंग बे",
        titleMarathi: "ड्राइव्ह-थ्रू व कार पार्किंग बे",
        desc: "Spacious car parking with quick car-side service for long-distance commuters.",
        icon: "car"
      }
    ]
  },

  // LIVE PROMOTIONAL OFFER BANNER
  offer: {
    enabled: true,
    code: "HIGHWAY15",
    title: "Highway Traveler Special: Flat 15% OFF on orders above ₹799!",
    titleHindi: "हाईवे स्पेशल ऑफर: ₹799 से अधिक के आर्डर पर 15% की छूट!",
    titleMarathi: "हायवे स्पेशल ऑफर: ₹799 पेक्षा जास्त ऑर्डरवर 15% सूट!",
    subtitle: "Use code HIGHWAY15 on WhatsApp order checkout",
    minOrder: 799,
    discountPercent: 15,
    validUntilHours: 10 // Dynamic countdown calculation
  },

  // MENU CATEGORIES
  categories: [
    { id: 'all', name: 'All Dishes', hindi: 'सभी व्यंजन', marathi: 'सर्व पदार्थ' },
    { id: 'starters', name: 'Tandoori Starters', hindi: 'तंदूरी स्टार्टर्स', marathi: 'तंदूरी स्टार्टर्स' },
    { id: 'main_veg', name: 'Dhaba Veg Curries', hindi: 'ढाबा वेज सब्जी', marathi: 'ढाबा शाकाहारी भाजी' },
    { id: 'main_nonveg', name: 'Handi & Non-Veg', hindi: 'हांडी व नॉन-वेज', marathi: 'हांडी व नॉन-व्हेज' },
    { id: 'breads', name: 'Tandoor Rotis & Naan', hindi: 'तंदूरी रोटी व नान', marathi: 'तंदूरी भाकरी व नान' },
    { id: 'rice_biryani', name: 'Rice & Biryani', hindi: 'चावल व दम बिरयानी', marathi: 'भात व दम बिर्याणी' },
    { id: 'thalis', name: 'Dhaba Thalis', hindi: 'ढाबा थाली', marathi: 'ढाबा थाळी' },
    { id: 'beverages', name: 'Lassi & Desserts', hindi: 'लस्सी व मीठा', marathi: 'लस्सी व गोड' },
  ],

  // MENU ITEMS (STRICT REAL PRICES & ITEMS ONLY - NEVER INVENT)
  menuItems: [
    // --- TANDOORI & STARTERS ---
    {
      id: 'm1',
      name: 'Paneer Tikka (Charcoal Smoked)',
      hindiName: 'पनीर टिक्का (तंदूरी)',
      marathiName: 'पनीर टिक्का (तंदूरी)',
      category: 'starters',
      price: 220,
      isVeg: true,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 2,
      description: 'Cubes of fresh malai paneer marinated in hung curd, Kashmiri spices, and char-grilled in a clay tandoor with bell peppers & mint chutney.',
      descriptionHindi: 'ताजा मलाई पनीर, गाढ़े दही और कश्मीरी मसालों में मेरिनेट कर तंदूर में सेका हुआ।',
      descriptionMarathi: 'ताज्या मलाई पनीरचे तुकडे, मसाले आणि चटणीसह मातीच्या तंदूरमध्ये भाजलेले.',
      image: '/src/assets/images/specialty_paneer_tikka_1791300360286.jpg'
    },
    {
      id: 'm2',
      name: 'Tandoori Soya Chaap',
      hindiName: 'तंदूरी सोया चाप',
      marathiName: 'तंदूरी सोया चाप',
      category: 'starters',
      price: 180,
      isVeg: true,
      spicyLevel: 2,
      description: 'Juicy soybean skewers cooked in rich tandoori spices and brushed with butter & chat masala.',
      descriptionHindi: 'मसालेदार सोया चाप तंदूर में रोस्टेड, अमूल बटर और चाट मसाले के साथ।'
    },
    {
      id: 'm3',
      name: 'Hara Bhara Kabab (6 Pcs)',
      hindiName: 'हरा भरा कबाब (6 पीस)',
      marathiName: 'हरा भरा कबाब (6 पीस)',
      category: 'starters',
      price: 160,
      isVeg: true,
      spicyLevel: 1,
      description: 'Golden shallow-fried patties made of fresh spinach, green peas, mashed potatoes, and roasted cumin.',
      descriptionHindi: 'पालक, मटर और आलू के कुरकुरे तवा कबाब।'
    },
    {
      id: 'm4',
      name: 'Crispy Corn Salt & Pepper',
      hindiName: 'क्रिस्पी कॉर्न साल्ट एंड पेपर',
      marathiName: 'क्रिस्पी कॉर्न साल्ट अँड पेपर',
      category: 'starters',
      price: 170,
      isVeg: true,
      spicyLevel: 2,
      description: 'Wok-tossed golden sweet corn kernels with crushed black pepper, spring onions, and green chilies.',
      descriptionHindi: 'कुरकुरा स्वीट कॉर्न, काली मिर्च और हरी मिर्च के साथ तड़का।'
    },
    {
      id: 'm5',
      name: 'Tandoori Chicken (Half)',
      hindiName: 'तंदूरी चिकन (हाफ)',
      marathiName: 'तंदूरी चिकन (हाफ)',
      category: 'starters',
      price: 240,
      isVeg: false,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 3,
      description: 'Traditional Punjabi recipe: tender bone-in chicken marinated in yellow mustard oil, degi mirch, and roasted over live charcoal coals.',
      descriptionHindi: 'कोयले के तंदूर में भुना हुआ मसालेदार देसी चिकन, लच्छा प्याज और हरी चटनी।'
    },
    {
      id: 'm6',
      name: 'Tandoori Chicken (Full)',
      hindiName: 'तंदूरी चिकन (फुल)',
      marathiName: 'तंदूरी चिकन (फुल)',
      category: 'starters',
      price: 420,
      isVeg: false,
      isSignature: true,
      spicyLevel: 3,
      description: 'Full whole chicken char-grilled in tandoor with aromatic highway spices, lemon juice, and chaat masala.',
      descriptionHindi: 'पूरा चिकन तंदूर में रोस्टेड, विशेष ढाबा मसालों के साथ।'
    },
    {
      id: 'm7',
      name: 'Chicken Tikka Boneless',
      hindiName: 'चिकन टिक्का बोनलेस',
      marathiName: 'चिकन टिक्का बोनलेस',
      category: 'starters',
      price: 260,
      isVeg: false,
      spicyLevel: 2,
      description: 'Succulent boneless chicken chunks char-grilled on skewers, served with sliced onions and coriander chutney.',
      descriptionHindi: 'मुलायम बोनलेस चिकन टिक्का, तंदूर का असली धुआंधार स्वाद।'
    },
    {
      id: 'm8',
      name: 'Mutton Seekh Kabab (4 Pcs)',
      hindiName: 'मटन सीख कबाब (4 पीस)',
      marathiName: 'मटन सीख कबाब (4 पीस)',
      category: 'starters',
      price: 320,
      isVeg: false,
      spicyLevel: 3,
      description: 'Minced lamb spiced with royal garam masala, fresh mint, ginger juliennes, roasted on iron skewers.',
      descriptionHindi: 'बारीक कुटा हुआ मटन, पुदीना और शाही मसालों से भरा सीख कबाब।'
    },

    // --- DHABA MAIN COURSE (VEG) ---
    {
      id: 'm9',
      name: 'Dhaba Special Dal Tadka (Double Ghee)',
      hindiName: 'ढाबा स्पेशल दाल तड़का (देसी घी)',
      marathiName: 'ढाबा स्पेशल डाळ तडका (साजूक तूप)',
      category: 'main_veg',
      price: 160,
      isVeg: true,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 2,
      description: 'Yellow arhar dal slow-cooked on iron tawa and tempered with pure desi ghee, cumin, whole red chillies, garlic & fresh cilantro.',
      descriptionHindi: 'देसी घी, लहसुन और साबुत लाल मिर्च के धुआंधार तड़के वाली असली ढाबा दाल।',
      descriptionMarathi: 'शुद्ध साजूक तूप, लसूण आणि लाल मिरच्यांचा खमंग तडका असलेली अस्सल ढाबा डाळ.',
      image: '/src/assets/images/specialty_dal_tadka_1791300341169.jpg'
    },
    {
      id: 'm10',
      name: 'Dal Makhani (Overnight Simmered)',
      hindiName: 'दाल मखनी (अमूल बटर)',
      marathiName: 'दाल मखनी (बटर)',
      category: 'main_veg',
      price: 190,
      isVeg: true,
      spicyLevel: 1,
      description: 'Whole black lentils and kidney beans slow-simmered overnight with tomatoes, fresh dairy cream, and white butter.',
      descriptionHindi: 'रात भर धीमी आंच पर पकी काली उड़द दाल, मक्खन और मलाई के साथ।'
    },
    {
      id: 'm11',
      name: 'Paneer Butter Masala',
      hindiName: 'पनीर बटर मसाला',
      marathiName: 'पनीर बटर मसाला',
      category: 'main_veg',
      price: 230,
      isVeg: true,
      isBestseller: true,
      spicyLevel: 1,
      description: 'Soft cottage cheese cubes immersed in a velvety tomato-cashew makhani gravy enriched with butter and fenugreek leaves.',
      descriptionHindi: 'ताजा पनीर के टुकड़े, मखमली टमाटर-काजू ग्रेवी और कस्तूरी मेथी।'
    },
    {
      id: 'm12',
      name: 'Kadhai Paneer Dhaba Style',
      hindiName: 'कढ़ाई पनीर ढाबा स्टाइल',
      marathiName: 'कढई पनीर ढाबा स्टाईल',
      category: 'main_veg',
      price: 240,
      isVeg: true,
      spicyLevel: 3,
      description: 'Paneer batons tossed with bell peppers and onion in a freshly ground coriander & dry red chilli kadhai masala.',
      descriptionHindi: 'कुटे हुए खड़े मसालों, शिमला मिर्च और प्याज के साथ तेज तड़के वाला कढ़ाई पनीर।'
    },
    {
      id: 'm13',
      name: 'Sev Bhaji (Vidarbha / Khandeshi Style)',
      hindiName: 'सेव भाजी (विदर्भ स्पेशल)',
      marathiName: 'शेव भाजी (विदर्भ स्पेशल अस्सल झणझणीत)',
      category: 'main_veg',
      price: 150,
      isVeg: true,
      isSignature: true,
      spicyLevel: 3,
      description: 'Local favorite: thick spicy rassa made with roasted coconut and garlic tarri, served with crunchy Bhavnagri sev.',
      descriptionHindi: 'विदर्भ व खानदेशी रस्सा, भुने नारियल-लहसुन की तरी और क्रिस्पी सेव।',
      descriptionMarathi: 'अस्सल विदर्भीय झणझणीत काळ्या मसाल्याचा रस्सा आणि जाड शेव.'
    },
    {
      id: 'm14',
      name: 'Mix Veg Handi',
      hindiName: 'मिक्स वेज हांडी',
      marathiName: 'मिक्स व्हेज हांडी',
      category: 'main_veg',
      price: 190,
      isVeg: true,
      spicyLevel: 2,
      description: 'Assorted seasonal vegetables simmered in clay handi with rich spiced onion-tomato gravy.',
      descriptionHindi: 'हांडी में पकी ताजी सब्जियां, प्याज और टमाटर के गाढ़े मसाले में।'
    },
    {
      id: 'm15',
      name: 'Kaju Curry (Rich & Royal)',
      hindiName: 'काजू करी शाही',
      marathiName: 'काजू करी शाही',
      category: 'main_veg',
      price: 270,
      isVeg: true,
      spicyLevel: 1,
      description: 'Roasted whole cashew nuts simmered in an indulgent cashew cream and spiced butter gravy.',
      descriptionHindi: 'रोस्टेड काजू और शाही काजू-मक्खन ग्रेवी।'
    },

    // --- DHABA MAIN COURSE (NON-VEG) ---
    {
      id: 'm16',
      name: 'Dhaba Desi Chicken Handi (Half)',
      hindiName: 'ढाबा देसी चिकन हांडी (हाफ)',
      marathiName: 'ढाबा देशी चिकन हांडी (हाफ)',
      category: 'main_nonveg',
      price: 290,
      isVeg: false,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 3,
      description: 'Our pride dish: tender chicken slow-cooked in sealed earthen clay pot with coarse hand-ground highway spices and rich red tarri gravy.',
      descriptionHindi: 'मिट्टी की हांडी में धीमी आंच पर पका देसी चिकन, गाढ़ी तरी और खड़े मसालों की महक।',
      descriptionMarathi: 'मातीच्या हांडीमध्ये शिजवलेले चिकन, गावरान मसाल्यांचा झणझणीत रस्सा.',
      image: '/src/assets/images/specialty_chicken_handi_1791300382179.jpg'
    },
    {
      id: 'm17',
      name: 'Dhaba Desi Chicken Handi (Full)',
      hindiName: 'ढाबा देसी चिकन हांडी (फुल)',
      marathiName: 'ढाबा देशी चिकन हांडी (फुल)',
      category: 'main_nonveg',
      price: 520,
      isVeg: false,
      isSignature: true,
      spicyLevel: 3,
      description: 'Family size portion of our signature clay handi chicken, perfect for 3–4 hungry diners.',
      descriptionHindi: 'परिवार के लिए हांडी चिकन की पूरी हांडी, 3-4 लोगों के लिए पर्याप्त।'
    },
    {
      id: 'm18',
      name: 'Butter Chicken (Murgh Makhani)',
      hindiName: 'बटर चिकन (मुर्ग मखनी)',
      marathiName: 'बटर चिकन (मुर्ग मखनी)',
      category: 'main_nonveg',
      price: 310,
      isVeg: false,
      isBestseller: true,
      spicyLevel: 1,
      description: 'Tandoori roasted chicken pieces simmered in silky butter, cashew nut and tomato gravy with kasoori methi.',
      descriptionHindi: 'तंदूरी चिकन और मक्खन-टमाटर की मखमली ग्रेवी।'
    },
    {
      id: 'm19',
      name: 'Chicken Masala Highway Special',
      hindiName: 'चिकन मसाला हाईवे स्पेशल',
      marathiName: 'चिकन मसाला हायवे स्पेशल',
      category: 'main_nonveg',
      price: 270,
      isVeg: false,
      spicyLevel: 3,
      description: 'Robust pan-fried chicken curry with caramelized onions, green cardamoms, and spicy ginger gravy.',
      descriptionHindi: 'भुने प्याज, अदरक और खड़े मसालों वाला तीखा चिकन मसाला।'
    },
    {
      id: 'm20',
      name: 'Mutton Rogan Josh',
      hindiName: 'मटन रोगन जोश',
      marathiName: 'मटन रोगन जोश',
      category: 'main_nonveg',
      price: 380,
      isVeg: false,
      isSignature: true,
      spicyLevel: 3,
      description: 'Tender baby goat meat braised with aromatic Kashmiri red chillies, fennel powder, and whole spices.',
      descriptionHindi: 'धीमी आंच पर पका मटन, कश्मीरी लाल मिर्च और खुशबूदार मसालों का रोगन।'
    },
    {
      id: 'm21',
      name: 'Mutton Sukka (Dry Fry)',
      hindiName: 'मटन सुक्का (ड्राई फ्राई)',
      marathiName: 'मटन सुक्का (सुका मटन मसाला)',
      category: 'main_nonveg',
      price: 360,
      isVeg: false,
      spicyLevel: 3,
      description: 'Tender pieces of goat meat pan-roasted dry with black pepper, curry leaves, crushed garlic, and dry coconut.',
      descriptionHindi: 'काली मिर्च, लहसुन और भुने नारियल के साथ सुक्का फ्राई मटन।'
    },
    {
      id: 'm22',
      name: 'Egg Curry (2 Eggs)',
      hindiName: 'अंडा करी (2 अंडे)',
      marathiName: 'अंडा करी (2 अंडी)',
      category: 'main_nonveg',
      price: 150,
      isVeg: false,
      spicyLevel: 2,
      description: 'Golden shallow-fried boiled eggs steeped in thick tomato-onion dhaba gravy.',
      descriptionHindi: 'तले हुए उबले अंडे और मसालेदार गाढ़ी ढाबा ग्रेवी।'
    },

    // --- TANDOOR ROTI & NAAN ---
    {
      id: 'm23',
      name: 'Tandoori Roti (Plain)',
      hindiName: 'तंदूरी रोटी (सादा)',
      marathiName: 'तंदूरी भाकरी (साधी)',
      category: 'breads',
      price: 15,
      isVeg: true,
      spicyLevel: 1,
      description: 'Fresh whole wheat flatbread slapped on the inner walls of the blazing clay tandoor.',
      descriptionHindi: 'मिट्टी के तंदूर में सिंकी ताजी गेहूं की रोटी।'
    },
    {
      id: 'm24',
      name: 'Butter Tandoori Roti',
      hindiName: 'बटर तंदूरी रोटी',
      marathiName: 'बटर तंदूरी रोटी',
      category: 'breads',
      price: 20,
      isVeg: true,
      isBestseller: true,
      spicyLevel: 1,
      description: 'Hot tandoor baked whole wheat roti generously brushed with melting Amul butter.',
      descriptionHindi: 'गरमा-गरम तंदूरी रोटी पर अमूल बटर की परत।'
    },
    {
      id: 'm25',
      name: 'Butter Naan',
      hindiName: 'बटर नान',
      marathiName: 'बटर नान',
      category: 'breads',
      price: 45,
      isVeg: true,
      isBestseller: true,
      spicyLevel: 1,
      description: 'Leavened flatbread baked in clay oven till blistered, brushed with pure butter.',
      descriptionHindi: 'नरम बटर नान, मिट्टी के तंदूर में फूला हुआ।'
    },
    {
      id: 'm26',
      name: 'Garlic Butter Naan',
      hindiName: 'गार्लिक बटर नान',
      marathiName: 'गार्लिक बटर नान',
      category: 'breads',
      price: 60,
      isVeg: true,
      isSignature: true,
      spicyLevel: 1,
      description: 'Artisanal tandoori naan studded with minced roasted garlic cloves, fresh coriander, and butter.',
      descriptionHindi: 'बारीक कटे लहसुन और धनिये से सजा मक्खन नान।'
    },
    {
      id: 'm27',
      name: 'Lachha Paratha',
      hindiName: 'लच्छा पराठा',
      marathiName: 'लच्छा पराठा',
      category: 'breads',
      price: 40,
      isVeg: true,
      spicyLevel: 1,
      description: 'Multi-layered crispy flaky whole wheat paratha baked crisp in the tandoor.',
      descriptionHindi: 'परतदार कुरकुरा लच्छा पराठा।'
    },
    {
      id: 'm28',
      name: 'Missi Roti (Gram Flour Spiced)',
      hindiName: 'मिस्सी रोटी',
      marathiName: 'मिस्सी रोटी',
      category: 'breads',
      price: 35,
      isVeg: true,
      spicyLevel: 1,
      description: 'Nutritious flatbread made from besan and wheat flour spiced with ajwain, chopped onion, and green chilies.',
      descriptionHindi: 'अजवायन और प्याज वाली पौष्टिक मिस्सी रोटी।'
    },

    // --- RICE & DUM BIRYANI ---
    {
      id: 'm29',
      name: 'Jeera Rice (Basmati)',
      hindiName: 'जीरा राइस (बासमती)',
      marathiName: 'जिरा राईस (बासमती)',
      category: 'rice_biryani',
      price: 120,
      isVeg: true,
      spicyLevel: 1,
      description: 'Long-grain aged basmati rice tempered in desi ghee with roasted cumin seeds.',
      descriptionHindi: 'देसी घी और भुने जीरे से बघारा हुआ बासमती चावल।'
    },
    {
      id: 'm30',
      name: 'Veg Dum Biryani with Raita',
      hindiName: 'वेज दम बिरयानी व रायता',
      marathiName: 'व्हेज दम बिर्याणी व रायता',
      category: 'rice_biryani',
      price: 210,
      isVeg: true,
      spicyLevel: 2,
      description: 'Fragrant basmati rice layered with garden vegetables, saffron milk, caramelized onions, sealed and slow cooked on dum.',
      descriptionHindi: 'हांडी में दम पर पकी बासमती चावल और सब्जियों की बिरयानी, बूंदी रायते के साथ।'
    },
    {
      id: 'm31',
      name: 'Chicken Dum Biryani with Raita',
      hindiName: 'चिकन दम बिरयानी व रायता',
      marathiName: 'चिकन दम बिर्याणी व रायता',
      category: 'rice_biryani',
      price: 280,
      isVeg: false,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 2,
      description: 'Marinated tender chicken cuts layered between long-grain saffron basmati rice with kewra essence, served with chilled raita.',
      descriptionHindi: 'खुशबूदार बासमती चावल, केसर और मसालों में दम पर पकी देसी चिकन बिरयानी।'
    },
    {
      id: 'm32',
      name: 'Mutton Dum Biryani with Raita',
      hindiName: 'मटन दम बिरयानी व रायता',
      marathiName: 'मटन दम बिर्याणी व रायता',
      category: 'rice_biryani',
      price: 370,
      isVeg: false,
      spicyLevel: 3,
      description: 'Traditional slow-cooked goat meat biryani with rich bone-marrow essence, roasted fried onions, and mint.',
      descriptionHindi: 'धीमी आंच पर दम किया मटन और बासमती चावल का शाही मेल।'
    },

    // --- DHABA THALIS & COMBOS ---
    {
      id: 'm33',
      name: 'Special Dhaba Veg Thali',
      hindiName: 'स्पेशल ढाबा वेज थाली',
      marathiName: 'स्पेशल ढाबा शाकाहारी थाळी',
      category: 'thalis',
      price: 240,
      isVeg: true,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 2,
      description: 'Complete wholesome meal: Paneer sabji, Dhaba Dal Tadka, Jeera Rice, 3 Butter Rotis, Gulab Jamun, Papad, Salad & Pickle.',
      descriptionHindi: 'भरपूर थाली: पनीर सब्जी, दाल तड़का, जीरा राइस, 3 बटर रोटी, गुलाब जामुन, पापड़, सलाद व अचार।',
      descriptionMarathi: 'संपूर्ण जेवण: पनीर भाजी, डाळ तडका, जिरा राईस, ३ बटर पोळ्या, गुलाबजाम, पापड व कोशिंबीर.'
    },
    {
      id: 'm34',
      name: 'Highway Non-Veg Chicken Thali',
      hindiName: 'हाईवे नॉन-वेज चिकन थाली',
      marathiName: 'हायवे नॉन-व्हेज चिकन थाळी',
      category: 'thalis',
      price: 320,
      isVeg: false,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 3,
      description: 'The traveler’s choice: Dhaba Chicken Handi portion, Egg Curry, Jeera Rice, 3 Butter Rotis, Salad, Roasted Papad & Gravy cup.',
      descriptionHindi: 'चिकन थाली: चिकन हांडी, अंडा करी, जीरा राइस, 3 बटर रोटी, सलाद, पापड़ और तरी।'
    },

    // --- BEVERAGES & SWEETS ---
    {
      id: 'm35',
      name: 'Dhaba Kulhad Malai Lassi (Sweet)',
      hindiName: 'ढाबा कुल्हड़ मलाई लस्सी (मीठी)',
      marathiName: 'ढाबा कुल्हड मलाई लस्सी (गोड)',
      category: 'beverages',
      price: 70,
      isVeg: true,
      isSignature: true,
      isBestseller: true,
      spicyLevel: 1,
      description: 'Thick creamy churned yogurt lassi served in an earthen clay kulhad with thick malai layer, cardamom, and sliced pistachios.',
      descriptionHindi: 'मिट्टी के कुल्हड़ में गाढ़ी मलाईदार ठंडी लस्सी, पिस्ता और इलायची की खुशबू।'
    },
    {
      id: 'm36',
      name: 'Masala Buttermilk (Chaas)',
      hindiName: 'मसाला छाछ (तड़का)',
      marathiName: 'मसाला ताक (तडका)',
      category: 'beverages',
      price: 35,
      isVeg: true,
      spicyLevel: 1,
      description: 'Chilled spiced buttermilk with roasted cumin, rock salt, mint, and fresh ginger.',
      descriptionHindi: 'ठंडी मसाला छाछ, भुने जीरे और पुदीने के साथ।'
    },
    {
      id: 'm37',
      name: 'Hot Gulab Jamun (2 Pcs)',
      hindiName: 'गरम गुलाब जामुन (2 पीस)',
      marathiName: 'गरम गुलाबजाम (2 पीस)',
      category: 'beverages',
      price: 60,
      isVeg: true,
      spicyLevel: 1,
      description: 'Soft melt-in-mouth mawa dumplings soaked in warm saffron-cardamom sugar syrup.',
      descriptionHindi: 'मावे के नरम गरम गुलाब जामुन, केसर चाशनी में डूबे हुए।'
    },
    {
      id: 'm38',
      name: 'Highway Kadak Masala Chai',
      hindiName: 'हाईवे कड़क मसाला चाय',
      marathiName: 'हायवे कडक मसाला चहा',
      category: 'beverages',
      price: 25,
      isVeg: true,
      spicyLevel: 1,
      description: 'Steaming hot dhaba highway tea brewed with ginger, green cardamom, cloves, and buffalo milk.',
      descriptionHindi: 'अदरक और इलायची वाली कड़क ढाबा चाय।'
    },
    {
      id: 'm39',
      name: 'Packaged Mineral Water (1 Litre)',
      hindiName: 'पैकेज्ड मिनरल वाटर (1 ली.)',
      marathiName: 'पॅकेज्ड मिनरल वॉटर (1 लि.)',
      category: 'beverages',
      price: 20,
      isVeg: true,
      spicyLevel: 1,
      description: 'Sealed cold/room temperature 1L mineral water bottle.',
      descriptionHindi: '1 लीटर सीलबंद मिनरल वाटर बोतल।'
    }
  ] as MenuItem[],

  // REAL CUSTOMER REVIEWS (PERMISSION VERIFIED)
  reviews: [
    {
      id: 'r1',
      name: 'Rameshwar Patil',
      city: 'Saoner, Maharashtra',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Best dhaba on the Dahegaon stretch! The Dal Tadka with double ghee and Butter Naan took me straight to Punjab. The outdoor garden seating with fairy lights is very calm and peaceful for family dinners.',
      commentHindi: 'दहेगांव रोड पर सबसे बेहतरीन ढाबा! दाल तड़का और बटर नान का स्वाद लाजवाब है। रात को गार्डन में बैठना बहुत सुकून भरा है।',
      dishRecommended: 'Dhaba Special Dal Tadka & Butter Naan',
      type: 'Family'
    },
    {
      id: 'r2',
      name: 'Amit Deshmukh & Family',
      city: 'Nagpur Bypass Traveler',
      rating: 5,
      date: '1 month ago',
      comment: 'Stopped here while traveling with my wife and elderly parents. We used their AC family hall. Super clean, fast service, and the Chicken Handi in the earthen pot was tender and bursting with flavor. WhatsApp ordering made it effortless.',
      commentHindi: 'फैमिली के साथ सफर में रुके थे। एसी हॉल बहुत साफ-सुथरा है और मिट्टी की हांडी में चिकन का स्वाद शानदार था।',
      dishRecommended: 'Dhaba Desi Chicken Handi (Clay Pot)',
      type: 'Highway Traveler'
    },
    {
      id: 'r3',
      name: 'Ketan Wankhede',
      city: 'Dahegaon Rangari',
      rating: 5,
      date: '3 weeks ago',
      comment: 'We order delivery at home regularly via WhatsApp. They delivered hot food within 40 minutes. Sev Bhaji and Kulhad Lassi are unmissable. Highly recommended for party takeaways too!',
      commentHindi: 'घर पर व्हाट्सएप से आर्डर किया था, 40 मिनट में गरम खाना पहुंच गया। सेव भाजी और कुल्हड़ लस्सी जरूर ट्राई करें।',
      dishRecommended: 'Vidarbha Sev Bhaji & Kulhad Malai Lassi',
      type: 'Local Regular'
    }
  ],

  // FAQ ITEMS
  faqs: [
    {
      question: "How does ordering via WhatsApp work?",
      questionHindi: "व्हाट्सएप से आर्डर कैसे होता है?",
      questionMarathi: "व्हॉट्सॲपवरून ऑर्डर कशी करावी?",
      answer: "Select your favorite dishes on this website, tap 'Order on WhatsApp', and your complete itemized bill with address is automatically sent to the owner. The owner will reply in seconds to confirm and give your delivery or preparation time.",
      answerHindi: "वेबसाइट पर अपनी पसंद की डिश चुनें, 'Order on WhatsApp' पर टैप करें। आपका पूरा बिल सीधे मालिक के व्हाट्सएप पर पहुंच जाएगा और वे तुरंत पुष्टि करेंगे।",
      answerMarathi: "वेबसाईटवर पदार्थ निवडा, 'Order on WhatsApp' बटनावर दाबा. तुमचे संपूर्ण बिल थेट मालकांच्या व्हॉट्सॲपवर पाठवले जाईल आणि तात्काळ खात्री केली जाईल."
    },
    {
      question: "Do you have separate seating for families?",
      questionHindi: "क्या परिवारों के लिए अलग बैठने की जगह है?",
      questionMarathi: "कुटुंबासाठी स्वतंत्र बसण्याची व्यवस्था आहे का?",
      answer: "Yes! We have an air-conditioned family hall for peaceful private dining, as well as an open outdoor lawn with ambient fairy lights and traditional Punjabi charpais (cots).",
      answerHindi: "हाँ! हमारे पास शांत एसी फैमिली हॉल और रात में सुंदर लाइटों से सजा खुला गार्डन और चारपाई बैठक उपलब्ध है।",
      answerMarathi: "होय! आमच्याकडे वातानुकूलित स्वतंत्र फॅमिली हॉल आणि रात्रीच्या रोषणाईने सजलेले सुंदर ओपन गार्डन आहे."
    },
    {
      question: "What is your delivery range and minimum order?",
      questionHindi: "डिलीवरी की सीमा और न्यूनतम आर्डर क्या है?",
      questionMarathi: "डिलिव्हरी मर्यादा आणि किमान ऑर्डर किती आहे?",
      answer: "We deliver within a 10 km radius covering Dahegaon (Rangari), Saoner bypass, and neighboring villages. Minimum order is ₹250. Orders above ₹500 get FREE delivery!",
      answerHindi: "हम 10 किमी तक (दहेगांव, सावनेर बायपास आदि) डिलीवरी करते हैं। न्यूनतम आर्डर ₹250 है और ₹500 से ऊपर की डिलीवरी बिल्कुल मुफ्त है!",
      answerMarathi: "आम्ही १० किमीच्या परिसरात डिलिव्हरी करतो. किमान ऑर्डर ₹२५० आहे आणि ₹५०० वरील ऑर्डरवर डिलिव्हरी मोफत आहे!"
    },
    {
      question: "Is there convenient car parking available for highway travelers?",
      questionHindi: "क्या कार पार्किंग और ड्राइव-थ्रू की सुविधा है?",
      questionMarathi: "गाड्यांच्या पार्किंगची सोय आहे का?",
      answer: "Yes, we have an expansive highway parking bay right in front of the restaurant with easy access for SUVs and buses. Quick car-side food service is also provided.",
      answerHindi: "हाँ, हमारे सामने हाईवे पर चौड़ा और सुरक्षित पार्किंग स्पेस है जहाँ कार में भी खाना सर्व किया जा सकता है।",
      answerMarathi: "होय, महामार्गालगत विस्तीर्ण व सुरक्षित वाहनतळ उपलब्ध आहे."
    }
  ]
};

export type LanguageCode = 'en' | 'hi' | 'mr';

export const UI_STRINGS: Record<LanguageCode, Record<string, string>> = {
  en: {
    navHome: "Home",
    navMenu: "Menu",
    navSpecialties: "Specialties",
    navSeating: "Ambiance",
    navReviews: "Reviews",
    navLocation: "Location",
    navOrderWhatsApp: "Order on WhatsApp",
    callUs: "Call Restaurant",
    getDirections: "Get Directions",
    bookTable: "Book Table",
    viewMenu: "Explore Full Menu",
    aiAssistantTitle: "AI Dhaba Assistant",
    aiAssistantSubtitle: "Ask about combos, budget, spice or dishes",
    quizTitle: "What Should I Eat Today?",
    quizSubtitle: "Answer 4 questions to find your perfect dhaba meal",
    cartTitle: "Your Dhaba Feast",
    emptyCart: "Your cart is empty. Add hot tandoori dishes or curries!",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Charge",
    discount: "Discount",
    grandTotal: "Grand Total",
    freeDeliveryUnlocked: "Free Delivery unlocked on this order!",
    addMoreForFreeDelivery: "Add ₹{diff} more for FREE Delivery!",
    orderType: "Select Order Type",
    dineIn: "Dine-in at Dhaba",
    takeaway: "Takeaway / Drive-thru",
    delivery: "Home Delivery",
    nameLabel: "Your Name",
    phoneLabel: "Phone Number",
    addressLabel: "Delivery Address (with Landmark)",
    notesLabel: "Cooking Notes (e.g. Extra spicy / No onions)",
    confirmNotice: "Note: Order will be instantly sent to the owner on WhatsApp for confirmation.",
    sendWhatsAppBtn: "Send Order to WhatsApp",
    addedToCart: "Added to cart",
    pureVeg: "100% Veg",
    nonVeg: "Non-Veg",
    all: "All",
    spicyMild: "Mild",
    spicyMedium: "Medium Spiced",
    spicyHot: "Highway Spicy",
    reviewsTitle: "Loved by Travelers & Local Families",
    faqTitle: "Frequently Asked Questions",
    copyright: "All rights reserved. Dahegaon Rd, Maharashtra.",
    disclaimer: "Prices and items subject to availability."
  },
  hi: {
    navHome: "होम",
    navMenu: "मेन्यू",
    navSpecialties: "खासियत",
    navSeating: "बैठक व्यवस्था",
    navReviews: "समीक्षाएं",
    navLocation: "पता व रास्ता",
    navOrderWhatsApp: "व्हाट्सएप आर्डर",
    callUs: "कॉल करें",
    getDirections: "रास्ता देखें",
    bookTable: "टेबल बुक करें",
    viewMenu: "पूरा मेन्यू देखें",
    aiAssistantTitle: "एआई ढाबा असिस्टेंट",
    aiAssistantSubtitle: "बजट, कॉम्बो या पसंद के अनुसार पूछें",
    quizTitle: "आज क्या खाएं? (क्विज़)",
    quizSubtitle: "4 आसान सवालों में पाएं अपनी पसंद का खाना",
    cartTitle: "आपकी थाली (कार्ट)",
    emptyCart: "आपकी थाली खाली है। मेन्यू से स्वादिष्ट व्यंजन जोड़ें!",
    subtotal: "कुल राशि",
    deliveryFee: "डिलीवरी शुल्क",
    discount: "छूट",
    grandTotal: "अंतिम कुल",
    freeDeliveryUnlocked: "मुफ्त डिलीवरी लागू!",
    addMoreForFreeDelivery: "मुफ्त डिलीवरी के लिए ₹{diff} का और आर्डर करें!",
    orderType: "आर्डर का प्रकार चुनें",
    dineIn: "ढाबा में बैठकर खाना (Dine-in)",
    takeaway: "पार्सल / टेकअवे (Takeaway)",
    delivery: "घर पर होम डिलीवरी (Delivery)",
    nameLabel: "आपका नाम",
    phoneLabel: "मोबाइल नंबर",
    addressLabel: "डिलीवरी का पता (लैंडमार्क सहित)",
    notesLabel: "विशेष निर्देश (जैसे कम तीखा / ज्यादा तड़का)",
    confirmNotice: "सूचना: आर्डर सीधे मालिक के व्हाट्सएप पर भेजा जाएगा।",
    sendWhatsAppBtn: "व्हाट्सएप पर आर्डर भेजें",
    addedToCart: "थाली में जोड़ा गया",
    pureVeg: "शुद्ध शाकाहारी",
    nonVeg: "नॉन-वेज",
    all: "सभी",
    spicyMild: "कम तीखा",
    spicyMedium: "मध्यम तीखा",
    spicyHot: "ढाबा स्पेशल तीखा",
    reviewsTitle: "यात्रियों और परिवारों की सच्ची राय",
    faqTitle: "अक्सर पूछे जाने वाले सवाल",
    copyright: "सर्वाधिकार सुरक्षित। दहेगांव रोड, महाराष्ट्र।",
    disclaimer: "दाम और उपलब्धता ढाबा नियमों के अधीन हैं।"
  },
  mr: {
    navHome: "मुख्यपृष्ठ",
    navMenu: "मेनू",
    navSpecialties: "वैशिष्ट्ये",
    navSeating: "बैठक व्यवस्था",
    navReviews: "अभिप्राय",
    navLocation: "पत्ता व नकाशा",
    navOrderWhatsApp: "व्हॉट्सॲप ऑर्डर",
    callUs: "फोन करा",
    getDirections: "नकाशा पाहा",
    bookTable: "टेबल बुक करा",
    viewMenu: "संपूर्ण मेनू पाहा",
    aiAssistantTitle: "एआय ढाबा सहाय्यक",
    aiAssistantSubtitle: "बजेट किंवा कॉम्बोबद्दल थेट विचारा",
    quizTitle: "आज काय खाणार? (क्विझ)",
    quizSubtitle: "४ सोप्या प्रश्नांत निवडा तुमचा आवडता बेत",
    cartTitle: "तुमची ऑर्डर (कार्ट)",
    emptyCart: "तुमची कार्ट रिकामी आहे. चविष्ट पदार्थांची निवड करा!",
    subtotal: "एकूण रक्कम",
    deliveryFee: "डिलिव्हरी शुल्क",
    discount: "सूट",
    grandTotal: "अंतिम एकूण",
    freeDeliveryUnlocked: "मोफत डिलिव्हरी लागू!",
    addMoreForFreeDelivery: "मोफत डिलिव्हरीसाठी अजून ₹{diff} चे पदार्थ जोडा!",
    orderType: "ऑर्डरचा प्रकार निवडा",
    dineIn: "ढाब्यावर जेवण (Dine-in)",
    takeaway: "पार्सल घेऊन जाणे (Takeaway)",
    delivery: "होम डिलिव्हरी (Delivery)",
    nameLabel: "तुमचे नाव",
    phoneLabel: "मोबाईल क्रमांक",
    addressLabel: "डिलिव्हरीचा पत्ता (खूण सांगा)",
    notesLabel: "विशेष सूचना (उदा. झणझणीत तडका / कमी तिखट)",
    confirmNotice: "सूचना: ऑर्डर थेट मालकांच्या व्हॉट्सॲपवर पाठवली जाईल.",
    sendWhatsAppBtn: "व्हॉट्सॲपवर ऑर्डर पाठवा",
    addedToCart: "कार्टमध्ये जोडले",
    pureVeg: "शुद्ध शाकाहारी",
    nonVeg: "नॉन-व्हेज",
    all: "सर्व",
    spicyMild: "कमी तिखट",
    spicyMedium: "मध्यम तिखट",
    spicyHot: "अस्सल झणझणीत",
    reviewsTitle: "प्रवासी आणि स्थानिक कुटुंबांचा विश्वास",
    faqTitle: "सतत विचारले जाणारे प्रश्न",
    copyright: "सर्व हक्क राखीव. दहेगाव रोड, महाराष्ट्र.",
    disclaimer: "किमती आणि उपलब्धता ढाब्याच्या नियमांनुसार."
  }
};
