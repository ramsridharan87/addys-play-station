/**
 * Module 3 — Challenge Math: Subtraction with borrowing
 *
 * All 20 questions genuinely require borrowing:
 *   ones digit of subtrahend > ones digit of minuend
 *
 * Levels:
 *   1 — minuend 30–59, subtrahend 10–29
 *   2 — minuend 60–79, subtrahend 20–49
 *   3 — minuend 80–99, subtrahend 30–69
 */

function Q(id, level, minuend, subtrahend, problem) {
  const answer = minuend - subtrahend
  // Safety assertion: must require borrowing
  if ((minuend % 10) >= (subtrahend % 10)) {
    throw new Error(
      `Q(${id}): ${minuend} - ${subtrahend} does NOT require borrowing ` +
      `(ones: ${minuend % 10} >= ${subtrahend % 10})`
    )
  }
  return { id, level, minuend, subtrahend, answer, problem }
}

const questions = [

  // ── Level 1 — minuend 30-59, subtrahend 10-29 ──────────────────────────────

  Q(1001, 1, 43, 17,
    'A garage had 43 cars. 17 drove away. How many are left?'),

  Q(1002, 1, 52, 28,
    'Addy had 52 car stickers. He gave 28 to his friend. How many does he have now?'),

  Q(1003, 1, 45, 19,
    'There were 45 cars in the big race. 19 broke down. How many finished?'),

  Q(1004, 1, 34, 16,
    'A car park had 34 spaces. 16 were already taken. How many are free for Addy?'),

  Q(1005, 1, 51, 24,
    'Addy counted 51 toy cars in his collection. He gave 24 to his cousin. How many does Addy have left?'),

  Q(1006, 1, 42, 15,
    'A garage washed 42 cars today. 15 were red. How many were NOT red?'),

  Q(1007, 1, 56, 27,
    'Addy had 56 trading cards. He used 27 in a swap at school. How many cards does he have now?'),

  // ── Level 2 — minuend 60-79, subtrahend 20-49 ──────────────────────────────

  Q(2001, 2, 61, 35,
    'A race started with 61 cars. 35 finished before Addy. How many were still on the track?'),

  Q(2002, 2, 72, 45,
    "Addy's garage had 72 cars for sale. 45 were sold at the weekend. How many are left?"),

  Q(2003, 2, 74, 46,
    'There were 74 cars at the big car show. 46 drove home early. How many stayed?'),

  Q(2004, 2, 65, 38,
    'Addy counted 65 cars on the motorway. 38 took the next exit. How many kept going?'),

  Q(2005, 2, 70, 43,
    'A car park had 70 spaces. 43 were already full. How many spaces were free for Addy?'),

  Q(2006, 2, 63, 27,
    "Addy's team built 63 toy cars this week. 27 were sent to the toy shop. How many are left?"),

  Q(2007, 2, 71, 34,
    'There were 71 cars in the championship race. 34 did not finish. How many crossed the line?'),

  // ── Level 3 — minuend 80-99, subtrahend 30-69 ──────────────────────────────

  Q(3001, 3, 83, 57,
    'A big garage had 83 cars. 57 were sold at the fair. How many are left?'),

  Q(3002, 3, 90, 43,
    'There were 90 cars at the starting grid. 43 dropped out before the race. How many raced?'),

  Q(3003, 3, 81, 34,
    'Addy counted 81 cars on the motorway. 34 took the exit. How many stayed on the motorway?'),

  Q(3004, 3, 92, 65,
    "A car collector had 92 models. He gave 65 to the museum. How many did he keep?"),

  Q(3005, 3, 85, 38,
    'A racing team had 85 tyres in their garage. 38 were used in the big race. How many are left?'),

  Q(3006, 3, 94, 67,
    "Addy's sticker book had 94 car stickers. He gave 67 away at the school fair. How many are left?"),
]

export default questions

/**
 * Pick a single question appropriate for `level`.
 * Excludes already-used IDs.
 * Falls back to adjacent levels if the target level is exhausted.
 */
export function pickOneM3Question(level, excludeIds = []) {
  function candidatesAt(lvl) {
    return questions.filter(q => q.level === lvl && !excludeIds.includes(q.id))
  }

  let pool = candidatesAt(level)
  for (let delta = 1; pool.length === 0 && delta <= 2; delta++) {
    pool = [...candidatesAt(level + delta), ...candidatesAt(level - delta)]
  }

  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}
