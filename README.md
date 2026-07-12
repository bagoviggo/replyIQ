# ReplyIQ — AI-Powered Google Review Management

> **AMD Developer Hackathon ACT II — Track 3: Open Product/Startup**
> Built with Gemma 3 27B on AMD GPU infrastructure via Fireworks AI

[![Demo](https://img.shields.io/badge/Live_Demo-Vercel-black)](https://replyiq.vercel.app)
[![AMD Powered](https://img.shields.io/badge/AMD-GPU_Powered-E31111)](https://developer.amd.com)
[![Gemma 3](https://img.shields.io/badge/Model-Gemma_3_27B-4285F4)](https://fireworks.ai/models/fireworks/gemma3-27b-it)

---

## The Problem

85% of small business owners never reply to their Google reviews — not because they don't care, but because they don't have time. Unanswered reviews directly hurt local SEO ranking and cost customers.

## The Solution

ReplyIQ connects to your Google Business Profile and uses **Gemma 3 27B** (hosted on **AMD GPU hardware** via Fireworks AI) to generate authentic, brand-tuned replies for every review. Business owners review and approve with one click — or enable auto-posting.

## AMD Infrastructure

This project uses **AMD GPU infrastructure** through the Fireworks AI platform:

- **Model**: `accounts/fireworks/models/gemma3-27b-it` (Google DeepMind's Gemma 3, 27B parameters)
- **Host**: Fireworks AI — inference runs on AMD GPU clusters
- **Why Fireworks + AMD**: Sub-200ms inference latency, OpenAI-compatible API, purpose-built for production AI workloads on AMD hardware

The entire AI inference pipeline routes through AMD-powered infrastructure — every review reply generated is AMD-computed.

## Features

- **AI Reply Generation** — Gemma 3 crafts contextual replies based on star rating, review content, and business type
- **Brand Voice Control** — Professional, friendly, or casual tone settings
- **Approval Workflow** — Review and edit AI drafts before posting, or enable auto-post
- **Multi-location Support** — Manage reviews across multiple business locations
- **Demo Mode** — Works fully without an API key for evaluation purposes
- **Sentiment Awareness** — Handles 1-star complaints differently from 5-star praise

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, React |
| AI Inference | Gemma 3 27B via Fireworks AI (AMD GPUs) |
| Deployment | Vercel |
| Reviews API | Google Business Profile API (OAuth) |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/replyiq
cd replyiq

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your FIREWORKS_API_KEY (get it free at fireworks.ai)

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The app works in **demo mode** without any API keys — showing realistic sample data and rule-based reply generation. Add a `FIREWORKS_API_KEY` to activate live Gemma 3 inference on AMD GPUs.

## Deploy to Vercel

```bash
# One-command deploy
npx vercel --prod
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) and add `FIREWORKS_API_KEY` in the Environment Variables settings.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `FIREWORKS_API_KEY` | Optional | Activates Gemma 3 on AMD GPU. Demo mode works without it |
| `GOOGLE_CLIENT_ID` | Optional | For real Google Business Profile OAuth |
| `GOOGLE_CLIENT_SECRET` | Optional | For real Google Business Profile OAuth |

## API Reference

### POST `/api/generate-reply`

Generates a review reply using Gemma 3 on AMD GPU.

```json
{
  "reviewText": "Amazing food, slightly slow service",
  "rating": 4,
  "reviewerName": "James Liu",
  "businessName": "Bella Cucina",
  "businessCategory": "restaurant",
  "brandTone": "friendly"
}
```

**Response:**
```json
{
  "reply": "Hi James, thank you so much! We're glad...",
  "model": "gemma3-27b-it",
  "amdPowered": true,
  "provider": "fireworks-ai"
}
```

### GET `/api/reviews`

Returns all reviews and connected business locations.

## Business Model

| Plan | Price | Locations |
|---|---|---|
| Starter | $19/mo | 1 location, 100 reviews/mo |
| Growth | $39/mo | 1 location, unlimited reviews |
| Agency | $99/mo | Up to 10 locations |

**Unit economics**: At $39/mo, AI inference costs ~$0.40-0.60/mo per location. ~99% gross margin.

**Target customers**: Restaurants, dental practices, salons, hotels — any SMB with Google reviews and no time.

## Roadmap

- [ ] Real Google Business Profile OAuth integration
- [ ] Auto-posting mode (fully hands-off)
- [ ] Review sentiment dashboard
- [ ] SMS/email notifications for new reviews
- [ ] White-label agency portal
- [ ] Review request campaigns (post-visit SMS)

## Why Track 3?

ReplyIQ is a real startup idea with a clear go-to-market. The AI is the product — not a demo. Gemma 3 on AMD GPUs via Fireworks gives us production-grade inference at a cost structure that makes the business model work.

---

Built for the **AMD Developer Hackathon ACT II** · Track 3: Open Product/Startup

*Powered by Gemma 3 · AMD GPU Infrastructure · Fireworks AI*
