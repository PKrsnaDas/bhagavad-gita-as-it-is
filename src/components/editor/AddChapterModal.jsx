import { useState } from 'react'
import { BookOpen, X } from 'lucide-react'
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient'

const AddChapterModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ name: '', sanskrit: '', english: '', theme: '', summary: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Chapter name is required.'); return }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      sanskrit: form.sanskrit.trim(),
      english: form.english.trim(),
      theme: form.theme.trim(),
      summary: form.summary.trim(),
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error: err } = await supabase.from('custom_chapters').insert(payload).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      onCreated({ ...payload, id: `custom-${data.id}`, dbId: data.id, imageUrl: null, verses: 0, keyTeachings: [], acronymSections: [] })
    } else {
      const localId = `custom-${Date.now()}`
      const chapters = JSON.parse(localStorage.getItem('custom_chapters') || '[]')
      const newChapter = { ...payload, id: localId, imageUrl: null, verses: 0, keyTeachings: [], acronymSections: [] }
      localStorage.setItem('custom_chapters', JSON.stringify([...chapters, newChapter]))
      onCreated(newChapter)
    }
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen size={18} className="text-orange-500" /> New Chapter
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={20} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Chapter Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 text-sm"
              placeholder="e.g. Yoga of Liberation" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sanskrit Name</label>
              <input value={form.sanskrit} onChange={e => set('sanskrit', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 text-sm"
                placeholder="संस्कृत" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">English Subtitle</label>
              <input value={form.english} onChange={e => set('english', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 text-sm"
                placeholder="The Yoga of…" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Theme</label>
            <input value={form.theme} onChange={e => set('theme', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 text-sm"
              placeholder="e.g. Devotion" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Summary</label>
            <textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-orange-500 text-sm resize-y"
              placeholder="Brief description of this chapter…" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md disabled:opacity-60">
            {saving ? 'Creating…' : 'Create Chapter'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddChapterModal
