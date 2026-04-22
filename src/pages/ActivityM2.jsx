import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getM2Level, saveM2Level,
  getOrCreateTodaySession, markModuleComplete, appendResults,
} from '../lib/storage'
import { pickQuestions } from '../data/m2questions'
import Mascot from '../components/Mascot'

const TOTAL = 8

const IDLE_MSG = 'Which one looks right, Addy? 🏎️'
const CORRECT_MSGS = [
  'Great spelling, Addy! 🚗',
  'You nailed it! 🏎️',
  'Brilliant! 🌟',
  "That's right! Keep going! ⚡",
]
const RETRY_MSGS = [
  'Not quite! Try once more, Addy! 💪',
  'Almost there! Have another go! 🤔',
]
const revealMsg  = (word) => `The right answer is ${word} — you'll get the next one! 🚗`
const randomFrom = (arr)  => arr[Math.floor(Math.random() * arr.length)]

// Render a Type B sentence, replacing ___ with a styled blank span
function SentenceWithBlank({ sentence }) {
  const [before, after] = sentence.split('___')
  return (
    <p className="text-xl font-bold text-blue-900 leading-snug text-center">
      {before}
      <span className="inline-block border-b-4 border-blue-400 px-3 mx-1 text-blue-300
                       min-w-[3rem] text-center">
        ___
      </span>
      {after}
    </p>
  )
}

