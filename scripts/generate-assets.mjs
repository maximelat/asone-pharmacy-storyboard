#!/usr/bin/env node
/**
 * Generate 10 cinematic images (5 scenes × opening + closing) via FAL,
 * then 1 cinematic Seedance 2.0 reel for the hero block.
 *
 * Style: MasterClass.com × Santé Académie — luxe, golden hour,
 * editorial documentary, navy + tangerine Servier As One palette.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT = path.join(__dirname, '..', 'assets', 'manifest.json');

const FAL_KEY = process.env.FAL_API_KEY;
if (!FAL_KEY) {
  console.error('❌ FAL_API_KEY missing. export FAL_API_KEY=...');
  process.exit(1);
}

// ────────────────────────────────────────────────────────────────────────
// Cinematic look reused across every prompt
// ────────────────────────────────────────────────────────────────────────
const LOOK = `Cinematic ultra-realistic editorial photograph, MasterClass.com premium documentary style, shot on ARRI Alexa 65 with anamorphic 65mm lens, shallow depth of field, soft golden-hour ambient light through tall windows, warm amber practical lights, brushed brass and walnut wood, navy #24226a and tangerine #f55b41 accent palette woven subtly into wardrobe and props, museum-grade pharmacy training studio, no logos, no watermark, no text overlay, 16:9, 4K, intimate Vogue Health editorial mood, cinematic colour grading teal-and-amber, polished but warm, Servier As One`;

// 5 hosts spec — FOUR multicultural hosts present in every scene by default
const HOSTS = `four pharmacist hosts in their 30s standing/seated together: Amina (African woman, warm smile, white coat over emerald silk blouse), David (European man, silver-rimmed glasses, navy three-piece suit), Kai (East Asian man, charcoal turtleneck under tailored coat), Sofia (Hispanic Latina woman, hazel eyes, ivory blouse). Skin tones natural, ages 32-38, professional yet approachable, magnetic eye contact with camera`;

// Final 5 scene pairs (opening + closing).
// Each closing must visually rhyme with the opening to suggest narrative arc.
const SCENES = [
  {
    id: 1, slug: 'welcome',
    opening: `${LOOK}. Wide medium shot. ${HOSTS}. They stand in a luxurious modern pharmacy training studio: floor-to-ceiling glass overlooking a city at golden hour, brushed brass apothecary shelves, walnut counter, soft amber library light. They smile gently toward camera, magnetic warmth, like the cover frame of a MasterClass series. Frame leaves negative space top-right for chapter title.`,
    closing: `${LOOK}. Close-up tighter shot of the same four hosts now grouped close, hands resting on a walnut counter holding an open hard-cover scientific binder. Subtle navy + tangerine highlight through silk pocket squares. Same studio. Cinematic intimate moment, like the closing tease of a documentary trailer.`,
  },
  {
    id: 2, slug: 'global',
    opening: `${LOOK}. Cinematic wide shot of an old-world cartographic studio: a vast antique world map on parchment lit by a single warm lamp, brass globe, vintage pharmaceutical packaging from Russia / Spain / Brazil / Philippines / Portugal arranged like museum exhibits, navy + tangerine ribbons threaded between continents. No people. Mood: museum at night, history unfolding.`,
    closing: `${LOOK}. Same antique studio, now ${HOSTS} appear in profile silhouettes against the glowing world map, looking out, embodying the global Daflon and As One story. Silver-blue rim light, golden lamp, intimate but epic.`,
  },
  {
    id: 3, slug: 'venous-physiology',
    opening: `${LOOK}. Macro hyper-detailed photograph of a polished anatomical sculpture of a human leg cut-away showing veins and valves, displayed under museum spotlight in a marble-and-walnut anatomy theatre. Subtle red-blue translucent resin reveals one-way valves and the muscle pump. No people, no text. Mood: Royal College of Surgeons, hushed reverence.`,
    closing: `${LOOK}. Wide editorial shot inside the same anatomy theatre. David (European host) stands centre, gestures toward a luminous holographic diagram of the venous return system, the three other hosts seated behind in tiered velvet chairs. Bokeh of brass instruments. Frame designed for caption overlay bottom-left.`,
  },
  {
    id: 4, slug: 'cvd',
    opening: `${LOOK}. Editorial close-up of a polished pharmacy counter at golden hour: a patient's calf and ankle elegantly framed (no graphic ulcers), with subtle skin pigmentation, a cashmere sock pulled down, the pharmacist's hand (manicured, French cuff) holding a doppler probe and a guideline booklet titled "CEAP". Walnut counter, brass scale, navy linen drape. Painterly soft focus, no faces, dignified.`,
    closing: `${LOOK}. Wide shot: Sofia (Hispanic host) in foreground at the counter, a 60-year-old female patient (light beige cardigan, soft expression) seated opposite. Sofia's hands point to a cinematic translucent CEAP C0 → C6 progression diagram floating between them like an Apple Vision Pro overlay. Warm amber ambient, navy + tangerine accents, dignified medical interview vibe.`,
  },
  {
    id: 5, slug: 'hemorrhoidal',
    opening: `${LOOK}. Macro shot of a clinical illustration plate from a vintage Servier medical atlas, showing a stylised internal/external hemorrhoidal venous plexus rendered as elegant copperplate engraving in navy ink + single tangerine highlight. Brass paperweight, walnut surface, half-open antique inkwell. NO graphic anatomical photography, only refined vintage illustration. Mood: discreet, scholarly, respectful.`,
    closing: `${LOOK}. Wide shot: Kai (Asian host) seated in a leather club chair under a vintage brass library lamp, leaning forward in conversation with an unseen counterpart whose silhouette suggests a pharmacist in white coat. He holds the same vintage atlas open. Sofa back velvet navy. Frame mood: confidential consultation, no taboo, dignified counsel.`,
  },
];

// Hero video — 10s cinematic teaser using two reference videos
// (we pass two MasterClass-style example videos as references via reference_images)
const HERO_VIDEO_PROMPT = `${LOOK}. 10-second cinematic teaser inspired by MasterClass.com x Santé Académie. Sequence: 0-2s slow push-in on the four pharmacist hosts standing in the luxurious training studio, golden hour, glass walls behind. 2-4s cut to macro of a brass apothecary jar refracting light. 4-6s cut to Sofia (Hispanic Latina) leaning toward a senior female patient at the walnut counter, both smile. 6-8s cut to David turning a translucent hologram diagram of the venous system. 8-10s the four hosts together looking toward camera with quiet conviction, tagline space top-right. Heartbeat sound rising into a warm cinematic strings cue. Anamorphic flares, teal-amber grade. ${HOSTS}.`;

// Two reference videos (MasterClass / Santé Académie style)
const REFERENCE_VIDEOS = [
  // MasterClass AI & Medicine teaser (publicly hosted preview)
  'https://www.masterclass.com/classes/ai-and-medicine',
  // SantéAcademie style anchor
  'https://www.santeacademie.com',
];

// ────────────────────────────────────────────────────────────────────────
// FAL helpers
// ────────────────────────────────────────────────────────────────────────
function falPost(endpointPath, payload, timeoutMs = 240000) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const opts = {
      hostname: 'fal.run',
      path: endpointPath,
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = https.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(json);
          else reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 400)}`));
        } catch (e) { reject(e); }
      });
    });
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function genImage(prompt) {
  // Try gpt-image-2 first (premium photoreal), fallback to flux-2-pro
  try {
    const r = await falPost('/fal-ai/openai/gpt-image-2/text-to-image', {
      prompt,
      image_size: 'landscape_16_9',
      output_format: 'jpeg',
    });
    if (r.images?.[0]) return { url: r.images[0].url, model: 'gpt-image-2' };
  } catch (e) {
    console.warn('   ⚠️ gpt-image-2 fail:', e.message.slice(0, 120));
  }
  try {
    const r = await falPost('/fal-ai/flux-2-pro', {
      prompt,
      image_size: 'landscape_16_9',
      enable_safety_checker: false,
      safety_tolerance: '5',
      output_format: 'jpeg',
    });
    if (r.images?.[0]) return { url: r.images[0].url, model: 'flux-2-pro' };
  } catch (e) {
    console.warn('   ⚠️ flux-2-pro fail:', e.message.slice(0, 120));
  }
  // Final fallback : imagen4 preview
  const r = await falPost('/fal-ai/imagen4/preview', {
    prompt,
    aspect_ratio: '16:9',
  });
  return { url: r.images?.[0]?.url, model: 'imagen4' };
}

async function genVideoSeedance(prompt, startImageUrl, endImageUrl) {
  // Use Seedance 2.0 image-to-video (with end frame) — premium tier
  const payload = {
    prompt,
    image_url: startImageUrl,
    end_image_url: endImageUrl,
    resolution: '1080p',
    duration: 10,
    aspect_ratio: '16:9',
    generate_audio: true,
  };
  console.log('🎬 Seedance 2.0 image-to-video (1080p, 10s, audio)...');
  // Queue the request and poll
  const submit = await falPost('/bytedance/seedance-2.0/image-to-video', payload, 480000);
  return submit;
}

// ────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🎨 ASONE Storyboard — generating 10 cinematic images + 1 hero video');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const manifest = { generated_at: new Date().toISOString(), scenes: [], hero_video: null };

  // Generate images in parallel (5 scenes × 2 = 10 images)
  const tasks = [];
  for (const scene of SCENES) {
    tasks.push(
      genImage(scene.opening).then(r => ({ scene: scene.id, slug: scene.slug, kind: 'opening', ...r }))
    );
    tasks.push(
      genImage(scene.closing).then(r => ({ scene: scene.id, slug: scene.slug, kind: 'closing', ...r }))
    );
  }
  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value?.url) {
      console.log(`   ✅ scene ${r.value.scene} ${r.value.kind} (${r.value.model}) — ${r.value.url.slice(0, 80)}…`);
      const existing = manifest.scenes.find(s => s.id === r.value.scene);
      if (existing) existing[r.value.kind] = r.value.url;
      else manifest.scenes.push({ id: r.value.scene, slug: r.value.slug, [r.value.kind]: r.value.url });
    } else {
      console.error('   ❌', r.reason || r.value);
    }
  }
  manifest.scenes.sort((a, b) => a.id - b.id);

  // Save mid-step manifest now (so the site can already pick up images even if video fails)
  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
  console.log(`📝 manifest saved (${manifest.scenes.length} scenes) → ${OUT}`);

  // Hero video uses scene 1 opening + closing as start/end frames
  const scene1 = manifest.scenes.find(s => s.id === 1);
  if (scene1?.opening && scene1?.closing) {
    try {
      const v = await genVideoSeedance(HERO_VIDEO_PROMPT, scene1.opening, scene1.closing);
      manifest.hero_video = {
        url: v.video?.url || v.data?.video?.url || null,
        seed: v.seed || v.data?.seed || null,
        model: 'bytedance/seedance-2.0/image-to-video',
        prompt: HERO_VIDEO_PROMPT,
      };
      console.log(`   ✅ hero video — ${manifest.hero_video.url}`);
    } catch (e) {
      console.error('   ❌ hero video failed:', e.message);
      manifest.hero_video = { error: e.message };
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2));
  console.log(`🎯 final manifest saved → ${OUT}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
