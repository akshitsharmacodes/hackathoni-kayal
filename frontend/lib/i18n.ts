// Citizen app copy in 4 languages (D52: drafted by Claude; Malayalam to be checked by a local).
import type { Category, Language, Status } from "@/lib/api";

export const LANGUAGES: { id: Language; native: string; english: string }[] = [
  { id: "ml-IN", native: "മലയാളം", english: "Malayalam" },
  { id: "hi-IN", native: "हिन्दी", english: "Hindi" },
  { id: "ta-IN", native: "தமிழ்", english: "Tamil" },
  { id: "en-IN", native: "English", english: "English" },
];

type Strings = {
  chooseLanguage: string;
  tapToSpeak: string;
  listening: string;
  tapToStop: string;
  addPhoto: string;
  photoAdded: string;
  understanding: string;
  isThisRight: string;
  problemType: string;
  phoneLabel: string;
  phoneHint: string;
  send: string;
  sending: string;
  registered: (id: number) => string;
  done: string;
  ask: string;
  myReports: string;
  report: string;
  askHint: string;
  typeInstead: string;
  thinking: string;
  askAgain: string;
  playAgain: string;
  enterPhone: string;
  find: string;
  noReports: string;
  error: string;
  micDenied: string;
  retake: string;
  categories: Record<Category, string>;
  statuses: Record<Status, string>;
};

