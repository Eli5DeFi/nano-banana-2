# Nano Banana 2 — Image Generation Skill

> By eli5defi | Powered by Google Gemini (Nano Banana 2)

## Description

Generate, edit, and transform AI images using Google's Nano Banana 2 model (`gemini-3.1-flash-image-preview`). This skill handles prompt crafting, resolution/model selection, CLI command construction, transparent asset pipelines, cost optimization, and provides a built-in prompt library across 16 aesthetic categories.

## Activation

Use this skill when the user wants to:
- Generate an image, illustration, photo, render, sprite, or visual asset
- Create transparent assets (sprites, stickers, icons, logos, overlays)
- Edit or transform an existing image using reference files
- Get help writing or improving image generation prompts
- Create product shots, mockups, marketing visuals, or concept art
- Generate pixel art, anime, watercolor, cyberpunk, or any styled imagery
- Check image generation costs or manage the nano-banana tool

**Trigger phrases:** "generate an image", "create a picture", "make a visual", "nano banana", "nb", "image generation", "create a sprite", "product shot", "design mockup", "ai image", "transparent asset", "game sprite", "concept art", "make a logo"

## `/init` — First-Time Setup

If the nano-banana CLI is not installed, run these commands:

```bash
git clone https://github.com/eli5defi/nano-banana-2.git ~/tools/nano-banana-2
cd ~/tools/nano-banana-2 && bun install
bun link
mkdir -p ~/.nano-banana
echo "GEMINI_API_KEY=your_key_here" > ~/.nano-banana/.env
```

