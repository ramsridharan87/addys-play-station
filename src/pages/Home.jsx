import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, saveProfile, getStreak, getTrophyStatus } from '../lib/storage'
import Mascot from '../components/Mascot'

const TROPHIES = [
  { key: 'firstSession', label: 'First Race!',  emoji: '🏆' },
  { key: 'streak3',      label: '3-Day Streak', emoji: '🔥' },
  { key: 'streak7',      label: '7-Day Streak', emoji: '⭐' },
  { key: 'questions50',  label: '50 Questions', emoji: '🚀' },
]

export default function Home() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [nameInput, setNameInput] = useState('')
  const [streak, setStreak]       = useState(0)
  const [trophies, setTrophies]   = useState({})
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const p = getProfile()
    if (p) {
      setProfile(p)
      setStreak(getStreak())
      setTrophies(getTrophyStatus())
    }
    setLoading(false)
  }, [])

  function handleStart() {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    saveProfile(trimmed)
    const p = { name: trimmed }
    setProfile(p)
    setStreak(0)
    setTrophies(getTrophyStatus())
  }

  if (loading) return null

  // ── First-time name form ────────────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                      flex flex-col items-center justify-center px-6 gap-8">
        <h1 className="text-4xl font-extrabold text-white text-center drop-shadow-md">
          Addy's Play Station
        </h1>

        <Mascot mood="happy" />

        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-5">
          <p className="text-xl font-bold text-blue-800 text-center">
            What's your name? 👋
          </p>
          <input
            className="border-2 border-blue-300 rounded-2xl px-4 py-3 text-2xl
                       font-bold text-blue-900 outline-none focus:border-blue-500
                       text-center"
            placeholder="Type your name"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            autoFocus
            maxLength={20}
          />
          <button
            className="bg-blue-600 text-white font-extrabold text-xl rounded-2xl
                       py-4 shadow-md active:bg-blue-700 active:scale-95
                       transition-transform disabled:opacity-40"
            style={{ minHeight: '56px' }}
            onClick={handleStart}
            disabled={!nameInput.trim()}
          >
            Start! 🚗
          </button>
        </div>
      </div>
    )
  }

  // ── Main Home screen ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                    flex flex-col items-center px-4 py-6 gap-6">

      {/* Title */}
      <h1 className="text-3xl font-extrabold text-white drop-shadow-md text-center">
        Addy's Play Station
      </h1>

      {/* Mascot */}
      <Mascot mood="happy" message={`Hey ${profile.name}! Ready to race? 🏎️`} size={130} />

      {/* Streak */}
      <div className="bg-white/20 rounded-2xl px-6 py-3 flex items-center gap-2">
        <span className="text-3xl">🔥</span>
        {streak > 0 ? (
          <span className="text-white font-bold text-lg">
            {streak} day{streak !== 1 ? 's' : ''} in a row!
          </span>
        ) : (
          <span className="text-white/80 font-semibold text-lg">
            Start your streak today!
          </span>
        )}
      </div>

      {/* Trophy shelf */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-5">
        <h2 className="text-blue-800 font-extrabold text-lg mb-4 text-center">
          🏅 Trophy Shelf
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {TROPHIES.map(t => {
            const unlocked = !!trophies[t.key]
            return (
              <div
                key={t.key}
                className={`flex flex-col items-center gap-1 rounded-2xl p-2
                            ${unlocked ? 'bg-yellow-50' : 'bg-gray-100'}`}
              >
                <span
                  className={`text-3xl transition-all ${unlocked ? '' : 'grayscale opacity-40'}`}
                >
                  {t.emoji}
                </span>
                <span
                  className={`text-xs font-bold text-center leading-tight
                              ${unlocked ? 'text-yellow-700' : 'text-gray-400'}`}
                >
                  {t.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Play button */}
      <button
        className="w-full max-w-md bg-yellow-400 text-blue-900 font-extrabold
                   text-2xl rounded-3xl shadow-lg py-5
                   active:bg-yellow-500 active:scale-95 transition-transform"
        style={{ minHeight: '72px' }}
        onClick={() => navigate('/session')}
      >
        Let's Play! 🚗💨
      </button>

      {/* Progress link */}
      <button
        className="self-end bg-white/20 text-white font-semibold text-base
                   rounded-2xl px-5 py-3 active:bg-white/30 transition-colors"
        style={{ minHeight: '48px' }}
        onClick={() => navigate('/progress')}
      >
        Progress →
      </button>
    </div>
  )
}
