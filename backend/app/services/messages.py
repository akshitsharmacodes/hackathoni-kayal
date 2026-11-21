"""Spoken confirmation sentences in the 4 languages (D52: drafted by Claude, Malayalam to be checked)."""

CATEGORY_NAMES = {
    "ml-IN": {"plastic": "പ്ലാസ്റ്റിക് മാലിന്യം", "water_hyacinth": "പോള", "oil": "എണ്ണ ചോർച്ച",
              "flooding": "വെള്ളക്കെട്ട്", "broken_jetty": "തകർന്ന ജെട്ടി", "other": "പ്രശ്നം"},
    "en-IN": {"plastic": "plastic waste", "water_hyacinth": "water hyacinth", "oil": "oil spill",
              "flooding": "flooding", "broken_jetty": "broken jetty", "other": "problem"},
    "hi-IN": {"plastic": "प्लास्टिक कचरा", "water_hyacinth": "जलकुंभी", "oil": "तेल रिसाव",
              "flooding": "जलभराव", "broken_jetty": "टूटी जेट्टी", "other": "समस्या"},
    "ta-IN": {"plastic": "பிளாஸ்டிக் கழிவு", "water_hyacinth": "ஆகாயத் தாமரை", "oil": "எண்ணெய் கசிவு",
              "flooding": "வெள்ளம்", "broken_jetty": "உடைந்த படகுத்துறை", "other": "பிரச்சனை"},
}

_CONFIRM = {
    "ml-IN": "നന്ദി. {place} ഭാഗത്തെ {category} സംബന്ധിച്ച പരാതി നമ്പർ {id} രേഖപ്പെടുത്തി.",
    "en-IN": "Thank you. Complaint number {id} about {category} near {place} is registered.",
    "hi-IN": "धन्यवाद। {place} के पास {category} की शिकायत नंबर {id} दर्ज हो गई है।",
    "ta-IN": "நன்றி. {place} அருகே {category} குறித்த புகார் எண் {id} பதிவு செய்யப்பட்டது.",
}


def confirmation(language: str, report_id: int, category: str, place: str) -> str:
    lang = language if language in _CONFIRM else "en-IN"
    return _CONFIRM[lang].format(id=report_id, category=CATEGORY_NAMES[lang][category], place=place)
