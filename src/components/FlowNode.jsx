import { Handle, Position } from '@xyflow/react'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const colorStyles = [
  'bg-gradient-to-br from-red-100 to-red-50 border-red-300 dark:from-red-900/50 dark:to-red-800/30 dark:border-red-600',
  'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300 dark:from-amber-900/50 dark:to-amber-800/30 dark:border-amber-600',
  'bg-gradient-to-br from-emerald-100 to-emerald-50 border-emerald-300 dark:from-emerald-900/50 dark:to-emerald-800/30 dark:border-emerald-600',
  'bg-gradient-to-br from-sky-100 to-sky-50 border-sky-300 dark:from-sky-900/50 dark:to-sky-800/30 dark:border-sky-600',
  'bg-gradient-to-br from-violet-100 to-violet-50 border-violet-300 dark:from-violet-900/50 dark:to-violet-800/30 dark:border-violet-600',
  'bg-gradient-to-br from-pink-100 to-pink-50 border-pink-300 dark:from-pink-900/50 dark:to-pink-800/30 dark:border-pink-600',
  'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-300 dark:from-orange-900/50 dark:to-orange-800/30 dark:border-orange-600',
  'bg-gradient-to-br from-teal-100 to-teal-50 border-teal-300 dark:from-teal-900/50 dark:to-teal-800/30 dark:border-teal-600',
]

const handleStyle = {
  width: 10,
  height: 10,
  background: '#f97316',
  border: '2px solid white',
}

const FlowNode = ({ data, id, isConnectable }) => {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(data.label)
  const textareaRef = useRef(null)

  const colorClass = colorStyles[(data.colorIndex ?? 0) % colorStyles.length]

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus()
      const len = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(len, len)
    }
  }, [editing])

  const commitEdit = () => {
    setEditing(false)
    data.onChange?.(id, label.trim() || 'Untitled')
  }

  return (
    <div
      className={`relative rounded-2xl border-2 shadow-md px-4 py-3 min-w-[150px] max-w-[210px] ${colorClass}`}
    >
      {/* Handles — all 4 sides, all source (ConnectionMode.Loose enables any→any) */}
      <Handle id="top"    type="source" position={Position.Top}    isConnectable={isConnectable} style={handleStyle} />
      <Handle id="right"  type="source" position={Position.Right}  isConnectable={isConnectable} style={handleStyle} />
      <Handle id="bottom" type="source" position={Position.Bottom} isConnectable={isConnectable} style={handleStyle} />
      <Handle id="left"   type="source" position={Position.Left}   isConnectable={isConnectable} style={handleStyle} />

      {/* Delete button — edit mode only */}
      {data.isEditMode && (
        <button
          className="nodrag nopan absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow z-50 transition-colors"
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); data.onDelete?.(id) }}
          title="Delete node"
        >
          <X size={10} strokeWidth={3} />
        </button>
      )}

      {/* Text — double-click to edit */}
      {editing && data.isEditMode ? (
        <textarea
          ref={textareaRef}
          value={label}
          onChange={e => setLabel(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit() } }}
          className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white resize-none outline-none leading-snug"
          rows={3}
        />
      ) : (
        <p
          onDoubleClick={() => { if (data.isEditMode) setEditing(true) }}
          className={`text-sm font-medium text-gray-800 dark:text-white text-center leading-snug select-none ${data.isEditMode ? 'cursor-text' : 'cursor-default'}`}
          title={data.isEditMode ? 'Double-click to edit' : undefined}
        >
          {label}
        </p>
      )}
    </div>
  )
}

export default FlowNode
