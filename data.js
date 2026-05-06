/* ════════════════════════════════════════════════════════════════════
   ASONE Pharmacy E-Learning · Storyboard data
   Sources : Scripts.pdf (4Choice Health Consultancy, v1, Jan 20 2025)
             Phase-2 brief (Servier · As One · Apr 2026)
   ════════════════════════════════════════════════════════════════════ */

const HOSTS = {
  amina:  { initials:'AM', label:'Amina',  bio:'Pharmacist · Cairo' },
  david:  { initials:'DV', label:'David',  bio:'Pharmacist · Lyon'  },
  kai:    { initials:'KA', label:'Kai',    bio:'Pharmacist · Singapore' },
  sofia:  { initials:'SF', label:'Sofia',  bio:'Pharmacist · Madrid' },
  team:   { initials:'AS', label:'The 4 hosts', bio:'Multicultural cast' },
};

// Spanish cast: Sofia leads ALL chapters (single-narrator pivot, default cast = ES)
const HOSTS_ES = {
  amina:  HOSTS.sofia,
  david:  HOSTS.sofia,
  kai:    HOSTS.sofia,
  sofia:  HOSTS.sofia,
  team:   { initials:'SF', label:'Sofia', bio:'Farmacéutica · Madrid (ES Solo Cast)' },
};

