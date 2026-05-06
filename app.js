/* ════════════════════════════════════════════════════════════════════
   ASONE Storyboard · runtime
   ════════════════════════════════════════════════════════════════════ */

const ASONE = window.ASONE_DATA;

let CURRENT_CAST = 'default'; // 'default' (EN · Amina) | 'es' (Sofia)
let MANIFEST = { scenes: [], hero_video: null };

/** @type {{ src: string, caption: string, kind?: 'image' | 'video', poster?: string }[]} */
let LIGHTBOX_DECK = [];
let lightboxIndex = 0;

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

/** Vidéo charter scène 2 (manifest) — EN ou ES selon le cast */
function openingVideoUrl(sceneId) {
  if (sceneId !== 2) return null;
  const s = MANIFEST.scenes?.find((x) => x.id === sceneId);
  if (!s) return null;
  if (CURRENT_CAST === 'es' && s.es_opening_video?.url) return s.es_opening_video.url;
  return s.opening_video?.url || null;
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
  LIGHTBOX_DECK = [];
  root.innerHTML = ASONE.CHAPTERS.map((c) => {
    const h = getHost(c.host);
    const vo = lang === 'es' ? (c.voES || c.voEN) : c.voEN;
    const title = c.title[lang] || c.title.en;
    const tk = c.takeaway[lang] || c.takeaway.en;
    const openingSrc = imgFor(c.id, 'opening');
    const closingSrc = imgFor(c.id, 'closing');
    const capOpen = `Début — ${c.scriptRef}`;
    const capClose = 'Fin';
    const openingVideo = openingVideoUrl(c.id);

    const idxOpen = LIGHTBOX_DECK.length;
    if (openingVideo && c.id === 2) {
      LIGHTBOX_DECK.push({
        src: openingVideo,
        caption: `Scène ${String(c.id).padStart(2, '0')} · ${capOpen}`,
        kind: 'video',
        poster: openingSrc,
      });
    } else {
      LIGHTBOX_DECK.push({
        src: openingSrc,
        caption: `Scène ${String(c.id).padStart(2, '0')} · ${capOpen}`,
        kind: 'image',
      });
    }
    const idxClose = LIGHTBOX_DECK.length;
    LIGHTBOX_DECK.push({
      src: closingSrc,
      caption: `Scène ${String(c.id).padStart(2, '0')} · ${capClose}`,
      kind: 'image',
    });

    const openingFigureHtml =
      openingVideo && c.id === 2
        ? `<figure class="scene-frame-block scene-frame-block--video">
        <div class="scene-video-shell">
          <video class="scene-inline-video" src="${escapeHtml(openingVideo)}" poster="${openingSrc}" controls playsinline muted loop autoplay></video>
        </div>
        <button type="button" class="scene-video-lightbox-hit" data-lightbox-idx="${idxOpen}" aria-label="Plein écran début scène 2">Plein écran</button>
        <figcaption class="scene-frame-cap">${escapeHtml(capOpen)}</figcaption>
      </figure>`
        : `<figure class="scene-frame-block">
        <button type="button" class="scene-thumb" data-lightbox-idx="${idxOpen}" aria-label="Agrandir image début scène ${c.id}">
          <img src="${openingSrc}" alt="Scène ${c.id} début" loading="lazy" width="800" height="450">
        </button>
        <figcaption class="scene-frame-cap">${escapeHtml(capOpen)}</figcaption>
      </figure>`;

    const savedComment = escapeHtml(storedComment(c.id));
    return `
<details class="scene" id="chapter-${c.id}" open>
  <summary class="scene-summary">
    <span class="scene-marker">SCENE ${String(c.id).padStart(2,'0')}</span>
    <span class="scene-summary-copy">
      <span class="scene-tag">${c.tag} · ${lang.toUpperCase()}</span>
      <strong>${title}</strong>
      <small>${h.label} · ${h.bio}</small>
    </span>
    <span class="scene-summary-action"><span class="lbl-when-open">Réduire la scène</span><span class="lbl-when-closed">Ouvrir la scène</span></span>
  </summary>
  <div class="scene-body">
    <div class="scene-media-column">
      <div class="scene-frames-stack" data-scene-id="${c.id}">
        ${openingFigureHtml}
        <figure class="scene-frame-block">
          <button type="button" class="scene-thumb" data-lightbox-idx="${idxClose}" aria-label="Agrandir image fin scène ${c.id}">
            <img src="${closingSrc}" alt="Scène ${c.id} fin" loading="lazy" width="800" height="450">
          </button>
          <figcaption class="scene-frame-cap">${escapeHtml(capClose)}</figcaption>
        </figure>
      </div>
      <p class="frames-hint">Cliquez sur une image pour l’ouvrir en grand et naviguer dans tout le storyboard (← → ou échap).</p>
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

function showLightboxAt(idx) {
  const panel = document.getElementById('storyboard-lightbox');
  const img = document.getElementById('lightbox-image');
  const vid = document.getElementById('lightbox-video');
  const cap = document.getElementById('lightbox-caption');
  const counter = document.getElementById('lightbox-counter');
  if (!LIGHTBOX_DECK.length || !panel || !img || !vid || !cap || !counter) return;
  lightboxIndex = ((idx % LIGHTBOX_DECK.length) + LIGHTBOX_DECK.length) % LIGHTBOX_DECK.length;
  const item = LIGHTBOX_DECK[lightboxIndex];
  cap.textContent = item.caption;
  counter.textContent = `${lightboxIndex + 1} / ${LIGHTBOX_DECK.length}`;

  if (item.kind === 'video') {
    img.hidden = true;
    img.removeAttribute('src');
    vid.hidden = false;
    vid.src = item.src;
    if (item.poster) vid.setAttribute('poster', item.poster);
    else vid.removeAttribute('poster');
    vid.play().catch(() => {});
  } else {
    vid.pause();
    vid.removeAttribute('src');
    vid.hidden = true;
    img.hidden = false;
    img.src = item.src;
    img.alt = item.caption;
  }
  panel.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const panel = document.getElementById('storyboard-lightbox');
  const vid = document.getElementById('lightbox-video');
  if (vid) {
    vid.pause();
    vid.removeAttribute('src');
  }
  if (panel) panel.hidden = true;
  document.body.style.overflow = '';
}

function setupLightbox() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-lightbox-idx]');
    if (trigger) {
      e.preventDefault();
      showLightboxAt(parseInt(trigger.getAttribute('data-lightbox-idx'), 10));
      return;
    }
    if (e.target.closest('[data-lightbox-close]')) {
      closeLightbox();
    }
  });

  document.getElementById('lightbox-prev')?.addEventListener('click', (e) => {
    e.preventDefault();
    showLightboxAt(lightboxIndex - 1);
  });
  document.getElementById('lightbox-next')?.addEventListener('click', (e) => {
    e.preventDefault();
    showLightboxAt(lightboxIndex + 1);
  });

  document.addEventListener('keydown', (e) => {
    const panel = document.getElementById('storyboard-lightbox');
    if (!panel || panel.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxAt(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxAt(lightboxIndex + 1);
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
  setupLightbox();

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
