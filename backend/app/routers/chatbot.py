from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.db.database import get_db
from app.models.models import Scheme

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

class ChatMessage(BaseModel):
    message: str
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    reply: str
    suggested_schemes: Optional[List[dict]] = None

# Keyword mapping for scheme discovery (bilingual: Hindi + English)
KEYWORD_MAP = {
    "farmer": ["farmer", "kisan", "kisaan", "agriculture", "krishi", "fasal"],
    "housing": ["housing", "ghar", "awas", "house", "home", "makaan"],
    "student": ["student", "scholarship", "vidyarthi", "chhatravritti", "education", "padhai", "school", "college"],
    "women": ["women", "mahila", "woman", "girl", "ladki", "beti"],
    "health": ["health", "swasthya", "medical", "hospital", "bimari", "ayushman", "treatment"],
    "senior": ["senior citizen", "old", "budhape", "pension", "vridha"],
    "employment": ["job", "rozgar", "employment", "naukri", "self-employment", "business", "vyavsay"],
    "disability": ["disabled", "divyang", "disability", "viklang"],
}

GREETINGS = ["hello", "hi", "namaste", "namaskar", "hey"]
HELP_WORDS = ["help", "madad", "sahayata", "info", "information", "batao", "bataiye"]

def process_chat(message: str, schemes: list) -> ChatResponse:
    msg_lower = message.lower()

    # Greeting
    if any(g in msg_lower for g in GREETINGS):
        return ChatResponse(
            reply="Namaste! 🙏 I'm your Government Schemes Assistant. You can ask me about schemes for farmers, students, women, health, housing, employment, and more. How can I help you today?"
        )

    # Help
    if any(h in msg_lower for h in HELP_WORDS):
        return ChatResponse(
            reply="I can help you find government schemes! Try asking:\n• 'Farmer schemes'\n• 'Housing scheme for poor'\n• 'Scholarship for students'\n• 'Health scheme'\n• 'Women empowerment scheme'"
        )

    # Find matching category from keywords
    matched_category = None
    for category, keywords in KEYWORD_MAP.items():
        if any(kw in msg_lower for kw in keywords):
            matched_category = category
            break

    if matched_category:
        matched_schemes = []
        for scheme in schemes:
            target = (scheme.target_occupation or "").lower()
            name = scheme.scheme_name.lower()
            desc = scheme.description.lower()
            keywords = KEYWORD_MAP[matched_category]
            if any(kw in target or kw in name or kw in desc for kw in keywords):
                matched_schemes.append({
                    "id": scheme.id,
                    "name": scheme.scheme_name,
                    "benefits": scheme.benefits[:100] + "..." if len(scheme.benefits) > 100 else scheme.benefits
                })

        if matched_schemes:
            reply = f"I found {len(matched_schemes)} scheme(s) related to **{matched_category}**:\n\n"
            for s in matched_schemes[:5]:
                reply += f"• **{s['name']}** — {s['benefits']}\n"
            reply += "\nWould you like more details on any of these schemes?"
        else:
            reply = f"I didn't find specific schemes for '{matched_category}' in our database yet, but new schemes are added regularly! Try searching on the Schemes page or check back soon."

        return ChatResponse(reply=reply, suggested_schemes=matched_schemes[:5] if matched_schemes else None)

    # Generic search in scheme names
    matching_by_name = [
        {"id": s.id, "name": s.scheme_name, "benefits": s.benefits[:80]}
        for s in schemes
        if any(word in s.scheme_name.lower() or word in s.description.lower()
               for word in msg_lower.split() if len(word) > 3)
    ]

    if matching_by_name:
        reply = f"Here are some schemes that might match your query:\n\n"
        for s in matching_by_name[:5]:
            reply += f"• **{s['name']}**\n"
        return ChatResponse(reply=reply, suggested_schemes=matching_by_name[:5])

    return ChatResponse(
        reply="I'm not sure about that. Try asking about specific topics like:\n• 'schemes for farmers'\n• 'housing scheme'\n• 'student scholarship'\n• 'health scheme'\n\nYou can also use the Search bar to find schemes directly."
    )


@router.post("/message", response_model=ChatResponse)
def chat_with_bot(chat: ChatMessage, db: Session = Depends(get_db)):
    schemes = db.query(Scheme).all()
    return process_chat(chat.message, schemes)