// 5 developed chapters
const CHAPTERS = [
  {
    id:1, slug:'welcome', host:'team', scriptRef:'Part #1 — Welcome video',
    tag:'Cold open',
    title:{ en:'Welcome to the As One pharmacy floor',
            es:'Bienvenidos a la farmacia As One' },
    voEN:`Welcome to Servier's Pharmacy Global E-Learning, powered by Daflon and the new As One strategy. I'm Amina. Hi, David here. Hey everyone, I'm Kai. And last but not least, Sofia's here! Together, we'll be your hosts on this cardiometabolic and venous voyage — a journey to help you turn comorbid patients at the counter from a challenge into an opportunity.`,
    voES:`Bienvenidos a la formación farmacéutica As One de Servier, impulsada por la herencia Daflon. Soy Sofia y seré vuestra única guía a través de este recorrido cardiometabólico y venoso — para que el paciente pluripatológico pase de ser un reto a ser una oportunidad de cuidado en el mostrador.`,
    refs:[ {tag:'BRIEF', text:'As One mindset shift — passive dispensing → proactive counselling. Servier Phase 2 brief, Apr 2026.'} ],
    takeaway:{ en:'Set the tone. Pharmacists are not order-takers — they are the patient\'s partner of choice for control & adherence.',
               es:'Marcar el tono. El farmacéutico no es un dispensador pasivo: es el partner de elección para el control y la adherencia.' },
    pills:['CMVD intro','As One identity','Mindset shift','HOOK · 90 sec'],
    accSlot:'Knowledge assessment placeholder · 0 questions (intro)'
  },
  {
    id:2, slug:'global', host:'team', scriptRef:'Part #2 — Global video (Daflon legacy)',
    tag:'Heritage reel',
    title:{ en:'A 55-year story across 17 languages',
            es:'Una historia de 55 años en 17 idiomas' },
    voEN:`Daflon's heritage spans more than fifty-five years across the globe — Russia, Spain, Slovakia, Brazil, the Philippines, Portugal. From every continent, pharmacists have walked patients through chronic venous and hemorrhoidal disease. Today the As One strategy gathers all of these voices into one cardiometabolic conversation: hypertension, anticoagulants, dyslipidemia and diabetes will join the venous chapter.`,
    voES:`La historia de Daflon abarca más de cincuenta y cinco años: Rusia, España, Eslovaquia, Brasil, Filipinas, Portugal. Desde cada continente, los farmacéuticos han acompañado a sus pacientes en la enfermedad venosa y hemorroidal. Hoy, la estrategia As One reúne todas esas voces en una sola conversación cardiometabólica.`,
    refs:[
      {tag:'BRIEF', text:'Phase 2 brief — Y1 = CV continuum + adherence + Daflon + Hypertension + NOACs. Y2 = dyslipidemia + T2D. Y3 = cardio franchise.'},
      {tag:'STAT', text:'56% hypertensive patients also have diabetes; 82% have dyslipidemia; 56% have chronic venous disease (Phase 2 brief).'},
    ],
    takeaway:{ en:'Position Servier as a care partner, not a salesman — set up the multi-year As One pipeline.',
               es:'Posicionar a Servier como partner de cuidado, no como vendedor — preparar el pipeline plurianual As One.' },
    pills:['Daflon legacy','Country reels','As One pipeline'],
    accSlot:'Knowledge assessment placeholder · 0 questions (heritage)'
  },
  {
    id:3, slug:'venous-physiology', host:'david', scriptRef:'Part #3 — Venous physiology & pathophysiology',
    tag:'Anatomy & physiology',
    title:{ en:'How blood climbs back up — valves, muscle pump & the inflamed vein',
            es:'Cómo regresa la sangre al corazón — válvulas, bomba muscular y la vena inflamada' },
    voEN:`If the arteries, veins and capillaries of one body were laid end to end, they'd wrap around the Earth two and a half times — about 100 000 kilometres. Veins are reservoirs: at rest they hold two-thirds of the total blood volume, and they're 30 times more compliant than arteries. So how does blood climb back up against gravity? Two heroes: the venous valves, and the skeletal muscle pump (with a star role for the deep plantar pump). Now picture chronic inflammation. Venous hypertension dilates the wall, drops shear stress, endothelial cells leak, edema settles in, capillaries cry hypoxia, and the wall thickens into fibrosis. That's the cycle CVD lives on.`,
    voES:`Si tomamos las arterias, venas y capilares de un solo cuerpo, podríamos darle la vuelta a la Tierra dos veces y media — unos 100.000 kilómetros. Las venas son reservorios: contienen dos tercios del volumen sanguíneo en reposo. ¿Cómo asciende la sangre contra la gravedad? Las válvulas venosas y la bomba muscular esquelética. Ahora añade inflamación crónica: hipertensión venosa, edema, hipoxia capilar, fibrosis. Ese es el ciclo de la enfermedad venosa crónica.`,
    refs:[
      {tag:'1-3', text:'Cardiovascular system functions — homeostasis, gas exchange, nutrient distribution, immune protection.'},
      {tag:'4',   text:'Total length of vasculature ≈ 100 000 km.'},
      {tag:'5,7', text:'Veins as compliant reservoirs (≈30× more compliant than arteries).'},
      {tag:'7-11',text:'Venous valves and skeletal muscle pump — Doppler-confirmed plantar venous pump.'},
      {tag:'7',   text:'Standing venous pressure 90 mmHg → 20 mmHg while walking.'},
      {tag:'8,12,13',text:'Inflammation, endothelial dysfunction, leukocyte adhesion, MMPs, IL-6, TNF-α.'},
    ],
    takeaway:{ en:'Pathophysiology = a self-perpetuating cycle of venous hypertension + inflammation + valve incompetence. This is why early intervention matters.',
               es:'Fisiopatología = ciclo auto-mantenido de hipertensión venosa, inflamación e incompetencia valvular — la intervención temprana es clave.' },
    pills:['Anatomy','Pathophysiology','Cellular cascade','GENIALLY · interactive vein'],
    accSlot:'10-question knowledge assessment · placeholder for affiliate LMS'
  },
  {
    id:4, slug:'cvd', host:'sofia', scriptRef:'Part #4 — Chronic Venous Disease',
    tag:'Disease module 1',
    title:{ en:'CVD — the silent 80%',
            es:'EVC — el 80% silencioso' },
    voEN:`Eight in ten patients walking into your pharmacy are affected by some stage of chronic venous disease. Most are silent sufferers. The CEAP classification stages it from C0 — heaviness without visible signs — to C6, the open ulcer that takes on average six months to heal. Watch for telangiectasias and reticular varices: they're the first visible signal that venous flow is failing. Risk factors? Family history, age, female sex, pregnancy — and the modifiables: obesity, sedentary lifestyle, prolonged standing, tobacco. The Edinburgh Vein Study followed patients for 13 years; almost a third progressed.`,
    voES:`Ocho de cada diez pacientes que entran en tu farmacia tienen algún grado de enfermedad venosa crónica. La mayoría son silenciosos. La clasificación CEAP va de C0 — pesadez sin signos visibles — hasta C6, la úlcera abierta que tarda en cicatrizar seis meses de media. Las telangiectasias y varices reticulares son la primera señal visible. Factores no modificables: edad, sexo femenino, embarazo, antecedentes familiares. Modificables: obesidad, sedentarismo, bipedestación, tabaco.`,
    refs:[
      {tag:'12,14,16-18', text:'CVD subjective symptoms — heaviness, pain, evening worsening, relief on elevation.'},
      {tag:'13,16,19',    text:'CEAP classification updated 2020, American Venous Forum.'},
      {tag:'15',          text:'12 500-patient cohort: CVD heightens cardiovascular risk, especially PAD & VTE.'},
      {tag:'22',          text:'≈30% of untreated patients show significant worsening at 5 years.'},
      {tag:'28-30',       text:'Worldwide CVD prevalence ≈ 80%; Edinburgh Vein Study — 32% progression at 13 yrs.'},
      {tag:'33',          text:'Psychosocial impact: anxiety, self-deprecation, aesthetic concerns.'},
      {tag:'24,34-36',    text:'Workplace impact: 10.4% lost workdays; Portugal 1 M lost workdays/yr.'},
      {tag:'8,37-43',     text:'Risk factors: family history, age, female sex, obesity, sedentary, tobacco.'},
    ],
    takeaway:{ en:'Identify CVD early. CEAP \'C0\' is already a clinical condition — pharmacist counselling is the first line of defence.',
               es:'Detectar la EVC pronto. CEAP C0 ya es una condición clínica — la asesoría farmacéutica es la primera línea de defensa.' },
    pills:['Pathophysiology','Clinical signs','CEAP C0→C6','Risk factors','RISE · CEAP quiz'],
    accSlot:'10-question knowledge assessment · placeholder for affiliate LMS'
  },
  {
    id:5, slug:'hemorrhoidal', host:'kai', scriptRef:'Part #5 — Hemorrhoidal disease',
    tag:'Disease module 2',
    title:{ en:'Hemorrhoidal disease — out of the taboo, into the consultation',
            es:'Enfermedad hemorroidal — del tabú a la consulta' },
    voEN:`Hemorrhoidal disease lives in the shadow of taboo. Patients lower their voice when describing anal symptoms, and crisis management is often patchy. As pharmacists, we can change that — discreetly, professionally. The condition shares an inflammatory backbone with chronic venous disease. Risk factors overlap: low-fibre diet, chronic constipation, prolonged sitting, pregnancy. Special groups deserve special attention — pregnant women, post-partum patients, the elderly. The opportunity at the counter is huge: dignified counsel today prevents the recurrence cycle tomorrow.`,
    voES:`La enfermedad hemorroidal vive en la sombra del tabú. El paciente baja la voz al describir sus síntomas y el manejo de las crisis suele ser irregular. Como farmacéuticos, podemos cambiar esto — con discreción y profesionalidad. Comparte una base inflamatoria con la EVC. Factores de riesgo: dieta pobre en fibra, estreñimiento crónico, sedentarismo, embarazo. Grupos especiales: embarazadas, post-parto, ancianos.`,
    refs:[
      {tag:'13,14,19', text:'Pathophysiology of internal & external hemorrhoidal plexus.'},
      {tag:'12,31',    text:'Guidelines and venoactive drug pharmacology — MPFF first-line in many guidelines.'},
      {tag:'BRIEF',    text:'Reference handling: per-frame footnotes (Servier Phase 2 requirement).'},
    ],
    takeaway:{ en:'Reframe HD as a treatable, evidence-based condition. The pharmacist is the trusted, discreet first contact.',
               es:'Reformular la EH como una patología tratable y basada en evidencia. El farmacéutico es el primer contacto discreto y de confianza.' },
    pills:['Pathophysiology','Special groups','Counter discretion'],
    accSlot:'10-question knowledge assessment · placeholder for affiliate LMS'
  },
];

