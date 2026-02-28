# 🍌 Nano Banana 2

AI image generation toolkit powered by Google Gemini — CLI, Claude Code skill, interactive dashboard, and prompt engineering tools.

Built on Google's `gemini-3.1-flash-image-preview` (Nano Banana 2) and `gemini-3-pro-image-preview` (Nano Banana Pro). Originally inspired by [kingbootoshi/nano-banana-2-skill](https://github.com/kingbootoshi/nano-banana-2-skill), rebuilt and expanded with additional tooling, prompt engineering infrastructure, and a full web dashboard.

## What's Inside

| Component | Description |
|-----------|-------------|
| **CLI Tool** (`nb`) | Generate images from your terminal with one command |
| **Claude Code Skill** | 16-aesthetic prompt library + auto model/resolution selection |
| **Prompt Dashboard** | Interactive web UI with 80+ prompts, pricing, features & tips |
| **Prompt Creator** | AI prompt formulation engine — turn rough ideas into NB2-optimized prompts |
| **Reverse Prompt** | Upload an image, get an NB2-optimized prompt to recreate it |

### Live Demo

🌐 **[nano-banana-2-lemon.vercel.app](https://nano-banana-2-lemon.vercel.app)**

---

## Quick Start

```bash
# Clone & install
git clone https://github.com/eli5defi/nano-banana-2.git
cd nano-banana-2
bun install
bun link

# Set API key (free at https://aistudio.google.com/)
mkdir -p ~/.nano-banana
echo "GEMINI_API_KEY=your_key_here" > ~/.nano-banana/.env

# Generate your first image
nb "mountain lake at sunrise, golden light, pine silhouettes"
```

---

## CLI Usage

```bash
nb "your prompt" [options]
```

### Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--output` | `-o` | Filename (no extension) | `nb-{timestamp}` |
| `--size` | `-s` | `512`, `1K`, `2K`, `4K` | `1K` |
| `--aspect` | `-a` | Aspect ratio (see below) | `1:1` |
| `--model` | `-m` | `flash` or `pro` | `flash` |
| `--dir` | `-d` | Output directory | current dir |
| `--ref` | `-r` | Reference image (repeatable, up to 14) | none |
| `--transparent` | `-t` | Green screen + auto bg removal | off |
| `--api-key` | | Override API key | env/file |
| `--costs` | | Show spending summary | |
| `--help` | `-h` | Show help | |

### Aspect Ratios

`1:1` `1:4` `1:8` `2:3` `3:2` `3:4` `4:1` `4:3` `4:5` `5:4` `8:1` `9:16` `16:9` `21:9`

---

## Models & Pricing

| Model | Alias | 512px | 1K | 2K | 4K | Best For |
|-------|-------|-------|-----|-----|-----|----------|
| Gemini 3.1 Flash Image | `flash` | ~$0.045 | ~$0.067 | ~$0.101 | ~$0.151 | Speed, volume, iteration |
| Gemini 3 Pro Image | `pro` | N/A | ~$0.134 | ~$0.201 | ~$0.302 | Max quality, complex scenes |

Track spending: `nb --costs`

---

## NB2 Capabilities

- **Text Rendering** — Near-perfect legible text in images, multi-language support
- **Subject Consistency** — Lock up to 5 characters + 14 objects across images
- **Native 4K** — Up to 4096px with 14 aspect ratios
- **Semantic Editing** — Natural language edits, no masking required
- **Reference-Based Generation** — Upload 6–14 reference images for style/character consistency
- **Search Grounding** — Google Search + Image Search integration for accurate subjects
- **Transparent Assets** — Green screen generation + FFmpeg/ImageMagick pipeline
- **Thinking Mode** — Adjustable reasoning (minimal/high) for complex prompts
- **40% cheaper** than Pro with comparable quality

---

## Examples

### Basic Generation
```bash
nb "serene mountain lake at sunrise, mist rising from calm water"
```

### Product Photography
```bash
nb "premium headphones on marble surface, studio three-point lighting" -s 4K -a 16:9 -o headphones-hero
```

### Transparent Game Sprite
```bash
nb "fantasy warrior character, full body, sword and shield" -t -s 2K -o warrior
```

### With Reference Images
```bash
nb "same character in battle stance, rain falling" -r char-ref1.jpg -r char-ref2.jpg
```

### Pro Model for Complex Scenes
```bash
nb "epic battle with 5 unique characters, dragon overhead" -m pro -s 4K
```

### Pixel Art
```bash
nb "16-bit RPG knight sprite sheet, 4 walking directions, SNES aesthetic" -s 512
```

### Typography
```bash
nb 'poster with text "LAUNCH DAY" in bold white geometric sans-serif on navy' -s 2K -a 3:4
```

---

## Transparent Mode (-t)

The `-t` flag runs a 3-step pipeline:

1. Generates image on solid green (#00FF00) background
2. FFmpeg colorkey + despill removes green, reconstructs edge colors
3. ImageMagick auto-crops transparent padding

**Requires:** FFmpeg and ImageMagick installed.

```bash
# macOS
brew install ffmpeg imagemagick

# Ubuntu/Debian
sudo apt install ffmpeg imagemagick
```

---

## Prompt Dashboard

The interactive dashboard at `index.html` provides:

- **Overview** — Stats, model comparison, NB1 vs NB2 side-by-side
- **Pricing** — Cost cards, model selection guide
- **Features** — 8 capability cards, resolution matrix
- **Prompt Library** — 80+ prompts across 16 aesthetics with search, filter & one-click copy
- **Prompting Tips** — 8 best-practice cards for getting optimal results
- **CLI Reference** — Installation steps, flag reference, examples

### 16 Aesthetic Categories

Photorealistic · Anime · Cyberpunk · Product · Watercolor · Fantasy · Typography · Architecture · Pixel Art · Editorial · Concept Art · Food Photography · Branding · UI/UX · Retro · 3D Render

---

## Prompt Creator

The prompt formulation engine at `prompt-creator.html` transforms rough ideas into NB2-optimized prompts:

- **Auto-Detect Aesthetic** — Scans input against keyword banks across 16 categories
- **Enhancement Injection** — Adds category-specific camera, lighting, style & quality terms
- **Mood/Lighting Overlays** — 8 lighting presets (golden hour, neon noir, studio, etc.)
- **Context Integration** — Purpose-driven enhancements (Instagram, game asset, print, etc.)
- **CLI Command Generation** — Ready-to-paste `nb` command with all flags
- **Cost Estimation** — Per-image cost based on model + resolution
- **Session History** — Track and revisit previous formulations
- **Quick Examples** — 8 one-click examples spanning different aesthetics

---

## Reverse Prompt

The reverse prompt tool at `reverse-prompt.html` does the opposite of prompt creation — upload any image and get an NB2-optimized prompt to recreate it:

- **Image Upload** — Drag & drop or file picker (JPG, PNG, WebP)
- **Canvas API Analysis** — Extracts dominant colors (k-means clustering), brightness, contrast, color temperature, saturation, edge density
- **Aesthetic Auto-Detection** — Maps image properties to one of 16 NB2 aesthetics via heuristic scoring
- **Auto-Configuration** — Sets resolution, aspect ratio, and mood/lighting from image analysis
- **Color Palette Extraction** — 5 dominant colors with click-to-copy hex values
- **User Refinement** — Subject description, camera angle, surface, context for precision
- **Prompt Formulation** — Combines analysis + user input through the NB2 enhancement engine
- **CLI Command + Cost Estimate** — Ready-to-paste command with per-image cost

All processing runs client-side in the browser — no API keys or backend required.

---

## Claude Code Skill

This project ships as a Claude Code skill. When installed, Claude automatically handles prompt crafting, model/resolution selection, and command construction.

### Install as Skill

```bash
mkdir -p ~/.claude/skills/nano-banana
cp plugins/nano-banana/skills/nano-banana/SKILL.md ~/.claude/skills/nano-banana/SKILL.md
```

Then in Claude Code, just say: *"generate an image of..."* and the skill activates.

### What the Skill Provides

- 16 aesthetic prompt templates with full examples
- Automatic model/resolution selection based on use case
- Cost optimization guidance
- Transparent asset pipeline for game dev
- Reference image workflows for character consistency
- Advanced techniques: multi-turn editing, style transfer, frame-to-frame consistency

---

## API Key

The CLI searches for your Gemini API key in this order:

1. `--api-key` flag
2. `GEMINI_API_KEY` environment variable
3. `.env` in current working directory
4. `.env` in repo root
5. `~/.nano-banana/.env`

**Free keys** at [aistudio.google.com](https://aistudio.google.com/)

---

## Prompt Tips

1. **Natural language** — "A lone samurai in a rain-drenched alley" beats "samurai, rain, neon, 4K"
2. **Specify intent** — "for a Michelin restaurant Instagram" guides artistic decisions
3. **Camera terms** — "85mm f/1.8, Kodak Portra 400" dramatically improves output
4. **Material details** — "brushed titanium with fingerprint smudges" adds realism
5. **Edit, don't redo** — If 80% right, describe the change conversationally
6. **Positive framing** — "empty medieval plaza with flower baskets" beats "no cars, no people"
7. **Wrap text in quotes** — Specify exact text with `"quotes"` and font characteristics
8. **Use references** — Upload reference images for consistent characters across generations

---

## Project Structure

```
nano-banana-2/
├── src/
│   └── cli.ts                    # CLI implementation (612 lines)
├── .claude-plugin/
│   └── marketplace.json          # Plugin marketplace config
├── plugins/
│   └── nano-banana/
│       ├── .claude-plugin/
│       │   └── plugin.json       # Plugin metadata
│       └── skills/
│           └── nano-banana/
│               └── SKILL.md      # Skill definition + prompt library (476 lines)
├── NANO-BANANA-2-OVERVIEW.md     # Full NB2 capabilities doc
├── index.html                    # Interactive prompt dashboard (6 tabs, 80+ prompts)
├── prompt-creator.html           # Prompt formulation engine (16 aesthetics)
├── reverse-prompt.html           # Image → prompt reverse engineering tool
├── package.json
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

---

## What's Different from bootoshi's Original

This project was inspired by [kingbootoshi/nano-banana-2-skill](https://github.com/kingbootoshi/nano-banana-2-skill) and shares the same core concept — a CLI + Claude Code skill for Gemini image generation. Here's what we added:

| Feature | bootoshi/nano-banana-2-skill | eli5defi/nano-banana-2 |
|---------|------------------------------|------------------------|
| CLI Tool | ✅ `nano-banana` command | ✅ `nb` + `nano-banana` dual aliases |
| Claude Code Skill | ✅ Skill file | ✅ Expanded skill (476 lines, 16 aesthetics) |
| Prompt Dashboard | ❌ | ✅ 6-tab interactive dashboard with 80+ prompts |
| Prompt Creator | ❌ | ✅ Auto-detect aesthetic + enhancement engine |
| Reverse Prompt | ❌ | ✅ Image → prompt via Canvas API analysis |
| Capabilities Overview | ❌ | ✅ Full NB2 capabilities doc |
| Live Web Demo | ❌ | ✅ Deployed on Vercel |
| Cost Estimation UI | ❌ | ✅ In prompt creator + dashboard |
| Prompt History | ❌ | ✅ Session-based tracking |

---

## License

MIT

## Credits

Built by [eli5defi](https://github.com/eli5defi).

Inspired by [kingbootoshi/nano-banana-2-skill](https://github.com/kingbootoshi/nano-banana-2-skill) — the original Nano Banana 2 CLI and Claude Code skill that pioneered the concept. Major props to bootoshi for the foundation.

Powered by [Google Gemini](https://ai.google.dev/).
