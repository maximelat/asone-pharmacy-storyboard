/* ════════════════════════════════════════════════════════════════════
   ASONE Storyboard · runtime
   ════════════════════════════════════════════════════════════════════ */

const { CHAPTERS, BLURRED, HOSTS, HOSTS_ES } = window.ASONE_DATA;

let CURRENT_CAST = 'default'; // 'default' (EN · 4 hosts) | 'es' (Sofia)
let MANIFEST = { scenes: [], hero_video: null };

// ─── 1. load image manifest ────────────────────────────────────────
async function loadManifest() {
  try {
    const r = await fetch('assets/manifest.json', { cache: 'no-store' });
    if (r.ok) MANIFEST = await r.json();
  } catch (e) {
    console.warn('manifest.json not loaded — using fallbacks', e);
  }
}

function imgFor(sceneId, kind) {
  const s = MANIFEST.scenes?.find(x => x.id === sceneId);
  if (CURRENT_CAST === 'es' && s?.[`es_${kind}`]) return s[`es_${kind}`];
  if (s?.[kind]) return s[kind];
  // Fallback : a single placeholder gradient SVG
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2324226a'/><stop offset='1' stop-color='%23f55b41'/></linearGradient></defs><rect width='800' height='450' fill='url(%23g)'/><text x='50%25' y='50%25' fill='%23fff' text-anchor='middle' font-family='Inter,sans-serif' font-size='22' font-weight='600'>Scene ${sceneId} · ${kind}</text></svg>`)}`;
}

// ─── 2. cast switch (EN ↔ ES) ──────────────────────────────────────
function setCast(cast) {
  CURRENT_CAST = cast;
  document.querySelector('.cast-switch').setAttribute('data-current', cast);
  document.querySelectorAll('.cs-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cast === cast);
  });
  document.documentElement.setAttribute('data-cast', cast);
  renderScenes();
  renderBlurred();
  renderHero();
}

// ─── 3. host helper ────────────────────────────────────────────────
function getHost(hostKey) {
  return CURRENT_CAST === 'es' ? HOSTS_ES[hostKey] : HOSTS[hostKey];
}

// ─── 4. render developed scenes ────────────────────────────────────
function renderScenes() {
  const root = document.getElementById('scenes-root');
  const lang = CURRENT_CAST === 'es' ? 'es' : 'en';
  root.innerHTML = CHAPTERS.map((c, i) => {
    const h = getHost(c.host);
    const vo = lang === 'es' ? (c.voES || c.voEN) : c.voEN;
    const title = c.title[lang] || c.title.en;
    const tk = c.takeaway[lang] || c.takeaway.en;
    return `
<article class="scene" id="chapter-${c.id}">
  <div class="scene-frames">
    <div class="scene-frame">
      <img loading="lazy" src="${imgFor(c.id, 'opening')}" alt="Scene ${c.id} opening frame">
      <span class="frame-label">▶ Opening — ${c.scriptRef}</span>
    </div>
    <div class="scene-frame">
      <img loading="lazy" src="${imgFor(c.id, 'closing')}" alt="Scene ${c.id} closing frame">
      <span class="frame-label">⏹ Closing</span>
    </div>
  </div>
  <div class="scene-copy">
    <span class="scene-num">${String(c.id).padStart(2,'0')}</span>
    <span class="scene-tag">${c.tag} · ${lang.toUpperCase()}</span>
    <h3 class="scene-title">${title}</h3>
    <div class="scene-host">
      <span class="host-avatar">${h.initials}</span>
      <span>Host · <strong>${h.label}</strong> · ${h.bio}</span>
    </div>
    <p class="vo-block">${vo}</p>
    <div class="scene-meta-row">
      ${c.pills.map(p => `<span class="meta-pill ${p.includes('GENIALLY')||p.includes('RISE')||p.includes('HEYGEN')?'acc':''}">${p}</span>`).join('')}
    </div>
    <div class="refs">
      <div class="refs-title">Sources shown for medical approval</div>
      ${c.refs.map(r => `<div class="refs-row"><span class="refs-tag">[${r.tag}]</span><span>${r.text}</span></div>`).join('')}
    </div>
    <div class="takeaway"><b>Take-home</b>${tk}</div>
    <div style="margin-top:14px"><span class="meta-pill acc">${c.accSlot}</span></div>
  </div>
</article>`;
  }).join('');
}

// ─── 5. render blurred chapters ────────────────────────────────────
function renderBlurred() {
  const root = document.getElementById('blurred-root');
  const lang = CURRENT_CAST === 'es' ? 'es' : 'en';
  root.innerHTML = BLURRED.map(b => {
    const h = getHost(b.host);
    const title = b.title[lang] || b.title.en;
    return `
<div class="blurred-card">
  <div class="bc-num">${String(b.id).padStart(2,'0')}</div>
  <div class="bc-title">${title}</div>
  <div class="bc-host">${h.label} — ${h.bio}</div>
  <div class="bc-vo">${b.vo}</div>
  <div class="bc-pending"><span>● ${b.badge}</span><span>${lang.toUpperCase()}</span></div>
</div>`;
  }).join('');
}

// ─── 6. render hero (poster from scene 1, then video swap when ready)
function renderHero() {
  const v = document.getElementById('heroVideo');
  const p = document.getElementById('heroPoster');
  const poster = imgFor(1, 'opening');
  p.src = poster;
  if (CURRENT_CAST !== 'es' && MANIFEST.hero_video?.url) {
    v.src = MANIFEST.hero_video.url;
    v.poster = poster;
    v.style.display = 'block';
    p.style.display = 'none';
    v.play().catch(()=>{});
  } else {
    v.style.display = 'none';
    p.style.display = 'block';
  }
}

// ─── 7. polish footer date ─────────────────────────────────────────
function patchFooter() {
  const d = new Date();
  document.body.innerHTML = document.body.innerHTML.replace(
    '{{DATE}}',
    d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
  );
}

// ─── 8. boot ───────────────────────────────────────────────────────
async function boot() {
  await loadManifest();
  document.querySelectorAll('.cs-btn').forEach(b => {
    b.addEventListener('click', () => setCast(b.dataset.cast));
  });
  setCast('default');
  patchFooter();
  // re-bind scene anchors
  document.querySelectorAll('.scene-tag, .scene-title').forEach(el => {});

  // Re-poll manifest every 20s in case the video finishes generating in background
  setInterval(async () => {
    try {
      const r = await fetch('assets/manifest.json', { cache: 'no-store' });
      if (r.ok) {
        const next = await r.json();
        if (JSON.stringify(next) !== JSON.stringify(MANIFEST)) {
          MANIFEST = next;
          renderHero();
          renderScenes();
        }
      }
    } catch (_) {}
  }, 20000);
}

document.addEventListener('DOMContentLoaded', boot);
