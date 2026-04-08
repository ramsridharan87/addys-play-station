/**
 * Module 1 question bank — 60 car-themed addition & subtraction questions.
 *
 * Structure: 6 contexts × 5 levels × 2 questions = 60 total.
 * Contexts: race | garage | roadtrip | carwash | parking | collection
 * Levels:
 *   1 — single digit, no carrying
 *   2 — two-digit + single-digit, no carrying
 *   3 — two-digit + two-digit, no carrying
 *   4 — two-digit + two-digit, with carrying
 *   5 — three-digit numbers
 *
 * Every question addresses Addy by name at least once.
 * pickQuestions() guarantees no two consecutive questions share a context.
 */

const Q = (id, level, context, text, answer) => ({ id, level, context, text, answer })

const questions = [

  // ════════════════════════════════════════════════════════════════════════════
  // RACE TRACK — cars racing, lap times, finishing positions
  // ════════════════════════════════════════════════════════════════════════════

  // Level 1
  Q(1001, 1, 'race',
    "Addy has 3 race cars lined up at the start. 4 more zoom onto the track. How many race cars are there now?",
    7),
  Q(1002, 1, 'race',
    "There are 9 cars racing around the track. 2 spin out and stop. How many cars are still racing, Addy?",
    7),

  // Level 2
  Q(1003, 2, 'race',
    "Addy's driver has done 32 laps. He does 5 more before the pit stop. How many laps has he completed?",
    37),
  Q(1004, 2, 'race',
    "There are 61 cars entered in the big race. 7 break down before the start. How many cars actually race, Addy?",
    54),

  // Level 3
  Q(1005, 3, 'race',
    "Addy's team drove 34 laps in race one and 25 laps in race two. How many laps did they drive altogether?",
    59),
  Q(1006, 3, 'race',
    "76 cars entered Addy's favourite championship. 23 didn't finish. How many cars crossed the finish line?",
    53),

  // Level 4
  Q(1007, 4, 'race',
    "Addy's driver did 47 laps on Saturday and 38 laps on Sunday. How many laps did he complete in total?",
    85),
  Q(1008, 4, 'race',
    "56 cars entered race one and 37 cars entered race two. How many cars raced altogether, Addy?",
    93),

  // Level 5
  Q(1009, 5, 'race',
    "Addy's favourite racing team has 245 trophies in their cabinet. They win 138 more this season. How many trophies do they have now?",
    383),
  Q(1010, 5, 'race',
    "The big racetrack recorded 512 laps on Saturday and 347 laps on Sunday. How many laps did Addy count altogether?",
    859),

  // ════════════════════════════════════════════════════════════════════════════
  // GARAGE & REPAIRS — mechanics, tools, spare parts, tyres
  // ════════════════════════════════════════════════════════════════════════════

  // Level 1
  Q(2001, 1, 'garage',
    "Addy's mechanic has 5 tyres stacked in the garage. She brings in 3 more. How many tyres are there now?",
    8),
  Q(2002, 1, 'garage',
    "The garage has 7 tools on the workbench. Addy puts 2 back in the drawer. How many tools are still on the bench?",
    5),

  // Level 2
  Q(2003, 2, 'garage',
    "Addy's garage has 43 spare parts on the shelf. The mechanic uses 3 to fix a car. How many spare parts are left?",
    40),
  Q(2004, 2, 'garage',
    "A mechanic has 25 bolts in her toolbox. Addy hands her 4 more. How many bolts does she have now?",
    29),

  // Level 3
  Q(2005, 3, 'garage',
    "Addy's garage fixed 32 cars in the morning and 16 cars in the afternoon. How many cars did the garage fix today?",
    48),
  Q(2006, 3, 'garage',
    "The garage had 57 spare tyres on the rack. Addy helped the mechanic use 24 of them. How many spare tyres are left?",
    33),

  // Level 4
  Q(2007, 4, 'garage',
    "Addy's garage fixed 48 cars last week and 35 cars this week. How many cars has the garage fixed altogether?",
    83),
  Q(2008, 4, 'garage',
    "The head mechanic had 74 spare parts. She used 28 of them fixing Addy's car. How many spare parts does she have left?",
    46),

  // Level 5
  Q(2009, 5, 'garage',
    "Addy's mega garage has 326 spare parts in stock. 148 get used up in one busy week. How many spare parts are left?",
    178),
  Q(2010, 5, 'garage',
    "The garage ordered 254 new tyres and already had 137 in stock. How many tyres does Addy's garage have altogether?",
    391),

  // ════════════════════════════════════════════════════════════════════════════
  // ROAD TRIP — miles driven, fuel stops, distance between cities
  // ════════════════════════════════════════════════════════════════════════════

  // Level 1
  Q(3001, 1, 'roadtrip',
    "Addy drives 4 miles to the first petrol station. Then he drives 5 more miles to the hotel. How far has Addy driven?",
    9),
  Q(3002, 1, 'roadtrip',
    "Addy stops at 8 traffic lights on his road trip. 3 of them are green when he arrives. How many are red for Addy?",
    5),

  // Level 2
  Q(3003, 2, 'roadtrip',
    "Addy has driven 54 miles so far on his road trip. He drives 5 more miles to reach the next town. How many miles has Addy driven?",
    59),
  Q(3004, 2, 'roadtrip',
    "Addy drives 72 miles on day one of his road trip and 6 miles on day two. How many miles has Addy driven in total?",
    78),

  // Level 3
  Q(3005, 3, 'roadtrip',
    "Addy drove 43 miles before lunch and 35 miles after lunch on his big road trip. How many miles did Addy drive today?",
    78),
  Q(3006, 3, 'roadtrip',
    "The trip from Addy's house to the mountains is 68 miles. He has already driven 47 miles. How many miles are left for Addy?",
    21),

  // Level 4
  Q(3007, 4, 'roadtrip',
    "Addy drove 47 miles on day one of his road trip and 38 miles on day two. How many miles has Addy driven altogether?",
    85),
  Q(3008, 4, 'roadtrip',
    "Addy's road trip is 73 miles long. He has driven 48 miles so far. How many miles are left for Addy to drive?",
    25),

  // Level 5
  Q(3009, 5, 'roadtrip',
    "Addy drives 356 miles on day one of his big road trip and 215 miles on day two. How many miles has Addy driven in total?",
    571),
  Q(3010, 5, 'roadtrip',
    "Addy's epic road trip is 624 miles long. He has already driven 358 miles. How many miles are left for Addy to drive?",
    266),

  // ════════════════════════════════════════════════════════════════════════════
  // CAR WASH — cars in queue, cars being cleaned, cars waiting
  // ════════════════════════════════════════════════════════════════════════════

  // Level 1
  Q(4001, 1, 'carwash',
    "There are 5 cars waiting at Addy's car wash. 3 more join the queue. How many cars are waiting now?",
    8),
  Q(4002, 1, 'carwash',
    "Addy counts 9 cars at the car wash. 4 get cleaned and drive away. How many cars are still there?",
    5),

  // Level 2
  Q(4003, 2, 'carwash',
    "Addy's car wash cleaned 31 cars in the morning. It cleans 6 more before lunchtime. How many cars has it cleaned?",
    37),
  Q(4004, 2, 'carwash',
    "There are 44 cars in the queue at Addy's car wash. 4 get tired of waiting and drive away. How many cars are left?",
    40),

  // Level 3
  Q(4005, 3, 'carwash',
    "Addy's car wash cleaned 41 cars before noon and 36 cars after noon. How many cars did it clean today?",
    77),
  Q(4006, 3, 'carwash',
    "55 cars were booked in for a wash at Addy's car wash. 22 have already been cleaned. How many are still waiting?",
    33),

  // Level 4
  Q(4007, 4, 'carwash',
    "Addy's car wash cleaned 37 cars in the morning and 46 in the afternoon. How many cars were cleaned today?",
    83),
  Q(4008, 4, 'carwash',
    "82 cars were booked in for a wash at Addy's car wash today. 47 have been cleaned. How many are still waiting?",
    35),

  // Level 5
  Q(4009, 5, 'carwash',
    "Addy's car wash cleaned 312 cars last month and 278 cars this month. How many cars has it cleaned altogether?",
    590),
  Q(4010, 5, 'carwash',
    "Addy's car wash has cleaned 500 cars this year. 263 of them were red cars. How many were NOT red cars?",
    237),

  // ════════════════════════════════════════════════════════════════════════════
  // PARKING LOT — cars arriving, cars leaving, spaces filling up
  // ════════════════════════════════════════════════════════════════════════════

  // Level 1
  Q(5001, 1, 'parking',
    "Addy sees 6 cars in the car park. 2 more drive in and find a space. How many cars are in the car park now?",
    8),
  Q(5002, 1, 'parking',
    "There are 7 cars parked outside Addy's school. 3 drive away at home time. How many cars are left?",
    4),

  // Level 2
  Q(5003, 2, 'parking',
    "Addy counts 52 cars in the big car park. 5 more arrive and find a space. How many cars are there now?",
    57),
  Q(5004, 2, 'parking',
    "There are 63 cars in the car park when Addy arrives. 3 drive away. How many cars are left?",
    60),

  // Level 3
  Q(5005, 3, 'parking',
    "In the morning Addy counted 43 cars in the car park. By the afternoon, 26 more had arrived. How many cars are there now?",
    69),
  Q(5006, 3, 'parking',
    "The car park had 87 cars. 54 drove home after the match. How many cars are still parked, Addy?",
    33),

  // Level 4
  Q(5007, 4, 'parking',
    "Addy counted 58 cars in car park A and 37 in car park B. How many cars are there altogether?",
    95),
  Q(5008, 4, 'parking',
    "The shopping centre car park had 81 cars this morning. 46 drove away before lunch. How many cars are left, Addy?",
    35),

  // Level 5
  Q(5009, 5, 'parking',
    "Addy counts 425 cars in the north car park and 163 in the south car park. How many cars are there altogether?",
    588),
  Q(5010, 5, 'parking',
    "The stadium car park had 714 cars. After the big match, 357 drove home. How many cars are left in the car park, Addy?",
    357),

  // ════════════════════════════════════════════════════════════════════════════
  // CAR COLLECTION — toy cars, trading cards, stickers of cars
  // ════════════════════════════════════════════════════════════════════════════

  // Level 1
  Q(6001, 1, 'collection',
    "Addy has 5 toy cars on his shelf. He gets 4 more for his birthday. How many toy cars does Addy have now?",
    9),
  Q(6002, 1, 'collection',
    "Addy has 8 car stickers. He gives 3 to his friend Sam. How many stickers does Addy have left?",
    5),

  // Level 2
  Q(6003, 2, 'collection',
    "Addy has 21 toy cars in his collection. He buys 7 more at the toy shop. How many toy cars does Addy have now?",
    28),
  Q(6004, 2, 'collection',
    "Addy has 45 car trading cards. He gives 4 away to his cousin. How many cards does Addy have left?",
    41),

  // Level 3
  Q(6005, 3, 'collection',
    "Addy has 31 toy cars and his cousin Leo has 24. How many toy cars do they have between them?",
    55),
  Q(6006, 3, 'collection',
    "Addy had 67 car stickers in his album. He gave 34 away at school. How many stickers does Addy have left?",
    33),

  // Level 4
  Q(6007, 4, 'collection',
    "Addy has 64 toy cars and his friend Zac has 29. How many toy cars do they have between them?",
    93),
  Q(6008, 4, 'collection',
    "Addy had 75 car trading cards. He traded away 38 at the school fair. How many cards does Addy have now?",
    37),

  // Level 5
  Q(6009, 5, 'collection',
    "Addy has 248 toy cars in his room. His grandpa gives him 135 more from his own collection. How many toy cars does Addy have now?",
    383),
  Q(6010, 5, 'collection',
    "Addy started with 512 car stickers. He gives 247 away to his classmates at the end of term. How many stickers does Addy have left?",
    265),
]

