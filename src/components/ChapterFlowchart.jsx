import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ReactFlow,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Lock, Plus, Save, Unlock, X } from 'lucide-react'
import FlowNode from './FlowNode'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const nodeTypes = { flowNode: FlowNode }

const EDIT_PASSWORD = import.meta.env.VITE_EDIT_PASSWORD || ''

const edgeDefaults = {
  animated: true,
  style: { stroke: '#f97316', strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
}

const buildDefaultNodes = (chapter) => {
  const sections = chapter.acronymSections || []
  if (!sections.length) {
    return [{ id: 'node-0', type: 'flowNode', position: { x: 250, y: 200 }, data: { label: chapter.name, colorIndex: 0 } }]
  }
  return sections.map((s, i) => ({
    id: `node-${i}`,
    type: 'flowNode',
    position: { x: 300, y: i * 170 },
    data: { label: s.title, colorIndex: i },
  }))
}

const buildDefaultEdges = (chapter) => {
  const sections = chapter.acronymSections || []
  return sections.slice(0, -1).map((_, i) => ({
    id: `edge-default-${i}`,
    source: `node-${i}`,
    target: `node-${i + 1}`,
    ...edgeDefaults,
  }))
}

const storageKey = (id) => `flowchart-ch-${id}`

const ChapterFlowchart = ({ chapter }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [editMode, setEditMode]       = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)
  const [pw, setPw]                   = useState('')
  const [pwError, setPwError]         = useState('')

  const nodeCounter = useRef(200)

  /* ── Load ─────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('chapter_flowcharts')
            .select('nodes, edges')
            .eq('chapter_id', chapter.id)
            .maybeSingle()

          if (!cancelled && data && !error && data.nodes?.length) {
            setNodes(data.nodes)
            setEdges(data.edges || [])
            setLoading(false)
            return
          }
        }
      } catch (_) { /* fallthrough */ }

      const raw = localStorage.getItem(storageKey(chapter.id))
      if (!cancelled && raw) {
        const { nodes: n, edges: e } = JSON.parse(raw)
        setNodes(n || [])
        setEdges(e || [])
      } else if (!cancelled) {
        setNodes(buildDefaultNodes(chapter))
        setEdges(buildDefaultEdges(chapter))
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [chapter.id]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Node callbacks (stable via useCallback) ──────────────── */
  const updateLabel = useCallback((id, label) => {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, data: { ...n.data, label } } : n))
  }, [setNodes])

  const deleteNode = useCallback((id) => {
    setNodes(ns => ns.filter(n => n.id !== id))
    setEdges(es => es.filter(e => e.source !== id && e.target !== id))
  }, [setNodes, setEdges])

  /* ── Inject callbacks + editMode flag into node data ─────── */
  const displayNodes = nodes.map(n => ({
    ...n,
    data: { ...n.data, isEditMode: editMode, onChange: updateLabel, onDelete: deleteNode },
  }))

  /* ── Connect ──────────────────────────────────────────────── */
  const onConnect = useCallback((params) => {
    setEdges(es => addEdge({ ...params, ...edgeDefaults }, es))
  }, [setEdges])

  /* ── Add node ─────────────────────────────────────────────── */
  const addNode = () => {
    const id = `node-custom-${nodeCounter.current++}`
    setNodes(ns => [
      ...ns,
      {
        id,
        type: 'flowNode',
        position: { x: 100 + Math.random() * 350, y: 100 + Math.random() * 300 },
        data: { label: 'New Concept', colorIndex: ns.length, isEditMode: true, onChange: updateLabel, onDelete: deleteNode },
      },
    ])
  }

  /* ── Password unlock ──────────────────────────────────────── */
  const handleUnlock = () => {
    if (!EDIT_PASSWORD) {
      setEditMode(true); setShowPwModal(false); return
    }
    if (pw === EDIT_PASSWORD) {
      setEditMode(true); setShowPwModal(false); setPw(''); setPwError('')
    } else {
      setPwError('Incorrect password. Try again.')
    }
  }

  /* ── Save ─────────────────────────────────────────────────── */
  const save = async () => {
    setSaving(true)
    const cleanNodes = nodes.map(({ id, type, position, data }) => ({
      id, type, position, data: { label: data.label, colorIndex: data.colorIndex },
    }))
    const cleanEdges = edges.map(({ id, source, target, animated, style, markerEnd }) => ({
      id, source, target, animated, style, markerEnd,
    }))

    localStorage.setItem(storageKey(chapter.id), JSON.stringify({ nodes: cleanNodes, edges: cleanEdges }))

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('chapter_flowcharts').upsert(
          { chapter_id: chapter.id, nodes: cleanNodes, edges: cleanEdges, updated_at: new Date().toISOString() },
          { onConflict: 'chapter_id' }
        )
      }
    } catch (_) { /* saved to localStorage at least */ }

    setSaving(false)
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Chapter Flowchart</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {editMode
              ? 'Edit mode — drag nodes, double-click to rename, drag handles to connect.'
              : 'Interactive concept map. Scroll / pinch to zoom.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {editMode ? (
            <>
              <button
                onClick={addNode}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-xl font-medium transition-colors shadow-sm"
              >
                <Plus size={15} /> Add Node
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-xl font-medium transition-colors shadow-sm disabled:opacity-60"
              >
                <Save size={15} /> {saving ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-xl font-medium transition-colors"
              >
                <Lock size={15} /> Lock
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowPwModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-xl font-medium transition-colors"
            >
              <Unlock size={15} /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="h-[540px] rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-inner bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
            Loading flowchart…
          </div>
        ) : (
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            onNodesChange={editMode ? onNodesChange : undefined}
            onEdgesChange={editMode ? onEdgesChange : undefined}
            onConnect={editMode ? onConnect : undefined}
            nodeTypes={nodeTypes}
            nodesDraggable={editMode}
            nodesConnectable={editMode}
            elementsSelectable={editMode}
            deleteKeyCode={editMode ? 'Backspace' : null}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#d1d5db" />
            <Controls showInteractive={false} className="[&>button]:bg-white [&>button]:dark:bg-gray-800 [&>button]:border-gray-200 [&>button]:dark:border-gray-600" />
            <MiniMap
              nodeColor={() => '#f97316'}
              maskColor="rgba(0,0,0,0.08)"
              className="!bg-white dark:!bg-gray-800 !border !border-gray-200 dark:!border-gray-700 !rounded-xl overflow-hidden"
            />
          </ReactFlow>
        )}
      </div>

      {/* Password modal */}
      {showPwModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Unlock size={18} className="text-orange-500" /> Unlock Editing
              </h3>
              <button
                onClick={() => { setShowPwModal(false); setPw(''); setPwError('') }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError('') }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter edit password…"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 dark:focus:border-orange-400 transition-colors mb-2 text-sm"
            />
            {pwError && (
              <p className="text-sm text-red-500 mb-3">{pwError}</p>
            )}
            <button
              onClick={handleUnlock}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold transition-all shadow-md mt-1"
            >
              Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChapterFlowchart
