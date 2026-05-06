#!/usr/bin/env node
import https from 'node:https';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'assets', 'manifest.json');

const variants = [
  {
    key: 'opening_video',
    label: 'EN / Amina',
    sourceUrl: 'https://asone-pharmacy-storyboard.netlify.app/assets/gpt-image2-v2/scene-02-en-opening.png',
  },
  {
    key: 'es_opening_video',
    label: 'ES / Sofia',
    sourceUrl: 'https://asone-pharmacy-storyboard.netlify.app/assets/gpt-image2-v2/scene-02-es-opening.png',
  },
];

async function loadEnv() {
  const candidates = [
    path.join(root, '..', '..', 'secrets', '.env'),
    path.join(root, '.env'),
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

function falPost(endpointPath, payload, timeoutMs = 480000) {
  const key = process.env.FAL_API_KEY;
  if (!key) throw new Error('FAL_API_KEY missing');
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: 'fal.run',
        path: endpointPath,
        method: 'POST',
        headers: {
          Authorization: `Key ${key}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
            else reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 500)}`));
          } catch (error) {
            reject(error);
          }
        });
      }
    );
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const buildPrompt = (label) => `Premium healthcare brand animation for Servier As One scene "A 55-year story across 17 languages" (${label}).
Starting from the provided still frame, keep the same navy brand wall, protagonist, world-map texture and colored As One ribbon paths.
Motion: slow cinematic push-in, the blue/red/green/yellow/orange ribbons softly glow, light pulses travel along the routes across the world map, subtle parallax on the wall, no extra characters, no fake logos, no product claims, no new text overlays, no distortion of the protagonist.
Elegant MasterClass/Sante Academie healthcare training insert, compliance-safe, realistic, 16:9.`;

await loadEnv();
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const scene = manifest.scenes.find((item) => item.id === 2);
if (!scene) throw new Error('Scene 02 missing in manifest');
for (const variant of variants) {
  if (scene[variant.key]?.url && !process.argv.includes('--force')) {
    console.log(`${variant.label}: already exists ${scene[variant.key].url}`);
    continue;
  }
  const prompt = buildPrompt(variant.label);
  const result = await falPost('/bytedance/seedance-2.0/image-to-video', {
    prompt,
    image_url: variant.sourceUrl,
    resolution: '1080p',
    duration: 5,
    aspect_ratio: '16:9',
    generate_audio: false,
  });

  const url = result.video?.url || result.data?.video?.url;
  if (!url) throw new Error(`FAL response without video URL: ${JSON.stringify(result).slice(0, 500)}`);
  scene[variant.key] = {
    url,
    model: 'bytedance/seedance-2.0/image-to-video',
    provider: 'fal',
    source: variant.sourceUrl,
    duration: 5,
    resolution: '1080p',
    prompt,
    generated_at: new Date().toISOString(),
    higgsfield_attempt: 'failed: generate_video server error',
  };
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`${variant.label}: ${url}`);
}
