import { useLocation, useNavigate } from 'react-router-dom'
import Mascot from '../components/Mascot'

const CAR_FACTS = [
  "The fastest production car ever built can go over 300 miles per hour! 🏎️",
  "Formula 1 cars can go from 0 to 60 mph in less than 2 seconds! ⚡",
  "Race car tires get so hot during a race they can reach 120°C — that's really toasty! 🔥",
  "The first car ever made only went about 10 miles per hour — slower than a bicycle! 🚲",
  "NASCAR race cars have NO doors — drivers climb in through the window! 🪟",
]

function randomFact() {
  return CAR_FACTS[Math.floor(Math.random() * CAR_FACTS.length)]
}

function starRating(correct, total) {
  const pct = correct / total
  if (pct > 0.85) return 3
  if (pct >= 0.6)  return 2
  return 1
}

export default function EndOfSession() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  // Fallback if navigated directly
  const correct = state?.correct ?? 0
  const total   = state?.total   ?? 10
  const stars   = starRating(correct, total)
  const fact    = randomFact()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                    flex flex-col items-center justify-center px-4 py-8 gap-6">

      {/* Celebration heading */}
      <div className="text-center">
        <p className="text-white text-lg font-semibold opacity-80 mb-1">Session complete!</p>
        <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
          Great session, Addy! 🎉
        </h1>
      </div>

      {/* Mascot celebrating */}
      <Mascot mood="happy" size={130} />

      {/* Score card */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 flex flex-col items-center gap-4">

        {/* Stars */}
        <div className="flex gap-2 text-5xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`transition-all ${i < stars ? 'drop-shadow-md' : 'grayscale opacity-30'}`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Score */}
        <p className="text-2xl font-extrabold text-blue-900">
          {correct} / {total} correct
        </p>

        <div className="w-full bg-blue-100 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${(correct / total) * 100}%` }}
          />
        </div>

        {/* Encouragement */}
        <p className="text-blue-700 font-semibold text-base text-center">
          {stars === 3 && "Perfect driving — you're a champion! 🏆"}
          {stars === 2 && "Really solid work! Keep pushing! 💪"}
          {stars === 1 && "Good effort! You'll zoom faster next time! 🚀"}
        </p>
      </div>

      {/* Fun car fact */}
      <div className="bg-yellow-100 border-2 border-yellow-300 rounded-3xl
                      w-full max-w-sm p-5 flex flex-col gap-2">
        <p className="font-extrabold text-yellow-800 text-sm uppercase tracking-wide">
          🚗 Fun Car Fact
        </p>
        <p className="text-blue-900 font-semibold text-base leading-snug">{fact}</p>
      </div>

      {/* See you tomorrow */}
      <p className="text-white font-bold text-lg text-center drop-shadow">
        See you tomorrow, Addy! 👋
      </p>

      {/* Go Home button */}
      <button
        className="w-full max-w-sm bg-yellow-400 text-blue-900 font-extrabold
                   text-xl rounded-3xl shadow-lg py-5
                   active:bg-yellow-500 active:scale-95 transition-transform"
        style={{ minHeight: '64px' }}
        onClick={() => navigate('/')}
      >
        Go Home 🏠
      </button>
    </div>
  )
}
