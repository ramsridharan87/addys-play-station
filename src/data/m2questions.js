/**
 * Module 2 — Word Work question bank.
 *
 * 24 questions total:
 *   12 Type A (Spot the right spelling) — emoji + word label + 3 options
 *   12 Type B (Fill the sentence)       — sentence with ___ blank + 3 options
 *
 * 3 categories × 4 questions per type = 12 per type
 *   transport | animals | school
 *
 * 3 difficulty levels, 4 questions per level per type:
 *   Level 1 — simple short words, obvious wrong options
 *   Level 2 — less obvious wrong options
 *   Level 3 — silent letters, irregular vowels, double consonants
 *
 * Wrong options specifically target Tamil-English interference:
 *   V vs W  (volf → wolf), F vs P/PH  (fone → phone),
 *   silent letters (nife → knife, rite → write),
 *   irregular vowels (wulf → wolf, laf → laugh)
 *
 * pickQuestions() returns 8 questions for a session:
 *   4 Type A + 4 Type B, interleaved A-B-A-B-A-B-A-B.
 *   Options are shuffled so the correct answer isn't always in the same position.
 */

// ── Builders ──────────────────────────────────────────────────────────────────

const QA = (id, level, category, emoji, word, correct, wrongA, wrongB) => ({
  id, type: 'A', level, category,
  emoji, word,
  correct,
  options: [correct, wrongA, wrongB],  // shuffled by pickQuestions
})

const QB = (id, level, category, sentence, correct, wrongA, wrongB) => ({
  id, type: 'B', level, category,
  sentence,   // contains ___ as the blank
  correct,
  options: [correct, wrongA, wrongB],  // shuffled by pickQuestions
})

// ── Question bank ─────────────────────────────────────────────────────────────

