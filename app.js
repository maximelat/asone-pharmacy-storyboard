/* ════════════════════════════════════════════════════════════════════
   ASONE Storyboard · runtime
   ════════════════════════════════════════════════════════════════════ */

const ASONE = window.ASONE_DATA;

let CURRENT_CAST = 'default'; // 'default' (EN · Amina) | 'es' (Sofia)
let MANIFEST = { scenes: [], hero_video: null };

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function commentKey(sceneId) {
  const cast = CURRENT_CAST === 'es' ? 'es' : 'en';
  return `asone-scene-comment-v2:${cast}:scene-${sceneId}`;
}

function storedComment(sceneId) {
  try {
    return localStorage.getItem(commentKey(sceneId)) || '';
  } catch (_) {
    return '';
  }
}

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
    const openingSrc = imgFor(c.id, 'opening');
    const closingSrc = imgFor(c.id, 'closing');
    const capOpen = `Opening — ${c.scriptRef}`;
    const capClose = 'Closing';
    const savedComment = escapeHtml(storedComment(c.id));
    return `
<details class="scene" id="chapter-${c.id}">
  <summary class="scene-summary">
    <span class="scene-marker">SCENE ${String(c.id).padStart(2,'0')}</span>
    <span class="scene-summary-copy">
      <span class="scene-tag">${c.tag} · ${lang.toUpperCase()}</span>
      <strong>${title}</strong>
      <small>${h.label} · ${h.bio}</small>
    </span>
    <span class="scene-summary-action">Ouvrir la scène</span>
  </summary>
  <div class="scene-body">
    <div class="scene-media-column">
      <div class="scene-carousel" data-scene-id="${c.id}" aria-label="Scene ${c.id} opening and closing frames">
        <div class="scene-carousel-viewport">
          <img class="scene-carousel-slide" src="${openingSrc}" alt="Scene ${c.id} opening" data-caption="${escapeHtml(capOpen)}" loading="lazy">
          <img class="scene-carousel-slide" src="${closingSrc}" alt="Scene ${c.id} closing" data-caption="${escapeHtml(capClose)}" hidden loading="lazy">
        </div>
        <div class="scene-carousel-bar">
          <button type="button" class="carousel-btn" data-carousel-prev aria-label="Image précédente">←</button>
          <p class="carousel-caption" aria-live="polite">${escapeHtml(capOpen)}</p>
          <button type="button" class="carousel-btn" data-carousel-next aria-label="Image suivante">→</button>
        </div>
        <p class="carousel-hint">Ouvrez la scène, puis utilisez les flèches pour passer d’une image à l’autre.</p>
      </div>
      <details class="scene-comments">
        <summary>Commentaires — scène ${String(c.id).padStart(2,'0')}</summary>
        <div class="scene-comments-body">
          <textarea class="scene-comment-input" data-comment-key="${commentKey(c.id)}" placeholder="Notes médicales / créa / localisation pour cette scène…">${savedComment}</textarea>
          <div class="comments-actions">
            <button class="tb-btn" data-copy-comment="${commentKey(c.id)}">Copier</button>
            <button class="tb-btn danger" data-clear-comment="${commentKey(c.id)}">Effacer</button>
            <span class="comment-status" data-comment-status="${commentKey(c.id)}"></span>
          </div>
        </div>
      </details>
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
      <div class="refs-title">Références (selon la liste du script)</div>
      ${c.refs.map(r => `<div class="refs-row"><span>${r.text}</span></div>`).join('')}
    </div>
    <div class="takeaway"><b>Take-home</b>${tk}</div>
    <div style="margin-top:14px"><span class="meta-pill acc">${c.accSlot}</span></div>
  </div>
  </div>
</details>`;
  }).join('');
  setupSceneCarousels();
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

// ─── 6. render hero — single character reference per cast (EN / ES)
function renderHero() {
  const p = document.getElementById('heroPoster');
  const selectedId = CURRENT_CAST === 'es' ? 'sofia' : 'amina';
  const ch = ASONE.CHARACTERS.find((x) => x.id === selectedId);
  if (p && ch) {
    p.src = ch.src;
    p.alt = `${ch.name} — fiche de référence (${ch.label})`;
  }
}

function setupSceneCarousels() {
  document.querySelectorAll('.scene-carousel').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('.scene-carousel-slide'));
    const cap = root.querySelector('.carousel-caption');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    let idx = 0;

    function render() {
      slides.forEach((img, i) => {
        img.hidden = i !== idx;
      });
      const text = slides[idx]?.dataset.caption || '';
      if (cap) cap.textContent = text;
    }

    prev?.addEventListener('click', (e) => {
      e.preventDefault();
      idx = (idx - 1 + slides.length) % slides.length;
      render();
    });
    next?.addEventListener('click', (e) => {
      e.preventDefault();
      idx = (idx + 1) % slides.length;
      render();
    });

    render();
  });
}

// ─── 7. polish footer date ─────────────────────────────────────────
function patchFooter() {
  const d = new Date();
  const el = document.getElementById('buildDate');
  if (el) el.textContent = d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function setupComments() {
  document.addEventListener('input', (event) => {
    const input = event.target.closest?.('.scene-comment-input');
    if (!input) return;
    const key = input.dataset.commentKey;
    try {
      localStorage.setItem(key, input.value);
    } catch (_) {}
    const status = document.querySelector(`[data-comment-status="${key}"]`);
    if (status) status.textContent = 'Enregistré localement';
  });

  document.addEventListener('click', async (event) => {
    const copy = event.target.closest?.('[data-copy-comment]');
    const clear = event.target.closest?.('[data-clear-comment]');
    if (!copy && !clear) return;
    const key = copy?.dataset.copyComment || clear?.dataset.clearComment;
    const input = document.querySelector(`.scene-comment-input[data-comment-key="${key}"]`);
    const status = document.querySelector(`[data-comment-status="${key}"]`);

    if (copy) {
      await navigator.clipboard.writeText(input?.value || '');
      if (status) status.textContent = 'Copié';
      return;
    }

    if (input) input.value = '';
    try {
      localStorage.removeItem(key);
    } catch (_) {}
    if (status) status.textContent = 'Effacé';
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

  setInterval(async () => {
    try {
      const r = await fetch('assets/manifest.json', { cache: 'no-store' });
      if (r.ok) {
        const next = await r.json();
        if (JSON.stringify(next) !== JSON.stringify(MANIFEST)) {
          MANIFEST = next;
          renderScenes();
          renderHero();
        }
      }
    } catch (_) {}
  }, 20000);
}

document.addEventListener('DOMContentLoaded', boot);
