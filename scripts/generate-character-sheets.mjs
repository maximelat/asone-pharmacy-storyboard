#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets', 'characters');

async function loadEnv() {
  const envPath = path.join(root, '..', '..', 'secrets', '.env');
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
  } catch {}
}

const prompts = [
  {
    file: 'amina-global-reference.png',
    prompt: `Servier As One compliance-ready character reference sheet, 4 panels on clean white/cream paper, navy #24226a and tangerine #f55b41 accent system, elegant medical training style. AMINA, recurring English/global host: African female pharmacist, 34 years old, warm confident smile, natural deep brown skin, short natural textured hair, white pharmacist coat over emerald blouse, discreet Servier-colored lapel pin, professional and human. Four labeled views: FRONT PORTRAIT, THREE-QUARTER, PROFILE, HANDS HOLDING TRAINING BINDER. Consistent face, consistent wardrobe, no brand logos, no fictional product labels, high-end healthcare storyboard reference, 16:9 composition.`
  },
  {
    file: 'sofia-hispanic-reference.png',
    prompt: `Servier As One compliance-ready character reference sheet, 4 panels on clean white/cream paper, navy #24226a and tangerine #f55b41 accent system, elegant medical training style. SOFIA, recurring Spanish/Hispanic host: Hispanic Latina / Spanish female pharmacist, 35 years old, hazel eyes, dark hair tied back in a neat low bun, warm calm expression, ivory blouse under navy tailored blazer with subtle tangerine detail, natural skin texture, professional and reassuring. Four labeled views: FRONT PORTRAIT, THREE-QUARTER, PROFILE, HANDS HOLDING TRAINING BINDER. Consistent face, consistent wardrobe, no brand logos, no fictional product labels, high-end healthcare storyboard reference, 16:9 composition.`
  }
];

async function generate(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY manquant');
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt,
      n: 1,
      size: '1536x1024',
      quality: 'high'
    })
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `OpenAI error ${res.status}`);
  const row = json?.data?.[0];
  if (row?.b64_json) return Buffer.from(row.b64_json, 'base64');
  if (row?.url) {
    const img = await fetch(row.url);
    if (!img.ok) throw new Error(`download failed ${img.status}`);
    return Buffer.from(await img.arrayBuffer());
  }
  throw new Error('OpenAI response without image');
}

await loadEnv();
await fs.mkdir(outDir, { recursive: true });
for (const item of prompts) {
  console.log(`Generating ${item.file}`);
  const image = await generate(item.prompt);
  const target = path.join(outDir, item.file);
  await fs.writeFile(target, image);
  console.log(`Saved ${target}`);
}
