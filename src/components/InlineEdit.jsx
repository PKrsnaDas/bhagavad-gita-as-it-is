import { useEffect, useRef, useState } from 'react'
import { useEditMode } from '../context/EditModeContext'

const InlineEdit = ({ value, onSave, multiline = false, className = '' }) => {
  const { isEditMode } = useEditMode()
  const [active, setActive] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef(null)

  useEffect(() => { if (!active) setDraft(value) }, [value, active])

  useEffect(() => {
    if (active && ref.current) {
      ref.current.focus()
      if (!multiline && ref.current.select) ref.current.select()
    }
  }, [active, multiline])

  const commit = () => {
    setActive(false)
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onSave(trimmed)
    else setDraft(value)
  }

  if (!isEditMode) return <>{value}</>

  if (active) {
    const baseClass = `w-full bg-orange-50 dark:bg-gray-700 border-2 border-orange-500 dark:border-orange-400 rounded-lg px-3 py-2 outline-none text-inherit font-inherit leading-inherit ${className}`
    return multiline ? (
      <textarea
        ref={ref}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Escape') { setActive(false); setDraft(value) } }}
        className={`${baseClass} resize-y min-h-[80px]`}
        rows={4}
      />
    ) : (
      <input
        ref={ref}
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') { setActive(false); setDraft(value) }
        }}
        className={baseClass}
      />
    )
  }

  const Tag = multiline ? 'div' : 'span'
  return (
    <Tag
      onClick={() => setActive(true)}
      title="Click to edit"
      className={`${multiline ? 'block w-full' : 'inline'} cursor-pointer rounded px-1 py-0.5 ring-1 ring-dashed ring-orange-300 dark:ring-orange-600 hover:ring-2 hover:ring-orange-400 dark:hover:ring-orange-500 hover:bg-orange-50/60 dark:hover:bg-orange-900/20 transition-all ${className}`}
    >
      {value}
    </Tag>
  )
}

export default InlineEdit
