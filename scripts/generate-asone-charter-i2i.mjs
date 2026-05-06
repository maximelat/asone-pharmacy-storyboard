#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets', 'scenes');
const manifestPath = path.join(root, 'assets', 'manifest.json');

const SOURCE =
  process.argv[2] ||
  '/Users/openclaw/.cursor/projects/Users-openclaw-openclaw/assets/Capture_d_e_cran_2026-05-01_a__21.03.03-aae0f3b1-c3c0-4f8d-a68c-13feea8d5971.png';

async function loadEnv() {
  const candidates = [
    path.join(root, '..', '..', 'secrets', '.env'),
    path.join(root, '.env')
  ];
  for (const envPath of candidates) {
    try {
      const text = await fs.readFile(envPath, 'utf8');
      for (const line of text.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eq = trimmed.indexOf('=');
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let val = trimmed.slice(eq + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
      return;
    } catch {}
  }
}

async function editImage() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY manquant');

  const sourceBytes = await fs.readFile(SOURCE);
  const form = new FormData();
  form.set('model', 'gpt-image-2');
  form.set('size', '1536x1024');
  form.set('quality', 'high');
  form.set('n', '1');
  form.set(
    'prompt',
    `Image-to-image transformation for Servier As One storyboard scene 02, "A 55-year story across 17 languages".
Use the uploaded brand-guide reference as the visual source of truth: keep the dark navy background and the interwoven coloured As One ribbons/lines (blue, red, green, yellow, orange), but turn it into a premium compliance-ready cinematic storyboard still.
Composition: 16:9 landscape, a refined training room wall or museum-style brand wall, with the coloured As One ribbons flowing across the image like global routes over a subtle world-map texture. Add elegant depth, soft shadows, clean healthcare communication style, Servier navy #24226a and coral #f55b41 accents.
No small unreadable legal text, no fake logos, no product claims, no watermark. The image must visibly integrate the As One visual charter/ribbon motif inside the scene itself, not as a separate UI overlay.`
  );
  form.set('image', new Blob([sourceBytes], { type: 'image/png' }), 'asone-charter-reference.png');

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || `OpenAI image edit error ${res.status}`);
  }
  const row = json?.data?.[0];
  if (row?.b64_json) return Buffer.from(row.b64_json, 'base64');
  if (row?.url) {
    const img = await fetch(row.url);
    if (!img.ok) throw new Error(`Image download failed ${img.status}`);
    return Buffer.from(await img.arrayBuffer());
  }
  throw new Error('OpenAI image edit response without image');
}

await loadEnv();
await fs.mkdir(outDir, { recursive: true });
const image = await editImage();
const outFile = path.join(outDir, 'scene-02-asone-charter-i2i.png');
await fs.writeFile(outFile, image);

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const scene = manifest.scenes.find((item) => item.id === 2);
if (!scene) throw new Error('Scene 02 missing in manifest');
scene.opening = 'assets/scenes/scene-02-asone-charter-i2i.png';
scene.es_opening = 'assets/scenes/scene-02-asone-charter-i2i.png';
scene.asone_charter_i2i = {
  model: 'openai/gpt-image-2',
  endpoint: 'images/edits',
  quality: 'high',
  source: path.basename(SOURCE),
  generated_at: new Date().toISOString()
};
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`Saved ${outFile}`);
console.log('Updated scene 02 opening and es_opening in manifest.json');
