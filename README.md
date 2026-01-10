# Medical Advocacy Assistant - Beta

AI-powered healthcare companion for the Dyson Challenge 2025.

## Features

- **Symptom Tracker** - Document symptoms with precision
- **Question Generator** - AI-generated questions for appointments
- **Medical Timeline** - Track your medical history
- **Treatment Tracker** - Monitor treatments
- **Talking Points** - AI advocacy statements
- **Note Analyzer** - AI analysis of medical notes
- **Community** - Connect with others

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure AI Providers in `.env`:

**Automatic Failover (Recommended)**
The app automatically uses all configured providers and switches between them when needed.

```env
# Configure one or both providers (both recommended for reliability)
GEMINI_API_KEY=your_gemini_key_here
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-3.5-turbo  # optional, defaults to gpt-3.5-turbo

# Optional: Set provider priority order (comma-separated)
# AI_PROVIDER_ORDER=gemini,openai
```

Get API keys:
- Gemini: https://makersuite.google.com/app/apikey
- OpenAI: https://platform.openai.com/api-keys

**How it works:**
- Automatically tries providers in order of preference
- Switches to backup provider if one hits rate limits
- Recovers automatically when rate limits reset
- Works forever without manual intervention

3. Run:
```bash
npm run dev
```

4. Open http://localhost:3000

## AI Provider Comparison

### Google Gemini
- **Free Tier**: 15 RPM, 1M TPM, 1,500 requests/day
- **Pricing**: $0.35/$1.05 per million tokens (input/output)
- **Best for**: Cost-effective, good free tier
- **Limits**: 1,500 requests/day on free tier

### OpenAI
- **Free Tier**: $5 credit (no ongoing free tier)
- **Pricing**: GPT-3.5-turbo ~$0.50/$1.50 per million tokens
- **Best for**: Higher quality, more reliable
- **Limits**: Pay-as-you-go, higher rate limits

## Automatic Failover System

The app includes an intelligent provider manager that:
- ✅ **Automatically switches** between providers when rate limits are hit
- ✅ **Self-healing** - recovers providers when rate limits reset
- ✅ **Zero configuration** - works with any combination of providers
- ✅ **Smart routing** - tries cheapest providers first
- ✅ **Fault tolerant** - continues working even if one provider fails

**No manual intervention needed** - the system handles everything automatically!

## Tech Stack

- Next.js 14, TypeScript, Tailwind CSS
- AI: Google Gemini or OpenAI (configurable)
