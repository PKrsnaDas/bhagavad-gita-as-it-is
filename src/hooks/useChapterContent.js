import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'

const localKey = (id) => `chapter-content-${id}`

export const useChapterContent = (chapter) => {
  const [overrides, setOverrides] = useState({})

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase
          .from('chapter_content')
          .select('data')
          .eq('chapter_id', chapter.id)
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
  }, [chapter.id])

  const updateField = useCallback((field, value) => {
    setOverrides(prev => {
      const next = { ...prev, [field]: value }
      localStorage.setItem(localKey(chapter.id), JSON.stringify(next))
      if (isSupabaseConfigured && supabase) {
        supabase.from('chapter_content').upsert(
          { chapter_id: chapter.id, data: next, updated_at: new Date().toISOString() },
          { onConflict: 'chapter_id' }
        ).then(() => {})
      }
      return next
    })
  }, [chapter.id])

  const content = { ...chapter, ...overrides }
  return { content, updateField }
}
