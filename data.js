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
  team:   { initials:'AM', label:'Amina', bio:'Lead host · global module' },
};

// Spanish cast: Sofia leads ALL chapters (single-narrator pivot, default cast = ES)
const HOSTS_ES = {
  amina:  HOSTS.sofia,
  david:  HOSTS.sofia,
  kai:    HOSTS.sofia,
  sofia:  HOSTS.sofia,
  team:   { initials:'SF', label:'Sofia', bio:'Farmacéutica · Madrid (ES solo cast)' },
};

const REF = {
  1: '1. Tortora GJ, Derrickson BH. Tortora\'s principles of anatomy and physiology. 15 ed. Wiley; 2017.',
  2: '2. Hall JE. Guyton & Hall Physiology Review. 4 ed. Elsevier; 2020.',
  3: '3. Katzung BG. Basic and clinical pharmacology. 14 ed. McGraw-Hill Education; 2018.',
  4: '4. Sherwood L. Human physiology: from cells to systems. 9 ed. Cengage Learning; 2015.',
  5: '5. Marieb EN, Keller SM. Essentials of Human Anatomy & Physiology. 13 ed. Pearson; 2021.',
  7: '7. Tansey EA, Montgomery LEA, Quinn JG, Roe SM, Johnson CD. Understanding basic vein physiology and venous blood pressure through simple physical assessments. Adv Physiol Educ. Sep 1 2019;43(3):423-429. doi:10.1152/advan.00182.2018',
  8: '8. Ortega MA, Fraile-Martínez O, García-Montero C, et al. Understanding chronic venous disease: A critical overview of its pathophysiology and medical management. J Clin Med. 2021;10(15):3239. doi:10.3390/jcm10153239',
  9: '9. Ricci S, Moro L, Antonelli Incalzi R. The foot venous system: anatomy, physiology and relevance to clinical practice. Dermatol Surg. Mar 2014;40(3):225-33. doi:10.1111/dsu.12381',
  10: '10. Wittens C, Davies AH, Bækgaard N, et al. Editor\'s Choice - Management of chronic venous disease: Clinical practice guidelines of the European Society for Vascular Surgery (ESVS). Eur J Vasc Endovasc Surg. Jun 2015;49(6):678-737. doi:10.1016/j.ejvs.2015.02.007',
  11: '11. Uhl J-F, Gillot C. The plantar venous pump: anatomy and physiological hypotheses. Phlebolymphology. 2010;17(3):151-158.',
  12: '12. Nicolaides A, Kakkos S, Baekgaard N, et al. Management of chronic venous disorders of the lower limbs. Guidelines according to scientific evidence. Part I. Int Angiol. Jun 2018;37(3):181-254. doi:10.23736/S0392-9590.18.03999-8',
  13: '13. Bergan JJ, Schmid-Schönbein GW, Smith PD, Nicolaides AN, Boisseau MR, Eklof B. Chronic venous disease. N Engl J Med. Aug 3 2006;355(5):488-98. doi:10.1056/NEJMra055289',
  14: '14. Matos AA, Mansilha A, Brandão ES, et al. Recomendações no diagnóstico e tratamento da doença venosa crónica. 2011.',
  15: '15. Prochaska JH, Arnold N, Falcke A, et al. Chronic venous insufficiency, cardiovascular disease, and mortality: a population study. Eur Heart J. Oct 21 2021;42(40):4157-4165. doi:10.1093/eurheartj/ehab495',
  16: '16. Carman TL, Al-Omari A. Evaluation and management of chronic venous disease using the foundation of CEAP. Curr Cardiol Rep. Aug 30 2019;21(10):114. doi:10.1007/s11886-019-1201-1',
  19: '19. Eklöf B, Rutherford RB, Bergan JJ, et al. Revision of the CEAP classification for chronic venous disorders: consensus statement. J Vasc Surg. Dec 2004;40(6):1248-52. doi:10.1016/j.jvs.2004.09.027',
  27: '27. Abbade LPF, Lastória S. Abordagem de pacientes com úlcera da perna de etiologia venosa. Anais Brasileiros de Dermatologia. 2006;81:509-522.',
  28: '28. Rabe E, Régnier C, Goron F, Salmat G, Pannier F. The prevalence, disease characteristics and treatment of chronic venous disease: an international web-based survey. J Comp Eff Res. Dec 2020;9(17):1205-1218. doi:10.2217/cer-2020-0158',
  30: '30. Lee AJ, Robertson LA, Boghossian SM, et al. Progression of varicose veins and chronic venous insufficiency in the general population in the Edinburgh Vein Study. J Vasc Surg Venous Lymphat Disord. Jan 2015;3(1):18-26. doi:10.1016/j.jvsv.2014.09.008',
  31: '31. De Maeseneer MG, Kakkos SK, Aherne T, et al. European Society for Vascular Surgery (ESVS) 2022 clinical practice guidelines on the management of chronic venous disease of the lower limbs. European Journal of Vascular and Endovascular Surgery. 2022;63(2):184-267. doi:10.1016/j.ejvs.2021.12.024',
  33: '33. Correia R, Bento R, Garcia R, et al. A relação da doença venosa crónica avançada com a psicopatologia e a qualidade de vida. Angiologia e Cirurgia Vascular. 2021;17(3):252-258.',
  37: '37. Gujja K, Wiley J, Krishnan P. Chronic venous insufficiency. Interv Cardiol Clin. Oct 2014;3(4):593-605. doi:10.1016/j.iccl.2014.07.001',
  38: '38. Spiridon M, Corduneanu D. Chronic venous insufficiency: A frequently underdiagnosed and undertreated pathology. Maedica (Bucur). Jan 2017;12(1):59-61.',
  39: '39. Bush R, Comerota A, Meissner M, Raffetto JD, Hahn SR, Freeman K. Recommendations for the medical management of chronic venous disease: The role of micronized purified flavanoid fraction (MPFF). Phlebology. Apr 2017;32(1_suppl):3-19. doi:10.1177/0268355517692221',
  48: '48. Barbosa FdS, Oliveira JCd, Tesser CD. Evidências sobre tratamentos clínicos conservadores para doença hemorroidária. Revista Brasileira de Medicina de Família e Comunidade. 12/16 2013;9(31):149-158. doi:10.5712/rbmfc9(31)786',
  49: '49. Deus JR, Rama N. Doença hemorroidária - recomendações (guidelines). Revista Portuguesa de Coloproctologia. 2020;17(1):40-46.',
  50: '50. Sun Z, Migaly J. Review of hemorrhoid disease: Presentation and management. Clin Colon Rectal Surg. 2016;29(1):22-29. doi:10.1055/s-0035-1568144',
  57: '57. Lohsiriwat V. Hemorrhoids: from basic pathophysiology to clinical management. World J Gastroenterol. May 7 2012;18(17):2009-17. doi:10.3748/wjg.v18.i17.2009',
  58: '58. De Marco S, Tiso D. Lifestyle and risk factors in hemorrhoidal disease. Mini Review. Frontiers in Surgery. 2021-August-18 2021;8doi:10.3389/fsurg.2021.729166',
};

