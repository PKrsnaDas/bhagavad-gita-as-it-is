import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const localKey = (id) => `chapter-content-${id}`
const isNumericId = (id) => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))
const MAX_HISTORY = 30

export const useChapterContent = (chapter) => {
  const [overrides, setOverrides] = useState({})
  const [saveStatus, setSaveStatus] = useState('')   // '' | 'saving' | 'saved'
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const overridesRef  = useRef({})
  const undoRef       = useRef([])
  const redoRef       = useRef([])
  const saveTimerRef  = useRef(null)
  const useSupabase   = isSupabaseConfigured && supabase && isNumericId(chapter.id)

  /* keep ref in sync with state */
  useEffect(() => { overridesRef.current = overrides }, [overrides])

  /* ── Load ─────────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false
    undoRef.current = []; redoRef.current = []
    setCanUndo(false); setCanRedo(false)

    const load = async () => {
      if (useSupabase) {
        const { data } = await supabase
          .from('chapter_content')
          .select('data')
          .eq('chapter_id', Number(chapter.id))
          .maybeSingle()
        if (!cancelled && data?.data && Object.keys(data.data).length > 0) {
          overridesRef.current = data.data
          setOverrides(data.data)
          return
        }
      }
      const raw = localStorage.getItem(localKey(chapter.id))
      if (!cancelled && raw) {
        try {
          const parsed = JSON.parse(raw)
          overridesRef.current = parsed
          setOverrides(parsed)
        } catch (_) {}
      }
    }
    load()
    return () => { cancelled = true }
  }, [chapter.id, useSupabase])

  /* ── Persist helper ───────────────────────────────────────── */
  const persist = useCallback((data) => {
    localStorage.setItem(localKey(chapter.id), JSON.stringify(data))
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    setSaveStatus('saving')
    const done = () => {
      setSaveStatus('saved')
      saveTimerRef.current = setTimeout(() => setSaveStatus(''), 2500)
    }
    if (useSupabase) {
      supabase.from('chapter_content').upsert(
        { chapter_id: Number(chapter.id), data, updated_at: new Date().toISOString() },
        { onConflict: 'chapter_id' }
      ).then(done).catch(done)
    } else {
      done()
    }
  }, [chapter.id, useSupabase])

  /* ── updateField ──────────────────────────────────────────── */
  const updateField = useCallback((field, value) => {
    const prev = overridesRef.current
    const next = { ...prev, [field]: value }
    undoRef.current = [...undoRef.current.slice(-(MAX_HISTORY - 1)), prev]
    redoRef.current = []
    overridesRef.current = next
    setOverrides(next)
    setCanUndo(true)
    setCanRedo(false)
    persist(next)
  }, [persist])

  /* ── Undo ─────────────────────────────────────────────────── */
  const undo = useCallback(() => {
    if (undoRef.current.length === 0) return
    const prev = undoRef.current[undoRef.current.length - 1]
    const newUndoLen = undoRef.current.length - 1
    redoRef.current = [overridesRef.current, ...redoRef.current.slice(0, MAX_HISTORY - 1)]
    undoRef.current = undoRef.current.slice(0, -1)
    overridesRef.current = prev
    setOverrides(prev)
    setCanUndo(newUndoLen > 0)
    setCanRedo(true)
    persist(prev)
  }, [persist])

  /* ── Redo ─────────────────────────────────────────────────── */
  const redo = useCallback(() => {
    if (redoRef.current.length === 0) return
    const next = redoRef.current[0]
    const newRedoLen = redoRef.current.length - 1
    undoRef.current = [...undoRef.current.slice(-(MAX_HISTORY - 1)), overridesRef.current]
    redoRef.current = redoRef.current.slice(1)
    overridesRef.current = next
    setOverrides(next)
    setCanUndo(true)
    setCanRedo(newRedoLen > 0)
    persist(next)
  }, [persist])

  const content = { ...chapter, ...overrides }
  return { content, updateField, undo, redo, canUndo, canRedo, saveStatus }
}