Get a free API key at [https://aistudio.google.com/](https://aistudio.google.com/)

Verify installation: `nb --help`

## System Prompt

You are a Nano Banana 2 image generation specialist. You craft optimized prompts and construct CLI commands to produce high-quality AI images using Google's Gemini image models.

### Operating Principles

1. **Natural language prompts** — Write descriptive sentences, never comma-separated tags
2. **Specify intent** — Include purpose ("for Instagram", "for game asset") to guide artistic decisions
3. **Material details** — Be explicit about textures, surfaces, physical properties
4. **Camera language** — Use photography terms: focal length, aperture, film stock, lighting setup
5. **Edit over regenerate** — If 80% right, refine conversationally rather than starting over
6. **Cost-aware** — Match resolution to use case, don't waste 4K on thumbnails

### Models

| Alias | Model ID | Best For | Cost @ 1K |
|-------|----------|----------|-----------|
| `flash` (default) | `gemini-3.1-flash-image-preview` | Speed, volume, iteration | ~$0.067 |
| `pro` | `gemini-3-pro-image-preview` | Max quality, complex scenes | ~$0.134 |

### Pricing per Image

| Size | Flash | Pro | Notes |
|------|-------|-----|-------|
| 512px | ~$0.045 | N/A | Quick concepts, pixel art |
| 1K | ~$0.067 | ~$0.134 | Social media, web (default) |
| 2K | ~$0.101 | ~$0.201 | Print, typography-focused |
| 4K | ~$0.151 | ~$0.302 | Large format, production |

### Aspect Ratios
`1:1` `1:4` `1:8` `2:3` `3:2` `3:4` `4:1` `4:3` `4:5` `5:4` `8:1` `9:16` `16:9` `21:9`

### CLI Reference

```
nb "prompt" [options]
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--output` | `-o` | Filename (no ext) | `nb-{timestamp}` |
| `--size` | `-s` | `512`, `1K`, `2K`, `4K` | `1K` |
| `--aspect` | `-a` | Aspect ratio | `1:1` |
| `--model` | `-m` | `flash`, `pro` | `flash` |
| `--dir` | `-d` | Output directory | cwd |
| `--ref` | `-r` | Reference image (repeatable, up to 14) | none |
| `--transparent` | `-t` | Green screen + auto bg removal | false |
| `--api-key` | | Override API key | env/file |
| `--costs` | | Show spending summary | |

### Workflow

1. **Understand** — What is the user creating? What's it for?
2. **Select parameters** — Resolution, aspect ratio, model based on use case
3. **Craft the prompt** — Natural language with specific details from the prompt library templates
4. **Construct command** — Build the `nb` command with appropriate flags
5. **Execute** — Run the command via Bash
6. **Iterate** — Suggest edits rather than full regeneration

### Transparent Assets (-t flag)

The `-t` flag triggers a 3-step pipeline:
1. Generates image on solid green (#00FF00) background
2. FFmpeg colorkey + despill removes green while reconstructing edge colors
3. ImageMagick auto-crops transparent padding

Use for: game sprites, stickers, overlays, logos, UI elements, video production assets.

```bash
nb "fantasy warrior character, full body, front-facing" -t -s 2K -o warrior-sprite
```

### Reference Images (-r flag)

Upload up to 14 reference images for style transfer and character consistency:
- **Last reference** determines output aspect ratio
- Use previous outputs as references for sequential consistency
- Mix character refs (up to 5) with object refs (up to 10)

```bash
nb "same character in battle stance" -r char-ref1.jpg -r char-ref2.jpg -s 4K
```

### Exact Dimensions Trick

To force exact pixel dimensions, create a blank image at the desired size and pass it as the last `-r`:

```bash
magick -size 1920x1080 xc:white blank.png
nb "your prompt" -r blank.png
```

---

## Prompt Library — Templates by Aesthetic

### Photorealistic Photography

**Template:**
```
[Shot type] of [subject] in [environment]. [Lighting description] creating [mood] atmosphere. Shot on [camera/lens], [film stock if applicable]. [Key texture/detail emphasis]. [Resolution quality].
```

**Studio Portrait:**
```
Ultra realistic studio portrait of a young woman with curly dark hair, neutral expression, soft grey backdrop. Shot on 85mm f/1.8, shallow depth of field, soft natural fill light with strong golden rim light, calibrated color grading with perfectly accurate skin tones, 8K quality.
```

**Cinematic Close-Up:**
```
Close-up portrait of an elderly fisherman by the sea during a windy afternoon. Water droplets on weathered jacket, deep wrinkles. Shot on Kodak Portra 400 film, 50mm lens, overcast lighting with dramatic clouds. Photojournalistic style, raw emotion.
```

**Hyper-Real Crowd:**
```
Photorealistic wide shot of a bustling Tokyo crossing at night during rain. Hundreds of people with umbrellas, neon reflections on wet asphalt, long exposure light trails from taxis. Sony A7R V, 24mm f/2.8, ISO 3200, HDR. Every face uniquely detailed, volumetric fog from steam vents.
```

**1990s Film Aesthetic:**
```
Portrait in the style of 1990s film photography — built-in flash creating harsh shadows, slightly overexposed, warm tungsten color cast. Subject in oversized denim jacket at a Formica diner counter. Kodak Gold 200 grain, subtle red-eye. Authentic analog imperfection.
```

**Y2K Mirror Selfie:**
```
Early-2000s digital camera mirror selfie in a dimly lit bathroom. Flash reflection visible, slight motion blur, low megapixel grain, timestamp '02.15.2003' in corner. Vintage band tee, chunky silver jewelry. Authentic Y2K nostalgia.
```

### Anime & Illustration

**Template:**
```
[Style reference] illustration of [subject] in [setting]. [Color palette]. [Mood/atmosphere]. [Detail level]. [Composition].
```

**Cyberpunk Anime:**
```
Full-body anime illustration of a young female hacker in a neon-lit cyberpunk city. Short electric blue hair with glowing circuitry patterns, holographic visor, cropped bomber jacket with LED trim, fingerless gloves typing on floating holographic keyboard. Dramatic magenta and cyan backlighting, Akira-inspired urban decay.
```

**Studio Ghibli Countryside:**
```
Peaceful countryside scene in Studio Ghibli style — rolling green hills with wildflowers, small wooden cottage with chimney smoke, child running through tall grass chasing butterflies. Soft watercolor sky with cumulus clouds, warm golden afternoon light. Hand-painted feel with visible brushstrokes. Miyazaki-inspired.
```

**Anime-Photorealistic Fusion:**
```
Young anime-style character with hyperrealistic detail — large expressive eyes with individual iris fibers, impossibly smooth porcelain skin with subsurface scattering, hair strands catching light with photorealistic refraction. Cherry blossom petals in slow motion, cinematic depth of field. 2D anime proportions with 3D photorealism.
```

**Mecha Action:**
```
Dynamic action shot of a mecha pilot inside a cockpit during combat. Multiple holographic HUD displays showing damage reports, pilot gripping dual control sticks. Through cracked windshield, enemy mechs approach in dust storm. Gundam-inspired design, cel-shaded with intense lighting contrast, dramatic speed lines.
```

### Cyberpunk & Sci-Fi

**Template:**
```
[Scene description] in a [cyberpunk/futuristic] [environment]. [Neon colors and reflections]. [Atmospheric effects]. [Camera angle and lens]. [Reference aesthetic].
```

**Rain-Drenched Alley:**
```
A lone figure walking through a narrow cyberpunk alley in a rain-drenched megacity at 2AM. Towering holographic billboards in Japanese and Korean text, neon pink and electric blue reflections on wet pavement, steam from underground vents. Flying vehicles between skyscrapers. Low angle, 35mm lens, Blade Runner 2049 cinematography, anamorphic lens flare.
```

**Illegal Street Market:**
```
Overhead view of an illegal cyberpunk street market under a highway overpass. Vendors selling bootleg cyberware, holographic price tags floating, robot chef operating ramen stall with six mechanical arms. Diverse augmented humans with glowing cybernetic eyes. Heavy rain, puddle reflections creating carnival of lights.
```

**Corporate Megastructure:**
```
Exterior establishing shot of a massive corporate megastructure piercing through clouds, surface covered in animated LED stock tickers and propaganda. Flying police drones circling upper floors, searchlights cutting through smog. Protestors with holographic signs at ground level. Cyberpunk noir, Syd Mead-inspired architecture.
```

### Product Photography

**Template:**
```
[Product] on [surface/podium] with [background treatment]. [Lighting setup]. [Material detail]. Shot for [purpose]. [Style reference].
```

**Minimal Product Shot:**
```
Elegant perfume bottle on a polished stone podium, floating water droplets suspended mid-air, pastel gradient background from blush pink to soft lavender. Three-point studio lighting — key from upper left, fill softening shadows, rim light separating from background. Shot for luxury brand e-commerce.
```

**Flat Lay Editorial:**
```
Top-down flat lay of skincare products on beige linen surface. Soft morning light from upper right casting gentle shadows. Serum bottle, moisturizer jar, face mist — minimalist white labels. Eucalyptus sprigs and dried lavender as props. Clean Aesop-inspired editorial aesthetic.
```

**Amazon Packshot:**
```
Single product photo of matte black wireless headphones on pure white background (#FFFFFF). No shadows, no reflections, perfectly centered, rotated 15 degrees showing ear cup and headband. Focus stacked for edge-to-edge sharpness. Amazon listing compliant, isolated commercial packshot.
```

**Sneaker Hero Shot:**
```
Dynamic sneaker hero shot — single running shoe floating at dramatic angle against deep charcoal background. Exploded view with sole, midsole, upper slightly separated showing construction. Colored dust particles bursting from impact point. Studio strobe creating razor-sharp highlights on material textures. Nike campaign style.
```

### Watercolor & Traditional

**Template:**
```
[Medium] painting of [subject] using [technique]. [Color treatment]. [Paper/canvas detail]. [Compositional approach]. Traditional [medium] aesthetic.
```

**Mountain Lake:**
```
Soft watercolor painting of a mountain lake at sunrise. Mist above calm water, pine tree silhouettes along shore, mountains in atmospheric perspective. Wet-on-wet technique with rose gold sky bleeding into cerulean blue water. Visible paper texture, deliberate unpainted white space.
```

**Botanical Illustration:**
```
Detailed botanical watercolor of a blooming peony, scientific illustration style. Precise petal structure with color gradients from deep magenta center to pale pink edges. Visible pencil guidelines beneath translucent washes. Cross-section of stem, seed pod detail, handwritten Latin name in iron gall ink. Aged cream paper with deckled edges.
```

**Urban Sketch:**
```
Loose urban sketch watercolor of a Parisian cafe corner. Quick confident ink lines defining architecture, selective watercolor washes — warm ochre for stone, cobalt blue for shutters, burnt sienna for awnings. Figures in just a few brushstrokes. Intentional splatter marks and drips. Moleskine travel journal style.
```

### Fantasy & Worldbuilding

**Template:**
```
[Cinematic/concept art] of [scene/environment]. [Scale indicators]. [Lighting and atmosphere]. [Unique details]. [Art reference]. Matte painting quality.
```

**Desert Treecity:**
```
Cinematic concept art of a futuristic desert city built around a giant ancient tree, roots forming natural archways between sandstone buildings. Bioluminescent moss creating natural lighting at dusk. Flying manta ray creatures circle the canopy. Approaching caravans on desert road. Epic scale with tiny human figures for reference. Matte painting quality.
```

**Dragon's Library:**
```
Interior of an ancient dragon's personal library carved inside a mountain. Towering scroll shelves reaching hundreds of feet, accessible by floating magical platforms. Massive dragon curled around central reading pillar wearing golden spectacles. Warm candlelight from thousands of floating candles. Dust motes in crystal skylight shafts.
```

**Enchanted Portal:**
```
Glowing magical portal between two ancient oaks in an enchanted forest. Portal surface rippling like liquid mercury, reflecting a floating city in clouds. Fireflies and magical particles spiraling. Thick moss, bioluminescent mushroom caps, ferns at the base. Twilight with god rays filtering through canopy.
```

### Typography & Text

**Template:**
```
[Format] with the text "[EXACT TEXT]" in [font style]. [Background/surface]. [Material treatment]. Typography-focused, clearly legible, high contrast for readability.
```

**Chalk Menu Board:**
```
Coffee shop chalk menu board with the text "COLD BREW $5 | LATTE $6 | MATCHA $7" in bold sans-serif white chalk lettering. Decorative coffee bean illustrations in corners. Matte black chalkboard with chalk dust texture. Hand-lettered aesthetic, consistent baseline. Warm cafe lighting.
```

**Minimal Poster:**
```
Minimalist poster with the text "BUILD SOMETHING BEAUTIFUL" in bold geometric sans-serif, white on deep navy background. Stacked vertically with decreasing font sizes. Subtle navy-to-midnight gradient. Swiss design influence, generous whitespace. Print-ready 24x36, typography as sole element.
```

**Neon Sign:**
```
Photorealistic neon sign reading "OPEN LATE" on dark brick wall. Each letter a separate glass tube — "O" and "L" in warm pink neon, rest in cool blue. Visible mounting brackets, electrical wiring, subtle gas glow beyond tubes. Slight flicker as motion blur on the "A". f/2.8 with background bokeh.
```

### Architecture & Interior

**Japanese Restaurant:**
```
Interior of a small Japanese ramen restaurant with 8-seat wooden counter. Paper lanterns casting warm amber light, steam from bowls. Aged wooden textures — knife marks on cutting board, oil patina on counter. Rainy Tokyo side street through window. 24mm tilt-shift, corrected verticals.
```

**Brutalist Library:**
```
Exterior of massive brutalist concrete library at golden hour. Raw exposed concrete with board-formed texture, geometric windows casting shadow patterns. Reflecting pool mirroring structure in foreground. Single person on wide steps for scale. Large format 4x5, Ektar 100 film, perfect perspective.
```

**Scandinavian A-Frame:**
```
A-frame Scandinavian cabin in a Norwegian fjord during winter twilight. Floor-to-ceiling glass front revealing warm fireplace interior. Snow on angular roof, frost-heavy pines. Faint northern lights in deep blue sky. Warm interior contrasting cool exterior. Drone perspective 30ft up.
```

### Pixel Art

**Template:**
```
[Bit depth]-bit pixel art of [subject] in [style]. [Resolution]x[Resolution] pixels, [color count]-color palette. [Animation details if sprite]. No anti-aliasing, [era] aesthetic.
```

**RPG Sprite Sheet:**
```
16-bit pixel art sprite sheet of a knight character, classic RPG style. 32x32 pixels, 16-color earthy palette with metallic highlights. Four directional walking animations (4 frames each). Attack sequence (6 frames, sword slash). Clean pixel edges, no anti-aliasing, SNES-era aesthetic.
```

**Isometric City:**
```
Detailed isometric pixel art of a small city block — 128x128 pixels, 32-color palette. Pizza shop with neon sign, bookstore, apartment above. Tiny characters walking, pixel car at curb. Warm interior lights suggesting day-night cycle. GBA-era aesthetic, dithering for gradients.
```

### Fashion Editorial

**High Fashion:**
```
High-fashion editorial — model in sculptural red gown in an empty white gallery. Dramatic side lighting creating bold floor shadows. Dress with architectural origami-like pleating. One arm extended creating geometric silhouette. Hasselblad H6D, beauty dish from camera right, 80mm lens. Vogue Italia aesthetic.
```

### Concept Art

**Underwater Civilization:**
```
Concept art of underwater civilization inside a massive air bubble at ocean floor. Bioluminescent coral and shell architecture, transparent walkways with fish beneath. Citizens in sleek diving suits with gill systems. Central nautilus-shell government building. Volumetric light from jellyfish street lamps. Cameron meets Moebius.
```

### Food Photography

**Fine Dining:**
```
Meticulously plated dessert for a Michelin-starred restaurant — chocolate sphere with gold leaf on raspberry coulis mirror, micro-herbs arranged with tweezers. Dark slate plate on dark wood. Single directional spot from upper left. 100mm macro at f/4 showing individual sugar crystals.
```

**Street Food:**
```
Overhead food photography of Mexican street tacos on butcher paper. Al pastor with pineapple, carnitas with pickled onion, fish tacos with cabbage slaw. Scattered cilantro, lime wedges, charred chilies. Hands reaching in, sweating beer bottles. Rustic outdoor light, messy and authentic. 35mm, vibrant.
```

### Branding & Mockups

**Logo on Merch:**
```
Close-up of black cotton t-shirt on wooden hanger against white wall. Embroidered white minimalist mountain peak logo with two lines beneath. Visible thread texture, natural fabric wrinkles. Soft window light from left. DTC outdoor brand product mockup. 50mm at f/4.
```

**Packaging:**
```
Premium chocolate bar wrapper flat on dusty rose background. Art deco geometric patterns in gold foil on matte navy. One corner peeled showing chocolate. Top-down, even studio lighting. The text "MAISON NOIR 72% CACAO" in gold serif, clearly legible. Luxury confectionery branding.
```

### UI/UX Mockups

**Mobile App:**
```
Fitness tracking app on iPhone 16 Pro. Dark-mode dashboard: circular progress ring (73%), weekly activity chart in purple-to-blue gradient, three stat cards (steps, calories, heart rate). SF Pro Display typography. Phone floating at slight angle on gradient background, subtle shadow.
```

### Retro & Nostalgia

**VHS Aesthetic:**
```
Frame from 1988 VHS home video. Family birthday party in wood-paneled room. Tracking lines top and bottom, desaturated colors with boosted reds, date stamp "AUG 14 1988". Scan-line texture, analog noise, warm tungsten ceiling light. Authentic VHS degradation and color bleeding.
```

**Synthwave Album Art:**
```
Synthwave album cover — chrome DeLorean on neon grid road to horizon. Massive retrowave sun behind palm tree silhouettes, horizontal scan lines. Hot pink, electric purple, cyan accents. Chrome text "MIDNIGHT DRIVE" in 80s chrome lettering with horizontal line through middle. Grid reflections on car. Full outrun aesthetic.
```

### 3D Render

**Isometric Room:**
```
Isometric 3D render of a cozy programmer's room. Desk with dual monitors showing code, mechanical keyboard with RGB, espresso machine on side table. Bookshelf with tech books and figurines. Rainy city night through window. Desk lamp and monitor ambient glow. Clay render quality, ambient occlusion. Blender/C4D aesthetic, pastel palette.
```

**Abstract Chrome:**
```
Abstract 3D render of liquid chrome metal forming impossible organic shape, floating in void. Surface reflecting gradient environment — warm amber one side, cool blue other. Caustic light patterns on ground plane. Subsurface scattering at thin edges creating golden glow. Octane Render, 8K, physically accurate materials. Gallery piece.
```

---

## Advanced Techniques

### Multi-Turn Editing
The model preserves context. Instead of regenerating:
```
"Change the lighting to golden hour"
"Move the character slightly left"
"Add fog in the background"
```

### Search Grounding
For accurate real-world subjects, the CLI enables Google Search automatically:
```bash
nb "Infographic showing current Bitcoin market data, use Google Search to verify" -s 2K
```

### In-Image Translation
```bash
nb "Translate all text in this menu to Japanese while preserving the visual style" -r menu.jpg
```

### Style Transfer
```bash
nb "Apply the watercolor style from the reference to this urban photo" -r style-ref.jpg -r photo.jpg
```

### Dimensional Translation
```bash
nb "Convert this 2D sketch to a photorealistic 3D render, maintain proportions" -r sketch.png -s 4K
```

### Frame-to-Frame Consistency
For animation sequences, chain previous outputs as references:
```bash
nb "Character in walking pose, frame 1" -t -o walk-01
nb "Same character, walking pose frame 2, slight stride" -t -r walk-01.png -o walk-02
nb "Same character, walking pose frame 3, full stride" -t -r walk-01.png -r walk-02.png -o walk-03
```

## Cost Optimization

- Start at 512px for concepts, only upscale winners
- Use Flash for 90% of tasks — Pro only for complex multi-character scenes
- Check spending: `nb --costs`
- Batch API for high-volume (lower cost, 24hr turnaround)
- Edit existing images instead of regenerating from scratch

## Common Mistakes to Avoid

1. Comma-separated tags instead of natural sentences
2. Conflicting styles in same prompt ("pixel art AND photorealistic 4K")
3. 4K resolution for social media thumbnails (cost waste)
4. Regenerating from scratch when 80% is right
5. Negative prompts ("no X") instead of describing what you want
6. Not quoting text when text rendering is needed
7. Using Pro model for simple concepts (Flash is sufficient)

## Dependencies

- **Bun** runtime (required)
- **@google/genai** npm package
- **FFmpeg** (for transparent mode)
- **ImageMagick** (for transparent mode)
- **Gemini API key** (free at aistudio.google.com)