export const STRINGS: Record<Language, Strings> = {
  "ml-IN": {
    chooseLanguage: "ഭാഷ തിരഞ്ഞെടുക്കൂ",
    tapToSpeak: "തൊട്ട് പ്രശ്നം പറയൂ",
    listening: "കേൾക്കുന്നു…",
    tapToStop: "നിർത്താൻ തൊടൂ",
    addPhoto: "ഫോട്ടോ",
    photoAdded: "ഫോട്ടോ ചേർത്തു",
    understanding: "മനസ്സിലാക്കുന്നു…",
    isThisRight: "ഇത് ശരിയാണോ?",
    problemType: "പ്രശ്നത്തിന്റെ തരം",
    phoneLabel: "മൊബൈൽ നമ്പർ (വേണമെങ്കിൽ)",
    phoneHint: "പരാതിയുടെ സ്ഥിതി അറിയാൻ മാത്രം ഉപയോഗിക്കും.",
    send: "അയയ്ക്കുക",
    sending: "അയയ്ക്കുന്നു…",
    registered: (id) => `പരാതി #${id} രേഖപ്പെടുത്തി`,
    done: "ശരി",
    ask: "ചോദിക്കൂ",
    myReports: "എന്റെ പരാതികൾ",
    report: "പരാതി പറയൂ",
    askHint: "ഉദാ: കൈനകരിയിൽ വെള്ളം കയറുന്നുണ്ടോ?",
    typeInstead: "ടൈപ്പ് ചെയ്യൂ",
    thinking: "ആലോചിക്കുന്നു…",
    askAgain: "വീണ്ടും ചോദിക്കൂ",
    playAgain: "വീണ്ടും കേൾക്കൂ",
    enterPhone: "മൊബൈൽ നമ്പർ നൽകൂ",
    find: "കാണുക",
    noReports: "ഈ നമ്പറിൽ പരാതികളില്ല.",
    error: "എന്തോ പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കൂ.",
    micDenied: "മൈക്ക് അനുമതി നൽകൂ.",
    retake: "വീണ്ടും പറയൂ",
    categories: { plastic: "പ്ലാസ്റ്റിക്", water_hyacinth: "പോള", oil: "എണ്ണ", flooding: "വെള്ളക്കെട്ട്", broken_jetty: "ജെട്ടി തകർച്ച", other: "മറ്റുള്ളവ" },
    statuses: { draft: "കരട്", open: "ലഭിച്ചു", in_progress: "നടപടിയിൽ", resolved: "പരിഹരിച്ചു", rejected: "നിരസിച്ചു", duplicate: "ആവർത്തനം" },
  },
  "hi-IN": {
    chooseLanguage: "भाषा चुनें",
    tapToSpeak: "छूकर समस्या बताइए",
    listening: "सुन रहे हैं…",
    tapToStop: "रोकने के लिए छुएँ",
    addPhoto: "फ़ोटो",
    photoAdded: "फ़ोटो जुड़ गई",
    understanding: "समझ रहे हैं…",
    isThisRight: "क्या यह सही है?",
    problemType: "समस्या का प्रकार",
    phoneLabel: "मोबाइल नंबर (वैकल्पिक)",
    phoneHint: "सिर्फ़ शिकायत की स्थिति बताने के लिए।",
    send: "भेजें",
    sending: "भेज रहे हैं…",
    registered: (id) => `शिकायत #${id} दर्ज हुई`,
    done: "ठीक है",
    ask: "पूछें",
    myReports: "मेरी शिकायतें",
    report: "शिकायत करें",
    askHint: "जैसे: क्या कैनकरी में पानी बढ़ रहा है?",
    typeInstead: "लिखकर पूछें",
    thinking: "सोच रहे हैं…",
    askAgain: "फिर पूछें",
    playAgain: "फिर सुनें",
    enterPhone: "मोबाइल नंबर डालें",
    find: "देखें",
    noReports: "इस नंबर पर कोई शिकायत नहीं।",
    error: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
    micDenied: "माइक की अनुमति दें।",
    retake: "फिर बोलें",
    categories: { plastic: "प्लास्टिक", water_hyacinth: "जलकुंभी", oil: "तेल", flooding: "जलभराव", broken_jetty: "टूटी जेट्टी", other: "अन्य" },
    statuses: { draft: "ड्राफ़्ट", open: "मिली", in_progress: "काम जारी", resolved: "हल हुई", rejected: "अस्वीकार", duplicate: "दोहराई गई" },
  },
  "ta-IN": {
    chooseLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
    tapToSpeak: "தொட்டு பிரச்சனையைச் சொல்லுங்கள்",
    listening: "கேட்கிறோம்…",
    tapToStop: "நிறுத்த தொடவும்",
    addPhoto: "புகைப்படம்",
    photoAdded: "புகைப்படம் சேர்க்கப்பட்டது",
    understanding: "புரிந்துகொள்கிறோம்…",
    isThisRight: "இது சரியா?",
    problemType: "பிரச்சனையின் வகை",
    phoneLabel: "மொபைல் எண் (விருப்பம்)",
    phoneHint: "புகாரின் நிலையைத் தெரிவிக்க மட்டும்.",
    send: "அனுப்பு",
    sending: "அனுப்புகிறோம்…",
    registered: (id) => `புகார் #${id} பதிவானது`,
    done: "சரி",
    ask: "கேளுங்கள்",
    myReports: "என் புகார்கள்",
    report: "புகார் செய்",
    askHint: "உதா: கைனகரியில் தண்ணீர் உயர்கிறதா?",
    typeInstead: "தட்டச்சு செய்யவும்",
    thinking: "யோசிக்கிறோம்…",
    askAgain: "மீண்டும் கேளுங்கள்",
    playAgain: "மீண்டும் கேளுங்கள் (ஒலி)",
    enterPhone: "மொபைல் எண்ணை உள்ளிடவும்",
    find: "பார்",
    noReports: "இந்த எண்ணில் புகார்கள் இல்லை.",
    error: "ஏதோ தவறு. மீண்டும் முயற்சிக்கவும்.",
    micDenied: "மைக் அனுமதி தேவை.",
    retake: "மீண்டும் பேசவும்",
    categories: { plastic: "பிளாஸ்டிக்", water_hyacinth: "ஆகாயத் தாமரை", oil: "எண்ணெய்", flooding: "வெள்ளம்", broken_jetty: "உடைந்த துறை", other: "மற்றவை" },
    statuses: { draft: "வரைவு", open: "பெறப்பட்டது", in_progress: "நடவடிக்கையில்", resolved: "தீர்ந்தது", rejected: "நிராகரிப்பு", duplicate: "நகல்" },
  },
  "en-IN": {
    chooseLanguage: "Choose your language",
    tapToSpeak: "Tap and tell us the problem",
    listening: "Listening…",
    tapToStop: "Tap to stop",
    addPhoto: "Photo",
    photoAdded: "Photo added",
    understanding: "Understanding…",
    isThisRight: "Is this right?",
    problemType: "Type of problem",
    phoneLabel: "Mobile number (optional)",
    phoneHint: "Only used to show you the status of your complaint.",
    send: "Send",
    sending: "Sending…",
    registered: (id) => `Complaint #${id} registered`,
    done: "Done",
    ask: "Ask",
    myReports: "My complaints",
    report: "Report",
    askHint: "e.g. Is water rising in Kainakary?",
    typeInstead: "Type instead",
    thinking: "Thinking…",
    askAgain: "Ask again",
    playAgain: "Play again",
    enterPhone: "Enter your mobile number",
    find: "Find",
    noReports: "No complaints for this number.",
    error: "Something went wrong. Please try again.",
    micDenied: "Please allow the microphone.",
    retake: "Speak again",
    categories: { plastic: "Plastic", water_hyacinth: "Water hyacinth", oil: "Oil", flooding: "Flooding", broken_jetty: "Broken jetty", other: "Other" },
    statuses: { draft: "Draft", open: "Received", in_progress: "In progress", resolved: "Resolved", rejected: "Rejected", duplicate: "Duplicate" },
  },
};
