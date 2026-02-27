# Nano Banana 2

AI image generation CLI and Claude Code skill powered by Google Gemini.

Generate, edit, and transform images from your terminal with transparent asset support, multi-resolution output (512px–4K), reference-based generation, and cost tracking.

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

## Usage

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

## Models

| Model | Alias | Cost @ 1K | Best For |
|-------|-------|-----------|----------|
| Gemini 3.1 Flash Image | `flash` (default) | ~$0.067 | Speed, volume, iteration |
| Gemini 3 Pro Image | `pro` | ~$0.134 | Maximum quality, complex scenes |

## Pricing

| Resolution | Flash | Pro |
|------------|-------|-----|
| 512px | ~$0.045 | N/A |
| 1K | ~$0.067 | ~$0.134 |
| 2K | ~$0.101 | ~$0.201 |
| 4K | ~$0.151 | ~$0.302 |

Track spending: `nb --costs`

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

## Claude Code Integration

This project ships as a Claude Code skill. When installed, Claude automatically handles prompt crafting, model/resolution selection, and command construction.

### Install as Skill

```bash
# Copy skill to Claude's skill directory
mkdir -p ~/.claude/skills/nano-banana
cp plugins/nano-banana/skills/nano-banana/SKILL.md ~/.claude/skills/nano-banana/SKILL.md
```

Then in Claude Code, just say: *"generate an image of..."* and the skill activates.

### What the Skill Provides

- 16 aesthetic prompt templates (photorealistic, anime, cyberpunk, product, etc.)
- Automatic model/resolution selection based on use case
- Cost optimization guidance
- Transparent asset pipeline for game dev
- Reference image workflows for character consistency

## API Key

The CLI searches for your Gemini API key in this order:

1. `--api-key` flag
2. `GEMINI_API_KEY` environment variable
3. `.env` in current working directory
4. `.env` in repo root
5. `~/.nano-banana/.env`

**Free keys** at [aistudio.google.com](https://aistudio.google.com/)

## Project Structure

```
nano-banana-2/
├── src/
│   └── cli.ts                    # CLI implementation
├── .claude-plugin/
│   └── marketplace.json          # Plugin marketplace config
├── plugins/
│   └── nano-banana/
│       ├── .claude-plugin/
│       │   └── plugin.json       # Plugin metadata
│       └── skills/
│           └── nano-banana/
│               └── SKILL.md      # Skill definition + prompt library
├── NANO-BANANA-2-OVERVIEW.md     # Full NB2 capabilities doc
├── index.html                    # Interactive prompt dashboard
├── package.json
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Prompt Tips

1. **Natural language** — "A lone samurai in a rain-drenched alley" beats "samurai, rain, neon, 4K"
2. **Specify intent** — "for a Michelin restaurant Instagram" guides artistic decisions
3. **Camera terms** — "85mm f/1.8, Kodak Portra 400" dramatically improves output
4. **Edit, don't redo** — If 80% right, describe the change conversationally
5. **Positive framing** — "empty medieval plaza with flower baskets" beats "no cars, no people"

## License

MIT

## Credits

Built by [eli5defi](https://github.com/eli5defi). Inspired by [kingbootoshi/nano-banana-2-skill](https://github.com/kingbootoshi/nano-banana-2-skill). Powered by Google Gemini.
