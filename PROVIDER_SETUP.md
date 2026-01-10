# AI Provider Setup Guide

This app includes an **automatic failover system** that intelligently switches between AI providers without any manual intervention. Configure multiple providers and the system handles everything automatically!

## Quick Comparison

| Provider | Free Tier | Cost (per 1M tokens) | Rate Limits (Free) | Best For |
|----------|-----------|---------------------|-------------------|----------|
| **Gemini 1.5 Flash** | ✅ Yes | $0.35/$1.05 | 15 RPM, 1,500/day | Cost-effective, good for demos |
| **OpenAI GPT-3.5** | ❌ No ($5 credit) | ~$0.50/$1.50 | Higher limits | Production, reliability |
| **OpenAI GPT-4** | ❌ No | ~$10/$30 | Higher limits | Best quality |

## Setup Instructions

### Recommended: Configure Multiple Providers (Automatic Failover)

The app automatically uses all configured providers and switches between them seamlessly.

1. **Get API keys:**
   - Gemini: https://makersuite.google.com/app/apikey
   - OpenAI: https://platform.openai.com/api-keys

2. **Install OpenAI package (if using OpenAI):**
```bash
npm install openai
```

3. **Add to `.env` (configure one or both):**
```env
# Gemini (free tier available)
GEMINI_API_KEY=your_gemini_key_here

# OpenAI (optional backup)
OPENAI_API_KEY=your_openai_key_here
OPENAI_MODEL=gpt-3.5-turbo  # optional, defaults to gpt-3.5-turbo

# Optional: Set provider priority (defaults to gemini,openai)
AI_PROVIDER_ORDER=gemini,openai
```

**That's it!** The system will:
- Try Gemini first (cheaper)
- Automatically switch to OpenAI if Gemini hits rate limits
- Switch back to Gemini when rate limits reset
- Work forever without manual intervention

### Single Provider Setup

You can also configure just one provider - the system will still work, but without automatic failover:

**Gemini only:**
```env
GEMINI_API_KEY=your_key_here
```

**OpenAI only:**
```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

## How Automatic Failover Works

1. **Smart Routing**: Tries providers in order of preference (cheapest first)
2. **Rate Limit Detection**: Automatically detects when a provider hits rate limits
3. **Automatic Switching**: Seamlessly switches to backup provider
4. **Self-Healing**: Automatically recovers providers when rate limits reset
5. **Fault Tolerance**: Continues working even if one provider completely fails

**No code changes or manual intervention needed!**

## Monitoring Provider Status

Check which providers are available and their status:

```bash
curl http://localhost:3000/api/ai-status
```

Returns JSON with provider availability, last errors, and rate limit information.

## Adding New Providers

The app uses a provider abstraction. To add a new provider:

1. Create `lib/providers/your-provider.ts`
2. Implement the `AIProvider` interface
3. Add initialization in `lib/provider-manager.ts` constructor

The provider manager will automatically include it in the failover chain!
