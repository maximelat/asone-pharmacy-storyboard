# Servier × Stetoo — As One Pharmacy E-Learning · Storyboard

> Cinematic compliance-readiness preview of the **Phase 2 Pharmacy Global E-Learning** by Stetoo for **Servier As One**.
> Built as a single static page deployed on Netlify.

## What's inside

- **Hero trailer** — 10 s cinematic teaser generated with Bytedance **Seedance 2.0** (1080p, audio) via FAL, seeded by 2 reference frames in the MasterClass.com / Santé Académie aesthetic.
- **5 chapters fully developed** (Welcome, Global / Daflon legacy, Venous physiology, Chronic Venous Disease, Hemorrhoidal disease) with EN voice-overs from the 4Choice script and ES translation for Sofia-led cast.
- **5 chapters in soft focus** waiting for the second round of medical approval (Servier Solutions, Pharma Intervention, OTC scenarios, Rx scenarios, Final thoughts).
- **Locked appendix** for references / knowledge assessments / native files.
- **EN ↔ ES cast switch** (default 4-host multicultural cast vs. Spanish single-narrator cast led by Sofia).
- **Alternation** of cinematic Seedance scenes with interactive Genially / Rise Articulate 360 / HeyGen × Seedance 2.0 hybrid blocks.

## Stack

| Layer | Tool |
|-------|------|
| Frontend | Static HTML + vanilla JS + CSS (no build step) |
| Image gen | FAL · Flux 2 Pro (10 cinematic stills @ 1024×576) |
| Video gen | FAL · Bytedance Seedance 2.0 image-to-video (1080p · 10 s · audio) |
| Hosting | Netlify (static) |
| Inspiration | MasterClass.com · SantéAcadémie.fr |

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Re-generating assets

```bash
export FAL_API_KEY="<your fal key>"
node scripts/generate-assets.mjs
# → writes assets/manifest.json
```

## Deploy to Netlify

```bash
netlify init   # link or create site
netlify deploy --prod
```

## License

Confidential — created by **Stetoo** for the **Servier As One Pharmacy E-Learning · Phase 2** tender (May 2026). Not for redistribution.
