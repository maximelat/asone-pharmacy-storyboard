#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets', 'gpt-image2-v2');
const manifestPath = path.join(root, 'assets', 'manifest.json');

const charterRef =
  '/Users/openclaw/.cursor/projects/Users-openclaw-openclaw/assets/Capture_d_e_cran_2026-05-01_a__21.03.03-aae0f3b1-c3c0-4f8d-a68c-13feea8d5971.png';

const characters = {
  en: {
    name: 'Amina',
    file: path.join(root, 'assets', 'characters', 'amina-global-reference.png'),
    description:
      'Amina, African female pharmacist, 34 years old, short natural textured hair, natural deep brown skin, warm confident smile, white pharmacist coat over emerald blouse. Use her as the single recurring English/global host.',
  },
  es: {
    name: 'Sofia',
    file: path.join(root, 'assets', 'characters', 'sofia-hispanic-reference.png'),
    description:
      'Sofia, Hispanic Latina / Spanish female pharmacist, 35 years old, hazel eyes, dark hair in a neat low bun, ivory blouse under navy tailored blazer with subtle tangerine detail. Use her as the single recurring Spanish/Hispanic host.',
  },
};

const scenes = [
  {
    id: 1,
    slug: 'welcome',
    opening:
      'Premium compliance-ready opening frame in a modern pharmacy training studio. The protagonist stands alone at a walnut counter, direct but natural eye contact, confident and welcoming. Behind her, a large matte navy training wall contains subtle As One ribbon lines as part of the interior design, not a UI overlay. Soft morning light, realistic skin texture, no other hosts, no fake logos.',
    closing:
      'The same protagonist closes a navy As One training binder at the walnut counter, gentle smile, cinematic but credible e-learning look. The coloured As One ribbons appear as a tasteful wall motif and reflection in the glass, reinforcing the storyboard colour system. No other hosts, no staged group shot, no product claims.',
  },
  {
    id: 2,
    slug: 'global',
    opening:
      'Scene "A 55-year story across 17 languages". Use the uploaded As One brand guide as the visual source: a dark navy brand wall with interwoven blue, red, green, yellow and orange ribbon paths, now transformed into a premium healthcare training room with a subtle dotted world map. The protagonist is seen from behind/three-quarter, studying the wall. Hyper-realistic, refined, not a flat graphic.',
    closing:
      'The protagonist in profile beside the same As One world-map wall. The coloured ribbons arc across countries like global learning routes, with soft glowing nodes for Russia, Spain, Brazil, Philippines and Portugal. One person only, consistent identity, museum-grade lighting, Servier navy and coral palette, compliance-safe.',
  },
  {
    id: 3,
    slug: 'venous-physiology',
    opening:
      'The protagonist presents a premium anatomical teaching display: a translucent leg vein-and-valve sculpture on a walnut table. The As One ribbon colours are subtly mapped into the educational light paths showing venous return, inspired by the brand guide. Hyper-realistic macro detail, no gore, no extra people.',
    closing:
      'The protagonist gestures toward a luminous venous return wall diagram. The line animation design echoes the As One coloured ribbons, with blue/red/green/orange curves moving across the navy wall as scientific pathways. Cinematic anatomy academy, one recurring host only, realistic hands and face.',
  },
  {
    id: 4,
    slug: 'cvd',
    opening:
      'A dignified pharmacy counter counselling setup. The protagonist reviews a CEAP booklet and lifestyle checklist with a patient just out of focus, no graphic lesions. The room uses Servier navy, coral and As One ribbon accents on folders, divider lines and wall art. Hyper-realistic healthcare editorial, discreet and human.',
    closing:
      'The protagonist sits opposite an older patient at a walnut counter. Between them, a transparent CEAP C0 to C6 educational tablet uses the As One ribbon colour system as navigation paths. One main host, patient secondary and softly framed, no dramatic face-camera group shot, compliance-safe.',
  },
  {
    id: 5,
    slug: 'hemorrhoidal',
    opening:
      'A discreet scholarly consultation frame: vintage medical atlas on a walnut desk, showing only a tasteful abstract venous plexus illustration, not graphic anatomy. The As One ribbon motif appears as coloured bookmark ribbons and page dividers. The protagonist hand enters frame turning the page, refined and respectful.',
    closing:
      'The protagonist in a quiet private consultation room under a brass library lamp, speaking discreetly with an unseen patient. The same atlas lies open; navy wall panels include subtle As One coloured ribbons as part of the room design. One recurring host only, calm, realistic, no taboo imagery.',
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateImage({ variant, scene, kind, prompt, outFile }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY manquant');

  const character = characters[variant];
  const [characterBytes, charterBytes] = await Promise.all([
    fs.readFile(character.file),
    fs.readFile(charterRef),
  ]);

  const form = new FormData();
  form.set('model', 'gpt-image-2');
  form.set('size', '1536x1024');
  form.set('quality', 'high');
  form.set('n', '1');
  form.set(
    'prompt',
    `Create a hyper-realistic 16:9 storyboard frame for Servier As One Pharmacy E-Learning Phase 2.
Use reference image 1 only for the protagonist's identity and wardrobe consistency. Do not reproduce the character-sheet layout or labels.
Use reference image 2 as the As One brand-guide visual language: dark navy background, flowing coloured ribbon lines, healthcare-compliance feel.

Variant: ${variant.toUpperCase()}.
Recurring protagonist: ${character.description}
Scene ${String(scene.id).padStart(2, '0')} ${kind}: ${prompt}

Style: premium MasterClass / Santé Académie healthcare training, naturalistic documentary lighting, credible pharmacy or medical academy environment, realistic skin texture, no uncanny avatar look, no group face-camera tableau, no unrelated people, no fake product logos, no promotional claims, no watermark.
Composition must read well when cropped into a 16:9 website card.`
  );
  form.append('image[]', new Blob([characterBytes], { type: 'image/png' }), `${character.name}-reference.png`);
  form.append('image[]', new Blob([charterBytes], { type: 'image/png' }), 'asone-brand-guide.png');

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || `OpenAI image edit error ${res.status}`);
  }
  const row = json?.data?.[0];
  let image;
  if (row?.b64_json) image = Buffer.from(row.b64_json, 'base64');
  else if (row?.url) {
    const img = await fetch(row.url);
    if (!img.ok) throw new Error(`Image download failed ${img.status}`);
    image = Buffer.from(await img.arrayBuffer());
  } else {
    throw new Error('OpenAI image edit response without image');
  }
  await fs.writeFile(outFile, image);
}

