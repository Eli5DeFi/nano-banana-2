#!/usr/bin/env bun

/**
 * Nano Banana 2 — AI Image Generation CLI
 * By eli5defi
 *
 * Powered by Google Gemini (Nano Banana 2 / gemini-3.1-flash-image-preview)
 * Supports: text-to-image, reference-based generation, transparent assets,
 * multi-resolution output, cost tracking, and conversational editing.
 */

import { GoogleGenAI } from "@google/genai";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, extname, basename, resolve, dirname } from "path";
import { homedir } from "os";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

// ─── Config Paths ───────────────────────────────────────────────────────────

const NB_HOME = join(homedir(), ".nano-banana");
const COSTS_FILE = join(NB_HOME, "costs.json");
const ENV_FILE = join(NB_HOME, ".env");
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");

// ─── API Key Resolution ─────────────────────────────────────────────────────

function resolveApiKey(flagKey?: string): string {
  // 1. CLI flag
  if (flagKey) return flagKey;

  // 2. Environment variable
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  // 3. .env in current working directory
  const cwdEnv = join(process.cwd(), ".env");
  const key3 = readEnvKey(cwdEnv);
  if (key3) return key3;

  // 4. .env next to script (repo root)
  const repoEnv = join(REPO_ROOT, ".env");
  const key4 = readEnvKey(repoEnv);
  if (key4) return key4;

  // 5. ~/.nano-banana/.env
  const key5 = readEnvKey(ENV_FILE);
  if (key5) return key5;

  console.error(
    "\x1b[31mError: No Gemini API key found.\x1b[0m\n" +
      "Set it via one of:\n" +
      "  1. --api-key <key>\n" +
      "  2. GEMINI_API_KEY environment variable\n" +
      "  3. .env file in current directory\n" +
      "  4. .env file in repo root\n" +
      `  5. ${ENV_FILE}\n\n` +
      "Get a free key at: https://aistudio.google.com/"
  );
  process.exit(1);
}

function readEnvKey(filePath: string): string | undefined {
  if (!existsSync(filePath)) return undefined;
  try {
    const content = readFileSync(filePath, "utf-8");
    const match = content.match(/GEMINI_API_KEY\s*=\s*(.+)/);
    return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") || undefined;
  } catch {
    return undefined;
  }
}

// ─── Constants ──────────────────────────────────────────────────────────────

const MODEL_ALIASES: Record<string, string> = {
  flash: "gemini-3.1-flash-image-preview",
  nb2: "gemini-3.1-flash-image-preview",
  pro: "gemini-3-pro-image-preview",
  "nb-pro": "gemini-3-pro-image-preview",
};

const VALID_SIZES = ["512", "1K", "2K", "4K"] as const;
type ImageSize = (typeof VALID_SIZES)[number];

const VALID_ASPECTS = [
  "1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3",
  "4:5", "5:4", "21:9", "1:4", "1:8", "4:1", "8:1",
];

// Cost per 1M tokens
const COST_RATES: Record<string, { input: number; output: number }> = {
  "gemini-3.1-flash-image-preview": { input: 0.25, output: 60.0 },
  "gemini-3-pro-image-preview": { input: 2.0, output: 120.0 },
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface Options {
  prompt: string;
  output: string;
  size: ImageSize;
  outputDir: string;
  referenceImages: string[];
  transparent: boolean;
  apiKey: string | undefined;
  model: string;
  aspectRatio: string | undefined;
}

interface CostEntry {
  timestamp: string;
  model: string;
  size: string;
  aspect: string | null;
  prompt_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  output_file: string;
}

// ─── Utility Functions ──────────────────────────────────────────────────────

function getMimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  const mimes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
  };
  return mimes[ext] || "image/png";
}

function loadImageAsBase64(filePath: string): { data: string; mimeType: string } {
  const absPath = resolve(filePath);
  if (!existsSync(absPath)) {
    console.error(`\x1b[31mReference image not found: ${absPath}\x1b[0m`);
    process.exit(1);
  }
  const buffer = readFileSync(absPath);
  return {
    data: buffer.toString("base64"),
    mimeType: getMimeType(absPath),
  };
}