// 5 developed chapters
const CHAPTERS = [
  {
    id:1, slug:'welcome', host:'amina', scriptRef:'Part #1 — Welcome video',
    tag:'Cold open',
    title:{ en:'Welcome to the As One pharmacy floor',
            es:'Bienvenidos a la farmacia As One' },
    voEN:`Welcome to Servier's Pharmacy Global E-Learning, powered by Daflon and the new As One strategy. I'm Amina, your guide on this cardiometabolic and venous voyage — a journey to help you turn comorbid patients at the counter from a challenge into an opportunity.`,
    voES:`Bienvenidos a la formación farmacéutica As One de Servier, impulsada por la herencia Daflon. Soy Sofia y seré vuestra única guía a través de este recorrido cardiometabólico y venoso — para que el paciente pluripatológico pase de ser un reto a ser una oportunidad de cuidado en el mostrador.`,
    refs:[ {tag:'SCRIPT', text:'Source script: PART #1 — OPENING VIDEO. No numbered scientific references are cited in this opening section.'} ],
    takeaway:{ en:'Set the tone. Pharmacists are not order-takers — they are the patient\'s partner of choice for control & adherence.',
               es:'Marcar el tono. El farmacéutico no es un dispensador pasivo: es el partner de elección para el control y la adherencia.' },
    pills:['CMVD intro','As One identity','Mindset shift','HOOK · 90 sec'],
    accSlot:'Knowledge assessment placeholder · 0 questions (intro)'
  },
  {
    id:2, slug:'global', host:'amina', scriptRef:'Part #2 — Global video (Daflon legacy)',
    tag:'Heritage reel',
    title:{ en:'A 55-year story across 17 languages',
            es:'Una historia de 55 años en 17 idiomas' },
    voEN:`Daflon's heritage spans more than fifty-five years across the globe — Russia, Spain, Slovakia, Brazil, the Philippines, Portugal. From every continent, pharmacists have walked patients through chronic venous and hemorrhoidal disease. Today the As One strategy gathers all of these voices into one cardiometabolic conversation: hypertension, anticoagulants, dyslipidemia and diabetes will join the venous chapter.`,
    voES:`La historia de Daflon abarca más de cincuenta y cinco años: Rusia, España, Eslovaquia, Brasil, Filipinas, Portugal. Desde cada continente, los farmacéuticos han acompañado a sus pacientes en la enfermedad venosa y hemorroidal. Hoy, la estrategia As One reúne todas esas voces en una sola conversación cardiometabólica.`,
    asOneCharter:true,
    refs:[
      {tag:'SCRIPT', text:'Source script: PART #2 — GLOBAL VIDEO. No numbered scientific references are cited in this global video section.'},
    ],
    takeaway:{ en:'Position Servier as a care partner, not a salesman — set up the multi-year As One pipeline.',
               es:'Posicionar a Servier como partner de cuidado, no como vendedor — preparar el pipeline plurianual As One.' },
    pills:['Daflon legacy','Country reels','As One pipeline'],
    accSlot:'Knowledge assessment placeholder · 0 questions (heritage)'
  },
  {
    id:3, slug:'venous-physiology', host:'amina', scriptRef:'Part #3 — Venous physiology & pathophysiology',
    tag:'Anatomy & physiology',
    title:{ en:'How blood climbs back up — valves, muscle pump & the inflamed vein',
            es:'Cómo regresa la sangre al corazón — válvulas, bomba muscular y la vena inflamada' },
    voEN:`If the arteries, veins and capillaries of one body were laid end to end, they'd wrap around the Earth two and a half times — about 100 000 kilometres. Veins are reservoirs: at rest they hold two-thirds of the total blood volume, and they're 30 times more compliant than arteries. So how does blood climb back up against gravity? Two heroes: the venous valves, and the skeletal muscle pump (with a star role for the deep plantar pump). Now picture chronic inflammation. Venous hypertension dilates the wall, drops shear stress, endothelial cells leak, edema settles in, capillaries cry hypoxia, and the wall thickens into fibrosis. That's the cycle CVD lives on.`,
    voES:`Si tomamos las arterias, venas y capilares de un solo cuerpo, podríamos darle la vuelta a la Tierra dos veces y media — unos 100.000 kilómetros. Las venas son reservorios: contienen dos tercios del volumen sanguíneo en reposo. ¿Cómo asciende la sangre contra la gravedad? Las válvulas venosas y la bomba muscular esquelética. Ahora añade inflamación crónica: hipertensión venosa, edema, hipoxia capilar, fibrosis. Ese es el ciclo de la enfermedad venosa crónica.`,
    refs:[
      {tag:'1', text:REF[1]},
      {tag:'2', text:REF[2]},
      {tag:'3', text:REF[3]},
      {tag:'4', text:REF[4]},
      {tag:'5', text:REF[5]},
      {tag:'7', text:REF[7]},
      {tag:'8', text:REF[8]},
      {tag:'9', text:REF[9]},
      {tag:'10', text:REF[10]},
      {tag:'11', text:REF[11]},
      {tag:'12', text:REF[12]},
      {tag:'13', text:REF[13]},
    ],
    takeaway:{ en:'Pathophysiology = a self-perpetuating cycle of venous hypertension + inflammation + valve incompetence. This is why early intervention matters.',
               es:'Fisiopatología = ciclo auto-mantenido de hipertensión venosa, inflamación e incompetencia valvular — la intervención temprana es clave.' },
    pills:['Anatomy','Pathophysiology','Cellular cascade','GENIALLY · interactive vein'],
    accSlot:'10-question knowledge assessment · placeholder for affiliate LMS'
  },
  {
    id:4, slug:'cvd', host:'amina', scriptRef:'Part #4 — Chronic Venous Disease',
    tag:'Disease module 1',
    title:{ en:'CVD — the silent 80%',
            es:'EVC — el 80% silencioso' },
    voEN:`Eight in ten patients walking into your pharmacy are affected by some stage of chronic venous disease. Most are silent sufferers. The CEAP classification stages it from C0 — heaviness without visible signs — to C6, the open ulcer that takes on average six months to heal. Watch for telangiectasias and reticular varices: they're the first visible signal that venous flow is failing. Risk factors? Family history, age, female sex, pregnancy — and the modifiables: obesity, sedentary lifestyle, prolonged standing, tobacco. The Edinburgh Vein Study followed patients for 13 years; almost a third progressed.`,
    voES:`Ocho de cada diez pacientes que entran en tu farmacia tienen algún grado de enfermedad venosa crónica. La mayoría son silenciosos. La clasificación CEAP va de C0 — pesadez sin signos visibles — hasta C6, la úlcera abierta que tarda en cicatrizar seis meses de media. Las telangiectasias y varices reticulares son la primera señal visible. Factores no modificables: edad, sexo femenino, embarazo, antecedentes familiares. Modificables: obesidad, sedentarismo, bipedestación, tabaco.`,
    refs:[
      {tag:'8', text:REF[8]},
      {tag:'13', text:REF[13]},
      {tag:'14', text:REF[14]},
      {tag:'15', text:REF[15]},
      {tag:'16', text:REF[16]},
      {tag:'19', text:REF[19]},
      {tag:'27', text:REF[27]},
      {tag:'28', text:REF[28]},
      {tag:'30', text:REF[30]},
      {tag:'31', text:REF[31]},
      {tag:'33', text:REF[33]},
      {tag:'37', text:REF[37]},
      {tag:'38', text:REF[38]},
      {tag:'39', text:REF[39]},
    ],
    takeaway:{ en:'Identify CVD early. CEAP \'C0\' is already a clinical condition — pharmacist counselling is the first line of defence.',
               es:'Detectar la EVC pronto. CEAP C0 ya es una condición clínica — la asesoría farmacéutica es la primera línea de defensa.' },
    pills:['Pathophysiology','Clinical signs','CEAP C0→C6','Risk factors','RISE · CEAP quiz'],
    accSlot:'10-question knowledge assessment · placeholder for affiliate LMS'
  },
  {
    id:5, slug:'hemorrhoidal', host:'amina', scriptRef:'Part #5 — Hemorrhoidal disease',
    tag:'Disease module 2',
    title:{ en:'Hemorrhoidal disease — out of the taboo, into the consultation',
            es:'Enfermedad hemorroidal — del tabú a la consulta' },
    voEN:`Hemorrhoidal disease lives in the shadow of taboo. Patients lower their voice when describing anal symptoms, and crisis management is often patchy. As pharmacists, we can change that — discreetly, professionally. The condition shares an inflammatory backbone with chronic venous disease. Risk factors overlap: low-fibre diet, chronic constipation, prolonged sitting, pregnancy. Special groups deserve special attention — pregnant women, post-partum patients, the elderly. The opportunity at the counter is huge: dignified counsel today prevents the recurrence cycle tomorrow.`,
    voES:`La enfermedad hemorroidal vive en la sombra del tabú. El paciente baja la voz al describir sus síntomas y el manejo de las crisis suele ser irregular. Como farmacéuticos, podemos cambiar esto — con discreción y profesionalidad. Comparte una base inflamatoria con la EVC. Factores de riesgo: dieta pobre en fibra, estreñimiento crónico, sedentarismo, embarazo. Grupos especiales: embarazadas, post-parto, ancianos.`,
    refs:[
      {tag:'48', text:REF[48]},
      {tag:'49', text:REF[49]},
      {tag:'50', text:REF[50]},
      {tag:'57', text:REF[57]},
      {tag:'58', text:REF[58]},
    ],
    takeaway:{ en:'Reframe HD as a treatable, evidence-based condition. The pharmacist is the trusted, discreet first contact.',
               es:'Reformular la EH como una patología tratable y basada en evidencia. El farmacéutico es el primer contacto discreto y de confianza.' },
    pills:['Pathophysiology','Special groups','Counter discretion'],
    accSlot:'10-question knowledge assessment · placeholder for affiliate LMS'
  },
];

