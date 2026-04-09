// ─── Keys ────────────────────────────────────────────────────────────────────
const KEYS = {
  profile:  'addy_profile',
  sessions: 'addy_sessions',
  results:  'addy_results',
  m1level:  'addy_m1_level',
  m2level:  'addy_m2_level',
}

// ─── Generic helpers ─────────────────────────────────────────────────────────
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export function getProfile() {
  return read(KEYS.profile, null)
}

export function saveProfile(name) {
  write(KEYS.profile, { name, startDate: new Date().toISOString().slice(0, 10) })
}

// ─── Sessions ─────────────────────────────────────────────────────────────────
export function getSessions() {
  return read(KEYS.sessions, [])
}

/** Returns today's session if it exists, otherwise null */
export function getTodaySession() {
  const today = new Date().toISOString().slice(0, 10)
  return getSessions().find(s => s.date === today) ?? null
}

/** Creates a new session for today and returns it. No-ops if one already exists. */
export function getOrCreateTodaySession() {
  const existing = getTodaySession()
  if (existing) return existing
  const sessions = getSessions()
  const session = {
    id: Date.now().toString(),
    date: new Date().toISOString().slice(0, 10),
    modulesCompleted: [],
    totalMinutes: 0,
  }
  write(KEYS.sessions, [...sessions, session])
  return session
}

export function markModuleComplete(sessionId, moduleId) {
  const sessions = getSessions()
  const updated = sessions.map(s => {
    if (s.id !== sessionId) return s
    const already = s.modulesCompleted.includes(moduleId)
    return already ? s : { ...s, modulesCompleted: [...s.modulesCompleted, moduleId] }
  })
  write(KEYS.sessions, updated)
}

// ─── Results ──────────────────────────────────────────────────────────────────
export function getResults() {
  return read(KEYS.results, [])
}

export function appendResults(newResults) {
  write(KEYS.results, [...getResults(), ...newResults])
}

// ─── Module 1 difficulty level ────────────────────────────────────────────────
export function getM1Level() {
  return read(KEYS.m1level, null) // null means "use first-session rule"
}

export function saveM1Level(level) {
  write(KEYS.m1level, Math.min(5, Math.max(1, level)))
}

// ─── Module 2 difficulty level ────────────────────────────────────────────────
export function getM2Level() {
  return read(KEYS.m2level, null) // null means "use first-session rule" (start at 1)
}

export function saveM2Level(level) {
  write(KEYS.m2level, Math.min(3, Math.max(1, level)))
}

// ─── Streak calculation ───────────────────────────────────────────────────────
export function getStreak() {
  const sessions = getSessions()
  if (sessions.length === 0) return 0

  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  // Streak only counts if today or yesterday has a session
  if (dates[0] !== today) {
    // Check if yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    if (dates[0] !== yesterday) return 0
  }

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (prev - curr) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

// ─── Trophy unlock checks ─────────────────────────────────────────────────────
export function getTrophyStatus() {
  const sessions = getSessions()
  const results = getResults()
  const streak = getStreak()
  const totalCompleted = sessions.filter(s => s.modulesCompleted.length > 0).length

  return {
    firstSession: totalCompleted >= 1,
    streak3:      streak >= 3,
    streak7:      streak >= 7,
    questions50:  results.length >= 50,
  }
}
