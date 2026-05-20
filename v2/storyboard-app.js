/* Storyboard V2 · runtime (assets parent ../) */

const ASONE = window.ASONE_DATA;
const ASSET_PREFIX = '../';

let CURRENT_CAST = 'default';
let MANIFEST = { scenes: [], hero_video: null };
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
  return window.ASONE_EXPORT_UTILS.commentKey(sceneId, CURRENT_CAST);
}

function storedComment(sceneId) {
  return window.ASONE_EXPORT_UTILS.storedComment(sceneId, CURRENT_CAST);
}

async function loadManifest() {
  try {
    const r = await fetch(`${ASSET_PREFIX}assets/manifest.json`, { cache: 'no-store' });
    if (r.ok) MANIFEST = await r.json();
  } catch (e) {
    console.warn('manifest.json not loaded', e);
  }
}

function imgFor(sceneId, kind) {
  const s = MANIFEST.scenes?.find((x) => x.id === sceneId);
  let path = null;
  if (CURRENT_CAST === 'es' && s?.[`es_${kind}`]) path = s[`es_${kind}`];
  else if (s?.[kind]) path = s[kind];
  if (path) return ASSET_PREFIX + path;
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2324226a'/><stop offset='1' stop-color='%23f55b41'/></linearGradient></defs><rect width='800' height='450' fill='url(%23g)'/><text x='50%25' y='50%25' fill='%23fff' text-anchor='middle' font-family='Inter,sans-serif' font-size='22'>Scene ${sceneId} · ${kind}</text></svg>`)}`;
}

function openingVideoUrl(sceneId) {
  if (sceneId !== 2) return null;
  const s = MANIFEST.scenes?.find((x) => x.id === sceneId);
  if (!s) return null;
  const url = CURRENT_CAST === 'es' && s.es_opening_video?.url ? s.es_opening_video.url : s.opening_video?.url;
  return url || null;
}

function setCast(cast) {
  CURRENT_CAST = cast;
  document.querySelector('.cast-switch')?.setAttribute('data-current', cast);
  document.querySelectorAll('.cs-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.cast === cast);
  });
  document.documentElement.setAttribute('data-cast', cast);
  renderScenes();
  renderBlurred();
  updatePrintMeta();
}

function getHost(hostKey) {
  return CURRENT_CAST === 'es' ? ASONE.HOSTS_ES[hostKey] : ASONE.HOSTS[hostKey];
}

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
      LIGHTBOX_DECK.push({ src: openingVideo, caption: `Scène ${String(c.id).padStart(2, '0')} · ${capOpen}`, kind: 'video', poster: openingSrc });
    } else {
      LIGHTBOX_DECK.push({ src: openingSrc, caption: `Scène ${String(c.id).padStart(2, '0')} · ${capOpen}`, kind: 'image' });
    }
    const idxClose = LIGHTBOX_DECK.length;
    LIGHTBOX_DECK.push({ src: closingSrc, caption: `Scène ${String(c.id).padStart(2, '0')} · ${capClose}`, kind: 'image' });

    const openingFigureHtml =
      openingVideo && c.id === 2
        ? `<figure class="scene-frame-block scene-frame-block--video">
        <div class="scene-video-shell">
          <video class="scene-inline-video" src="${escapeHtml(openingVideo)}" poster="${openingSrc}" controls playsinline muted loop autoplay></video>
        </div>
        <button type="button" class="scene-video-lightbox-hit" data-lightbox-idx="${idxOpen}">Plein écran</button>
        <figcaption class="scene-frame-cap">${escapeHtml(capOpen)}</figcaption>
      </figure>`
        : `<figure class="scene-frame-block">
        <button type="button" class="scene-thumb" data-lightbox-idx="${idxOpen}">
          <img src="${openingSrc}" alt="Scène ${c.id} début" loading="lazy" width="800" height="450">
        </button>
        <figcaption class="scene-frame-cap">${escapeHtml(capOpen)}</figcaption>
      </figure>`;

    const savedComment = escapeHtml(storedComment(c.id));
    const printComment = storedComment(c.id);

    return `
<details class="scene" id="chapter-${c.id}" open data-scene-id="${c.id}">
  <summary class="scene-summary">
    <span class="scene-marker">SCENE ${String(c.id).padStart(2, '0')}</span>
    <span class="scene-summary-copy">
      <span class="scene-tag">${c.tag} · ${lang.toUpperCase()}</span>
      <strong>${title}</strong>
      <small>${h.label} · ${h.bio}</small>
    </span>
    <span class="scene-summary-action no-print"><span class="lbl-when-open">Réduire</span><span class="lbl-when-closed">Ouvrir</span></span>
  </summary>
  <div class="scene-body">
    <div class="scene-media-column">
      <div class="scene-frames-stack">
        ${openingFigureHtml}
        <figure class="scene-frame-block">
          <button type="button" class="scene-thumb" data-lightbox-idx="${idxClose}">
            <img src="${closingSrc}" alt="Scène ${c.id} fin" loading="lazy" width="800" height="450">
          </button>
          <figcaption class="scene-frame-cap">${escapeHtml(capClose)}</figcaption>
        </figure>
      </div>
      <p class="frames-hint no-print">Cliquez sur une image pour agrandir (← → · Échap).</p>
      <details class="scene-comments no-print">
        <summary>Commentaires — scène ${String(c.id).padStart(2, '0')}</summary>
        <div class="scene-comments-body">
          <textarea class="scene-comment-input" data-comment-key="${commentKey(c.id)}" placeholder="Notes médicales / créa / localisation…">${savedComment}</textarea>
          <div class="comments-actions">
            <button class="tb-btn" data-copy-comment="${commentKey(c.id)}">Copier</button>
            <button class="tb-btn danger" data-clear-comment="${commentKey(c.id)}">Effacer</button>
            <span class="comment-status" data-comment-status="${commentKey(c.id)}"></span>
          </div>
        </div>
      </details>
      <div class="print-comment print-only">
        <strong>Commentaire reviewer</strong>
        <p>${printComment ? escapeHtml(printComment) : '—'}</p>
      </div>
    </div>
    <div class="scene-copy">
      <span class="scene-num">${String(c.id).padStart(2, '0')}</span>
      <span class="scene-tag">${c.tag} · ${lang.toUpperCase()}</span>
      <h3 class="scene-title">${title}</h3>
      <div class="scene-host">
        <span class="host-avatar">${h.initials}</span>
        <span>Host · <strong>${h.label}</strong> · ${h.bio}</span>
      </div>
      <p class="vo-block">${vo}</p>
      <div class="refs">
        <div class="refs-title">Références (script)</div>
        ${c.refs.map((r) => `<div class="refs-row"><span>${r.text}</span></div>`).join('')}
      </div>
      <div class="takeaway"><b>Take-home</b>${tk}</div>
    </div>
  </div>
</details>`;
  }).join('');
}

