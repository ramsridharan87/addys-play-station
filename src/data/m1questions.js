// 30 car-themed addition & subtraction questions, 6 per difficulty level.
// Each: { id, level, a, b, op, answer, text }

const Q = (id, level, text, answer) => ({ id, level, text, answer })

const questions = [
  // ── Level 1: single digit, no carrying ──────────────────────────────────────
  Q(101, 1,
    "Addy has 3 toy cars. He finds 4 more under the couch. How many toy cars does he have?",
    7),
  Q(102, 1,
    "There are 5 red cars and 2 blue cars in the garage. How many cars are there altogether?",
    7),
  Q(103, 1,
    "A race had 9 cars. 2 drove into the pit stop. How many cars are still on the track?",
    7),
  Q(104, 1,
    "Addy has 8 toy cars. He gives 3 to his friend Max. How many does Addy have left?",
    5),
  Q(105, 1,
    "There are 4 cars parked on Road Street and 5 more on Race Avenue. How many cars in total?",
    9),
  Q(106, 1,
    "The garage has 6 cars inside. 4 drive out for a race. How many cars are still in the garage?",
    2),

  // ── Level 2: two-digit + single-digit, no carrying ───────────────────────────
  Q(201, 2,
    "Addy has 23 toy cars. He gets 5 more at the race. How many does he have now?",
    28),
  Q(202, 2,
    "A racing team has 31 cars. They find 7 more in storage. How many cars do they have?",
    38),
  Q(203, 2,
    "The garage had 45 cars. 3 drove away to the track. How many cars are left in the garage?",
    42),
  Q(204, 2,
    "Addy counted 52 laps yesterday. He does 6 more today. How many laps has he counted in total?",
    58),
  Q(205, 2,
    "There are 64 cars in the big race. 4 break down and stop. How many cars are still racing?",
    60),
  Q(206, 2,
    "The racetrack had 71 cars signed up. 8 more joined at the last minute. How many cars in total?",
    79),

  // ── Level 3: two-digit + two-digit, no carrying ───────────────────────────────
  Q(301, 3,
    "A red car drove 34 miles and a blue car drove 25 miles. How many miles did they drive altogether?",
    59),
  Q(302, 3,
    "Addy has 21 toy cars and his friend has 14. How many toy cars do they have together?",
    35),
  Q(303, 3,
    "The big garage has 43 sports cars and 26 race cars. How many cars is that in total?",
    69),
  Q(304, 3,
    "62 cars started the championship race. 31 finished early. How many cars are still racing?",
    31),
  Q(305, 3,
    "There are 55 cars in the parking lot and 34 more waiting in the garage. How many cars altogether?",
    89),
  Q(306, 3,
    "Addy collected 47 car stickers. He gave 23 to his friend. How many stickers does Addy have left?",
    24),

  // ── Level 4: two-digit + two-digit, with carrying ────────────────────────────
  Q(401, 4,
    "A red car drove 47 miles. A blue car drove 38 miles. How far did they drive together?",
    85),
  Q(402, 4,
    "There are 56 cars on the left track and 27 on the right track. How many cars altogether?",
    83),
  Q(403, 4,
    "Addy has 65 toy cars. He gets 28 more for his birthday. How many toy cars does he have now?",
    93),
  Q(404, 4,
    "The racetrack had 84 cars at the start. 37 have finished the race. How many are still going?",
    47),
  Q(405, 4,
    "The blue team has 49 cars and the red team has 46. How many cars are there in total?",
    95),
  Q(406, 4,
    "There were 73 cars at the car show. 48 drove home at the end. How many cars are still there?",
    25),

  // ── Level 5: three-digit numbers ─────────────────────────────────────────────
  Q(501, 5,
    "Addy's favourite track has 245 cars registered. 138 more sign up on race day. How many cars total?",
    383),
  Q(502, 5,
    "The big car show had 362 cars. 147 drove home after lunch. How many cars are left at the show?",
    215),
  Q(503, 5,
    "A race had 124 laps on day one and 253 laps on day two. How many laps is that altogether?",
    377),
  Q(504, 5,
    "The super garage has 431 toy cars. Addy donates 218 to the school. How many are left in the garage?",
    213),
  Q(505, 5,
    "Team Blue drove 356 miles and Team Red drove 425 miles. How far did they drive in total?",
    781),
  Q(506, 5,
    "500 cars entered the grand race. 278 have already finished. How many cars are still racing?",
    222),
]

export default questions

/**
 * Returns a shuffled array of `count` questions for the given level.
 * Falls back to adjacent levels if the exact level has fewer questions than needed.
 */
export function pickQuestions(level, count = 10) {
  const atLevel = questions.filter(q => q.level === level)
  // Build pool: exact level first, then adjacent levels
  const pool = [...atLevel]
  for (let delta = 1; pool.length < count && delta <= 4; delta++) {
    const up   = questions.filter(q => q.level === level + delta)
    const down = questions.filter(q => q.level === level - delta)
    pool.push(...up, ...down)
  }
  // Shuffle and slice
  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
}
