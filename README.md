# TradeJournal AI

AI-powered trade journaling and backtesting platform. Import your trades, get AI coaching, and visualize your performance.

## Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Recharts
- **Backend**: Python FastAPI + SQLAlchemy + SQLite (swappable to PostgreSQL)
- **AI**: Anthropic Claude API for trade analysis
- **Auth**: NextAuth.js with email magic links (Resend)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm

### Frontend Setup

```bash
cd frontend
cp ../.env.example .env.local  # Edit with your keys
npm install
npm run dev
```

Frontend runs at http://localhost:3000

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

Backend runs at http://localhost:8000

### Environment Variables

Copy `.env.example` to `.env` (backend) and `frontend/.env.local` (frontend). Fill in:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for AI analysis |
| `RESEND_API_KEY` | Resend API key for magic link emails |
| `NEXTAUTH_SECRET` | Random secret for NextAuth sessions |
| `DATABASE_URL` | Database connection string (defaults to SQLite) |

## Features

- **Landing Page**: Hero section, feature cards, free beta CTA, waitlist signup
- **Dashboard**: Summary cards, P&L chart, win rate by ticker, hourly heatmap, position sizing
- **CSV Upload**: Drag-and-drop upload with TD Ameritrade and Robinhood format support
- **AI Analysis**: Claude-powered trading pattern analysis with strengths, weaknesses, and recommendations
- **Auth**: Email magic links via Resend + NextAuth.js

## Deployment

- **Frontend** -> Vercel (zero-config, just push)
- **Backend** -> Railway (uses Dockerfile, reads PORT env var)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/trades/upload` | Upload CSV trade file |
| GET | `/trades/analysis` | Get aggregated trade statistics |
| POST | `/ai/review` | Get AI coaching analysis |
| GET | `/health` | Health check |
