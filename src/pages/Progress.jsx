import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessions, getResults, getM1Level, getStreak, getProfile } from '../lib/storage'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns array of ISO date strings for the last N days, oldest first */
function lastNDates(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toISOString().slice(0, 10)
  })
}

/**
 * Accuracy for a module over its last `sessionCount` sessions.
 * Returns null if no results exist for that module.
 */
function moduleAccuracy(results, sessions, moduleId, sessionCount = 5) {
  // Get the last N sessions (by date) that have this module completed
  const relevantSessions = [...sessions]
    .filter(s => s.modulesCompleted?.includes(moduleId))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, sessionCount)

  if (relevantSessions.length === 0) return null

  const ids = new Set(relevantSessions.map(s => s.id))
  const relevant = results.filter(r => r.module === moduleId && ids.has(r.sessionId))
  if (relevant.length === 0) return null

  const correct = relevant.filter(r => r.correct).length
  return Math.round((correct / relevant.length) * 100)
}

const MODULES = [
  { id: 1, name: 'Math Warm-Up',    emoji: '🔢' },
  { id: 2, name: 'Word Work',       emoji: '📖' },
  { id: 3, name: 'Challenge Math',  emoji: '🧠' },
  { id: 4, name: 'Puzzle Time',     emoji: '🧩' },
]

const LEVEL_LABELS = { 1: 'Starter', 2: 'Getting Going', 3: 'Solid', 4: 'Strong', 5: 'Champion' }

// ── Component ─────────────────────────────────────────────────────────────────

export default function Progress() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const sessions = getSessions()
    const results  = getResults()
    const profile  = getProfile()
    const streak   = getStreak()
    const m1Level  = getM1Level() ?? 1

    const dates      = lastNDates(14)
    const sessionSet = new Set(sessions.map(s => s.date))

    const moduleStats = MODULES.map(mod => {
      const acc = moduleAccuracy(results, sessions, mod.id, 5)
      const everPlayed = sessions.some(s => s.modulesCompleted?.includes(mod.id))
      return { ...mod, accuracy: acc, everPlayed }
    })

    setData({ dates, sessionSet, moduleStats, streak, m1Level, profile })
  }, [])

  if (!data) return null

  const { dates, sessionSet, moduleStats, streak, m1Level, profile } = data

  const needsAttention = moduleStats.filter(
    m => m.accuracy !== null && m.accuracy < 60
  )

  const name = profile?.name ?? 'Addy'

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                    flex flex-col items-center px-4 py-6 gap-5">

      {/* Header */}
      <div className="w-full max-w-md flex items-center gap-3">
        <button
          className="text-white/80 font-semibold bg-white/20 rounded-xl px-3 py-2
                     active:bg-white/30"
          style={{ minHeight: '48px' }}
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1 className="flex-1 text-2xl font-extrabold text-white text-center">
          {name}'s Progress
        </h1>
        <div style={{ width: '64px' }} />
      </div>

      {/* ── Streak + Calendar ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-blue-900 text-lg">Last 14 Days</h2>
          <span className="text-base font-bold text-orange-500">
            🔥 {streak} day{streak !== 1 ? 's' : ''} streak
          </span>
        </div>

        {/* Calendar row */}
        <div className="flex gap-1.5 justify-between">
          {dates.map(date => {
            const active   = sessionSet.has(date)
            const isToday  = date === new Date().toISOString().slice(0, 10)
            const dayLabel = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'narrow' })
            return (
              <div key={date} className="flex flex-col items-center gap-1">
                <div
                  className={`rounded-lg transition-colors
                    ${active
                      ? 'bg-blue-500'
                      : 'bg-gray-100 border border-gray-200'}
                    ${isToday ? 'ring-2 ring-yellow-400' : ''}
                  `}
                  style={{ width: '100%', aspectRatio: '1', minWidth: '18px', maxWidth: '36px' }}
                  title={date}
                />
                <span className={`text-[10px] font-semibold
                  ${isToday ? 'text-yellow-600' : 'text-gray-400'}`}>
                  {dayLabel}
                </span>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 text-center">
          Blue = session completed · Ring = today
        </p>
      </div>

      {/* ── Needs Attention ───────────────────────────────────────────── */}
      {needsAttention.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-3xl
                        w-full max-w-md p-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-extrabold text-orange-800 text-sm">Needs a little extra practice</p>
            <p className="text-orange-700 text-sm mt-0.5">
              {needsAttention.map(m => m.name).join(' and ')} — under 60% in recent sessions.
              Try again tomorrow!
            </p>
          </div>
        </div>
      )}

      {/* ── Module Accuracy ───────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-5 flex flex-col gap-4">
        <h2 className="font-extrabold text-blue-900 text-lg">Module Accuracy</h2>
        <p className="text-xs text-gray-400 -mt-2">Based on last 5 completed sessions per module</p>

        {moduleStats.map(mod => (
          <div key={mod.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 text-sm">
                {mod.emoji} {mod.name}
              </span>
              <span className={`font-extrabold text-sm
                ${mod.accuracy === null
                  ? 'text-gray-400'
                  : mod.accuracy < 60
                    ? 'text-orange-500'
                    : mod.accuracy >= 85
                      ? 'text-green-600'
                      : 'text-blue-600'}
              `}>
                {mod.accuracy === null
                  ? mod.everPlayed ? '—' : 'Not started'
                  : `${mod.accuracy}%`}
              </span>
            </div>

            {/* Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3">
              {mod.accuracy !== null && (
                <div
                  className={`h-3 rounded-full transition-all
                    ${mod.accuracy < 60
                      ? 'bg-orange-400'
                      : mod.accuracy >= 85
                        ? 'bg-green-500'
                        : 'bg-blue-500'}
                  `}
                  style={{ width: `${mod.accuracy}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Module 1 Level ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-5 flex flex-col gap-3">
        <h2 className="font-extrabold text-blue-900 text-lg">Math Warm-Up Level</h2>

        <div className="flex items-center justify-between">
          <span className="text-blue-700 font-semibold text-base">
            Level {m1Level} — {LEVEL_LABELS[m1Level]}
          </span>
          <span className="text-2xl">
            {m1Level >= 4 ? '🏆' : m1Level >= 2 ? '🚗' : '🏁'}
          </span>
        </div>

        {/* 5-pip level display */}
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-4 rounded-full transition-colors
                ${i < m1Level ? 'bg-blue-500' : 'bg-gray-100 border border-gray-200'}`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400">
          Level adjusts automatically based on how {name} is doing.
        </p>
      </div>

    </div>
  )
}
