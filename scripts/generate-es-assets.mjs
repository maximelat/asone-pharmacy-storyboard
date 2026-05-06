#!/usr/bin/env node
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.join(__dirname, '..', 'assets', 'manifest.json');
const FAL_KEY = process.env.FAL_API_KEY;

if (!FAL_KEY) {
  console.error('FAL_API_KEY missing');
  process.exit(1);
}

const LOOK = `Cinematic ultra-realistic editorial photograph, MasterClass.com premium documentary style, luxurious modern pharmacy training studio in Madrid, warm golden-hour light, walnut wood, brushed brass shelves, navy #24226a and tangerine #f55b41 accents, no watermark, no logos, no text overlay except naturally photographed medical papers if needed, 16:9, refined compliance-ready storyboard frame`;
const SOFIA = `Sofia, a Hispanic Latina / Spanish pharmacist in her 30s, hazel eyes, dark hair tied back, ivory blouse under navy tailored blazer with subtle tangerine accent, professional, warm, calm, trustworthy`;

const scenes = [
  {
    id: 1,
    opening: `${LOOK}. ${SOFIA} stands alone at a walnut pharmacy counter, direct eye contact to camera, elegant shelves behind, Madrid skyline at sunset through glass, Sofia-led Spanish adaptation opening frame.`,
    closing: `${LOOK}. ${SOFIA} closes a hard-cover As One training binder on the counter and smiles gently toward the camera, warm amber practical lamp, refined solo-host Spanish adaptation closing frame.`
  },
  {
    id: 2,
    opening: `${LOOK}. Antique world map on a walnut table with a subtle focus on Spain and Latin America, brass globe, elegant pharmacy artefacts, navy and tangerine route lines, Spanish adaptation global heritage frame.`,
    closing: `${LOOK}. ${SOFIA} stands in profile before a glowing antique world map, Spain and Latin America softly highlighted, cinematic rim light, global Daflon heritage becomes As One Spanish narration.`
  },
  {
    id: 3,
    opening: `${LOOK}. Macro of a polished anatomical sculpture of a human leg showing translucent veins and valves, displayed in a luxurious Madrid medical academy, no graphic content, Spanish adaptation venous physiology opening.`,
    closing: `${LOOK}. ${SOFIA} gestures toward a luminous holographic venous return diagram in a premium anatomy theatre, confident educator pose, no gore, medical training elegance.`
  },
  {
    id: 4,
    opening: `${LOOK}. Dignified close-up at a pharmacy counter: an older Hispanic woman patient shows subtle leg heaviness signs without graphic lesions, Sofia's hand points to a CEAP booklet, refined compliance-safe scene.`,
    closing: `${LOOK}. ${SOFIA} sits opposite an older Hispanic woman patient at a walnut counter; a translucent CEAP C0 to C6 diagram floats between them, both calm and reassured, Spanish adaptation CVD counselling frame.`
  },
  {
    id: 5,
    opening: `${LOOK}. Vintage medical atlas on walnut desk showing a tasteful navy ink illustration of hemorrhoidal venous plexus with one tangerine highlight, discreet, scholarly, no graphic anatomy photo, Spanish adaptation.`,
    closing: `${LOOK}. ${SOFIA} in a quiet consultation room under brass library lamp, holding the vintage atlas open while speaking discreetly to an unseen patient, dignified and respectful hemorrhoidal disease counselling.`
  }
];

function falPost(endpointPath, payload, timeoutMs = 240000) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: 'fal.run',
      path: endpointPath,
      method: 'POST',
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
          else reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 300)}`));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('timeout'));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function genImage(prompt) {
  const result = await falPost('/fal-ai/flux-2-pro', {
    prompt,
    image_size: 'landscape_16_9',
    enable_safety_checker: false,
    safety_tolerance: '5',
    output_format: 'jpeg'
  });
  return result.images?.[0]?.url;
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const jobs = [];
  for (const scene of scenes) {
    jobs.push(genImage(scene.opening).then(url => ({ id: scene.id, key: 'es_opening', url })));
    jobs.push(genImage(scene.closing).then(url => ({ id: scene.id, key: 'es_closing', url })));
  }
  const results = await Promise.all(jobs);
  for (const item of results) {
    const scene = manifest.scenes.find(s => s.id === item.id);
    if (scene && item.url) scene[item.key] = item.url;
    console.log(`scene ${item.id} ${item.key}: ${item.url}`);
  }
  manifest.es_generated_at = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