export default questions

// ── Shuffle helper: no two consecutive questions from the same context ─────────
function spreadByContext(pool) {
  // Group into per-context buckets, shuffle within each
  const buckets = {}
  for (const q of pool) {
    (buckets[q.context] ??= []).push(q)
  }
  for (const arr of Object.values(buckets)) arr.sort(() => Math.random() - 0.5)

  const result = []
  while (result.length < pool.length) {
    const lastCtx = result.at(-1)?.context ?? null

    // Prefer a different context than the last; break ties by largest remaining bucket
    const candidates = Object.entries(buckets)
      .filter(([, arr]) => arr.length > 0)
      .sort(([ctxA, arrA], [ctxB, arrB]) => {
        const blocked = (ctx) => (ctx === lastCtx ? 1 : 0)
        if (blocked(ctxA) !== blocked(ctxB)) return blocked(ctxA) - blocked(ctxB)
        return arrB.length - arrA.length   // larger bucket wins ties
      })

    if (candidates.length === 0) break
    result.push(candidates[0][1].shift())
  }

  return result
}

/**
 * Pick `count` questions appropriate for `level`.
 * Falls back to adjacent levels if the exact level doesn't have enough.
 * Guarantees no two consecutive questions share a context.
 */
export function pickQuestions(level, count = 10) {
  // Build candidate pool: exact level first, then widen outward
  const pool = []
  pool.push(...questions.filter(q => q.level === level))
  for (let delta = 1; pool.length < count && delta <= 4; delta++) {
    pool.push(...questions.filter(q => q.level === level + delta))
    pool.push(...questions.filter(q => q.level === level - delta))
  }

  // Random-shuffle the whole pool, then take the first `count`
  const shuffled = pool
    .sort(() => Math.random() - 0.5)
    .slice(0, count)

  // Re-order so no two consecutive questions share a context
  return spreadByContext(shuffled)
}
