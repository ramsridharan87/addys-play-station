import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getM3Level, saveM3Level,
  getTodaySession, markModuleComplete, appendResults,
} from '../lib/storage'
import { pickOneM3Question } from '../data/m3questions'
import Mascot from '../components/Mascot'
import NumberPad from '../components/NumberPad'

const TOTAL = 8

const IDLE_MSG    = 'Take your time, Addy. Use the hint! 🔧'
const CORRECT_MSGS = [
  'You borrowed perfectly! 🚗',
  'Brilliant subtraction, Addy! ⚡',
  'Yes! You got it! 🏎️',
  'Amazing work — keep going! 🎉',
]
const revealMsg  = (answer) => `It was ${answer} — borrowing is tricky, keep going! 🚗`
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]

// ── Place Value Blocks visual ─────────────────────────────────────────────────

/** A single tens-rod: 12 × 60 px blue rectangle divided into 10 equal segments */
function Rod() {
  return (
    <div
      style={{
        width: 12,
        height: 60,
        backgroundColor: '#3b82f6',
        borderRadius: 3,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* 9 horizontal dividers creating 10 equal segments */}
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${((i + 1) / 10) * 100}%`,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
          }}
        />
      ))}
    </div>
  )
}

/** A single ones-unit: 12 × 12 px blue square */
function Unit() {
  return (
    <div
      style={{
        width: 12,
        height: 12,
        backgroundColor: '#3b82f6',
        borderRadius: 2,
        flexShrink: 0,
      }}
    />
  )
}

/**
 * Renders tens-rods on the left and ones-units on the right.
 * Units wrap into up to 5 columns so they stay compact.
 */
function PlaceValueBlocks({ number }) {
  const tens = Math.floor(number / 10)
  const ones = number % 10

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        justifyContent: 'center',
        padding: '8px 0',
      }}
    >
      {/* Tens rods */}
      {tens > 0 && (
        <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end' }}>
          {Array.from({ length: tens }).map((_, i) => (
            <Rod key={i} />
          ))}
        </div>
      )}

      {/* Divider line between rods and units */}
      {tens > 0 && ones > 0 && (
        <div
          style={{
            width: 1,
            height: 60,
            backgroundColor: '#cbd5e1',
            alignSelf: 'flex-end',
          }}
        />
      )}

      {/* Ones units — wrap in a grid of max 5 columns */}
      {ones > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 12px)',
            gap: 4,
            alignContent: 'end',
          }}
        >
          {Array.from({ length: ones }).map((_, i) => (
            <Unit key={i} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Module 3 activity ─────────────────────────────────────────────────────────

export default function ActivityM3() {
  const navigate = useNavigate()

  // ── Refs ───────────────────────────────────────────────────────────────────
  const sessionRef       = useRef(null)
  const levelRef         = useRef(null)   // current difficulty (1–3)
  const resultsRef       = useRef([])     // accumulated results, flushed at end
  const correctStreakRef = useRef(0)
  const wrongStreakRef   = useRef(0)
  const qIndexRef        = useRef(0)      // mirrors qIndex — safe inside setTimeout
  const attemptRef       = useRef(1)      // 1 = first attempt, 2 = second
  const inputRef         = useRef('')     // mirrors input state — always current
  const isAdvancing      = useRef(false)  // true during 1-s pause; blocks double-submit
  const usedIdsRef       = useRef([])     // IDs already served this session

  // ── State (rendering only) ─────────────────────────────────────────────────
  const [currentQ, setCurrentQ]       = useState(null)
  const [qIndex, setQIndex]           = useState(0)
  const [input, setInput]             = useState('')
  const [padDisabled, setPadDisabled] = useState(false)
  const [mascotMsg, setMascotMsg]     = useState(IDLE_MSG)
  const [mascotMood, setMascotMood]   = useState('idle')

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    sessionRef.current = getTodaySession()
    const saved = getM3Level()
    // Cap starting level at 2 — same fix applied to Module 1
    levelRef.current = saved === null ? 1 : Math.min(2, saved)
    const first = pickOneM3Question(levelRef.current, [])
    if (first) usedIdsRef.current = [first.id]
    console.log(`[M3] Question 1 — level: ${levelRef.current}`)
    setCurrentQ(first)
  }, [])

  // Keep inputRef in sync so handlers always read the latest value
  function updateInput(val) {
    inputRef.current = val
    setInput(val)
  }

  // ── Submit handler ─────────────────────────────────────────────────────────
  function handleSubmit() {
    if (isAdvancing.current || !currentQ || inputRef.current === '') return

    const guess = parseInt(inputRef.current, 10)

    if (attemptRef.current === 1) {
      // ── First attempt ────────────────────────────────────────────────────
      if (guess === currentQ.answer) {
        pushResult(true)
        correctStreakRef.current += 1
        wrongStreakRef.current    = 0
        checkLevelAdjust()
        setMascotMood('happy')
        setMascotMsg(randomFrom(CORRECT_MSGS))
        beginAdvance(1000)
      } else {
        // Wrong on attempt 1 — clear, show retry
        attemptRef.current = 2
        updateInput('')
        setMascotMood('thinking')
        setMascotMsg('Not quite! The hint might help 💪')
      }
    } else {
      // ── Second attempt — advance regardless ──────────────────────────────
      if (guess === currentQ.answer) {
        pushResult(true)
        correctStreakRef.current += 1
        wrongStreakRef.current    = 0
        setMascotMood('happy')
        setMascotMsg(randomFrom(CORRECT_MSGS))
      } else {
        pushResult(false)
        correctStreakRef.current  = 0
        wrongStreakRef.current   += 1
        setMascotMood('idle')
        setMascotMsg(revealMsg(currentQ.answer))
      }
      checkLevelAdjust()
      beginAdvance(1000)
    }
  }

  /** Locks the pad and fires the advance timer */
  function beginAdvance(delay) {
    isAdvancing.current = true
    setPadDisabled(true)
    setTimeout(advance, delay)
  }

  // ── Level adjustment ───────────────────────────────────────────────────────
  function checkLevelAdjust() {
    if (correctStreakRef.current >= 3) {
      levelRef.current = Math.min(3, levelRef.current + 1)
      correctStreakRef.current = 0
      saveM3Level(levelRef.current)
    }
    if (wrongStreakRef.current >= 2) {
      levelRef.current = Math.max(1, levelRef.current - 1)
      wrongStreakRef.current = 0
      saveM3Level(levelRef.current)
    }
  }

  // ── Record a result ────────────────────────────────────────────────────────
  function pushResult(isCorrect) {
    resultsRef.current = [
      ...resultsRef.current,
      {
        sessionId:       sessionRef.current?.id ?? 'unknown',
        module:          3,
        topic:           'subtraction-borrowing',
        difficultyLevel: currentQ.level,
        correct:         isCorrect,
        attempts:        attemptRef.current,
        timestamp:       new Date().toISOString(),
      },
    ]
  }

  // ── Advance to next question (called from setTimeout) ─────────────────────
  function advance() {
    qIndexRef.current += 1

    if (qIndexRef.current >= TOTAL) {
      finishModule()
    } else {
      const next = pickOneM3Question(levelRef.current, usedIdsRef.current)
      if (next) usedIdsRef.current = [...usedIdsRef.current, next.id]
      console.log(`[M3] Question ${qIndexRef.current + 1} — level: ${levelRef.current}`)

      attemptRef.current  = 1
      isAdvancing.current = false

      setQIndex(qIndexRef.current)
      setCurrentQ(next)
      updateInput('')
      setPadDisabled(false)
      setMascotMood('idle')
      setMascotMsg(IDLE_MSG)
    }
  }

  // ── Finish the module ──────────────────────────────────────────────────────
  function finishModule() {
    const allResults = resultsRef.current
    appendResults(allResults)
    saveM3Level(levelRef.current)
    if (sessionRef.current) markModuleComplete(sessionRef.current.id, 3)

    const correct = allResults.filter(r => r.correct).length
    navigate('/end-of-session', {
      state: { correct, total: TOTAL, module: 3 },
    })
  }

  // ── Render guard ───────────────────────────────────────────────────────────
  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                    flex flex-col items-center px-4 py-5 gap-4">

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-white/80 text-sm font-semibold mb-1 px-1">
          <span>Question {qIndex + 1} of {TOTAL}</span>
          <span>Level {currentQ.level}</span>
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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-4">

        {/* Place value blocks */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
            Tens &amp; Ones blocks for {currentQ.minuend}
          </p>
          <PlaceValueBlocks number={currentQ.minuend} />
        </div>

        {/* Divider */}
        <div className="w-full border-t border-blue-100" />

        {/* Word problem */}
        <p className="text-xl font-bold text-blue-900 leading-snug text-center">
          {currentQ.problem}
        </p>

        {/* Equation display */}
        <p className="text-3xl font-extrabold text-blue-800 tracking-wide">
          {currentQ.minuend} − {currentQ.subtrahend} = ___
        </p>

        {/* Hint panel — always visible in Phase 1 */}
        <div className="w-full rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800 text-center leading-snug">
            💡 Hint: You need to borrow! Break one rod into 10 small squares
            to help subtract the ones.
          </p>
        </div>
      </div>

      {/* Number pad */}
      <div className="w-full max-w-md">
        <NumberPad
          value={input}
          onChange={updateInput}
          onSubmit={handleSubmit}
          disabled={padDisabled}
        />
      </div>

      {/* Mascot */}
      <div className="w-full max-w-md flex justify-center pb-4">
        <Mascot mood={mascotMood} message={mascotMsg} size={110} />
      </div>
    </div>
  )
}
