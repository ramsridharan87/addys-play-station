import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrCreateTodaySession, getTodaySession } from '../lib/storage'

const MODULES = [
  {
    id: 1,
    name: 'Math Warm-Up',
    emoji: '🔢',
    description: 'Addition & subtraction with cars!',
    unlocked: true,
  },
  {
    id: 2,
    name: 'Word Work',
    emoji: '📖',
    description: 'Spelling and reading fun.',
    unlocked: false,
  },
  {
    id: 3,
    name: 'Challenge Math',
    emoji: '🧠',
    description: 'Tricky maths for champions.',
    unlocked: false,
  },
  {
    id: 4,
    name: 'Puzzle Time',
    emoji: '🧩',
    description: 'Logic puzzles and brain teasers.',
    unlocked: false,
  },
]

export default function Session() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)

  useEffect(() => {
    const s = getOrCreateTodaySession()
    setSession(s)
  }, [])

  function statusFor(mod) {
    if (!mod.unlocked) return 'locked'
    if (session?.modulesCompleted?.includes(mod.id)) return 'complete'
    return 'available'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                    flex flex-col items-center px-4 py-6 gap-5">

      {/* Header */}
      <div className="w-full max-w-md flex items-center gap-3">
        <button
          className="text-white/80 font-semibold text-base bg-white/20
                     rounded-xl px-3 py-2 active:bg-white/30"
          style={{ minHeight: '48px' }}
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1 className="flex-1 text-2xl font-extrabold text-white text-center">
          Today's Session
        </h1>
        <div style={{ width: '64px' }} /> {/* balance back button */}
      </div>

      {/* Module cards */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {MODULES.map(mod => {
          const status = statusFor(mod)
          return (
            <button
              key={mod.id}
              disabled={status !== 'available'}
              onClick={() => status === 'available' && navigate(`/activity/${mod.id}`)}
              className={`w-full rounded-3xl p-5 flex items-center gap-4 shadow-lg
                          text-left transition-transform
                          ${status === 'available'
                            ? 'bg-white active:scale-95 cursor-pointer'
                            : status === 'complete'
                              ? 'bg-green-50 cursor-default'
                              : 'bg-white/40 cursor-not-allowed'}
                        `}
              style={{ minHeight: '80px' }}
            >
              <span className={`text-4xl ${status === 'locked' ? 'grayscale opacity-50' : ''}`}>
                {status === 'complete' ? '✅' : status === 'locked' ? '🔒' : mod.emoji}
              </span>
              <div className="flex-1">
                <p className={`font-extrabold text-lg leading-tight
                               ${status === 'locked' ? 'text-gray-400' : 'text-blue-900'}`}>
                  {mod.name}
                </p>
                <p className={`text-sm mt-0.5
                               ${status === 'locked' ? 'text-gray-400' : 'text-blue-600'}`}>
                  {mod.description}
                </p>
              </div>
              {status === 'available' && (
                <span className="text-blue-400 text-2xl font-bold">›</span>
              )}
              {status === 'complete' && (
                <span className="text-green-600 font-bold text-sm">Done!</span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-white/60 text-sm mt-2">More modules coming soon!</p>
    </div>
  )
}
