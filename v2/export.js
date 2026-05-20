/* Export compliance pack — scènes, sources, script audio, commentaires */

const ASONE_EXPORT = window.ASONE_DATA;
const EXPORT_VERSION = 'v2.0';

function commentKey(sceneId, cast = null) {
  const c = cast || document.documentElement.getAttribute('data-cast') || 'default';
  const lang = c === 'es' ? 'es' : 'en';
  return `asone-scene-comment-v2:${lang}:scene-${sceneId}`;
}

function storedComment(sceneId, cast = null) {
  try {
    return localStorage.getItem(commentKey(sceneId, cast)) || '';
  } catch (_) {
    return '';
  }
}

function buildCompliancePack(cast = 'default') {
  const lang = cast === 'es' ? 'es' : 'en';
  const modules = ASONE_EXPORT.MODULES;
  const hostKey = cast === 'es' ? 'sofia' : 'amina';
  const host = cast === 'es' ? ASONE_EXPORT.HOSTS_ES.team : ASONE_EXPORT.HOSTS.team;

  const scenes = ASONE_EXPORT.CHAPTERS.map((c) => ({
    id: c.id,
    slug: c.slug,
    scriptRef: c.scriptRef,
    tag: c.tag,
    title: c.title[lang] || c.title.en,
    host: (cast === 'es' ? ASONE_EXPORT.HOSTS_ES : ASONE_EXPORT.HOSTS)[c.host]?.label,
    audioScript: lang === 'es' ? (c.voES || c.voEN) : c.voEN,
    audioScriptEN: c.voEN,
    audioScriptES: c.voES || c.voEN,
    takeaway: c.takeaway[lang] || c.takeaway.en,
    references: c.refs.map((r) => r.text),
    reviewerComment: storedComment(c.id, cast),
  }));

  return {
    exportVersion: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    project: 'Servier · As One Pharmacy E-Learning · Phase 2',
    cast: cast === 'es' ? 'Hispanic (Sofia)' : 'African (Amina)',
    host,
    modules: {
      module0: {
        label: modules.module0.label[lang] || modules.module0.label.fr,
        video: modules.module0.videoSrc,
        description: modules.module0.desc[lang] || modules.module0.desc.fr,
      },
      module1: {
        label: modules.module1.label[lang] || modules.module1.label.fr,
        video: modules.module1.videoSrc,
        description: modules.module1.desc[lang] || modules.module1.desc.fr,
        takeaways: modules.module1.takeaways.map((t) => t.label[lang] || t.label.fr),
      },
    },
    scenes,
    disclaimer: 'Confidential storyboard preview — not for promotional use. Subject to Servier medical approval.',
  };
}

function complianceToText(pack) {
  const lines = [
    '═══════════════════════════════════════════════════════════',
    '  ASONE · COMPLIANCE EXPORT',
    `  ${pack.project}`,
    `  ${pack.exportVersion} · ${pack.exportedAt}`,
    `  Cast: ${pack.cast}`,
    '═══════════════════════════════════════════════════════════',
    '',
    '── MODULES (DEMO PAGE) ──',
    '',
    `[${pack.modules.module0.label}]`,
    `Video: ${pack.modules.module0.video}`,
    pack.modules.module0.description,
    '',
    `[${pack.modules.module1.label}]`,
    `Video: ${pack.modules.module1.video}`,
    pack.modules.module1.description,
    `Takeaways: ${pack.modules.module1.takeaways.join(' · ')}`,
    '',
    '── STORYBOARD SCENES ──',
    '',
  ];

  pack.scenes.forEach((s) => {
    lines.push(`▸ SCENE ${String(s.id).padStart(2, '0')} — ${s.title}`);
    lines.push(`  Script ref: ${s.scriptRef}`);
    lines.push(`  Host: ${s.host}`);
    lines.push('');
    lines.push('  AUDIO SCRIPT:');
    lines.push(`  ${s.audioScript.replace(/\n/g, '\n  ')}`);
    lines.push('');
    lines.push('  REFERENCES:');
    if (s.references.length) s.references.forEach((r) => lines.push(`  · ${r}`));
    else lines.push('  (none cited in script section)');
    lines.push('');
    lines.push('  REVIEWER COMMENT:');
    lines.push(s.reviewerComment ? `  ${s.reviewerComment.replace(/\n/g, '\n  ')}` : '  (empty)');
    lines.push('');
    lines.push('  TAKE-HOME:');
    lines.push(`  ${s.takeaway}`);
    lines.push('');
    lines.push('───────────────────────────────────────────────────────────');
    lines.push('');
  });

  lines.push(pack.disclaimer);
  return lines.join('\n');
}

function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCompliance(cast) {
  const c = cast || document.documentElement.getAttribute('data-cast') || 'default';
  const pack = buildCompliancePack(c);
  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = c === 'es' ? 'ES' : 'EN';
  downloadBlob(`asone-compliance-${suffix}-${stamp}.json`, JSON.stringify(pack, null, 2), 'application/json');
  downloadBlob(`asone-compliance-${suffix}-${stamp}.txt`, complianceToText(pack), 'text/plain;charset=utf-8');
}

function exportStoryboardPrint() {
  window.print();
}

window.ASONE_EXPORT_UTILS = { buildCompliancePack, complianceToText, exportCompliance, exportStoryboardPrint, commentKey, storedComment };