// 5 chapters under medical review (blurred)
const BLURRED = [
  { id:6, host:'amina',
    title:{ en:'Servier Solutions — branded module',     es:'Soluciones Servier — módulo branded' },
    vo:    'MPFF · Daflon · perindopril-based SPCs · NOACs · differentiation by manufacturing.',
    badge: 'Medical review · Round 2' },
  { id:7, host:'amina',
    title:{ en:'Pharmaceutical intervention',           es:'Intervención farmacéutica' },
    vo:    'Pharmaceutical service · interpersonal communication · technical component (110 → 114).',
    badge: 'Medical review · Round 2' },
  { id:8, host:'amina',
    title:{ en:'OTC counter scenarios — 4 vignettes',   es:'Escenarios OTC — 4 viñetas' },
    vo:    'Real-world counter scenarios for OTC markets — chronic venous disease + comorbidities.',
    badge: 'Medical review · Round 2' },
  { id:9, host:'amina',
    title:{ en:'Prescription scenarios — 4 vignettes',  es:'Escenarios con receta — 4 viñetas' },
    vo:    'Real-world scenarios for Rx markets — refilling, switch refusal, adherence reinforcement.',
    badge: 'Medical review · Round 2' },
  { id:10, host:'amina',
    title:{ en:'Final thoughts & As One pledge',        es:'Conclusiones y compromiso As One' },
    vo:    'The lead host closes the journey. Pledge to control, adherence, persistence.',
    badge: 'Medical review · Round 2' },
];

// Image manifest (filled in by assets/manifest.json or fallback)
const CHARACTERS = [
  {
    id:'amina',
    name:'Amina',
    label:'EN · Global recurring host',
    src:'assets/characters/amina-global-reference.png',
    note:'GPT Image 2 high · 4-angle reference sheet'
  },
  {
    id:'sofia',
    name:'Sofia',
    label:'ES · Hispanic recurring host',
    src:'assets/characters/sofia-hispanic-reference.png',
    note:'GPT Image 2 high · 4-angle reference sheet'
  }
];

window.ASONE_DATA = { CHAPTERS, BLURRED, HOSTS, HOSTS_ES, CHARACTERS };
