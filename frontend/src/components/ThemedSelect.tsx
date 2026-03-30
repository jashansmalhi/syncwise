import { useEffect, useRef, useState } from 'react'

interface ThemedSelectProps<T extends string> {
  label: string
  value: T
  options: T[]
  onChange: (value: T) => void
}

export function ThemedSelect<T extends string>({ label, value, options, onChange }: ThemedSelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const [menuMaxHeight, setMenuMaxHeight] = useState<number>(240)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!open || !rootRef.current) return

    const rect = rootRef.current.getBoundingClientRect()
    const viewportPadding = 16
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
    const spaceAbove = rect.top - viewportPadding

    const shouldOpenUpward = spaceBelow < 200 && spaceAbove > spaceBelow
    setOpenUpward(shouldOpenUpward)

    const availableSpace = shouldOpenUpward ? spaceAbove : spaceBelow
    setMenuMaxHeight(Math.max(140, Math.min(320, availableSpace)))
  }, [open])

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="input flex items-center justify-between text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <span className="truncate">{value}</span>
        <span className={`ml-3 text-xs text-slate-500 transition ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div
          className={`dropdown-enter absolute z-20 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ${
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          role="listbox"
          style={{ maxHeight: `${menuMaxHeight}px`, overflowY: 'auto' }}
        >
          {options.map((option) => {
            const isActive = option === value
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={`block w-full px-3 py-2.5 text-left text-sm transition ${
                  isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
                role="option"
                aria-selected={isActive}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
