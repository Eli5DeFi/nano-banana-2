# Nano Banana 2 — Complete Overview

## What Is Nano Banana 2?

Nano Banana 2 (model ID: `gemini-3.1-flash-image-preview`) is Google's latest AI image generation model, launched February 2026. It combines the advanced capabilities of Nano Banana Pro with the speed of Gemini Flash, delivering **Pro-grade visuals at Flash speeds** with up to **40% lower API cost**.

It is the default image generation model across the entire Gemini ecosystem — Gemini app, Google Search AI Mode, Google Lens, Flow (video), Google Ads, AI Studio, Gemini API, and Gemini CLI.

---

## Model Lineup

| Model | Model ID | Tier | Best For |
|-------|----------|------|----------|
| **Nano Banana 2** | `gemini-3.1-flash-image-preview` | Flash | Speed + high-volume, production workflows |
| **Nano Banana Pro** | `gemini-3-pro-image-preview` | Pro | Maximum quality, complex multi-character scenes |
| **Nano Banana 1** | `gemini-2.5-flash-image` | Flash | Legacy, high-volume low-latency tasks |

---

## Pricing (API Cost per Image)

| Resolution | Nano Banana 2 (Flash) | Nano Banana Pro | Savings |
|------------|----------------------|-----------------|---------|
| **512px** | ~$0.045 | N/A | — |
| **1K** (default) | ~$0.067 | ~$0.134 | **~50%** |
| **2K** | ~$0.101 | ~$0.134 | **~25%** |
| **4K** | ~$0.151 | ~$0.240 | **~37%** |

- Free API keys available at [Google AI Studio](https://aistudio.google.com/)
- Batch API available for large-scale generation (up to 24hr turnaround, higher rate limits)
- All costs logged locally when using CLI tools

---

## Key Capabilities

### 1. Text Rendering
- State-of-the-art legible text in generated images
- Supports marketing mockups, greeting cards, infographics, menus, diagrams
- In-image localization — generate/translate text across multiple languages
- Tip: Wrap exact text in `"quotes"`, specify font characteristics

### 2. Subject Consistency
- Lock up to **5 characters** across multiple images
- Maintain fidelity for up to **14 objects** in a single workflow
- Face-locking with reference images for character consistency

### 3. Resolution & Aspect Ratios
- **Resolutions**: 512px, 1K, 2K, 4K (native)
- **Aspect Ratios**: 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, 4:5, 5:4, 8:1, 9:16, 16:9, 21:9

### 4. Semantic Editing
- Natural language edits — no manual masking required
- Model identifies target objects and applies edits while preserving context
- Multi-turn conversational editing with context preservation

### 5. Reference-Based Generation
- Upload 6–14 reference images for style transfer
- Mix up to 10 objects + 4–5 character reference images
- Last uploaded reference determines output aspect ratio

### 6. Real-Time Data Grounding
- Google Search integration for accurate, current subject rendering
- Google Image Search grounding (NB2 exclusive)
- Generate infographics with live data

### 7. Transparent Assets
- Native green screen generation with automatic background removal
- Broadcast-grade quality via FFmpeg colorkey + despill pipeline
- Auto-crop transparent padding via ImageMagick

### 8. Thinking Mode
- Adjustable reasoning: "minimal" or "high"
- Better results for complex, multi-layered prompts
- Physics and intent reasoning (not just pattern matching)

### 9. Advanced Features
- Dimensional translation (2D sketch → photorealistic 3D)
- Style transfer while maintaining subject identity
- Frame-to-frame consistency for animation prep
- SynthID watermark on all generated images

---

## Advancement from Nano Banana 1

| Feature | NB1 | NB2 |
|---------|-----|-----|
| **Speed** | Standard Flash | 2x faster |
| **Text Quality** | Basic / wobbly | Near-perfect legibility |
| **Scene Understanding** | Pattern matching | Physics + intent reasoning |
| **Subject Consistency** | Limited | 5 chars + 14 objects |
| **Max Resolution** | 2K | Native 4K |
| **Aspect Ratios** | Standard set | +4:1, 1:4, 8:1, 1:8 |
| **API Cost** | Baseline | Up to 40% cheaper |
| **Search Grounding** | Basic | Google Search + Image Search |
| **Thinking Mode** | None | Adjustable (minimal/high) |
| **Instruction Following** | Moderate | Strict multi-layered adherence |
| **Availability** | Limited regions | 141+ countries, 8+ languages |
| **Text in Images** | Poor | Production-ready |
| **In-Image Translation** | None | Multi-language support |

---

## Availability

- **Gemini App**: Default for all modes (Fast, Thinking, Pro)
- **Google Search**: AI Mode + Lens
- **Flow**: AI video tool
- **Google Ads**: Creative asset generation
- **API**: AI Studio, Gemini API, Gemini CLI
- **SDK**: Python, JavaScript, Go, Java
- **Countries**: 141+ (expanded from NB1)
- **Languages**: 8+ additional languages

---

## API Access

**REST Endpoint:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent
```

**Authentication:** API key required (free tier available)

**SDK Support:** Python, JavaScript, Go, Java

---

## CLI Tool

The [eli5defi/nano-banana-2](https://github.com/eli5defi/nano-banana-2) toolkit provides a CLI, Claude Code skill, prompt dashboard, and prompt creator. Originally inspired by [kingbootoshi/nano-banana-2-skill](https://github.com/kingbootoshi/nano-banana-2-skill).

```bash
# Basic generation
nb "your prompt"

# With options
nb "product on marble surface" -s 4K -a 16:9 -o product-hero

# Transparent asset
nb "game character sprite" -t -s 2K

# With reference images
nb "similar style portrait" -r reference1.jpg -r reference2.jpg

# Pro model
nb "complex scene" -m pro

# Check costs
nb --costs
```

**Tech Stack:** TypeScript + Bun, requires FFmpeg + ImageMagick for transparency

**License:** MIT

---

## Sources

- [Google Blog: Nano Banana 2](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/)
- [Build with Nano Banana 2](https://blog.google/innovation-and-ai/technology/developers-tools/build-with-nano-banana-2/)
- [Gemini API Docs: Image Generation](https://ai.google.dev/gemini-api/docs/image-generation)
- [The Decoder: NB2 Pricing](https://the-decoder.com/googles-nano-banana-2-brings-pro-level-image-generation-to-flash-speeds-at-up-to-40-lower-api-cost/)
- [TechCrunch: NB2 Launch](https://techcrunch.com/2026/02/26/google-launches-nano-banana-2-model-with-faster-image-generation/)
- [Android Central: NB2 Default](https://www.androidcentral.com/apps-software/google-announces-nano-banana-2)
- [GitHub: nano-banana-2-skill](https://github.com/kingbootoshi/nano-banana-2-skill)
- [Kimi AI Conversation](https://www.kimi.com/share/19c9cd4a-6822-8d37-8000-000041019873)