function renderBlurred() {
  const root = document.getElementById('blurred-root');
  const lang = CURRENT_CAST === 'es' ? 'es' : 'en';
  root.innerHTML = ASONE.BLURRED.map((b) => {
    const h = getHost(b.host);
    const title = b.title[lang] || b.title.en;
    return `
<div class="blurred-card">
  <div class="bc-num">${String(b.id).padStart(2, '0')}</div>
  <div class="bc-title">${title}</div>
  <div class="bc-host">${h.label} — ${h.bio}</div>
  <div class="bc-vo">${b.vo}</div>
  <div class="bc-pending"><span>● ${b.badge}</span><span>${lang.toUpperCase()}</span></div>
</div>`;
  }).join('');
}

function updatePrintMeta() {
  const el = document.getElementById('print-meta');
  if (el) {
    const cast = CURRENT_CAST === 'es' ? 'ES · Hispanic (Sofia)' : 'EN · Multicultural (Amina)';
    el.textContent = `Export ${new Date().toLocaleDateString('fr-FR')} · ${cast} · V2`;
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
  if (vid) { vid.pause(); vid.removeAttribute('src'); }
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
    if (e.target.closest('[data-lightbox-close]')) closeLightbox();
  });
  document.getElementById('lightbox-prev')?.addEventListener('click', (e) => { e.preventDefault(); showLightboxAt(lightboxIndex - 1); });
  document.getElementById('lightbox-next')?.addEventListener('click', (e) => { e.preventDefault(); showLightboxAt(lightboxIndex + 1); });
  document.addEventListener('keydown', (e) => {
    const panel = document.getElementById('storyboard-lightbox');
    if (!panel || panel.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxAt(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightboxAt(lightboxIndex + 1);
  });
}

function setupComments() {
  document.addEventListener('input', (event) => {
    const input = event.target.closest?.('.scene-comment-input');
    if (!input) return;
    const key = input.dataset.commentKey;
    try { localStorage.setItem(key, input.value); } catch (_) {}
    const status = document.querySelector(`[data-comment-status="${key}"]`);
    if (status) status.textContent = 'Enregistré';
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
    try { localStorage.removeItem(key); } catch (_) {}
    if (status) status.textContent = 'Effacé';
  });
}

function preparePrintExport() {
  document.querySelectorAll('.scene').forEach((s) => { s.open = true; });
  updatePrintMeta();
}

async function boot() {
  await loadManifest();
  document.querySelectorAll('.cs-btn').forEach((b) => {
    b.addEventListener('click', () => setCast(b.dataset.cast));
  });
  document.getElementById('btn-export-compliance')?.addEventListener('click', () => {
    window.ASONE_EXPORT_UTILS.exportCompliance(CURRENT_CAST);
  });
  document.getElementById('btn-export-pdf')?.addEventListener('click', () => {
    preparePrintExport();
    window.ASONE_EXPORT_UTILS.exportStoryboardPrint();
  });
  setCast('default');
  setupComments();
  setupLightbox();
  const el = document.getElementById('buildDate');
  if (el) el.textContent = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

document.addEventListener('DOMContentLoaded', boot);
