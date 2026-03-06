# 🏛️ YojanaMitra - Government Schemes Platform

**YojanaMitra** is a high-performance, AI-powered platform designed to help 1.4 billion Indian citizens discover, check eligibility for, and apply to government schemes across Central and State levels.

![YojanaMitra Platform Interface](/C:/Users/user/.gemini/antigravity/brain/c08b87ae-0061-4f87-941d-0d81472b6106/frontend_home_page_1772788420290.png)

## 🌟 Key Features

- **🧠 AI Eligibility Engine**: Instantly matches user profiles (age, income, occupation) with scheme criteria to show qualified results with detailed reasons.
- **💬 Bilingual AI Assistant**: A smart chatbot supporting Hindi and English for natural language scheme discovery.
- **🕷️ Advanced Data Engine**: Headless Scraping Pipeline (Playwright + BS4) that crawls 36+ State/UT portals automatically.
- **🛡️ Admin Portal**: Dedicated dashboard for agents to manage applications, track statistics, and perform approvals.
- **🔍 Programmatic SEO**: Dynamic metadata generation for all 1500+ schemes ensuring maximum visibility on Search Engines.
- **✨ Premium UI/UX**: Modern glassmorphic design built with React and Tailwind CSS, optimized for both Desktop and Mobile (PWA).

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, React Helmet Async.
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic.
- **Database**: SQLite (Development) / PostgreSQL (Production).
- **Automation**: Playwright (Headless Browsing), APScheduler (Cron Jobs).

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python seed.py        # Seed initial 20+ schemes
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## ⏰ Automated Updates
The platform features an integrated **Cron Job** that runs every **3 days**. It automatically crawls government portals, parses new schemes, and updates the database without manual intervention.

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
**Made with ❤️ for Bharat 🇮🇳**