async function main() {
  await loadEnv();
  await fs.mkdir(outDir, { recursive: true });
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

  const jobs = [];
  for (const scene of scenes) {
    for (const variant of ['en', 'es']) {
      for (const kind of ['opening', 'closing']) {
        const file = `scene-${String(scene.id).padStart(2, '0')}-${variant}-${kind}.png`;
        jobs.push({
          scene,
          variant,
          kind,
          prompt: scene[kind],
          outFile: path.join(outDir, file),
          manifestPath: `assets/gpt-image2-v2/${file}`,
        });
      }
    }
  }

  console.log(`Generating ${jobs.length} images with OpenAI gpt-image-2 high (max requested: 20)`);
  for (let i = 0; i < jobs.length; i += 1) {
    const job = jobs[i];
    console.log(`[${i + 1}/${jobs.length}] scene ${job.scene.id} ${job.variant} ${job.kind}`);
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        await generateImage(job);
        break;
      } catch (error) {
        if (attempt === 2) throw error;
        console.warn(`Retrying after error: ${error.message}`);
        await sleep(5000);
      }
    }
    const sceneRow = manifest.scenes.find((item) => item.id === job.scene.id);
    const key = job.variant === 'en' ? job.kind : `es_${job.kind}`;
    sceneRow[key] = job.manifestPath;
    sceneRow.gpt_image2_v2 = {
      model: 'openai/gpt-image-2',
      endpoint: 'images/edits',
      quality: 'high',
      count: 20,
      character_logic: 'EN=Amina, ES=Sofia',
      charter_reference: path.basename(charterRef),
      generated_at: new Date().toISOString(),
    };
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }
  console.log('Done. Manifest updated.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
