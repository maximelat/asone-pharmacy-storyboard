/* MyServier V2 · page principale */

const ASONE = window.ASONE_DATA;
const ASSET_PREFIX = '../';
let CURRENT_CAST = 'default';
let MANIFEST = { scenes: [] };

async function loadManifest() {
  try {
    const r = await fetch(`${ASSET_PREFIX}assets/manifest.json`, { cache: 'no-store' });
    if (r.ok) MANIFEST = await r.json();
  } catch (e) {
    console.warn('manifest not loaded', e);
  }
}

function langKey() {
  return CURRENT_CAST === 'es' ? 'es' : 'en';
}

function uiLang() {
  return CURRENT_CAST === 'es' ? 'es' : 'fr';
}

function t(obj) {
  if (!obj) return '';
  const k = uiLang();
  return obj[k] || obj.en || obj.fr || '';
}

function imgFor(sceneId, kind) {
  const s = MANIFEST.scenes?.find((x) => x.id === sceneId);
  let path = null;
  if (CURRENT_CAST === 'es' && s?.[`es_${kind}`]) path = s[`es_${kind}`];
  else if (s?.[kind]) path = s[kind];
  if (path) return ASSET_PREFIX + path;
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 640'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='%2324226a'/><stop offset='1' stop-color='%23f55b41'/></linearGradient></defs><rect width='360' height='640' fill='url(%23g)'/><text x='50%25' y='50%25' fill='%23fff' text-anchor='middle' font-family='Inter,sans-serif' font-size='16'>Scene ${sceneId}</text></svg>`)}`;
}

function renderTakeaways() {
  const root = document.getElementById('takeaway-grid');
  if (!root) return;
  root.innerHTML = ASONE.MODULES.module1.takeaways
    .map(
      (tk) => `
    <figure class="ms-takeaway-card">
      <div class="ms-takeaway-frame">
        <img src="${imgFor(tk.sceneId, tk.key)}" alt="${t(tk.label)}" loading="lazy">
      </div>
      <figcaption>${t(tk.label)}</figcaption>
    </figure>`
    )
    .join('');
}

function applyCopy() {
  const M = ASONE.MODULES;
  const el = (id, text) => {
    const n = document.getElementById(id);
    if (n && text != null) n.textContent = text;
  };

  el('hero-title', null);
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle) {
    const title = t(M.hero.title);
    heroTitle.innerHTML = title.includes('As One')
      ? title.replace(/(As One)/i, '<em>$1</em>').replace(/\n/g, '<br>')
      : title.replace(' module', '<br><em>module</em>').replace(' e-learning', ' e-learning');
    if (uiLang() === 'fr') {
      heroTitle.innerHTML = 'Bienvenue dans le module<br><em>e-learning As One</em>';
    } else if (CURRENT_CAST === 'es') {
      heroTitle.innerHTML = 'Bienvenido al módulo<br><em>e-learning As One</em>';
    } else {
      heroTitle.innerHTML = 'Welcome to the<br><em>As One e-learning module</em>';
    }
  }

  el('hero-sub', t(M.hero.subtitle));
  el('m0-label', t(M.module0.label));
  el('m0-desc', t(M.module0.desc));
  el('m0-video-title', t(M.module0.videoTitle));
  el('m1-label', t(M.module1.label));
  el('m1-desc', t(M.module1.desc));
  el('m1-video-title', t(M.module1.videoTitle));
  el('m1-upsell', t(M.module1.upsell));
  el('quiz-label', t(M.quiz.label));
  el('quiz-desc', t(M.quiz.desc));
  el('quiz-title', t(M.quiz.title));

  const m0poster = document.querySelector('#module-0 .ms-video');
  const m1poster = document.querySelector('#module-1 .ms-video');
  if (m0poster) {
    m0poster.poster = imgFor(2, 'opening');
  }
  if (m1poster) {
    m1poster.poster = imgFor(3, 'opening');
  }

  renderTakeaways();
}

function setCast(cast) {
  CURRENT_CAST = cast;
  document.querySelector('.cast-switch')?.setAttribute('data-current', cast);
  document.querySelectorAll('.cs-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.cast === cast);
  });
  document.documentElement.setAttribute('data-cast', cast);
  applyCopy();
}

function patchFooter() {
  const el = document.getElementById('buildDate');
  if (el) {
    el.textContent = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}

async function boot() {
  await loadManifest();
  document.querySelectorAll('.cs-btn').forEach((b) => {
    b.addEventListener('click', () => setCast(b.dataset.cast));
  });
  document.getElementById('btn-export-compliance')?.addEventListener('click', () => {
    window.ASONE_EXPORT_UTILS.exportCompliance(CURRENT_CAST);
  });
  setCast('default');
  patchFooter();
}

document.addEventListener('DOMContentLoaded', boot);
