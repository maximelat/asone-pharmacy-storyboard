/* ════════════════════════════════════════════════════════════════════
   ASONE Storyboard · runtime
   ════════════════════════════════════════════════════════════════════ */

const ASONE = window.ASONE_DATA;

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

function videoFor(sceneId, kind) {
  if (kind !== 'opening') return null;
  const s = MANIFEST.scenes?.find(x => x.id === sceneId);
  return s?.opening_video?.url || null;
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
  renderCharacters();
  renderHero();
}

// ─── 3. host helper ────────────────────────────────────────────────
function getHost(hostKey) {
  return CURRENT_CAST === 'es' ? ASONE.HOSTS_ES[hostKey] : ASONE.HOSTS[hostKey];
}

// ─── 4. render developed scenes ────────────────────────────────────
function renderScenes() {
  const root = document.getElementById('scenes-root');
  const lang = CURRENT_CAST === 'es' ? 'es' : 'en';
  root.innerHTML = ASONE.CHAPTERS.map((c) => {
    const h = getHost(c.host);
    const vo = lang === 'es' ? (c.voES || c.voEN) : c.voEN;
    const title = c.title[lang] || c.title.en;
    const tk = c.takeaway[lang] || c.takeaway.en;
    const openingVideo = videoFor(c.id, 'opening');
    return `
<article class="scene" id="chapter-${c.id}">
  <div class="scene-marker">SCENE ${String(c.id).padStart(2,'0')}</div>
  <div class="scene-frames">
    <div class="scene-frame">
      ${openingVideo
        ? `<video class="scene-video" src="${openingVideo}" poster="${imgFor(c.id, 'opening')}" muted loop playsinline autoplay></video>`
        : `<img loading="lazy" src="${imgFor(c.id, 'opening')}" alt="Scene ${c.id} opening frame">`}
      <span class="frame-label">▶ Opening${openingVideo ? ' animation' : ''} — ${c.scriptRef}</span>
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
    ${c.asOneCharter ? renderAsOneCharter() : ''}
    <div class="refs">
      <div class="refs-title">Sources cited exactly from the script reference list</div>
      ${c.refs.map(r => `<div class="refs-row"><span>${r.text}</span></div>`).join('')}
    </div>
    <div class="takeaway"><b>Take-home</b>${tk}</div>
    <div style="margin-top:14px"><span class="meta-pill acc">${c.accSlot}</span></div>
  </div>
</article>`;
  }).join('');
}

function renderAsOneCharter() {
  return `
    <div class="asone-card">
      <div class="asone-title">As One visual charter for this module</div>
      <div class="asone-grid">
        <span><b>Navy</b>#24226a</span>
        <span><b>Tangerine</b>#f55b41</span>
        <span><b>White</b>#ffffff</span>
        <span><b>Structure</b>Educate · Empower · Engage</span>
        <span><b>Rule</b>Respect Rx · no counter-switching</span>
        <span><b>Footnotes</b>Frame-level references</span>
      </div>
    </div>`;
}

function renderCharacters() {
  const root = document.getElementById('characters-root');
  if (!root) return;
  root.innerHTML = ASONE.CHARACTERS.map(c => `
    <article class="character-card">
      <img src="${c.src}" alt="${c.name} four-angle reference sheet" loading="lazy">
      <div class="character-meta">
        <span>${c.label}</span>
        <strong>${c.name}</strong>
        <small>${c.note}</small>
      </div>
    </article>
  `).join('');
}

// ─── 5. render blurred chapters ────────────────────────────────────
function renderBlurred() {
  const root = document.getElementById('blurred-root');
  const lang = CURRENT_CAST === 'es' ? 'es' : 'en';
  root.innerHTML = ASONE.BLURRED.map(b => {
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
  const el = document.getElementById('buildDate');
  if (el) el.textContent = d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function setupComments() {
  const ta = document.getElementById('reviewComments');
  if (!ta) return;
  const key = 'asone-review-comments-v1';
  const status = document.getElementById('commentsStatus');
  ta.value = localStorage.getItem(key) || '';
  ta.addEventListener('input', () => {
    localStorage.setItem(key, ta.value);
    if (status) status.textContent = 'Saved locally';
  });
  document.getElementById('copyComments')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(ta.value || '');
    if (status) status.textContent = 'Copied';
  });
  document.getElementById('clearComments')?.addEventListener('click', () => {
    ta.value = '';
    localStorage.removeItem(key);
    if (status) status.textContent = 'Cleared';
  });
}

// ─── 8. boot ───────────────────────────────────────────────────────
async function boot() {
  await loadManifest();
  document.querySelectorAll('.cs-btn').forEach(b => {
    b.addEventListener('click', () => setCast(b.dataset.cast));
  });
  setCast('default');
  patchFooter();
  setupComments();
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