const questions = [

  // ══════════════════════════════════════════════════════════════════════════
  // TYPE A — Spot the right spelling
  // ══════════════════════════════════════════════════════════════════════════

  // ── Transport ──────────────────────────────────────────────────────────────
  // Level 1: 🚗 car — K-substitution and double-r trap
  QA(2101, 1, 'transport', '🚗', 'Car',
    'car', 'kar', 'carr'),

  // Level 2: 🛞 wheel — V-vs-W trap (no W sound in Tamil) + silent-H drop
  QA(2102, 2, 'transport', '🛞', 'Wheel',
    'wheel', 'veel', 'weel'),

  // Level 2: 🚦 brake — irregular A-E vowel confusion
  QA(2103, 2, 'transport', '🚦', 'Brake',
    'brake', 'braik', 'breek'),

  // Level 3: ⛽ fuel — phonetic EW and FY-ULE spellings
  QA(2104, 3, 'transport', '⛽', 'Fuel',
    'fuel', 'fewl', 'fyule'),

  // ── Animals ────────────────────────────────────────────────────────────────
  // Level 1: 🐺 wolf — V-vs-W + irregular O→U vowel
  QA(2111, 1, 'animals', '🐺', 'Wolf',
    'wolf', 'volf', 'wulf'),

  // Level 1: 🐟 fish — double-S ending + CH-for-SH trap
  QA(2112, 1, 'animals', '🐟', 'Fish',
    'fish', 'fiss', 'fich'),

  // Level 2: 🐬 dolphin — PH→F substitution + silent-H drop
  QA(2113, 2, 'animals', '🐬', 'Dolphin',
    'dolphin', 'dolfin', 'dolpin'),

  // Level 3: 🐋 whale — V-for-WH + silent-H drop produces 'vale' / 'wale'
  QA(2114, 3, 'animals', '🐋', 'Whale',
    'whale', 'vale', 'wale'),

  // ── School words ───────────────────────────────────────────────────────────
  // Level 1: 📞 phone — PH→F substitution + vowel swap
  QA(2121, 1, 'school', '📞', 'Phone',
    'phone', 'fone', 'foan'),

  // Level 2: ✍️ write — silent-W drop + GH insertion
  QA(2122, 2, 'school', '✍️', 'Write',
    'write', 'rite', 'wrighte'),

  // Level 3: 🔪 knife — silent-K drop + F→V swap
  QA(2123, 3, 'school', '🔪', 'Knife',
    'knife', 'nife', 'knive'),

  // Level 3: 😄 laugh — phonetic LAF + German-style LAUF
  QA(2124, 3, 'school', '😄', 'Laugh',
    'laugh', 'laf', 'lauf'),

  // ══════════════════════════════════════════════════════════════════════════
  // TYPE B — Fill the sentence
  // ══════════════════════════════════════════════════════════════════════════

  // ── Transport ──────────────────────────────────────────────────────────────
  // Level 1: car — K-substitution + double-R
  QB(2201, 1, 'transport',
    'The ___ drove very fast down the road.',
    'car', 'kar', 'carr'),

  // Level 2: fuel — phonetic EW + vowel swap
  QB(2202, 2, 'transport',
    'The racing car was running low on ___.',
    'fuel', 'fewl', 'fule'),

  // Level 2: race — AI-vowel + EI-vowel traps
  QB(2203, 2, 'transport',
    'Addy loves to ___ his toy cars across the floor.',
    'race', 'raice', 'reise'),

  // Level 3: brake — AE and EE vowel swaps
  QB(2204, 3, 'transport',
    'The driver pressed the ___ hard to stop the car.',
    'brake', 'braek', 'breek'),

  // ── Animals ────────────────────────────────────────────────────────────────
  // Level 1: wolf — V-vs-W + U vowel swap
  QB(2211, 1, 'animals',
    'The ___ howled at the full moon last night.',
    'wolf', 'volf', 'wulf'),

  // Level 1: elephant — PH→F + vowel swap in second syllable
  QB(2212, 1, 'animals',
    "Addy's favourite animal is the big grey ___.",
    'elephant', 'elefant', 'eliphant'),

  // Level 2: frog — double-G + AW vowel trap
  QB(2213, 2, 'animals',
    'The little green ___ jumped into the pond.',
    'frog', 'frogg', 'frawg'),

  // Level 3: dolphin — PH→F + EN ending swap
  QB(2214, 3, 'animals',
    'The friendly ___ leaped out of the sea to say hello.',
    'dolphin', 'dolfin', 'dolfen'),

  // ── School words ───────────────────────────────────────────────────────────
  // Level 1: almost — double-L + OA vowel swap
  QB(2221, 1, 'school',
    'Addy could ___ hear the race car from far away.',
    'almost', 'allmost', 'almoast'),

  // Level 2: said — phonetic SAYED + phonetic SED
  QB(2222, 2, 'school',
    'The mechanic ___ the tyre was going flat.',
    'said', 'sayed', 'sed'),

  // Level 3: threw — phonetic THRUE + THROO
  QB(2223, 3, 'school',
    'She ___ the ball so hard it flew right over the fence.',
    'threw', 'thrue', 'throo'),

  // Level 3: knife — silent-K drop + F→V swap
  QB(2224, 3, 'school',
    'Addy picked up a ___ to cut his birthday cake.',
    'knife', 'nife', 'knyfe'),
]

export default questions

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

/**
 * Pick 8 questions for a session at the given level.
 * Returns 4 Type A + 4 Type B interleaved: A, B, A, B, A, B, A, B.
 * Options within each question are shuffled so the correct answer
 * is never predictably in the same slot.
 */
export function pickQuestions(level) {
  function poolFor(type, lvl) {
    return questions.filter(q => q.type === type && q.level === lvl)
  }

  function buildPool(type) {
    let pool = shuffle(poolFor(type, level))
    // Expand to adjacent levels if needed
    for (let d = 1; pool.length < 4 && d <= 2; d++) {
      pool = [...pool, ...shuffle(poolFor(type, level + d))]
      pool = [...pool, ...shuffle(poolFor(type, level - d))]
    }
    return pool.slice(0, 4)
  }

  const typeA = buildPool('A')
  const typeB = buildPool('B')

  // Interleave A-B-A-B-A-B-A-B
  const interleaved = []
  for (let i = 0; i < 4; i++) {
    if (typeA[i]) interleaved.push(typeA[i])
    if (typeB[i]) interleaved.push(typeB[i])
  }

  // Shuffle options so the correct answer isn't always first
  return interleaved.map(q => ({
    ...q,
    options: shuffle(q.options),
  }))
}