function runCommand(cmd: string, args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args);
    let stdout = "";
    let stderr = "";
    proc.stdout?.on("data", (d) => (stdout += d.toString()));
    proc.stderr?.on("data", (d) => (stderr += d.toString()));
    proc.on("close", (code) => resolve({ code: code ?? 1, stdout, stderr }));
    proc.on("error", (err) => resolve({ code: 1, stdout: "", stderr: err.message }));
  });
}

async function runMagick(args: string[]): Promise<{ code: number; stdout: string; stderr: string }> {
  // Try `magick` first (ImageMagick v7), fall back to `convert` (v6)
  let result = await runCommand("magick", args);
  if (result.code !== 0 && result.stderr.includes("not found")) {
    result = await runCommand("convert", args);
  }
  return result;
}

function resolveModel(input: string): string {
  const lower = input.toLowerCase().trim();
  return MODEL_ALIASES[lower] || input;
}

function calculateCost(model: string, promptTokens: number, outputTokens: number): number {
  const rates = COST_RATES[model] || COST_RATES["gemini-3.1-flash-image-preview"];
  return (promptTokens / 1_000_000) * rates.input + (outputTokens / 1_000_000) * rates.output;
}

// ─── Cost Tracking ──────────────────────────────────────────────────────────

function ensureNBHome(): void {
  if (!existsSync(NB_HOME)) {
    mkdirSync(NB_HOME, { recursive: true });
  }
}

function logCost(entry: CostEntry): void {
  ensureNBHome();
  let costs: CostEntry[] = [];
  if (existsSync(COSTS_FILE)) {
    try {
      costs = JSON.parse(readFileSync(COSTS_FILE, "utf-8"));
    } catch {
      costs = [];
    }
  }
  costs.push(entry);
  writeFileSync(COSTS_FILE, JSON.stringify(costs, null, 2));
}

function printCostSummary(): void {
  if (!existsSync(COSTS_FILE)) {
    console.log("\x1b[33mNo generation history found.\x1b[0m");
    console.log(`Costs are tracked at: ${COSTS_FILE}`);
    return;
  }

  let costs: CostEntry[];
  try {
    costs = JSON.parse(readFileSync(COSTS_FILE, "utf-8"));
  } catch {
    console.log("\x1b[31mFailed to read cost history.\x1b[0m");
    return;
  }

  if (costs.length === 0) {
    console.log("\x1b[33mNo generations recorded yet.\x1b[0m");
    return;
  }

  // Group by model
  const byModel: Record<string, { count: number; cost: number }> = {};
  let totalCost = 0;

  for (const entry of costs) {
    const key = entry.model.includes("pro") ? "Pro" : "Flash";
    if (!byModel[key]) byModel[key] = { count: 0, cost: 0 };
    byModel[key].count++;
    byModel[key].cost += entry.estimated_cost;
    totalCost += entry.estimated_cost;
  }

  console.log("\n\x1b[33m🍌 Nano Banana 2 — Cost Summary\x1b[0m\n");
  console.log(`  Total generations: ${costs.length}`);
  console.log(`  Total estimated cost: \x1b[32m$${totalCost.toFixed(4)}\x1b[0m\n`);

  for (const [model, data] of Object.entries(byModel)) {
    console.log(`  ${model}: ${data.count} images — $${data.cost.toFixed(4)}`);
  }

  // Last 5 generations
  const recent = costs.slice(-5).reverse();
  console.log("\n  Recent generations:");
  for (const entry of recent) {
    const model = entry.model.includes("pro") ? "Pro" : "Flash";
    const date = new Date(entry.timestamp).toLocaleDateString();
    console.log(
      `    ${date} | ${model} ${entry.size} | $${entry.estimated_cost.toFixed(4)} | ${basename(entry.output_file)}`
    );
  }
  console.log("");
}

