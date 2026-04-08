/**
 * NumberPad — large touch-friendly keypad for kids.
 * Props:
 *   value: string  — current input
 *   onChange: (newValue: string) => void
 *   onSubmit: () => void
 *   disabled: bool
 */
export default function NumberPad({ value, onChange, onSubmit, disabled = false }) {
  function press(digit) {
    if (disabled) return
    if (value.length >= 4) return  // max 4 digits
    onChange(value + digit)
  }

  function backspace() {
    if (disabled) return
    onChange(value.slice(0, -1))
  }

  const btnBase =
    'flex items-center justify-center rounded-2xl font-bold text-2xl select-none ' +
    'active:scale-95 transition-transform shadow-md '

  const digitBtn =
    btnBase +
    'bg-white border-2 border-blue-200 text-blue-900 ' +
    (disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:bg-blue-50')

  const backBtn =
    btnBase +
    'bg-yellow-100 border-2 border-yellow-300 text-yellow-800 ' +
    (disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:bg-yellow-200')

  const submitBtn =
    btnBase +
    'col-span-3 text-xl bg-blue-600 border-2 border-blue-700 text-white ' +
    (disabled || value === ''
      ? 'opacity-40 cursor-not-allowed'
      : 'cursor-pointer active:bg-blue-700')

  // Rows: [7,8,9] [4,5,6] [1,2,3] [⌫,0,—]
  const digits = ['7','8','9','4','5','6','1','2','3']

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col gap-2">
      {/* Display */}
      <div className="w-full h-16 bg-white border-2 border-blue-300 rounded-2xl
                      flex items-center justify-end px-5 shadow-inner">
        <span className="text-4xl font-bold text-blue-900 tracking-wider min-w-[2ch] text-right">
          {value || <span className="text-gray-300">?</span>}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2">
        {digits.map(d => (
          <button
            key={d}
            className={digitBtn}
            style={{ minHeight: '64px', minWidth: '64px' }}
            onPointerDown={() => press(d)}
            aria-label={d}
          >
            {d}
          </button>
        ))}

        {/* Bottom row: ⌫  0  (spacer handled by submit spanning) */}
        <button
          className={backBtn}
          style={{ minHeight: '64px' }}
          onPointerDown={backspace}
          aria-label="Backspace"
        >
          ⌫
        </button>
        <button
          className={digitBtn}
          style={{ minHeight: '64px' }}
          onPointerDown={() => press('0')}
          aria-label="0"
        >
          0
        </button>
        {/* Empty slot placeholder */}
        <div />

        {/* Submit */}
        <button
          className={submitBtn}
          style={{ minHeight: '64px' }}
          onPointerDown={() => { if (!disabled && value !== '') onSubmit() }}
          aria-label="Submit answer"
        >
          Check ✓
        </button>
      </div>
    </div>
  )
}
