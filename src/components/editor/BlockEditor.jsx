import { useState } from 'react'
import {
  BarChart2, CheckCircle, ChevronDown, ChevronUp, Image as ImageIcon,
  List, Minus, Plus, Quote, Table, Trash2, Type, Video, X, Hash,
  Lightbulb, AlignLeft
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { useEditMode } from '../../context/EditModeContext'

/* ─────────────────────────── helpers ──────────────────────────── */
const uid = () => `b${Date.now()}${Math.random().toString(36).slice(2, 7)}`

const COLORS = ['#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6','#f43f5e']

const BLOCK_TYPES = [
  { type: 'paragraph',      label: 'Paragraph',     icon: <AlignLeft size={16}/>,   desc: 'Plain text block' },
  { type: 'heading',        label: 'Heading',        icon: <Hash size={16}/>,        desc: 'H2 / H3 / H4 title' },
  { type: 'bullet_list',    label: 'Bullet List',    icon: <List size={16}/>,        desc: 'Unordered list with nesting' },
  { type: 'numbered_list',  label: 'Numbered List',  icon: <List size={16}/>,        desc: 'Ordered list with nesting' },
  { type: 'key_teaching',   label: 'Key Teaching',   icon: <CheckCircle size={16}/>, desc: 'Highlighted teaching point' },
  { type: 'callout',        label: 'Callout',        icon: <Lightbulb size={16}/>,   desc: 'Highlighted note box' },
  { type: 'quote',          label: 'Quote',          icon: <Quote size={16}/>,       desc: 'Blockquote with attribution' },
  { type: 'image',          label: 'Image',          icon: <ImageIcon size={16}/>,   desc: 'Image from URL' },
  { type: 'video',          label: 'Video',          icon: <Video size={16}/>,       desc: 'YouTube or video URL' },
  { type: 'table',          label: 'Table',          icon: <Table size={16}/>,       desc: 'Rows and columns' },
  { type: 'chart',          label: 'Chart',          icon: <BarChart2 size={16}/>,   desc: 'Bar, line or pie chart' },
  { type: 'divider',        label: 'Divider',        icon: <Minus size={16}/>,       desc: 'Horizontal separator' },
]

const defaultBlock = (type) => {
  const id = uid()
  const map = {
    paragraph:     { id, type, content: '' },
    heading:       { id, type, content: 'New Section', level: 2 },
    bullet_list:   { id, type, items: [{ id: uid(), text: 'Item 1', level: 0 }] },
    numbered_list: { id, type, items: [{ id: uid(), text: 'Item 1', level: 0 }] },
    key_teaching:  { id, type, content: 'New teaching point' },
    callout:       { id, type, emoji: '💡', content: 'Add your note here…' },
    quote:         { id, type, content: '', attribution: '' },
    image:         { id, type, src: '', alt: '', caption: '' },
    video:         { id, type, url: '' },
    table:         { id, type, headers: ['Column 1', 'Column 2'], rows: [['', ''], ['', '']] },
    chart:         { id, type, chartType: 'bar', title: 'My Chart', data: [{ label: 'A', value: 40 }, { label: 'B', value: 70 }, { label: 'C', value: 55 }] },
    divider:       { id, type },
  }
  return map[type]
}

/* ─────────────────────── list text ↔ items ────────────────────── */
const itemsToText = (items) => items.map(it => '  '.repeat(it.level) + it.text).join('\n')
const textToItems = (text) =>
  text.split('\n').map(line => {
    const spaces = line.match(/^(\s*)/)[1].length
    return { id: uid(), text: line.trimStart(), level: Math.min(Math.floor(spaces / 2), 3) }
  }).filter(it => it.text.trim())

/* ─────────────────── YouTube URL → embed ──────────────────────── */
const toEmbedUrl = (url) => {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  return url
}

/* ──────────────────────── view renderers ───────────────────────── */
const RenderParagraph = ({ block }) => (
  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{block.content}</p>
)

const RenderHeading = ({ block }) => {
  const cls = 'font-bold text-gray-900 dark:text-white'
  if (block.level === 4) return <h4 className={`text-lg ${cls}`}>{block.content}</h4>
  if (block.level === 3) return <h3 className={`text-xl ${cls}`}>{block.content}</h3>
  return <h2 className={`text-2xl ${cls}`}>{block.content}</h2>
}

const RenderList = ({ block }) => {
  const Tag = block.type === 'numbered_list' ? 'ol' : 'ul'
  return (
    <Tag className={`space-y-1 ${block.type === 'numbered_list' ? 'list-decimal' : 'list-disc'} pl-5`}>
      {block.items.map(item => (
        <li key={item.id} style={{ marginLeft: item.level * 20 }} className="text-gray-700 dark:text-gray-300">
          {item.text}
        </li>
      ))}
    </Tag>
  )
}

const RenderKeyTeaching = ({ block }) => (
  <div className="flex items-start gap-3">
    <CheckCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={18} />
    <span className="text-gray-700 dark:text-gray-300">{block.content}</span>
  </div>
)

const RenderCallout = ({ block }) => (
  <div className="flex gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
    <span className="text-2xl flex-shrink-0">{block.emoji || '💡'}</span>
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{block.content}</p>
  </div>
)

const RenderQuote = ({ block }) => (
  <blockquote className="border-l-4 border-orange-400 pl-4 py-1">
    <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed whitespace-pre-wrap">{block.content}</p>
    {block.attribution && <footer className="text-sm text-gray-500 dark:text-gray-400 mt-1">— {block.attribution}</footer>}
  </blockquote>
)

const RenderImage = ({ block }) => (
  block.src ? (
    <figure className="text-center">
      <img src={block.src} alt={block.alt || ''} className="rounded-xl max-w-full shadow-md mx-auto" />
      {block.caption && <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{block.caption}</figcaption>}
    </figure>
  ) : null
)

const RenderVideo = ({ block }) => (
  block.url ? (
    <div className="rounded-xl overflow-hidden shadow-md aspect-video">
      <iframe src={toEmbedUrl(block.url)} className="w-full h-full" allowFullScreen title="video" />
    </div>
  ) : null
)

const RenderTable = ({ block }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
    <table className="w-full text-sm">
      <thead className="bg-orange-50 dark:bg-gray-700">
        <tr>{block.headers.map((h, i) => <th key={i} className="px-4 py-2 text-left font-semibold text-gray-800 dark:text-gray-200">{h}</th>)}</tr>
      </thead>
      <tbody>
        {block.rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
            {row.map((cell, ci) => <td key={ci} className="px-4 py-2 text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const RenderChart = ({ block }) => {
  const { chartType = 'bar', data = [], title } = block
  return (
    <div>
      {title && <p className="text-center font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={260}>
        {chartType === 'pie' ? (
          <PieChart>
            <Pie data={data.map(d => ({ name: d.label, value: d.value }))} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : chartType === 'line' ? (
          <LineChart data={data.map(d => ({ name: d.label, value: d.value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        ) : (
          <BarChart data={data.map(d => ({ name: d.label, value: d.value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

const RenderDivider = () => <hr className="border-gray-200 dark:border-gray-700" />

/* ─────────────────────── block renderer map ────────────────────── */
const RENDERERS = {
  paragraph:     RenderParagraph,
  heading:       RenderHeading,
  bullet_list:   RenderList,
  numbered_list: RenderList,
  key_teaching:  RenderKeyTeaching,
  callout:       RenderCallout,
  quote:         RenderQuote,
  image:         RenderImage,
  video:         RenderVideo,
  table:         RenderTable,
  chart:         RenderChart,
  divider:       RenderDivider,
}

/* ──────────────────────── block editors ────────────────────────── */
const EditParagraph = ({ block, onChange }) => (
  <textarea value={block.content} rows={4} onChange={e => onChange({ ...block, content: e.target.value })}
    className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none resize-y"
    placeholder="Write your paragraph…" />
)

const EditHeading = ({ block, onChange }) => (
  <div className="space-y-2">
    <div className="flex gap-2">
      {[2,3,4].map(l => (
        <button key={l} onClick={() => onChange({ ...block, level: l })}
          className={`px-2 py-1 rounded text-xs font-bold border ${block.level === l ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
          H{l}
        </button>
      ))}
    </div>
    <input value={block.content} onChange={e => onChange({ ...block, content: e.target.value })}
      className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 font-bold text-gray-800 dark:text-gray-200 outline-none"
      placeholder="Heading text…" />
  </div>
)

const EditList = ({ block, onChange }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500 dark:text-gray-400">One item per line. Use 2 spaces to indent (create subpoints).</p>
    <textarea
      value={itemsToText(block.items)}
      rows={6}
      onChange={e => onChange({ ...block, items: textToItems(e.target.value) })}
      className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 dark:text-gray-200 outline-none resize-y"
      placeholder={'Item 1\n  Sub-item 1.1\n  Sub-item 1.2\nItem 2'}
    />
  </div>
)

const EditKeyTeaching = ({ block, onChange }) => (
  <input value={block.content} onChange={e => onChange({ ...block, content: e.target.value })}
    className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none"
    placeholder="Key teaching point…" />
)

const EditCallout = ({ block, onChange }) => (
  <div className="space-y-2">
    <input value={block.emoji} onChange={e => onChange({ ...block, emoji: e.target.value })}
      className="w-16 bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-2 py-1 text-center text-xl outline-none" placeholder="💡" />
    <textarea value={block.content} rows={3} onChange={e => onChange({ ...block, content: e.target.value })}
      className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none resize-y"
      placeholder="Callout text…" />
  </div>
)

const EditQuote = ({ block, onChange }) => (
  <div className="space-y-2">
    <textarea value={block.content} rows={3} onChange={e => onChange({ ...block, content: e.target.value })}
      className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm italic text-gray-800 dark:text-gray-200 outline-none resize-y"
      placeholder="Quote text…" />
    <input value={block.attribution} onChange={e => onChange({ ...block, attribution: e.target.value })}
      className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm text-gray-500 dark:text-gray-400 outline-none"
      placeholder="Attribution (optional)…" />
  </div>
)

const EditImage = ({ block, onChange }) => (
  <div className="space-y-2">
    <input value={block.src} onChange={e => onChange({ ...block, src: e.target.value })}
      className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm outline-none text-gray-800 dark:text-gray-200"
      placeholder="Image URL (https://…)" />
    <input value={block.alt} onChange={e => onChange({ ...block, alt: e.target.value })}
      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none text-gray-600 dark:text-gray-300"
      placeholder="Alt text (for accessibility)" />
    <input value={block.caption} onChange={e => onChange({ ...block, caption: e.target.value })}
      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm outline-none text-gray-600 dark:text-gray-300"
      placeholder="Caption (optional)" />
    {block.src && <img src={block.src} alt={block.alt} className="rounded-lg max-h-40 object-contain mt-1" />}
  </div>
)

const EditVideo = ({ block, onChange }) => (
  <input value={block.url} onChange={e => onChange({ ...block, url: e.target.value })}
    className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm outline-none text-gray-800 dark:text-gray-200"
    placeholder="YouTube URL or video embed URL…" />
)

const EditTable = ({ block, onChange }) => {
  const addRow = () => onChange({ ...block, rows: [...block.rows, block.headers.map(() => '')] })
  const addCol = () => onChange({ ...block, headers: [...block.headers, `Col ${block.headers.length + 1}`], rows: block.rows.map(r => [...r, '']) })
  const delRow = (ri) => onChange({ ...block, rows: block.rows.filter((_, i) => i !== ri) })
  const delCol = (ci) => onChange({ ...block, headers: block.headers.filter((_, i) => i !== ci), rows: block.rows.map(r => r.filter((_, i) => i !== ci)) })
  const setHeader = (ci, v) => onChange({ ...block, headers: block.headers.map((h, i) => i === ci ? v : h) })
  const setCell = (ri, ci, v) => onChange({ ...block, rows: block.rows.map((r, i) => i === ri ? r.map((c, j) => j === ci ? v : c) : r) })

  return (
    <div className="space-y-2 overflow-x-auto">
      <div className="flex gap-2 text-xs">
        <button onClick={addRow} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">+ Row</button>
        <button onClick={addCol} className="px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded">+ Column</button>
      </div>
      <table className="text-xs border-collapse">
        <thead>
          <tr>
            {block.headers.map((h, ci) => (
              <th key={ci} className="border border-gray-300 dark:border-gray-600 p-1 bg-orange-50 dark:bg-gray-700">
                <div className="flex items-center gap-1">
                  <input value={h} onChange={e => setHeader(ci, e.target.value)} className="w-20 bg-transparent outline-none font-semibold" />
                  {block.headers.length > 1 && <button onClick={() => delCol(ci)} className="text-red-400 hover:text-red-600"><X size={10}/></button>}
                </div>
              </th>
            ))}
            <th className="w-6" />
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="border border-gray-200 dark:border-gray-700 p-1">
                  <input value={cell} onChange={e => setCell(ri, ci, e.target.value)} className="w-20 bg-transparent outline-none text-gray-700 dark:text-gray-300" />
                </td>
              ))}
              <td className="pl-1"><button onClick={() => delRow(ri)} className="text-red-400 hover:text-red-600"><X size={12}/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const EditChart = ({ block, onChange }) => {
  const csvText = block.data.map(d => `${d.label},${d.value}`).join('\n')
  const parseCSV = (text) => text.split('\n').filter(Boolean).map(line => {
    const [label, val] = line.split(',')
    return { label: label?.trim() || '', value: Number(val?.trim()) || 0 }
  })
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {['bar','line','pie'].map(t => (
          <button key={t} onClick={() => onChange({ ...block, chartType: t })}
            className={`px-3 py-1 rounded-lg text-xs font-medium capitalize border ${block.chartType === t ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>
      <input value={block.title} onChange={e => onChange({ ...block, title: e.target.value })}
        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm outline-none" placeholder="Chart title…" />
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Data — one entry per line: <code>Label,Value</code></p>
        <textarea value={csvText} rows={5} onChange={e => onChange({ ...block, data: parseCSV(e.target.value) })}
          className="w-full bg-white dark:bg-gray-700 border border-orange-400 rounded-lg px-3 py-2 text-sm font-mono outline-none resize-y text-gray-800 dark:text-gray-200"
          placeholder={'Krishna,100\nArjuna,85\nDharma,90'} />
      </div>
      <div className="pointer-events-none opacity-80 bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-100 dark:border-gray-700">
        <RenderChart block={block} />
      </div>
    </div>
  )
}

const EDITORS = {
  paragraph:     EditParagraph,
  heading:       EditHeading,
  bullet_list:   EditList,
  numbered_list: EditList,
  key_teaching:  EditKeyTeaching,
  callout:       EditCallout,
  quote:         EditQuote,
  image:         EditImage,
  video:         EditVideo,
  table:         EditTable,
  chart:         EditChart,
  divider:       () => <p className="text-xs text-gray-400 italic">Divider has no settings.</p>,
}

/* ─────────────────────── Block type picker ─────────────────────── */
const BlockPicker = ({ onPick, onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2"><Plus size={16} className="text-orange-500" /> Add Block</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={18} /></button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {BLOCK_TYPES.map(bt => (
          <button key={bt.type} onClick={() => { onPick(bt.type); onClose() }}
            className="flex flex-col items-start gap-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-left group">
            <span className="text-orange-500 group-hover:scale-110 transition-transform">{bt.icon}</span>
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{bt.label}</span>
            <span className="text-[10px] text-gray-400 leading-tight">{bt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
)

/* ──────────────────────── single block item ────────────────────── */
const BlockItem = ({ block, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [editing, setEditing] = useState(false)
  const Renderer = RENDERERS[block.type]
  const Editor   = EDITORS[block.type]

  return (
    <div className="group relative">
      {/* Edit toolbar */}
      <div className="absolute -right-1 top-1 z-10 hidden group-hover:flex items-center gap-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md px-1 py-0.5">
        <button onClick={() => setEditing(e => !e)} title="Edit" className={`p-1 rounded transition-colors ${editing ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/30' : 'text-gray-400 hover:text-orange-500'}`}>
          <Type size={12} />
        </button>
        <button disabled={index === 0} onClick={onMoveUp} title="Move up" className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30">
          <ChevronUp size={12} />
        </button>
        <button disabled={index === total - 1} onClick={onMoveDown} title="Move down" className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30">
          <ChevronDown size={12} />
        </button>
        <button onClick={onDelete} title="Delete" className="p-1 rounded text-gray-400 hover:text-red-500">
          <Trash2 size={12} />
        </button>
      </div>

      {/* Block content */}
      <div className={`rounded-lg transition-all ${editing ? 'ring-2 ring-orange-400 bg-orange-50/30 dark:bg-orange-900/10' : 'ring-1 ring-dashed ring-transparent hover:ring-orange-200 dark:hover:ring-orange-800'}`}>
        <div className={editing ? 'p-3' : 'px-1 py-0.5'}>
          {editing && Editor ? (
            <div className="mb-3">
              <Editor block={block} onChange={onUpdate} />
            </div>
          ) : null}
          <Renderer block={block} />
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────── main component ───────────────────────── */
const BlockEditor = ({ blocks = [], onChange, placeholder = 'Click + to add content…' }) => {
  const { isEditMode } = useEditMode()
  const [showPicker, setShowPicker] = useState(false)
  const [insertAt, setInsertAt] = useState(null)

  const addBlock = (type) => {
    const nb = defaultBlock(type)
    if (insertAt !== null) {
      const arr = [...blocks]
      arr.splice(insertAt + 1, 0, nb)
      onChange(arr)
      setInsertAt(null)
    } else {
      onChange([...blocks, nb])
    }
  }

  const updateBlock = (updated) => onChange(blocks.map(b => b.id === updated.id ? updated : b))
  const deleteBlock = (id) => onChange(blocks.filter(b => b.id !== id))
  const moveUp = (index) => { const a = [...blocks]; [a[index-1], a[index]] = [a[index], a[index-1]]; onChange(a) }
  const moveDown = (index) => { const a = [...blocks]; [a[index], a[index+1]] = [a[index+1], a[index]]; onChange(a) }

  if (!isEditMode && blocks.length === 0) return null

  return (
    <div className="space-y-2">
      {blocks.length === 0 && isEditMode && (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic py-2">{placeholder}</p>
      )}

      {blocks.map((block, index) => (
        <div key={block.id}>
          {isEditMode && (
            <button
              onClick={() => { setInsertAt(index - 1); setShowPicker(true) }}
              className="w-full h-4 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group"
            >
              <div className="h-px bg-orange-300 dark:bg-orange-700 flex-1" />
              <span className="mx-2 text-orange-400 text-xs font-bold leading-none">+</span>
              <div className="h-px bg-orange-300 dark:bg-orange-700 flex-1" />
            </button>
          )}

          {isEditMode ? (
            <BlockItem
              block={block}
              index={index}
              total={blocks.length}
              onUpdate={updateBlock}
              onDelete={() => deleteBlock(block.id)}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
            />
          ) : (
            <div key={block.id}>{RENDERERS[block.type]?.({ block }) ?? null}</div>
          )}
        </div>
      ))}

      {isEditMode && (
        <button
          onClick={() => { setInsertAt(null); setShowPicker(true) }}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-orange-200 dark:border-orange-800 text-orange-500 dark:text-orange-400 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 text-sm font-medium transition-all"
        >
          <Plus size={16} /> Add Block
        </button>
      )}

      {showPicker && <BlockPicker onPick={addBlock} onClose={() => setShowPicker(false)} />}
    </div>
  )
}

export default BlockEditor