export default function ActivityM2() {
  const navigate = useNavigate()

  // ── Refs ──────────────────────────────────────────────────────────────────
  const sessionRef       = useRef(null)
  const levelRef         = useRef(null)
  const resultsRef       = useRef([])
  const correctStreakRef = useRef(0)
  const wrongStreakRef   = useRef(0)
  const qIndexRef        = useRef(0)
  const attemptRef       = useRef(1)    // 1 = first attempt, 2 = second
  const isAdvancing      = useRef(false) // true during 1-s pause between questions

  // ── State (rendering only) ────────────────────────────────────────────────
  const [questions, setQuestions]       = useState([])
  const [qIndex, setQIndex]             = useState(0)
  const [disabled, setDisabled]         = useState(false) // pad locked during advance
  const [selectedWrong, setSelectedWrong] = useState(null) // option string → amber highlight
  const [mascotMsg, setMascotMsg]       = useState(IDLE_MSG)
  const [mascotMood, setMascotMood]     = useState('idle')

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    sessionRef.current = getOrCreateTodaySession()   // ensures session always exists
    const saved = getM2Level()
    levelRef.current = saved === null ? 1 : saved
    setQuestions(pickQuestions(levelRef.current))
  }, [])

  const currentQ = questions[qIndex]

  // ── Option tap handler ────────────────────────────────────────────────────
  function handleOptionTap(option) {
    if (isAdvancing.current || !currentQ || disabled) return

    if (option === currentQ.correct) {
      // ── Correct ────────────────────────────────────────────────────────
      pushResult(true)
      correctStreakRef.current += 1
      wrongStreakRef.current    = 0
      checkLevelAdjust()
      setMascotMood('happy')
      setMascotMsg(randomFrom(CORRECT_MSGS))
      beginAdvance()
    } else if (attemptRef.current === 1) {
      // ── First wrong — reset correct streak, amber highlight, retry ─────
      attemptRef.current = 2
      correctStreakRef.current = 0   // a wrong answer breaks any correct run
      setSelectedWrong(option)
      setMascotMood('thinking')
      setMascotMsg(randomFrom(RETRY_MSGS))
      // disabled stays false — buttons stay live for retry
    } else {
      // ── Second wrong — reveal, advance ────────────────────────────────
      pushResult(false)
      correctStreakRef.current  = 0
      wrongStreakRef.current   += 1
      checkLevelAdjust()
      setSelectedWrong(option)
      setMascotMood('idle')
      setMascotMsg(revealMsg(currentQ.correct))
      beginAdvance()
    }
  }

  function beginAdvance() {
    isAdvancing.current = true
    setDisabled(true)
    setTimeout(advance, 1000)
  }

  // ── Level adjustment ──────────────────────────────────────────────────────
  function checkLevelAdjust() {
    if (correctStreakRef.current >= 3) {
      levelRef.current = Math.min(3, levelRef.current + 1)
      correctStreakRef.current = 0
      saveM2Level(levelRef.current)   // persist immediately on level change
    }
    if (wrongStreakRef.current >= 2) {
      levelRef.current = Math.max(1, levelRef.current - 1)
      wrongStreakRef.current = 0
      saveM2Level(levelRef.current)   // persist immediately on level change
    }
  }

  // ── Record result ─────────────────────────────────────────────────────────
  function pushResult(isCorrect) {
    resultsRef.current = [
      ...resultsRef.current,
      {
        sessionId:       sessionRef.current?.id ?? 'unknown',
        module:          2,
        topic:           `${currentQ.type}-${currentQ.category}`,
        difficultyLevel: currentQ.level,
        correct:         isCorrect,
        attempts:        attemptRef.current,
        timestamp:       new Date().toISOString(),
      },
    ]
  }

  // ── Advance to next question ───────────────────────────────────────────────
  function advance() {
    qIndexRef.current += 1

    if (qIndexRef.current >= TOTAL) {
      finishModule()
    } else {
      attemptRef.current  = 1
      isAdvancing.current = false

      setQIndex(qIndexRef.current)
      setDisabled(false)
      setSelectedWrong(null)
      setMascotMood('idle')
      setMascotMsg(IDLE_MSG)
    }
  }

  // ── Finish module ─────────────────────────────────────────────────────────
  function finishModule() {
    const allResults = resultsRef.current
    appendResults(allResults)
    saveM2Level(levelRef.current)
    if (sessionRef.current) markModuleComplete(sessionRef.current.id, 2)

    const correct = allResults.filter(r => r.correct).length
    navigate('/end-of-session', {
      state: { correct, total: TOTAL, module: 2 },
    })
  }

  // ── Render guard ──────────────────────────────────────────────────────────
  if (questions.length === 0) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                    flex flex-col items-center px-4 py-5 gap-4">

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-white/80 text-sm font-semibold mb-1 px-1">
          <span>Question {qIndex + 1} of {TOTAL}</span>
          <span className="capitalize">{currentQ?.category}</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3">
          <div
            className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(qIndex / TOTAL) * 100}%` }}
          />
        </div>
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i < qIndex     ? 'w-3 h-3 bg-yellow-400'
                : i === qIndex ? 'w-3 h-3 bg-white'
                               : 'w-2 h-2 bg-white/40 self-center'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3">
        {currentQ?.type === 'A' ? (
          <>
            {/* Intentionally NO word label — showing the word gives away the answer */}
            <span className="text-7xl leading-none">{currentQ.emoji}</span>
            <p className="text-sm text-blue-400 font-semibold">Choose the correct spelling</p>
          </>
        ) : (
          <>
            <p className="text-sm text-blue-400 font-semibold mb-1">Fill in the blank</p>
            <SentenceWithBlank sentence={currentQ.sentence} />
          </>
        )}
      </div>

      {/* Option buttons */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {currentQ?.options.map(option => {
          const isWrong = selectedWrong === option
          return (
            <button
              key={option}
              onPointerDown={() => handleOptionTap(option)}
              disabled={disabled}
              className={`w-full rounded-2xl font-bold text-xl shadow-md
                          transition-transform active:scale-95 border-2
                          ${isWrong
                            ? 'bg-amber-100 border-amber-400 text-amber-900'
                            : 'bg-white border-blue-200 text-blue-900'}
                          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                        `}
              style={{ minHeight: '64px' }}
            >
              {option}
            </button>
          )
        })}
      </div>

      {/* Mascot */}
      <div className="w-full max-w-md flex justify-center pb-4">
        <Mascot mood={mascotMood} message={mascotMsg} size={110} />
      </div>
    </div>
  )
}