// ─── Background Removal Pipeline ────────────────────────────────────────────

async function detectKeyColor(imagePath: string): Promise<string> {
  // Sample top-left 4x4 pixels and find most common color
  const result = await runMagick([
    imagePath,
    "-crop", "4x4+0+0",
    "-depth", "8",
    "-format", "%c",
    "histogram:info:",
  ]);

  if (result.code !== 0) {
    console.log("\x1b[33mWarning: Could not auto-detect key color, defaulting to green.\x1b[0m");
    return "00FF00";
  }

  // Parse histogram — find most common color
  const lines = result.stdout.trim().split("\n").filter(Boolean);
  let maxCount = 0;
  let keyColor = "00FF00";

  for (const line of lines) {
    const countMatch = line.match(/^\s*(\d+):/);
    const colorMatch = line.match(/#([0-9A-Fa-f]{6})/);
    if (countMatch && colorMatch) {
      const count = parseInt(countMatch[1]);
      if (count > maxCount) {
        maxCount = count;
        keyColor = colorMatch[1];
      }
    }
  }

  return keyColor;
}

async function removeBackground(imagePath: string): Promise<string> {
  const outputPath = imagePath.replace(/\.png$/i, "-transparent.png");

  console.log("  \x1b[36m[1/3]\x1b[0m Detecting key color...");
  const keyColor = await detectKeyColor(imagePath);
  console.log(`        Key color: #${keyColor}`);

  console.log("  \x1b[36m[2/3]\x1b[0m Removing background (FFmpeg colorkey + despill)...");
  const ffmpegResult = await runCommand("ffmpeg", [
    "-y", "-i", imagePath,
    "-vf", `colorkey=0x${keyColor}:0.25:0.08,despill=green`,
    "-frames:v", "1",
    outputPath,
  ]);

  if (ffmpegResult.code !== 0) {
    console.error(`\x1b[31mFFmpeg failed: ${ffmpegResult.stderr}\x1b[0m`);
    console.log("\x1b[33mReturning original image without transparency.\x1b[0m");
    return imagePath;
  }

  console.log("  \x1b[36m[3/3]\x1b[0m Trimming transparent padding (ImageMagick)...");
  const trimResult = await runMagick([
    outputPath,
    "-trim",
    "+repage",
    outputPath,
  ]);

  if (trimResult.code !== 0) {
    console.log("\x1b[33mWarning: Trim failed, but transparency was applied.\x1b[0m");
  }

  return outputPath;
}

// ─── Argument Parser ────────────────────────────────────────────────────────

function printHelp(): void {
  console.log(`
\x1b[33m🍌 Nano Banana 2 — AI Image Generation CLI\x1b[0m
\x1b[2mby eli5defi\x1b[0m

\x1b[1mUsage:\x1b[0m
  nb "your prompt here" [options]
  nano-banana "your prompt here" [options]

\x1b[1mOptions:\x1b[0m
  -o, --output <name>     Output filename (without extension)
  -s, --size <size>       Resolution: 512, 1K, 2K, 4K (default: 1K)
  -a, --aspect <ratio>    Aspect ratio: 1:1, 16:9, 9:16, 4:3, etc.
  -m, --model <model>     Model: flash (default), pro
  -d, --dir <path>        Output directory (default: current)
  -r, --ref <image>       Reference image path (repeatable, up to 14)
  -t, --transparent       Generate with green screen + auto bg removal
  --api-key <key>         Override Gemini API key
  --costs                 Show cost/spending summary
  -h, --help              Show this help

\x1b[1mModels:\x1b[0m
  flash (default)  gemini-3.1-flash-image-preview   ~$0.067/1K
  pro              gemini-3-pro-image-preview        ~$0.134/1K

\x1b[1mExamples:\x1b[0m
  nb "mountain lake at sunrise"
  nb "product on marble" -s 4K -a 16:9 -o hero-shot
  nb "game character sprite" -t -s 2K
  nb "same character, new pose" -r ref1.jpg -r ref2.jpg
  nb "complex battle scene" -m pro -s 4K
  nb --costs

\x1b[1mAPI Key:\x1b[0m
  Free key at https://aistudio.google.com/
  Set via: echo "GEMINI_API_KEY=your_key" > ~/.nano-banana/.env
`);
}

function parseArgs(argv: string[]): Options | null {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    printHelp();
    return null;
  }

  if (args.includes("--costs")) {
    printCostSummary();
    return null;
  }

  const opts: Options = {
    prompt: "",
    output: `nb-${Date.now()}`,
    size: "1K",
    outputDir: process.cwd(),
    referenceImages: [],
    transparent: false,
    apiKey: undefined,
    model: "flash",
    aspectRatio: undefined,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg === "-o" || arg === "--output") {
      opts.output = args[++i] || opts.output;
    } else if (arg === "-s" || arg === "--size") {
      const size = args[++i];
      if (size && VALID_SIZES.includes(size as ImageSize)) {
        opts.size = size as ImageSize;
      } else {
        console.error(`\x1b[31mInvalid size: ${size}. Valid: ${VALID_SIZES.join(", ")}\x1b[0m`);
        process.exit(1);
      }
    } else if (arg === "-a" || arg === "--aspect") {
      const aspect = args[++i];
      if (aspect && VALID_ASPECTS.includes(aspect)) {
        opts.aspectRatio = aspect;
      } else {
        console.error(`\x1b[31mInvalid aspect ratio: ${aspect}. Valid: ${VALID_ASPECTS.join(", ")}\x1b[0m`);
        process.exit(1);
      }
    } else if (arg === "-m" || arg === "--model") {
      opts.model = args[++i] || "flash";
    } else if (arg === "-d" || arg === "--dir") {
      opts.outputDir = args[++i] || process.cwd();
    } else if (arg === "-r" || arg === "--ref") {
      const refPath = args[++i];
      if (refPath) opts.referenceImages.push(refPath);
    } else if (arg === "-t" || arg === "--transparent") {
      opts.transparent = true;
    } else if (arg === "--api-key") {
      opts.apiKey = args[++i];
    } else if (!arg.startsWith("-") && !opts.prompt) {
      opts.prompt = arg;
    }

    i++;
  }

  if (!opts.prompt) {
    console.error('\x1b[31mError: No prompt provided.\x1b[0m\nUsage: nb "your prompt" [options]');
    process.exit(1);
  }

  return opts;
}

