/**
 * Mascot — a friendly cartoon racing car.
 * mood: "idle" | "happy" | "thinking" | "reveal"
 * message: string shown in speech bubble (null = no bubble)
 */
export default function Mascot({ mood = 'idle', message = null, size = 120 }) {
  const eyeStyle = mood === 'happy' ? 'happy' : 'normal'
  const mouthPath = mood === 'happy'
    ? 'M 62 88 Q 75 96 88 88'   // big smile
    : 'M 64 88 Q 75 93 86 88'   // gentle smile

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Speech bubble */}
      {message && (
        <div className="relative max-w-xs bg-white border-2 border-blue-300 rounded-2xl px-4 py-3 text-center shadow-md">
          <p className="text-base font-semibold text-blue-800 leading-snug">{message}</p>
          {/* Tail — border triangle via inline style to avoid Tailwind arbitrary-value quirks */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: '-12px',
              width: 0,
              height: 0,
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderTop: '12px solid #93C5FD', // border-blue-300
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: '-9px',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '10px solid white',
            }}
          />
        </div>
      )}

      {/* Car SVG */}
      <svg
        width={size}
        height={size * 0.65}
        viewBox="0 0 150 98"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Racing car mascot"
        role="img"
      >
        {/* Body shadow */}
        <ellipse cx="75" cy="94" rx="60" ry="5" fill="#00000015" />

        {/* Main body */}
        <rect x="10" y="52" width="130" height="36" rx="14" fill="#2563EB" />

        {/* Roof / cab */}
        <path d="M 38 52 Q 44 22 75 20 Q 106 22 112 52 Z" fill="#1D4ED8" />

        {/* Windshield */}
        <path d="M 48 50 Q 52 30 75 28 Q 98 30 102 50 Z" fill="#BAE6FD" opacity="0.9" />

        {/* Racing stripe */}
        <rect x="10" y="62" width="130" height="6" rx="3" fill="#FBBF24" />

        {/* Number on door */}
        <text x="75" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="system-ui">1</text>

        {/* Front wheel */}
        <circle cx="112" cy="88" r="14" fill="#1E293B" />
        <circle cx="112" cy="88" r="8"  fill="#94A3B8" />
        <circle cx="112" cy="88" r="3"  fill="#1E293B" />

        {/* Rear wheel */}
        <circle cx="40"  cy="88" r="14" fill="#1E293B" />
        <circle cx="40"  cy="88" r="8"  fill="#94A3B8" />
        <circle cx="40"  cy="88" r="3"  fill="#1E293B" />

        {/* Exhaust pipe */}
        <rect x="4" y="66" width="14" height="6" rx="3" fill="#94A3B8" />
        <rect x="2" y="67" width="6"  height="4" rx="2" fill="#CBD5E1" />

        {/* Spoiler */}
        <rect x="118" y="44" width="18" height="4" rx="2" fill="#1D4ED8" />
        <rect x="132" y="44" width="3"  height="14" rx="1" fill="#1D4ED8" />

        {/* Face — eyes */}
        {eyeStyle === 'normal' ? (
          <>
            <circle cx="68" cy="40" r="5" fill="white" />
            <circle cx="82" cy="40" r="5" fill="white" />
            <circle cx="69" cy="40" r="2.5" fill="#1E293B" />
            <circle cx="83" cy="40" r="2.5" fill="#1E293B" />
            {/* Shine */}
            <circle cx="70" cy="39" r="1" fill="white" />
            <circle cx="84" cy="39" r="1" fill="white" />
          </>
        ) : (
          <>
            {/* Happy squint eyes */}
            <path d="M 63 39 Q 68 34 73 39" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 77 39 Q 82 34 87 39" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Mouth */}
        <path d={mouthPath} stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Excitement stars for happy mood */}
        {mood === 'happy' && (
          <>
            <text x="18" y="30" fontSize="14" fill="#FBBF24">⭐</text>
            <text x="118" y="28" fontSize="12" fill="#FBBF24">✨</text>
          </>
        )}
      </svg>
    </div>
  )
}
