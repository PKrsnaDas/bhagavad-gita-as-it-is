import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const localKey = (id) => `chapter-content-${id}`
const isNumericId = (id) => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))

export const useChapterContent = (chapter) => {
  const [overrides, setOverrides] = useState({})
  const useSupabase = isSupabaseConfigured && supabase && isNumericId(chapter.id)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (useSupabase) {
        const { data } = await supabase
          .from('chapter_content')
          .select('data')
          .eq('chapter_id', Number(chapter.id))
          .maybeSingle()
        if (!cancelled && data?.data && Object.keys(data.data).length > 0) {
          setOverrides(data.data)
          return
        }
      }
      const raw = localStorage.getItem(localKey(chapter.id))
      if (!cancelled && raw) {
        try { setOverrides(JSON.parse(raw)) } catch (_) {}
      }
    }
    load()
    return () => { cancelled = true }
  }, [chapter.id, useSupabase])

  const updateField = useCallback((field, value) => {
    setOverrides(prev => {
      const next = { ...prev, [field]: value }
      localStorage.setItem(localKey(chapter.id), JSON.stringify(next))
      if (useSupabase) {
        supabase.from('chapter_content').upsert(
          { chapter_id: Number(chapter.id), data: next, updated_at: new Date().toISOString() },
          { onConflict: 'chapter_id' }
        ).then(() => {})
      }
      return next
    })
  }, [chapter.id, useSupabase])

  const content = { ...chapter, ...overrides }
  return { content, updateField }
}
