/* Quiz interactif · Module 1 physiologie veineuse (3 séquences Genially-style) */

const QUIZ = {
  sequences: [
    {
      id: 'intro',
      title: 'Séquence 1 · Rappel des points clés',
      intro: 'Avant de valider le module, vérifiez votre compréhension de la physiologie veineuse et du rôle du pharmacien.',
      cards: [
        { icon: '♥', title: 'Réservoir veineux', text: 'Les veines contiennent ~⅔ du volume sanguin au repos — 30× plus distensibles que les artères.' },
        { icon: '↑', title: 'Remontée sanguine', text: 'Valves veineuses + pompe musculaire (dont la pompe plantaire profonde) luttent contre la gravité.' },
        { icon: '⟳', title: 'Cycle pathologique', text: 'HT veineuse → inflammation → fuite endothéliale → œdème → hypoxie → fibrose.' },
      ],
    },
    {
      id: 'questions',
      title: 'Séquence 2 · Cas au comptoir',
      questions: [
        {
          prompt: 'Quelle proportion du volume sanguin total les veines contiennent-elles au repos ?',
          options: ['Environ ⅓', 'Environ ½', 'Environ ⅔', 'Environ ¾'],
          correct: 2,
          feedback: 'Les veines sont des réservoirs : ~⅔ du volume sanguin au repos (script Part #3).',
        },
        {
          prompt: 'Quels sont les deux « héros » de la remontée veineuse contre la gravité ?',
          options: ['Artères et capillaires', 'Valves veineuses et pompe musculaire', 'Rate et foie', 'Poumons et cœur droit'],
          correct: 1,
          feedback: 'Valves veineuses + pompe musculaire esquelettique (pompe plantaire profonde en rôle clé).',
        },
        {
          prompt: 'Dans le cycle de la maladie veineuse chronique, que provoque l’hypoxie capillaire ?',
          options: ['Disparition des valves', 'Fibrose pariétale', 'Augmentation du débit artériel', 'Réduction de l’inflammation'],
          correct: 1,
          feedback: 'Le cycle auto-entretenu mène à fibrose pariétale — d’où l’importance d’intervenir tôt.',
        },
        {
          prompt: 'Quel stade CEAP correspond à une lourdeur sans signe visible ?',
          options: ['C2', 'C0', 'C4', 'C6'],
          correct: 1,
          feedback: 'CEAP C0 = symptômes sans signes visibles — déjà une condition clinique (Part #4).',
        },
      ],
    },
    {
      id: 'result',
      title: 'Séquence 3 · Validation & score',
    },
  ],
};

function initQuiz() {
  const root = document.getElementById('quiz-app');
  if (!root) return;

  let seq = 0;
  let qIdx = 0;
  let score = 0;
  const answers = [];

  function render() {
    const current = QUIZ.sequences[seq];
    if (current.id === 'intro') {
      root.innerHTML = `
        <div class="quiz-seq">
          <div class="quiz-seq-head"><span class="quiz-badge">Genially</span><h3>${current.title}</h3><p>${current.intro}</p></div>
          <div class="quiz-cards">${current.cards.map((c) => `
            <article class="quiz-card"><span class="quiz-card-icon">${c.icon}</span><strong>${c.title}</strong><p>${c.text}</p></article>
          `).join('')}</div>
          <button type="button" class="ms-btn ms-btn-primary quiz-next">Commencer le quiz →</button>
        </div>`;
      root.querySelector('.quiz-next')?.addEventListener('click', () => { seq = 1; qIdx = 0; render(); });
      return;
    }

    if (current.id === 'questions') {
      const q = current.questions[qIdx];
      root.innerHTML = `
        <div class="quiz-seq">
          <div class="quiz-seq-head"><span class="quiz-badge">Question ${qIdx + 1} / ${current.questions.length}</span><h3>${current.title}</h3></div>
          <div class="quiz-question">
            <p class="quiz-prompt">${q.prompt}</p>
            <div class="quiz-options">${q.options.map((opt, i) => `
              <button type="button" class="quiz-opt" data-idx="${i}">${opt}</button>
            `).join('')}</div>
            <div class="quiz-feedback" hidden></div>
          </div>
        </div>`;
      root.querySelectorAll('.quiz-opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          const chosen = parseInt(btn.dataset.idx, 10);
          const ok = chosen === q.correct;
          if (ok) score += 1;
          answers.push({ q: qIdx, ok });
          root.querySelectorAll('.quiz-opt').forEach((b) => {
            b.disabled = true;
            const idx = parseInt(b.dataset.idx, 10);
            if (idx === q.correct) b.classList.add('correct');
            else if (idx === chosen && !ok) b.classList.add('wrong');
          });
          const fb = root.querySelector('.quiz-feedback');
          fb.hidden = false;
          fb.className = `quiz-feedback ${ok ? 'ok' : 'ko'}`;
          fb.innerHTML = `<strong>${ok ? 'Correct' : 'À revoir'}</strong><p>${q.feedback}</p>
            <button type="button" class="ms-btn ms-btn-primary quiz-next">${qIdx < current.questions.length - 1 ? 'Question suivante →' : 'Voir mon score →'}</button>`;
          fb.querySelector('.quiz-next')?.addEventListener('click', () => {
            if (qIdx < current.questions.length - 1) { qIdx += 1; render(); }
            else { seq = 2; render(); }
          });
        });
      });
      return;
    }

    if (current.id === 'result') {
      const total = QUIZ.sequences[1].questions.length;
      const pct = Math.round((score / total) * 100);
      const pass = pct >= 75;
      root.innerHTML = `
        <div class="quiz-seq quiz-result">
          <div class="quiz-seq-head"><span class="quiz-badge">Certificat module</span><h3>${current.title}</h3></div>
          <div class="quiz-score-ring"><span>${pct}%</span></div>
          <p class="quiz-score-label">${score} / ${total} bonnes réponses</p>
          <p class="quiz-result-msg">${pass
            ? 'Module validé — vous pouvez passer au storyboard et aux scènes suivantes.'
            : 'Score insuffisant — revoyez les key takeaways et réessayez.'}</p>
          <div class="quiz-result-actions">
            <button type="button" class="ms-btn ms-btn-primary" id="quiz-retry">Réessayer</button>
            <a class="ms-btn ms-btn-outline" href="#storyboard">Storyboard ↓</a>
          </div>
        </div>`;
      document.getElementById('quiz-retry')?.addEventListener('click', () => {
        seq = 0; qIdx = 0; score = 0; answers.length = 0; render();
      });
      const ring = root.querySelector('.quiz-score-ring');
      if (ring) ring.style.background = `conic-gradient(#f55b41 ${pct}%, #eeedf6 0)`;
    }
  }

  render();
}

window.initAsOneQuiz = initQuiz;
