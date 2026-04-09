import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getM1Level, saveM1Level,
  getTodaySession, markModuleComplete, appendResults,
} from '../lib/storage'
import { pickOneQuestion } from '../data/m1questions'
import Mascot from '../components/Mascot'
import NumberPad from '../components/NumberPad'
import ActivityM2 from './ActivityM2'

const TOTAL = 10

const IDLE_MSG = "You've got this! 🏎️"
const CORRECT_MSGS = [
  "Awesome job! 🎉",
  "Vroom vroom! Correct! 🏁",
  "You're on fire! ⭐",
  "Amazing, keep going! 🚀",
  "Yes! That's it! 🎊",
]
const revealMsg  = (answer) => `It was ${answer} — you'll get the next one! 🚗`
const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function Activity() {
  const { moduleId } = useParams()
  const navigate     = useNavigate()

  // ── Refs ─────────────────────────────────────────────────────────────────────
  const sessionRef       = useRef(null)
  const levelRef         = useRef(null)  // current difficulty (1–5)
  const resultsRef       = useRef([])    // accumulated results, flushed at end
  const correctStreakRef = useRef(0)
  const wrongStreakRef   = useRef(0)
  const qIndexRef        = useRef(0)     // mirrors qIndex — safe to read inside setTimeout
  const attemptRef       = useRef(1)     // 1 = first attempt, 2 = second attempt
  const inputRef         = useRef('')    // mirrors input state — always current in handlers
  const isAdvancing      = useRef(false) // true during the 1-s pause; blocks double-submit
  const usedIdsRef       = useRef([])    // IDs already served this session
  const lastContextRef   = useRef(null)  // context of last question (avoids back-to-back)

  // ── State (rendering only) ───────────────────────────────────────────────────
  const [currentQ, setCurrentQ]         = useState(null)
  const [qIndex, setQIndex]             = useState(0)
  const [input, setInput]               = useState('')
  const [padDisabled, setPadDisabled]   = useState(false) // re-renders pad after isAdvancing changes
  const [mascotMsg, setMascotMsg]       = useState(IDLE_MSG)
  const [mascotMood, setMascotMood]     = useState('idle')

  // ── Init ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    sessionRef.current = getTodaySession()
    const saved = getM1Level()
    // Bug 1: cap starting level at 2 so a stale high level doesn't dominate a fresh session
    levelRef.current = saved === null ? 1 : Math.min(2, saved)
    const first = pickOneQuestion(levelRef.current, [], null)
    if (first) {
      usedIdsRef.current    = [first.id]
      lastContextRef.current = first.context
    }
    console.log(`[M1] Question 1 — level: ${levelRef.current}`)
    setCurrentQ(first)
  }, [])

  // Keep inputRef in sync so handlers always read the latest value
  function updateInput(val) {
    inputRef.current = val
    setInput(val)
  }

  // ── Submit handler ────────────────────────────────────────────────────────────
  function handleSubmit() {
    // Guard: ignore if mid-advance or nothing typed
    if (isAdvancing.current || !currentQ || inputRef.current === '') return

    const guess = parseInt(inputRef.current, 10)

    if (attemptRef.current === 1) {
      // ── First attempt ──────────────────────────────────────────────────────
      if (guess === currentQ.answer) {
        pushResult(true)
        correctStreakRef.current += 1
        wrongStreakRef.current    = 0
        checkLevelAdjust()
        setMascotMood('happy')
        setMascotMsg(randomFrom(CORRECT_MSGS))
        beginAdvance(1000)
      } else {
        // Wrong on attempt 1 — clear input, show retry, keep pad enabled
        attemptRef.current = 2
        updateInput('')
        setMascotMood('thinking')
        setMascotMsg(`So close! Try once more, Addy! 💪`)
        // padDisabled intentionally NOT set — pad stays live for retry
      }
    } else {
      // ── Second attempt — advance regardless of right or wrong ──────────────
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

  // Locks the pad and fires the advance timer
  function beginAdvance(delay) {
    isAdvancing.current = true
    setPadDisabled(true)
    setTimeout(advance, delay)
  }

  // ── Level adjustment ─────────────────────────────────────────────────────────
  function checkLevelAdjust() {
    if (correctStreakRef.current >= 3) {
      levelRef.current = Math.min(5, levelRef.current + 1)
      correctStreakRef.current = 0
      saveM1Level(levelRef.current)   // Bug 2: persist immediately on level-up
    }
    if (wrongStreakRef.current >= 2) {
      levelRef.current = Math.max(1, levelRef.current - 1)
      wrongStreakRef.current = 0
      saveM1Level(levelRef.current)   // Bug 2: persist immediately on level-down
    }
  }

  // ── Record a result ──────────────────────────────────────────────────────────
  function pushResult(isCorrect) {
    resultsRef.current = [
      ...resultsRef.current,
      {
        sessionId:       sessionRef.current?.id ?? 'unknown',
        module:          1,
        topic:           'addition-subtraction',
        difficultyLevel: currentQ.level,
        correct:         isCorrect,
        attempts:        attemptRef.current,
        timestamp:       new Date().toISOString(),
      },
    ]
  }

  // ── Advance to next question (called from setTimeout) ─────────────────────────
  function advance() {
    qIndexRef.current += 1

    if (qIndexRef.current >= TOTAL) {
      finishModule()
    } else {
      // Pick next question lazily at the current (possibly adjusted) level
      const next = pickOneQuestion(levelRef.current, usedIdsRef.current, lastContextRef.current)
      if (next) {
        usedIdsRef.current    = [...usedIdsRef.current, next.id]
        lastContextRef.current = next.context
      }
      console.log(`[M1] Question ${qIndexRef.current + 1} — level: ${levelRef.current}`)

      // Reset everything for the next question
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

  // ── Finish the module ────────────────────────────────────────────────────────
  function finishModule() {
    const allResults = resultsRef.current          // always current, no state read needed
    appendResults(allResults)
    saveM1Level(levelRef.current)
    if (sessionRef.current) markModuleComplete(sessionRef.current.id, 1)

    const correct = allResults.filter(r => r.correct).length
    navigate('/end-of-session', {
      state: { correct, total: TOTAL, module: 1 },
    })
  }

  // ── Render guards ─────────────────────────────────────────────────────────────
  if (moduleId === '2') return <ActivityM2 />

  if (moduleId !== '1') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-700 font-bold text-lg">Module {moduleId} coming soon!</p>
      </div>
    )
  }

  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700
                    flex flex-col items-center px-4 py-5 gap-4">

      {/* Progress */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-white/80 text-sm font-semibold mb-1 px-1">
          <span>Question {qIndex + 1} of {TOTAL}</span>
          <span>Level {currentQ?.level ?? '…'}</span>
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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <p className="text-xl font-bold text-blue-900 leading-snug text-center">
          {currentQ?.text}
        </p>
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
