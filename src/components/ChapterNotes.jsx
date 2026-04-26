import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NotebookPen } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const ChapterNotes = ({ chapterId, user }) => {
  const [chapterNote, setChapterNote] = useState('')
  const [chapterNoteId, setChapterNoteId] = useState(null)
  const [verseNumber, setVerseNumber] = useState('')
  const [verseNote, setVerseNote] = useState('')
  const [verseNotes, setVerseNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadNotes = async () => {
      if (!user || !supabase || !isSupabaseConfigured) return
      setLoading(true)
      setMessage('')

      try {
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapter_notes')
          .select('id, note')
          .eq('user_id', user.id)
          .eq('chapter_id', chapterId)
          .maybeSingle()

        if (chapterError) throw chapterError

        if (chapterData) {
          setChapterNoteId(chapterData.id)
          setChapterNote(chapterData.note)
        } else {
          setChapterNoteId(null)
          setChapterNote('')
        }

        const { data: verseData, error: verseError } = await supabase
          .from('verse_notes')
          .select('id, verse_number, note, updated_at')
          .eq('user_id', user.id)
          .eq('chapter_id', chapterId)
          .order('verse_number', { ascending: true })

        if (verseError) throw verseError
        setVerseNotes(verseData || [])
      } catch (error) {
        setMessage(error.message || 'Failed to load notes')
      } finally {
        setLoading(false)
      }
    }

    loadNotes()
  }, [chapterId, user])

  const saveChapterNote = async () => {
    if (!user || !supabase) return
    setSaving(true)
    setMessage('')

    try {
      if (chapterNoteId) {
        const { error } = await supabase
          .from('chapter_notes')
          .update({ note: chapterNote })
          .eq('id', chapterNoteId)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('chapter_notes')
          .insert({ user_id: user.id, chapter_id: chapterId, note: chapterNote })
          .select('id')
          .single()
        if (error) throw error
        setChapterNoteId(data.id)
      }

      setMessage('Chapter note saved')
    } catch (error) {
      setMessage(error.message || 'Failed to save chapter note')
    } finally {
      setSaving(false)
    }
  }

  const addVerseNote = async () => {
    if (!user || !supabase) return
    if (!verseNumber.trim() || !verseNote.trim()) {
      setMessage('Verse number and note are required')
      return
    }

    const verse = Number(verseNumber)
    if (Number.isNaN(verse) || verse <= 0) {
      setMessage('Verse number must be a positive number')
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('verse_notes')
        .upsert(
          {
            user_id: user.id,
            chapter_id: chapterId,
            verse_number: verse,
            note: verseNote
          },
          { onConflict: 'user_id,chapter_id,verse_number' }
        )

      if (error) throw error

      const { data: verseData, error: verseError } = await supabase
        .from('verse_notes')
        .select('id, verse_number, note, updated_at')
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)
        .order('verse_number', { ascending: true })

      if (verseError) throw verseError

      setVerseNotes(verseData || [])
      setVerseNumber('')
      setVerseNote('')
      setMessage('Verse note saved')
    } catch (error) {
      setMessage(error.message || 'Failed to save verse note')
    } finally {
      setSaving(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mt-8 p-4 rounded-xl border border-dashed border-orange-300 dark:border-orange-700 text-sm text-gray-700 dark:text-gray-300">
        Notes are disabled. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable personal notes.
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mt-8 p-4 rounded-xl border border-dashed border-orange-300 dark:border-orange-700 text-sm text-gray-700 dark:text-gray-300">
        Login to create your personal chapter and verse notes.
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 border border-orange-200 dark:border-gray-600"
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <NotebookPen size={22} className="text-orange-600 dark:text-orange-400" />
        My Notes
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Chapter Note
        </label>
        <textarea
          value={chapterNote}
          onChange={(e) => setChapterNote(e.target.value)}
          placeholder="Write your chapter-level reflections..."
          rows={4}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <button
          onClick={saveChapterNote}
          disabled={saving || loading}
          className="mt-3 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm disabled:opacity-60"
        >
          Save Chapter Note
        </button>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Verse-wise Notes</h3>
        <div className="grid sm:grid-cols-4 gap-3 mb-3">
          <input
            value={verseNumber}
            onChange={(e) => setVerseNumber(e.target.value)}
            placeholder="Verse #"
            className="sm:col-span-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <input
            value={verseNote}
            onChange={(e) => setVerseNote(e.target.value)}
            placeholder="Write your verse note"
            className="sm:col-span-3 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={addVerseNote}
          disabled={saving || loading}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm disabled:opacity-60"
        >
          Save Verse Note
        </button>
      </div>

      <div className="space-y-2">
        {verseNotes.map((item) => (
          <div key={item.id} className="p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">Verse {item.verse_number}</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{item.note}</p>
          </div>
        ))}
        {verseNotes.length === 0 && !loading && (
          <p className="text-sm text-gray-600 dark:text-gray-400">No verse notes yet.</p>
        )}
      </div>

      {message && <p className="mt-4 text-sm text-orange-700 dark:text-orange-300">{message}</p>}
    </motion.div>
  )
}

export default ChapterNotes