// 5 chapters under medical review (blurred)
const BLURRED = [
  { id:6, host:'team',
    title:{ en:'Servier Solutions — branded module',     es:'Soluciones Servier — módulo branded' },
    vo:    'MPFF · Daflon · perindopril-based SPCs · NOACs · differentiation by manufacturing.',
    badge: 'Medical review · Round 2' },
  { id:7, host:'amina',
    title:{ en:'Pharmaceutical intervention',           es:'Intervención farmacéutica' },
    vo:    'Pharmaceutical service · interpersonal communication · technical component (110 → 114).',
    badge: 'Medical review · Round 2' },
  { id:8, host:'david',
    title:{ en:'OTC counter scenarios — 4 vignettes',   es:'Escenarios OTC — 4 viñetas' },
    vo:    'Real-world counter scenarios for OTC markets — chronic venous disease + comorbidities.',
    badge: 'Medical review · Round 2' },
  { id:9, host:'kai',
    title:{ en:'Prescription scenarios — 4 vignettes',  es:'Escenarios con receta — 4 viñetas' },
    vo:    'Real-world scenarios for Rx markets — refilling, switch refusal, adherence reinforcement.',
    badge: 'Medical review · Round 2' },
  { id:10, host:'team',
    title:{ en:'Final thoughts & As One pledge',        es:'Conclusiones y compromiso As One' },
    vo:    'The four hosts close the journey. Pledge to control, adherence, persistence.',
    badge: 'Medical review · Round 2' },
];

// Image manifest (filled in by assets/manifest.json or fallback)
window.ASONE_DATA = { CHAPTERS, BLURRED, HOSTS, HOSTS_ES };