// ─── Image Generation ───────────────────────────────────────────────────────

async function generateImage(opts: Options): Promise<string[]> {
  const apiKey = resolveApiKey(opts.apiKey);
  const modelId = resolveModel(opts.model);
  const ai = new GoogleGenAI({ apiKey });

  console.log(`\n\x1b[33m🍌 Nano Banana 2\x1b[0m`);
  console.log(`  Model:  ${modelId.includes("pro") ? "Pro" : "Flash"} (${modelId})`);
  console.log(`  Size:   ${opts.size}`);
  if (opts.aspectRatio) console.log(`  Aspect: ${opts.aspectRatio}`);
  if (opts.referenceImages.length > 0) console.log(`  Refs:   ${opts.referenceImages.length} image(s)`);
  if (opts.transparent) console.log(`  Mode:   \x1b[32mTransparent (green screen)\x1b[0m`);
  console.log(`  Prompt: "${opts.prompt.slice(0, 80)}${opts.prompt.length > 80 ? "..." : ""}"`);
  console.log("");

  // Build image config
  const imageConfig: Record<string, string> = { outputImageSize: opts.size };
  if (opts.aspectRatio) {
    imageConfig.aspectRatio = opts.aspectRatio;
  }

  // Build parts array
  const parts: Array<Record<string, any>> = [];

  // Add reference images
  for (const refPath of opts.referenceImages) {
    const img = loadImageAsBase64(refPath);
    parts.push({
      inlineData: {
        data: img.data,
        mimeType: img.mimeType,
      },
    });
  }

  // Build prompt text
  let promptText = opts.prompt;
  if (opts.transparent) {
    promptText +=
      "\n\nIMPORTANT: Generate this on a solid, bright green background (#00FF00). " +
      "The subject must have clear, clean edges with NO green spill on the subject. " +
      "The green background must be uniform and extend to all edges of the image. " +
      "Do NOT include any ground shadows that touch the edges.";
  }

  parts.push({ text: promptText });

  // Generate
  console.log("  \x1b[36mGenerating...\x1b[0m");
  const startTime = Date.now();

  let response;
  try {
    response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: "user", parts }],
      config: {
        responseModalities: ["IMAGE", "TEXT"],
        // @ts-ignore - imageConfig type not fully exposed
        imageConfig,
        tools: [{ googleSearch: {} }],
      },
    });
  } catch (err: any) {
    console.error(`\x1b[31mGeneration failed: ${err.message}\x1b[0m`);
    if (err.message?.includes("API key")) {
      console.log("Get a free key at: https://aistudio.google.com/");
    }
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`  \x1b[32mDone in ${elapsed}s\x1b[0m\n`);

  // Extract images from response
  const outputPaths: string[] = [];
  const candidates = response.candidates || [];

  if (candidates.length === 0) {
    console.error("\x1b[31mNo output generated. Try a different prompt.\x1b[0m");
    process.exit(1);
  }

  // Ensure output directory exists
  if (!existsSync(opts.outputDir)) {
    mkdirSync(opts.outputDir, { recursive: true });
  }

  let imageIndex = 0;
  for (const candidate of candidates) {
    const contentParts = candidate.content?.parts || [];
    for (const part of contentParts) {
      if (part.text) {
        console.log(`  \x1b[2mModel response: ${part.text.slice(0, 200)}\x1b[0m`);
      }
      if (part.inlineData) {
        const suffix = imageIndex > 0 ? `-${imageIndex + 1}` : "";
        const fileName = `${opts.output}${suffix}.png`;
        const filePath = join(opts.outputDir, fileName);
        const imageBuffer = Buffer.from(part.inlineData.data, "base64");
        writeFileSync(filePath, imageBuffer);
        outputPaths.push(filePath);
        imageIndex++;
      }
    }
  }

  if (outputPaths.length === 0) {
    console.error("\x1b[31mNo images in response. The model may have declined the prompt.\x1b[0m");
    process.exit(1);
  }

  // Log cost
  const usage = response.usageMetadata;
  if (usage) {
    const promptTokens = usage.promptTokenCount || 0;
    const outputTokens = usage.candidatesTokenCount || 0;
    const cost = calculateCost(modelId, promptTokens, outputTokens);

    logCost({
      timestamp: new Date().toISOString(),
      model: modelId,
      size: opts.size,
      aspect: opts.aspectRatio || null,
      prompt_tokens: promptTokens,
      output_tokens: outputTokens,
      estimated_cost: cost,
      output_file: outputPaths[0],
    });

    console.log(`  Cost: ~$${cost.toFixed(4)} (${promptTokens} in / ${outputTokens} out tokens)`);
  }

  return outputPaths;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const opts = parseArgs(process.argv);
  if (!opts) return;

  let outputPaths = await generateImage(opts);

  // Post-processing: transparent mode
  if (opts.transparent) {
    console.log("\n  \x1b[33mApplying transparency pipeline...\x1b[0m");
    const processedPaths: string[] = [];

    for (const imgPath of outputPaths) {
      const transparentPath = await removeBackground(imgPath);
      processedPaths.push(transparentPath);
    }

    outputPaths = processedPaths;
  }

  // Output summary
  console.log("\n\x1b[33m🍌 Output:\x1b[0m");
  for (const p of outputPaths) {
    console.log(`  \x1b[32m→\x1b[0m ${p}`);
  }
  console.log("");
}

main().catch((err) => {
  console.error(`\x1b[31mUnexpected error: ${err.message}\x1b[0m`);
  process.exit(1);
});
